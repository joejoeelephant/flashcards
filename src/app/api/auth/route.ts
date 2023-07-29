import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getTokenData } from '@/components/utils/validateToken';

export async function POST(request: NextRequest) {
    const {word} = await request.json();
    const token = request.cookies.get('token');
    if (!token) {
      return NextResponse.json({message: "token is not defined"}, {status: 401})
    }
    const decodedToken = getTokenData(token.value);
    if(!decodedToken) {
      return NextResponse.json({message: "token is invalid", success:false}, {status: 401})
    }
    return NextResponse.json({message: "token valid", success: true}, {status: 200})

}