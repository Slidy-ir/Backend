import TemplatesService from "../services/templates.service";
import Response, { RESPONSE_STATUS, ResponseType } from "../utils/response";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "apollo-server-core";

@Resolver()
class TemplatesResolver {
  @Query(() => ResponseType)
  async CATEGORIES_QUERY() {
    const data = await TemplatesService.getCategories();
    return Response("", RESPONSE_STATUS.SUCCESS, data);
  }
  @Query(() => ResponseType)
  async TEMPLATES_QUERY(@Arg("category_id") category_id: number) {
    const data = await TemplatesService.getTemplates(category_id);
    return Response("", RESPONSE_STATUS.SUCCESS, data);
  }
  @Mutation(() => ResponseType)
  async USE_TEMPLATE_MUTATION(
    @Arg("template_id") template_id: number,
    @Ctx() ctx: Context<{ user: number }>
  ) {
    const data = await TemplatesService.useTemplate(ctx.user, template_id);
    return Response(
      "پرزنتیشن با موفقیت ایجاد شد",
      RESPONSE_STATUS.SUCCESS,
      data
    );
  }
}
export default TemplatesResolver;
