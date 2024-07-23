import Presentation from "../models/presentation.model";
import presentationService from "../services/presentation.service";
import Response, { RESPONSE_STATUS, ResponseType } from "../utils/response";
import { Context } from "apollo-server-core";

import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
class TrashbinResolver {
  @Query(() => ResponseType)
  async TRASHBIN_QUERY(@Ctx() ctx: Context<{ user: number }>) {
    const data = await presentationService.getDeletedPresentations(ctx.user);
    return Response("", RESPONSE_STATUS.SUCCESS, data);
  }
  @Mutation(() => ResponseType)
  async DELETE_PERSENTATION_PERMENANTLY_MUTATION(
    @Arg("id") id: number,
    @Ctx() ctx: Context<{ user: number }>
  ) {
    await presentationService.deletePresentationPermenantly(id, ctx.user);
    return Response("پرزنتیشن با موفقیت حذف شد", RESPONSE_STATUS.SUCCESS);
  }
}
export default TrashbinResolver;
