import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { getTokenData } from '@/components/utils/validateToken';
import { chatCompletion } from '@/components/openapi/openAICall'
import { prisma } from '@/components/libs/prisma'


export async function POST(request: NextRequest) {
    const {word} = await request.json();
    const token = request.cookies.get('token');
    if (!token) {
      return NextResponse.json({message: "token is not defined"}, {status: 401})
    }
    const decodedToken = getTokenData(token.value);
    if(!decodedToken) {
      return NextResponse.json({message: "token is invalid"}, {status: 401})
    }

    const response = await chatCompletion(word)
    const content = response.content
    const wordData = JSON.parse(content)
    const {definitions, examples, etymology} = wordData
    const {id} = decodedToken;

    try {
        // Create a new user in the database
        const newFlashCard = await prisma.flashCard.create({
            data: {
                word: wordData.word,
                pronunciation: wordData.pronunciation,
                definition: JSON.stringify(definitions),
                example: JSON.stringify(examples),
                etymology: JSON.stringify(etymology),
                user: {
                    connect: { id: Number(id) },
                },
            },
        });
    
        // console.log("User created:", newFlashCard);
        // Return a success response
        return NextResponse.json({ message: "newFlashCard created successfully", success: 'ok', word: wordData.word }, {status: 200});
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          // Unique constraint violation (i.e., email already exists)
          return NextResponse.json({ message: "FlashCard already exists." }, { status: 409 });
        } else {
          // All other errors
          console.error(`An unexpected error occurred: ${String(error)}`);
          return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
        }
      }

}

export async function DELETE(
  request: NextRequest,
) {

  const token = request.cookies.get('token');
  if (!token) {
    throw new Error('token is not defined');
  }
  const decodedToken = getTokenData(token.value);
  if(!decodedToken) {
    return NextResponse.json({message: "token is invalid"}, {status: 401})
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id') //card id
  try {
    const word = await prisma.flashCard.delete({
      where: {
        id: Number(id),
      },
    })
    return NextResponse.json({message: "Delete successfully", success: true}, {status: 200});
  } catch (error) {
    return NextResponse.json({message: 'An error occurred while deleting the word', success: false}, {status: 500});
  }finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  const {id, score, failure} = await request.json();
  const token = request.cookies.get('token');

  if (!token) {
    throw new Error('token is not defined');
  }

  const decodedToken = getTokenData(token.value);

  if(!decodedToken) {
    return NextResponse.json({message: "token is invalid"}, {status: 401})
  }

  try {
      // Update the flashcard in the database
      const updatedFlashCard = await prisma.flashCard.update({
          where: {
              id: Number(id),
          },
          data: {
              score: {
                increment: Number(score),
              },
              failure: {
                increment: Number(failure),
              },
              lastReviewed: new Date(),
          },
      });

      console.log("FlashCard updated:", updatedFlashCard);

      // Return a success response
      return NextResponse.json({ message: "FlashCard updated successfully", success: 'ok', flashCard: updatedFlashCard }, {status: 200});

  } catch (error) {
      // Handle all other errors
      console.error(`An unexpected error occurred: ${String(error)}`);
      return NextResponse.json({ message: "An unexpected error occurred." }, {status: 500});
  }
}
