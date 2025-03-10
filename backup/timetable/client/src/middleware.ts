// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import handler from './app/api/auth/verify';
import jwt  from 'jsonwebtoken';
import { use } from 'react';
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/forms/signin', request.url));
    }

    // Call the API route to verify the token
    const response = handler({ cookies: { token } }, {} as any);

    // console.log(response);
    // console.log(response.cookies);
    // console.log(response.status);

    if (response.status !== 200) {
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    const user:any = jwt.decode(token)

    const res = NextResponse.next();
    
    // Pass user data in a custom header
    console.log(user!.uni_id);
    
    res.headers.set('uni_id', user!.uni_id);
    
    return res;
    
    // return NextResponse.next();
}

export const config = {
    matcher: ['/forms/resource/:path*','/dashboard/:path*'],
};
