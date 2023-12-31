import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { type NextRequest } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/components/libs/prisma'


export async function POST(request: NextRequest) {
    // Get the data from the request body
    const { email, password } = await request.json()

    //Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      // Create a new user in the database
      const user = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
        },
      });
  
      console.log("User created:", user);
  
      // Return a success response
      return NextResponse.json({ message: "User created successfully" });
    } catch (error) {
      console.log(error)
      return NextResponse.json({ message:  "An unexpected error occurred.", error }, { status: 500 });
    }
  }