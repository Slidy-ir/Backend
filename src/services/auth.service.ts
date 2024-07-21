import RegisterationToken from "../models/registeration-token.model";
import AppDataSource from "../config/database";
import User from "../models/user.model";
import { createToken } from "../utils/create-token";
import { UserPurposeOfUse } from "../enums/user.enums";
import { ApolloError } from "apollo-server-express";
import { ERROR_CODES } from "../config/error-codes";
import Token from "../models/token.model";
import { hashPassword } from "../utils/authentication";

class AuthenticationService {
  private userRepository = AppDataSource.getRepository(User);
  private tokenRepository = AppDataSource.getRepository(Token);
  private registerationTokenRrepository =
    AppDataSource.getRepository(RegisterationToken);

  async verificationRequest(email: string) {
    await this.registerationTokenRrepository.delete({ email });
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
    job: string | undefined,
    company_website: string | undefined,
    company_size: string | undefined
  ) {
    // check if email is verified or not  ,if not, reject the request
    const registerationToken = await this.registerationTokenRrepository.findOne(
      {
        where: { email, is_verified: true },
      }
    );
    if (!registerationToken) {
      throw new ApolloError(
        "ایمیل وارد شده تایید نشده است",
        ERROR_CODES.UN_AUTHORIZED
      );
    }

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

    // generate new token for uthentication
    const token = await this.generateLoginToken(email, user.id);
    // delete the registeration token after user registeration is complete
    await this.registerationTokenRrepository.delete({ email });
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user)
      throw new ApolloError(
        "کاربری با ایمیل وارد شده موحود نمیباشد",
        ERROR_CODES.UN_AUTHORIZED
      );

    const isPasswordCorrect = hashPassword.pwdCompare(user.password, password);
    if (!isPasswordCorrect)
      throw new ApolloError(
        "نام کاربر یا رمز عبورد وارد شده اشتباه میباشد",
        ERROR_CODES.UN_AUTHORIZED
      );

    if (!user.is_active)
      throw new ApolloError(
        "حساب کاربری شما مسدود شده است",
        ERROR_CODES.UN_AUTHORIZED
      );

    const token = await this.generateLoginToken(email, user.id);

    return { user, token };
  }

  async generateLoginToken(email: string, user_id: number) {
    const token = createToken(email);
    const loginToken = this.tokenRepository.create({
      user_id,
      access_token: token,
    });

    await loginToken.save();

    return loginToken.access_token;
  }
}

export default new AuthenticationService();