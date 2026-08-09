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
  
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    });
  
    console.log("Message sent: %s", info.messageId);
  };  