import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/sendEmail";

function generateOTP(){
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export default async  function sendOTP(email:string){
    const otp = generateOTP();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 5);
    
    const user = await prisma.user.update({
        where: {
            email: email,
        },
        data: {
            otp: otp,
            otpExpiresAt: otpExpiresAt,
            otpSentAt: new Date(),
        },
    });
    
    const result = await sendEmail(email, otp);
    console.log(result);
    return result;
}