import nodemailer from "nodemailer";

export async function sendEmail(email: string, OTP: string) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${OTP}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        return { success: true };
      } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error };
    }

}