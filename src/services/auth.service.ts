import RegisterationToken from "../models/registeration-token.model";
import AppDataSource from "../config/database";
import User from "../models/user.model";
import { createToken } from "../utils/create-token";
import { UserPurposeOfUse } from "src/enums/user.enums";
import { ApolloError } from "apollo-server-express";
import { ERROR_CODES } from "../config/error-codes";

class AuthenticationService {
  private userRepository = AppDataSource.getRepository(User);
  private registerationTokenRrepository =
    AppDataSource.getRepository(RegisterationToken);

  async verificationRequest(email: string) {
    // check if email does exists ,if so, reject the request
    const user = await this.userRepository.findOne({ where: { email } });
    if (user)
      throw new ApolloError(
        "ایمیل وارد شده از قبل استفاده شده است",
        ERROR_CODES.CONFLICT
      );
    // create and save the new registeration token
    const registerationToken = this.registerationTokenRrepository.create({
      email,
      token: createToken(email),
    });
    await registerationToken.save();

    // generate and return the verification url
    return `https://slidy.ir/register/complete/${registerationToken.token}`;
  }
  async verifyEmail(email: string, token: string) {
    // get the registeration token entry and check if its expired , if so , reject request
    const registerationToken = await this.registerationTokenRrepository.findOne(
      {
        where: { token, email },
      }
    );
    if (
      !registerationToken ||
      new Date(registerationToken?.expire_at as string) < new Date()
    ) {
      throw new ApolloError(
        "زمان اعتبار لینک تایید منقصی شده",
        ERROR_CODES.UN_AUTHORIZED
      );
    }

    // update the registration token to verified
    await this.registerationTokenRrepository.update(
      registerationToken?.id as number,
      { is_verified: true }
    );
  }
  async register(
    email: string,
    fullName: string,
    password: string,
    work_field: UserPurposeOfUse,
    job: string,
    company_website: string,
    company_size: string
  ) {
    // check if user does exists ,if so, reject the request
    this.checkIfUserExists(email);
    // check if email is verified or not  ,if not, reject the request
    // this.validateRegistrationToken(email);

    // create the new user and save
    const user = this.userRepository.create({
      company_size,
      company_website,
      email,
      full_name: fullName,
      job,
      password,
      work_field,
    });
    await user.save();

    // delete the registeration token after user registeration is complete
    await this.registerationTokenRrepository.delete({ email });
    return user;
  }

  private async checkIfUserExists(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new ApolloError(
        "ایمیل وارد شده از قبل موجود میباشد",
        ERROR_CODES.CONFLICT
      );
    }
  }
}

export default new AuthenticationService();
