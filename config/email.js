import emailjs from "emailjs-com";
import dotenv from "dotenv";
dotenv.config();

export async function sendEmail(templateID, to_email, variables) {
  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      templateID,
      { to_email, ...variables },
      process.env.EMAILJS_PUBLIC_KEY
    );
    console.log(`Email envoyé à ${to_email}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi du mail :", error);
  }
}
