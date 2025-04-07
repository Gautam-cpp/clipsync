import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
   

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      }, { status: 404 });
    }

    if (!user.otp || !user.otpExpiresAt){
        return NextResponse.json({
          success: false,
          message: "OTP not sent",
        }, { status: 400 });
    }
      
    if (user.otp !== otp){
      return NextResponse.json({
            success: false,
            message: "Invalid OTP",
        }, { status: 400 });
    }

    
    const now = new Date();
    if (now > user.otpExpiresAt){
        return NextResponse.json({
            success: false,
            message: "OTP expired",
        }, { status: 400 });
    }

    await prisma.user.update({
      where: { email },
      data: {
        verified: true,
        otp: null,
        otpSentAt: null,
        otpExpiresAt: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    }, { status: 200 });
    
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "error: Internal server error",
    }, { status: 500 });
  }
}
