import AppDataSource from "../config/database";
import User from "../models/user.model";

class UserSerivce {
  constructor(
    public repository: ReturnType<
      typeof AppDataSource.getRepository<User>
    > = AppDataSource.getRepository(User)
  ) {}

    async changePassword() {}
}

export default new UserSerivce();
