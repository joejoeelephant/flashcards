import React from 'react'
import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import Card from '@/components/deleteCard/card'
import { authCheck } from '@/components/auth/authCheck'
import { prisma } from '@/components/libs/prisma'

const findWord = async (word: string) => {
    try {
        const flashCard = await prisma.flashCard.findUnique({
          where: {
            word: word,
          },
        });
  
        if (flashCard) {
          return flashCard;
        } else {
          return null
        }
      } catch (error) {
        throw error;
      }
}

interface CardProps {
    id: number;
    definition: string;
    example: string;
    etymology: string;
  }

export default async function page({ params }: { params: { word: string } }) {
    authCheck()
    const {word} = params;
    const wordData = await findWord(word)
    if (!wordData) {      
        return (
          <>
            404
          </>
        )  
       
    } 

    return (
      <>
          <Card wordData={wordData}></Card>
      </>
    )
}
