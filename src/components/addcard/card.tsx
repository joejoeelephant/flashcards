'use client'
import React, { useState } from 'react'
import { useRef } from 'react'
import customFetch from '@/components/utils/customFetch'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';

export default function Card() {
    const wordRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const addCard = () => {
        const word = wordRef.current?.value;
        if(!word) return;
        if(loading) return;
        setLoading(true)
        customFetch('/api/card', {
            method: 'POST',
            body: {
                word
            }
        }).then(res => {
            console.log(res)
            setLoading(false)
            router.push('/card/' + res.word)
        }).catch(error => {
            setLoading(false)
            if(error.message === 'FlashCard already exists.') {
                toast.error('FlashCard already exists.');
            }
            console.log(error.message)
        })
    }
    return (
        <div className='p-4 bg-white shadow-md shadow-slate-300 rounded-md'>
            <div>
                <div>Word:</div>
                    <input type="text" name='word' className='border-2 border-slate-500 rounded-md w-full mt-2 p-2' ref={wordRef}/>
                </div>
                <button onClick={addCard} className='font-bold w-full block mt-4 bg-blue-400 p-2 text-center text-white active:bg-blue-500 rounded-md'>
                    {loading ? 'loading' : 'Add Card'}
                </button>
            </div>
    )
}
