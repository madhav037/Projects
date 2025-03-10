// pages/api/auth/verify.ts
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export default function handler(req:any, res:any) {
    const token = req.cookies.token;

    // console.log(token);

    if (!token) {
        return NextResponse.json({ status:401,error: "Token missing" });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
        return NextResponse.json({ status:200,user: decoded });
    } catch (error) {
        return NextResponse.json({ status:401,user: error });
    }
}