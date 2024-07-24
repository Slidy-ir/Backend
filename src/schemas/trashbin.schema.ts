import Presentation from "../models/presentation.model";
import presentationService from "../services/presentation.service";
import Response, { RESPONSE_STATUS, BaseResponseType } from "../utils/response";
import { Context } from "apollo-server-core";

import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

@ObjectType()
class TrashbinResponesType extends BaseResponseType {
  @Field(() => [Presentation])
  data!: Presentation[];
}
@Resolver()
class TrashbinResolver {
  @Query(() => TrashbinResponesType)
  async TRASHBIN_QUERY(@Ctx() ctx: Context<{ user: number }>) {
    const data = await presentationService.getDeletedPresentations(ctx.user);
    return Response("", RESPONSE_STATUS.SUCCESS, data);
  }
  @Mutation(() => BaseResponseType)
  async DELETE_PERSENTATION_PERMENANTLY_MUTATION(
    @Arg("id") id: number,
    @Ctx() ctx: Context<{ user: number }>
  ) {
    await presentationService.deletePresentationPermenantly(id, ctx.user);
    return Response("پرزنتیشن با موفقیت حذف شد", RESPONSE_STATUS.SUCCESS);
  }
}
export default TrashbinResolver;
