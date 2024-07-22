import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import AuthenticationService from "../services/auth.service";
import MailServices, { EmailTemplates } from "../services/mail.service";
import User from "../models/user.model";
import { UserPurposeOfUse } from "../enums/user.enums";
import Response, { RESPONSE_STATUS, ResponseType } from "../utils/response";

@InputType()
class ResetPasswordInput {
  @Field()
  token!: string;
  @Field()
  password!: string;
}
@InputType()
class VerifiyEmailInputs {
  @Field()
  token!: string;
  @Field()
  email!: string;
}

@InputType()
class LoginWithUserPasswordInput {
  @Field()
  email!: string;
  @Field()
  password!: string;
}
@InputType()
class RegisterInputs implements Partial<User> {
  @Field()
  full_name!: string;
  @Field()
  email!: string;
  @Field()
  password!: string;
  // User work information
  @Field()
  work_field!: UserPurposeOfUse;
  @Field({ nullable: true })
  job?: string;
  @Field({ nullable: true })
  company_website?: string;
  @Field({ nullable: true })
  company_size?: string;
}

@Resolver()
class AuthenticationResolver {
  @Query(() => String)
  async user() {
    return "";
  }

  @Mutation(() => ResponseType, { nullable: true })
  async REQUEST_VERIFICATION_MUTATION(@Arg("email") email: string) {
    const link = await AuthenticationService.verificationRequest(email);
    await MailServices.send({
      context: { link },
      template: EmailTemplates.VERIFICATION_LINK,
      to: email,
    });
    return Response("لینک تایید با موفقیت ارسال شد", RESPONSE_STATUS.SUCCESS);
  }
  @Mutation(() => ResponseType, { nullable: true })
  async VERIFY_EMAIL_MUTATION(
    @Arg("data") verifyEmailData: VerifiyEmailInputs
  ) {
    await AuthenticationService.verifyEmail(
      verifyEmailData.email,
      verifyEmailData.token
    );

    return Response("ایمیل با موفقیت تایید شد", RESPONSE_STATUS.SUCCESS);
  }
  @Mutation(() => ResponseType)
  async REGISTER_MUTATION(
    @Arg("data")
    registerData: RegisterInputs
  ) {
    const {
      company_size,
      company_website,
      email,
      full_name,
      job,
      password,
      work_field,
    } = registerData;
    const data = await AuthenticationService.register(
      email,
      full_name,
      password,
      work_field,
      job,
      company_website,
      company_size
    );
    return Response("ایمیلی با موفقیت تایید شد", RESPONSE_STATUS.SUCCESS, data);
  }
  @Mutation(() => ResponseType)
  async LOGIN_WITH_USER_PASSWORD_MUTATION(
    @Arg("data") loginData: LoginWithUserPasswordInput
  ) {
    const data = await AuthenticationService.login(
      loginData.email,
      loginData.password
    );

    return Response("با موفقیت وارد شدید", RESPONSE_STATUS.SUCCESS, data);
  }
  @Mutation(() => ResponseType)
  async REQUEST_RESET_PASSWORD_MUTATION(@Arg("email") email: string) {
    const link = await AuthenticationService.requestResetPassword(email);
    await MailServices.send({
      to: email,
      template: EmailTemplates.RESET_PASSWORD,
      context: { link },
    });
    return Response(
      "لینک بازنشانی رمز عبور به ایمیل شما ارسال شد",
      RESPONSE_STATUS.SUCCESS
    );
  }
  @Mutation(() => ResponseType)
  async RESET_PASSWOR_MUTATION(@Arg("data") resetPassData: ResetPasswordInput) {
    await AuthenticationService.resetPassword(
      resetPassData.token,
      resetPassData.password
    );
    return Response("رمز عبور با موفقیت تغییر یافت", RESPONSE_STATUS.SUCCESS);
  }
}

export default AuthenticationResolver;