import Presentation from "../models/presentation.model";
import AppDataSource from "../config/database";
import Category from "../models/category.model";
import Template from "../models/template.model";

class TemplatesService {
  private templateRepository = AppDataSource.getRepository(Template);
  private categoryRepository = AppDataSource.getRepository(Category);
  private presentationRepository = AppDataSource.getRepository(Presentation);
  async getCategories() {
    const data = await this.categoryRepository.find();
    return data;
  }
  async getTemplates(category_id: number) {
    const data = await this.templateRepository.find({
      where: { category: { id: category_id } },
    });
    return data;
  }
  async useTemplate(user: number, template_id: number) {
    const template = await this.templateRepository.findOne({
      where: { id: template_id },
    });
    const presentation = this.presentationRepository.create({
      content: template?.content,
      owner: user,
      title: template?.title,
    });
    presentation.save();
    return presentation;
  }
}

export default new TemplatesService();
