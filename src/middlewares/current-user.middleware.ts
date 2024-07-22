// src/middleware/CurrentUser.ts
import { ApolloError } from "apollo-server-express";
import { Request, Response, NextFunction } from "express";

import AppDataSource from "../config/database";
import { ERROR_CODES } from "../config/error-codes";
import Token from "../models/token.model";

declare global {
  namespace Express {
    interface Request {
      user_id?: number;
    }
  }
}
export const CurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Assuming Bearer token

  if (token) {
    const session = await AppDataSource.getRepository(Token).findOne({
      where: { access_token: token },
      loadRelationIds: true,
    });
    if (session) {
      req.user_id = session.user;
      next();
    }
  }
  next();
};
