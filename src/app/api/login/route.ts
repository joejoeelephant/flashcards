// Import necessary libraries
import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt'
import { prisma } from '@/components/libs/prisma'

const jwtSecret = process.env.JWT_SECRET_KEY

// Define an async function for handling the API endpoint
export async function POST(request: NextRequest){
    // Extract the email and password from the request body
    const { email, password } = await request.json()
    // Find a user in the database with the provided email
    const user = await prisma.user.findUnique({
        where: { email },
    })

    // If a user doesn't exist, return a 401 error
    if (!user) {
        return NextResponse.json({ message: 'Invalid login credentials username or password' },{status: 401})
    }

    // Compare the password with the stored hashed password using bcrypt
    const isValid = await bcrypt.compare(password, user.password)

    // If the password is invalid, return a 401 message
    if (!isValid) {
        return NextResponse.json({ message: 'Invalid login credentials username or password' }, {status: 401})
    }

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
    }

    const token = sign({ id: user.id, email: user.email }, jwtSecret, {
        expiresIn: '8h', // Token expires in 1 hour
    });

    cookies().set('token', token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',  // Secure in production
        sameSite: 'lax',
    });

    await prisma.$disconnect();

    return NextResponse.json({ token, message: 'logged in' }, {status: 200})
}
