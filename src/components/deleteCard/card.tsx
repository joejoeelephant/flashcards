'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import customFetch from '@/components/utils/customFetch'

interface CardProps {
    wordData: any;
}

export default function Card(props: CardProps) {
    const wordData = props.wordData;
    const definitions = JSON.parse(wordData.definition)
    const examples = JSON.parse(wordData.example)
    const {id} = wordData
    const router = useRouter()
    const deleteCard = async () => {
        customFetch(`/api/card?id=${id}`, {
            method: 'DELETE'
        }).then(res => {
            console.log(res)
            router.push('/cards')
        }).catch(error => {
            console.log(error)
        })
    }

    return (
        <div className='p-4 bg-white shadow-md shadow-slate-300 rounded-md'>
            <div>
                <div className='w-full mt-2 py-4 text-2xl font-bold text-center border-b-2 border-slate-500'>
                    {wordData?.word}
                </div>
            </div>
            <div>
                <div className='mt-2 border-b-2 border-slate-500 pb-2'>
                    <div className='font-bold'>
                        definition:
                    </div>
                    <div>
                        {
                            definitions.length > 0 && definitions.map((item: string,index: number) => (
                                <div key={index} className='mt-2'>{item}</div>
                            ))
                        }
                    </div>
                </div>
                <div className='mt-2 border-b-2 border-slate-500 pb-2'>
                    <div className='font-bold'>
                        example:
                    </div>
                    <div>
                        {
                            examples.length > 0 && examples.map((item: string,index: number) => (
                                <div key={index} className='mt-2'>{item}</div>
                            ))
                        }
                    </div>
                </div>
                <div className='mt-2'>
                    <div className='font-bold'>
                        etymology:
                    </div>
                    <div className='mt-2'>
                        {wordData?.etymology}
                    </div>
                </div>
            </div>
            <button onClick={deleteCard} className='font-bold w-full block mt-4 bg-red-400 p-2 text-center text-white active:bg-red-500 rounded-md'>
                delete card
            </button>
        </div>
    )
}
