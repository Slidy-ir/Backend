import express from "express";
import dotenv from "dotenv";
import AppDataSource from "./config/database";

dotenv.config();

const bootstrap = () => {
  AppDataSource.initialize()
    .then(() => {
      console.log("Database initilized successfuly");
    })
    .catch((eer) => {
      console.log(eer)
      console.log("Database initilization failed");
    });

  const application = express();

  application.listen(process.env.PORT, () => {
    console.log(`Application started on http://localhost:${process.env.PORT}`);
  });
};

bootstrap();
