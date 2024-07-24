import PresentationsService from "../services/presentation.service";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Context } from "apollo-server-core";
import Response, { RESPONSE_STATUS, BaseResponseType } from "../utils/response";
import Presentation from "../models/presentation.model";
// Custom response type for presentations query
@ObjectType()
class PresentationsResponseType extends BaseResponseType {
  @Field(() => [Presentation])
  data?: Presentation[];
}
@Resolver()
class PresentationsResolver {
  @Query(() => PresentationsResponseType)
  async PRESENTATIONS_LIST_QUERY(
    @Arg("search", { nullable: true }) searchQuery: string,
    @Ctx() ctx: Context<{ user: number }>
  ) {
    const data = await PresentationsService.getPresentations(
      ctx.user,
      searchQuery
    );
    return Response("", RESPONSE_STATUS.SUCCESS, data);
  }
  @Mutation(() => BaseResponseType)
  async DELETE_PRESENTATION_MUTATION(
    @Arg("id") id: number,
    @Ctx() ctx: Context<{ user: number }>
  ) {
    await PresentationsService.deletePresentation(id, ctx.user);
    return Response("پرزنتیشن با موفقیت حذف شد", RESPONSE_STATUS.SUCCESS);
  }
}

export default PresentationsResolver;
