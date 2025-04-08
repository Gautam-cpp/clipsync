import sendOTP from "@/helper/sendOtp";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export  async function POST(req: NextRequest) {
    const {email} = await req.json();
    
    if(!email){
        return NextResponse.json({
            success: false,
            message: "error: email not found",
        }, { status: 400 });
    }

    try{
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "error: User not found",
            }, { status: 404 });
        }

        if (!user.otpSentAt || !user.otpExpiresAt) {
            return NextResponse.json({
                success: false,
                message: "error: OTP not sent",
            }, { status: 400 });
        }

        if(user.otpSentAt > user.otpExpiresAt){
            return NextResponse.json({
                success: false,
                message: "error: OTP already sent",
            }, { status: 400 });
        }

        const result = await sendOTP(email);

        if (!result.success) {
            return NextResponse.json({
                success: false,
                message: "error: Failed to send OTP",
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully",
            data: result
        }, { status: 200 });


    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json(
          {
            success: false,
            message: "Internal server error",
          },
          { status: 500 }
        );
      }
      

}
