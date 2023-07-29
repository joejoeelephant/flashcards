'use client'
import React, { useCallback, useEffect, useState } from 'react'
import customFetch from '../utils/customFetch'
import TestList from './testList';

export default function CardsList() {
    const [list, setList] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [testStatus, setTestStatus] = useState(false)
    const currentWord = list.length > currentIndex ? list[currentIndex] : null;
    const definitions = currentWord? JSON.parse(currentWord.definition): []
    const examples = currentWord? JSON.parse(currentWord.example): [];
    const getList = useCallback(async () => {
        setLoading(true)
        try {
            const result = await customFetch('/api/dailycards', {
                method: 'GET',
            })
            setLoading(false)
            console.log(result)
            setList(result.result)
        } catch (error) {
            console.log(error)
        }
    },[])

    useEffect(() => {
        getList()
    }, [getList])

    const nextCard = () => {
        if(currentIndex >= list.length - 1) {
            setTestStatus(true)
            return;
        }
        setCurrentIndex(prev => (prev + 1))
    }

    if(loading) {
        return (
            <div className='min-h-screen p-3 bg-slate-100 flex flex-col justify-center items-center'>
                Loading...
            </div>
        )
    }
    if(!testStatus) {
        return (
            <div className='min-h-screen p-3 bg-slate-100 flex flex-col justify-center'>
                <div className='p-4 bg-white shadow-md shadow-slate-300 rounded-md'>
                    <div>
                        <div className='w-full mt-2 py-4 text-2xl font-bold text-center border-b-2 border-slate-500'>
                            {currentWord?.word}
                        </div>
                    </div>
                    <div>
                        <div className='mt-2 border-b-2 border-slate-500 pb-2'>
                            <div className='font-bold'>
                                definition:
                            </div>
                            <div>
                                {
                                    definitions.map((item: string,index: number) => (
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
                                    examples.map((item: string,index: number) => (
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
                                {currentWord?.etymology}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-4'>
                    <button onClick={nextCard} className='block p-2 text-center bg-blue-300 active:bg-blue-400 text-white font-bolder mx-auto rounded-md select-none'>next</button>
                </div>
            </div>
        )
    }else {
        return (
            <>
                <TestList FlashCards={list}></TestList>
            </>
        )
    }


}
