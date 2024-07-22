import AppDataSource from "../config/database";
import User from "../models/user.model";

class UserSerivce {
  private repository = AppDataSource.getRepository(User);

  async changeInformation(id: number, fullName: string) {
    const user = this.repository.update({ id }, { full_name: fullName, });
    return user;
  }
}

export default new UserSerivce();
