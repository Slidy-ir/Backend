import TempToken, { TempTokenType } from "../models/temp-token.model";
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
  private tempTokenRepository = AppDataSource.getRepository(TempToken);

  async verificationRequest(email: string) {
    await this.tempTokenRepository.delete({
      email,
      type: TempTokenType.REGISTER,
    });
    // check if email does exists ,if so, reject the request
    const user = await this.userRepository.findOne({ where: { email } });
    if (user)
      throw new ApolloError(
        "ایمیل وارد شده از قبل استفاده شده است",
        ERROR_CODES.CONFLICT
      );
    // create and save the new registeration token
    const tempToken = this.tempTokenRepository.create({
      email,
      token: createToken(email),
      type: TempTokenType.REGISTER,
    });
    await tempToken.save();
    // generate and return the verification url
    return `https://slidy.ir/register/complete/${tempToken.token}`;
  }

  async verifyEmail(email: string, token: string) {
    // get the registeration token entry and check if its expired , if so , reject request
    const tempToken = await this.tempTokenRepository.findOne({
      where: { token, email, type: TempTokenType.REGISTER },
    });
    if (!tempToken || new Date(tempToken?.expire_at as string) < new Date()) {
      throw new ApolloError(
        "زمان اعتبار لینک تایید منقصی شده",
        ERROR_CODES.UN_AUTHORIZED
      );
    }

    // update the registration token to verified
    await this.tempTokenRepository.update(tempToken?.id as number, {
      is_verified: true,
    });
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
    const tempToken = await this.tempTokenRepository.findOne({
      where: { email, is_verified: true, type: TempTokenType.REGISTER },
    });
    if (!tempToken) {
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
    await this.tempTokenRepository.delete({ email });
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

  async requestResetPassword(email: string) {
    // check if email does exists ,if not, reject the request
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new ApolloError(
        "کاربری با ایمیل وارد شده موجود نمیباشد",
        ERROR_CODES.CONFLICT
      );
    // create and save the new registeration token
    const tempToken = this.tempTokenRepository.create({
      email,
      token: createToken(email),
      type: TempTokenType.RESET_PASSWORD,
    });
    await tempToken.save();
    // generate and return the verification url
    return `https://slidy.ir/reset-password/${tempToken.token}`;
  }
  async resetPassword(token: string, password: string) {
    const tempToken = await this.tempTokenRepository.findOne({
      where: { token: token, type: TempTokenType.RESET_PASSWORD },
    });
    if (!tempToken || new Date(tempToken.expire_at) < new Date())
      throw new ApolloError(
        "توکن ارسالی نامعتبر میباشد",
        ERROR_CODES.UN_AUTHORIZED
      );
    const user = await this.userRepository.findOne({
      where: { email: tempToken?.email },
    });

    if (user) {
      user.password = password;
      await this.userRepository.save(user);
    } else {
      throw new Error("User not found");
    }

    await this.tempTokenRepository.delete({ id: tempToken.id });
  }
}

export default new AuthenticationService();
