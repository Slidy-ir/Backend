import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import AuthenticationService from "../services/auth.service";
import MailServices, { EmailTemplates } from "../services/mail.service";
import User from "../models/user.model";
import { UserPurposeOfUse } from "../enums/user.enums";

@InputType()
class VerifiyEmailInputs {
  @Field()
  token!: string;
  @Field()
  email!: string;
}
@InputType()
class RegisterInputs {
  @Field()
  full_name!: string;
  @Field()
  email!: string;
  @Field()
  password!: string;
  // User work information
  @Field()
  work_field!: UserPurposeOfUse;
  @Field()
  job!: string;
  @Field()
  company_website!: string;
  @Field()
  company_size!: string;
}
@Resolver()
class AuthenticationResolver {
  @Query(() => String)
  async user() {
    return "";
  }

  @Mutation(() => String, { nullable: true })
  async verificationRequest(@Arg("email") email: string) {
    const link = await AuthenticationService.verificationRequest(email);
    await MailServices.send({
      context: { link },
      template: EmailTemplates.VERIFICATION_LINK,
      to: email,
    });
  }
  @Mutation(() => String, { nullable: true })
  async verifyEmail(@Arg("data") verifyEmailData: VerifiyEmailInputs) {
    await AuthenticationService.verifyEmail(
      verifyEmailData.email,
      verifyEmailData.token
    );

    return "ایمیلی با موفقیت تایید شد";
  }
  @Mutation(() => User)
  async register(
    @Arg("data")
   registerData: RegisterInputs
  ) {
    const {company_size,company_website,email,full_name,job,password,work_field} = registerData
    const user = await AuthenticationService.register(
      email,
      full_name,
      password,
      work_field,
      job,
      company_website,
      company_size
    );
    return user;
  }
}

export default AuthenticationResolver;
