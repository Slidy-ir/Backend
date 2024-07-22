import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const createToken = (email: string): string => {
  dotenv.config();

  const token = jwt.sign(
    { user_id: email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  return token;
};
