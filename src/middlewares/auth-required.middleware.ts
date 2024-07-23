import { NextFunction, Request, Response } from "express";
import AppDataSource from "../config/database";
import Token from "../models/token.model";
import { ERROR_CODES } from "../config/error-codes";

const nonAuthenticatedRoutes = [
  "RESET_PASSWORD_MUTATION",
  "REQUEST_VERIFICATION_MUTATION",
  "VERIFY_EMAIL_MUTATION",
  "REGISTER_MUTATION",
  "LOGIN_WITH_USER_PASSWORD_MUTATION",
  "REQUEST_RESET_PASSWORD_MUTATION",
];
const AuthRequired = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isNonAuthRoute = nonAuthenticatedRoutes.some((route) =>
      req.body.query.includes(route)
    );

    if (isNonAuthRoute) {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (token) {
        return res.status(401).json({
          errors: [
            {
              message: "توکن ارسالی نامعتبر میباشد",
              code: ERROR_CODES.UN_AUTHORIZED,
            },
          ],
          data: null,
        });
      }
      const session = await AppDataSource.getRepository(Token).findOne({
        where: { access_token: token },
      });

      if (!session || new Date(session?.expire_at) < new Date()) {
        return res.status(401).json({
          errors: [
            {
              message: "توکن ارسالی نامعتبر میباشد",
              code: ERROR_CODES.UN_AUTHORIZED,
            },
          ],
          data: null,
        });
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default AuthRequired;
