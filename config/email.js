import fetch from "node-fetch";

export async function sendEmail(templateId, toEmail, variables) {
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: templateId,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: { ...variables, to_email: toEmail }
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erreur EmailJS : ${text}`);
    }

    console.log("Email envoyé avec succès !");
  } catch (error) {
    console.error("Erreur envoi email :", error);
    throw error;
  }
}
