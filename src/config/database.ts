import { DataSource } from "typeorm";
import User from "../models/user.model";
import Token from "../models/token.model";
const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_DB,
} = process.env;
import RegisterationToken from "../models/registeration-token.model";

const AppDataSource = new DataSource({
  type: "postgres",
  host: POSTGRES_HOST,
  password: POSTGRES_PASSWORD,
  port: Number(POSTGRES_PORT),
  database: POSTGRES_DB,
  username: POSTGRES_USER,
  synchronize: true,
  entities: [User, RegisterationToken, Token],
});

export default AppDataSource;
