import { readFile } from "fs/promises";
import nodemailer from "nodemailer";
import path from "path";
import handlebars from "handlebars";

const { MAIL_HOST, MAIL_USER, MAIL_PASSWORD } = process.env;

type EmailOptions = {
  to: string;
  template: EmailTemplates;
  context: { [key: string]: any };
};
export const enum EmailTemplates {
  VERIFICATION_LINK = "register/mail-confirmation",
  RESET_PASSWORD = "reset-password/reset-password-link"
}
const emailSubjects: Record<EmailTemplates, string> = {
  [EmailTemplates.VERIFICATION_LINK]: "لینک اعتبارسنجی ایمیل",
  [EmailTemplates.RESET_PASSWORD]: "بازنشانی رمزعبور",
};
class MailServices {
  private transporter: ReturnType<typeof nodemailer.createTransport> =
    nodemailer.createTransport({
      host: MAIL_HOST as string,
      auth: {
        user: MAIL_USER as string,
        pass: MAIL_PASSWORD as string,
      },
    });

  private getTemplateFilePath(template: EmailTemplates): string {
    const [fileRoute, fileName] = template.split("/");
    return path.join(
      __dirname,
      "..",
      "templates",
      "emails",
      fileRoute,
      `${fileName}.handlebars`
    );
  }
  private async loadTemplate(template: EmailTemplates): Promise<string> {
    const filePath = this.getTemplateFilePath(template);
    try {
      return await readFile(filePath, { encoding: "utf8" });
    } catch (error: any) {
      throw new Error(`Failed to load template: ${error.message}`);
    }
  }
  private async compileTemplate(
    template: string,
    context: Record<string, any>
  ) {
    return handlebars.compile(template)(context);
  }
  async send(options: EmailOptions) {
    try {
      const template = await this.loadTemplate(options.template);
      const compiledTemplate = await this.compileTemplate(
        template,
        options.context
      );
      this.transporter.sendMail({
        from: "info@mail.slidy.ir",
        to: options.to,
        subject: emailSubjects[options.template],
        html: compiledTemplate,
      });
    } catch (error: any) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

export default new MailServices;
