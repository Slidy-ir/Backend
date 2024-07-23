import express, { json } from "express";
import dotenv from "dotenv";
import AppDataSource from "./config/database";
import CORS from "cors";
import { engine } from "express-handlebars";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import AuthenticationResolver from "./schemas/auth.schema";
import UserResolver from "./schemas/user.schema";
import { CurrentUser } from "./middlewares/current-user.middleware";
import AuthRequired from "./middlewares/auth-required.middleware";
import PresentationsResolver from "./schemas/presentations.schema";
dotenv.config();

const main = async () => {
  AppDataSource.initialize()
    .then(() => {
      console.log("Database initilized successfuly");
    })
    .catch((eer) => {
      console.log(eer);
      console.log("Database initilization failed");
    });

  const application = express();

  application.engine("handlebars", engine({ defaultLayout: false }));
  application.set("view engine", "handlebars");

  application.use(json());
  application.use(
    CORS({
      origin: "*",
    })
  );
  application.use(CurrentUser);
  application.use(AuthRequired);
  const schema = await buildSchema({
    resolvers: [AuthenticationResolver, UserResolver,PresentationsResolver],
    emitSchemaFile: true,
  });
  const apolloServer = new ApolloServer({
    schema,
    formatError(error) {
      return {
        message: error.message,
        code: error.extensions.code,
      };
    },
    context: ({ req }) => ({ user: req.user_id }),
  });
  apolloServer.start().then(() => {
    apolloServer.applyMiddleware({ app: application });
  });

  application.listen(process.env.PORT, () => {
    console.log(`Application started on http://localhost:${process.env.PORT}`);
  });
};

main();
