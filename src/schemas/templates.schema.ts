import TemplatesService from "../services/templates.service";
import Response, { RESPONSE_STATUS, BaseResponseType } from "../utils/response";
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
import Category from "src/models/category.model";
import Template from "src/models/template.model";

@ObjectType()
class CategoriesResponseType extends BaseResponseType {
  @Field(() => [Category])
  data!: Category[];
}
@ObjectType()
class TemplatesResponseType extends BaseResponseType {
  @Field(() => [Template])
  data!: Template[];
}
@ObjectType()
class TemplateResponseType extends BaseResponseType {
  @Field(() => Template)
  data!: Template;
}
@Resolver()
class TemplatesResolver {
  @Query(() => CategoriesResponseType)
  async CATEGORIES_QUERY() {
    const data = await TemplatesService.getCategories();
    return Response("", RESPONSE_STATUS.SUCCESS, data);
  }
  @Query(() => TemplatesResponseType)
  async TEMPLATES_QUERY(@Arg("category_id") category_id: number) {
    const data = await TemplatesService.getTemplates(category_id);
    return Response("", RESPONSE_STATUS.SUCCESS, data);
  }
  @Query(() => TemplateResponseType)
  async TEMPLATE_QUERY(@Arg("template_id") template_id: number) {
    const data = await TemplatesService.getTemplate(template_id);
    return Response("", RESPONSE_STATUS.SUCCESS, data);
  }
  @Mutation(() => BaseResponseType)
  async USE_TEMPLATE_MUTATION(
    @Arg("template_id") template_id: number,
    @Ctx() ctx: Context<{ user: number }>
  ) {
    await TemplatesService.useTemplate(ctx.user, template_id);
    return Response("پرزنتیشن با موفقیت ایجاد شد", RESPONSE_STATUS.SUCCESS);
  }
}
export default TemplatesResolver;
