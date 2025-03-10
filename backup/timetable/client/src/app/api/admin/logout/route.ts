import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export const GET = async () => {
    const response = NextResponse.json({
        status: 200,
        message: 'User logged out successfully',
        function_name: 'logout-success',
    });

    response.headers.set('Set-Cookie', serialize('token', '', {
        httpOnly: true,
        secure: true,
        maxAge: -1,
        path: '/',
        sameSite: 'strict',
    }));

    return response;
}
