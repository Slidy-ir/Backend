import { ILike, IsNull, Not } from "typeorm";
import AppDataSource from "../config/database";
import Presentation from "../models/presentation.model";
import cron from "node-cron";
class PresentationService {
  private repository = AppDataSource.getRepository(Presentation);

  async getPresentations(
    user: number,
    search?: string
  ): Promise<Presentation[]> {
    const filters: Record<any, any> = {
      owner: user,
      deleted_at: IsNull(),
    };
    if (search) filters.title = ILike(`%${search}%`);

    const presentations = await this.repository.findBy(filters);

    return presentations;
  }

  async getDeletedPresentations(user: number): Promise<Presentation[]> {
    const filters: Record<any, any> = {
      owner: user,
      deleted_at: Not(IsNull()),
    };
    // if (search) filters.title = ILike(`%${search}%`);
    const presentations = await this.repository.find({
      where: { ...filters },
      withDeleted: true,
    });

    return presentations;
  }

  async deletePresentation(id: number, user: number) {
    await this.repository.softDelete({ id, owner: user });
    const presentation = await this.repository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (presentation) {
      const cronDeletionDate = new Date(
        presentation?.deleted_at as unknown as string
      );
      cronDeletionDate.setDate(cronDeletionDate.getDate() + 30);

      cron.schedule(
        `${cronDeletionDate.getMinutes()} ${cronDeletionDate.getHours()} ${cronDeletionDate.getDate()} ${
          cronDeletionDate.getMonth() + 1
        } *`,
        async () => {
          await this.deletePresentationPermenantly(id, user);
        }
      );
    }
  }
  async deletePresentationPermenantly(id: number, user: number) {
    await this.repository.delete({ id, owner: user });
  }
}

export default new PresentationService();
