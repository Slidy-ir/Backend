import PresentationsService from "../services/presentation.service";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "apollo-server-core";
import Response, { RESPONSE_STATUS, ResponseType } from "../utils/response";

@Resolver()
class PresentationsResolver {
  @Query(() => ResponseType)
  async PRESENTATIONS_LIST_QUERY(
    @Arg("search", { nullable: true }) searchQuery: string,
    @Ctx() ctx: Context<{ user: number }>
  ) {
    const data = PresentationsService.getPresentations(ctx.user, searchQuery);
    return Response("", RESPONSE_STATUS.SUCCESS, data);
  }
  @Mutation(() => ResponseType)
  async DELETE_PRESENTATION_MUTATION(
    @Arg("id") id: number,
    @Ctx() ctx: Context<{ user: number }>
  ) {
    await PresentationsService.deletePresentation(id, ctx.user);
    return Response("پرزنتیشن با موفقیت حذف شد", RESPONSE_STATUS.SUCCESS);
  }
}

export default PresentationsResolver;
