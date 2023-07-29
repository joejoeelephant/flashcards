import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getTokenData } from '@/components/utils/validateToken';
import dayjs from 'dayjs';
import { prisma } from '@/components/libs/prisma'


interface FlashCard {
    id: number   
    word: string         
    definition: string     
    etymology: string      
    example: string | null; 
    lastReviewed: Date;
    score: number         
    failure: number      
    createdAt: Date
    updatedAt: Date
    userId: number
}

function shouldBeStudied(card: FlashCard): boolean {
    const lastReviewed = dayjs(card.lastReviewed);
    const today = dayjs();
    const daysSinceLastReview = today.diff(lastReviewed, 'day');
  
    if (card.failure > 0) {
      // If the card has been failed before, it should be studied every day
      return true;
    } else if (card.score === 0) {
      // If the card has a score of 0, it should be studied every day
      return true;
    } else if (card.score === 1) {
      // If the card has a score of 1, it should be studied every three days
      return daysSinceLastReview >= 3;
    } else {
      // If the card has a score of 2 or more, it should be studied every five days
      return daysSinceLastReview >= 5;
    }
  }

export async function GET(request: NextRequest) {
    const token = request.cookies.get('token');
    if (!token) {
        return NextResponse.json({message: "No token found in request", success: false}, {status: 401})
    }
    const decodedToken = getTokenData(token.value);
    if(!decodedToken) {
        return NextResponse.json({message: "Invalid token", success: false}, {status: 401})
    }

    const userId = Number(decodedToken.id);

    try {
        const allCards: FlashCard[] = await prisma.flashCard.findMany({
            where: {
              userId: userId
            }
        });
        const cardsToStudy = allCards.filter(shouldBeStudied);
        return NextResponse.json({result: cardsToStudy.slice(0, 10), success: true}, {status: 200}); // Return cards to study
    } catch (error) {
        return NextResponse.json({message: 'An error occurred while deleting the word', success: false}, {status: 500});
    }

}
