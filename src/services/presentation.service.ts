import { ILike, Like } from "typeorm";
import AppDataSource from "../config/database";
import Presentation from "../models/presentation.model";

class PresentationService {
  private repository = AppDataSource.getRepository(Presentation);

  async getPresentations(
    user: number,
    search?: string
  ): Promise<Presentation[]> {
    const filters: Record<any, any> = {};
    if (search) filters.title = ILike(`%${search}%`);

    const presentations = await this.repository.findBy({
      owner: user,
      deleted_at: undefined,
      ...filters,
    });

    return presentations;
  }

  async deletePresentation(id: number, user: number) {
    await this.repository.softDelete({ id, owner: user });
  }
}

export default new PresentationService();
