import GraphQLJSON from "graphql-type-json";
import { ObjectType, Field } from "type-graphql";

export const enum RESPONSE_STATUS {
  SUCCESS = "success",
  FAILED = "failed",
}

@ObjectType()
export class ResponseType {
  @Field()
  message!: string;
  @Field()
  status!: RESPONSE_STATUS;
  @Field(() => GraphQLJSON)
  data: any;
}

const Response = (
  message: string,
  status: RESPONSE_STATUS,
  data: any = null
) => {
  return {
    message,
    status,
    data,
  };
};
export default Response;
