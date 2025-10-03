import { connectDB } from "@/lib/databaseConnection";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB()
        return NextResponse.json({
            success: true,
            message: "Connection Success"
        })
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error 
        })
    }

}