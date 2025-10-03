import { NextResponse } from "next/server"
import { success } from "zod"

export const response = (success, statusCode, message, data = {}) => {
    return NextResponse.json({
        success, statusCode, message, data
    })
}

export const catchError = (error, customeMessage) => {
    // handeling duplicate error

    if (error.code === 11000) {
        const kays = Object.keys(error.keyPattern).join(',')
        error.message = `Duplicate field: ${kays}. This fields value must be unique.`
    }

    let errorObj = {}

    if (process.env.NODE_ENV === 'development') {
        errorObj = {
            message: error.message,
            error
        }
    } else {
        errorObj = {
            message: customeMessage || 'Internal Server Error',
            error
        }
    }

    return NextResponse.json({
        success:false,
        statusCode: error.code || 500,
        ...errorObj
    })
}

export const generateOTP = () =>{
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp
}
