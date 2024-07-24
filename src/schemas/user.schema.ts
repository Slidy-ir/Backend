import { Context } from "apollo-server-core";
import User from "../models/user.model";
import Response, { RESPONSE_STATUS, BaseResponseType } from "../utils/response";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import UserSerivce from "../services/user.service";
@InputType()
class ChangeUserInfoInputs implements Partial<User> {
  @Field()
  full_name!: string;
}
@Resolver()
class UserResolver {
  @Query(() => String)
  async USER_QUERY() {
    return "";
  }

  @Mutation(() => BaseResponseType)
  async CHANGE_USER_INFORMATION(
    @Arg("data") userInfo: ChangeUserInfoInputs,
    @Ctx() ctx: Context<{ user: number }>
  ) {
    await UserSerivce.changeInformation(ctx?.user, userInfo.full_name);
    return Response("اطلاعات شما با موفقیت ویرایش شد", RESPONSE_STATUS.SUCCESS);
  }
}
export default UserResolver;
