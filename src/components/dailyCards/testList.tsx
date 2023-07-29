import React, { useRef, useState } from 'react'
import Link from 'next/link'
import customFetch from '../utils/customFetch'
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

interface Props{
    FlashCards: FlashCard[];
}

export default function TestList(props: Props) {
    const flashCards = props.FlashCards
    const [currentIndex, setCurrentIndex] = useState(0)
    const [checkState, setCheckState] = useState(true)
    const [answerState, setAnswerState] = useState(false)
    const [updating, setUpdating] = useState(false)
    const answerRef = useRef<HTMLInputElement>(null)
    const currentWord = flashCards[currentIndex]
    const definitions = currentWord? JSON.parse(currentWord.definition): []

    const resetAnswer = () => {
        if(answerRef.current) {
            answerRef.current.value = ""
        }
        setCheckState(true)
        setAnswerState(false)
    }

    const nextCard = () => {
        if(currentIndex >= flashCards.length - 1) {
            return;
        }
        
        resetAnswer()
        setCurrentIndex(prev => (prev + 1))
    }

    const checkAnswer = async () => {
        if(updating) return;
        const answer = answerRef.current?.value;
        const word = currentWord.word;
        setAnswerState(answer == word)
        setUpdating(true)
        const score = (answer == word)? 1: 0
        const failure = Number(!score)
        const id = currentWord.id

        try {
            const response = await customFetch('/api/card',{
                method: 'PUT',
                body: {
                    score, 
                    failure,
                    id
                }
            })
            console.log(response)
            setCheckState(false)
            setUpdating(false)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='min-h-screen p-3 bg-slate-100 flex flex-col justify-center'>
            <div className='p-4 bg-white shadow-md shadow-slate-300 rounded-md'>
                <div className='text-2xl font-bold text-center'>Test Card</div>
                <div className='font-bold mt-3'>
                    Definition:
                </div>
                <div className='mt-2'>
                    {
                        definitions.map((item: string, index: number) => (
                            <div key={index}>
                                {item}
                            </div>
                        ))
                    }
                </div>
                <div className='mt-2'>
                    <div className='font-bold'>
                        Word:
                    </div>
                    <div>
                        <input type="text" name="word" className='w-full border-2 border-slate-300 p-2 mt-2' ref={answerRef}/>
                    </div>
                </div>
                {
                    !checkState && 
                    <div className='mt-2'>
                        <span className='font-bold'>Answer:</span>
                        <span className={answerState? 'text-green-600': 'text-red-600'}>{currentWord.word}</span>
                    </div>
                }
                {
                    !checkState &&  currentIndex < flashCards.length - 1 &&
                    <div className='mt-4'>
                        <button onClick={nextCard} className='block p-2 text-center bg-blue-300 active:bg-blue-400 text-white font-bolder mx-auto rounded-md select-none'>next</button>
                    </div>
                }
                
                {
                    checkState &&
                    <div className='mt-4'>
                        <button 
                            onClick={checkAnswer}
                            className='block p-2 text-center bg-green-400 active:bg-green-500 text-white font-bolder mx-auto rounded-md select-none'>
                            {updating ? 'updating' : 'check'}
                        </button>
                    </div>
                }

                {
                     currentIndex >= flashCards.length - 1 &&
                    <div className='mt-4'>
                        <Link href={'/cards'} className='block p-2 text-center bg-purple-300 active:bg-purple-400 text-white font-bolder mx-auto rounded-md select-none'>done</Link>
                    </div>
                }
                
            </div>
            
        </div>
    )
}
