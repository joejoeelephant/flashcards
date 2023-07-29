import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getTokenData } from '@/components/utils/validateToken';
import { prisma } from '@/components/libs/prisma'


export async function GET(request: NextRequest) {
    const token = request.cookies.get('token');
    if (!token) {
        throw new Error('token is not defined');
    }
    const decodedToken = getTokenData(token.value);
    if(!decodedToken) {
        return NextResponse.json({message: "token is invalid"}, {status: 401})
    }

    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page'))
    const pageSize = Number(process.env.PAGE_SIZE) || 10
    try {
        const result = await prisma.flashCard.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: pageSize,
            skip: (page - 1) * pageSize
        });
        return NextResponse.json({result, success: true})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error, success: false})
    }

}