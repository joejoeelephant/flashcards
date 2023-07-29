import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';
import { getTokenData } from '../utils/validateToken';
import { redirect } from 'next/navigation';
export const authCheck = () => {
    const tokenCookie = cookies().get('token')
    if(!tokenCookie) {
        redirect('/login')
    }
    const token = tokenCookie.value;

    if (!token) {
        redirect('/login')
    }

    const decoded = getTokenData(token)

    if(!decoded) {
        redirect('/login')
    }

    return decoded
}