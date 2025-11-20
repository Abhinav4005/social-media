import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export const sendEmail = async ({ to, subject, templateName, variables }) => {
    const __fileName = fileURLToPath(import.meta.url);
    const __dirname = dirname(__fileName);
    const filePath = path.join(__dirname, "../templates", templateName);
    let html = fs.readFileSync(filePath, "utf8");
  
    for (const key in variables) {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
    }
  
    const testAccount = await nodemailer.createTestAccount();
  
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.ethereal.email",
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER || testAccount.user,
        pass: process.env.SMTP_PASS || testAccount.pass,
      },
    });
  
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER || testAccount.user,
      to,
      subject,
      html,
    });
  
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  };  