import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import AuthenticationService from "../services/auth.service";
import MailServices, { EmailTemplates } from "../services/mail.service";
import User from "../models/user.model";
import { UserPurposeOfUse } from "../enums/user.enums";
import Response, { RESPONSE_STATUS, BaseResponseType } from "../utils/response";

// Custom Response Type for login and register mutations
@ObjectType()
class ResponseType {
  @Field(() => User)
  user!: User;
  @Field(() => String)
  token!: String;
}
@ObjectType()
class UserResponseType extends BaseResponseType {
  @Field(() => ResponseType)
  data!: ResponseType;
}

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

  @Mutation(() => BaseResponseType, { nullable: true })
  async REQUEST_VERIFICATION_MUTATION(@Arg("email") email: string) {
    const link = await AuthenticationService.verificationRequest(email);
    await MailServices.send({
      context: { link },
      template: EmailTemplates.VERIFICATION_LINK,
      to: email,
    });
    return Response("لینک تایید با موفقیت ارسال شد", RESPONSE_STATUS.SUCCESS);
  }
  @Mutation(() => BaseResponseType, { nullable: true })
  async VERIFY_EMAIL_MUTATION(
    @Arg("data") verifyEmailData: VerifiyEmailInputs
  ) {
    await AuthenticationService.verifyEmail(
      verifyEmailData.email,
      verifyEmailData.token
    );

    return Response("ایمیل با موفقیت تایید شد", RESPONSE_STATUS.SUCCESS);
  }
  @Mutation(() => UserResponseType)
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
  @Mutation(() => UserResponseType)
  async LOGIN_WITH_USER_PASSWORD_MUTATION(
    @Arg("data") loginData: LoginWithUserPasswordInput
  ) {
    const data = await AuthenticationService.login(
      loginData.email,
      loginData.password
    );

    return Response("با موفقیت وارد شدید", RESPONSE_STATUS.SUCCESS, data);
  }
  @Mutation(() => BaseResponseType)
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
  @Mutation(() => BaseResponseType)
  async RESET_PASSWORD_MUTATION(
    @Arg("data") resetPassData: ResetPasswordInput
  ) {
    await AuthenticationService.resetPassword(
      resetPassData.token,
      resetPassData.password
    );
    return Response("رمز عبور با موفقیت تغییر یافت", RESPONSE_STATUS.SUCCESS);
  }
}

export default AuthenticationResolver;
