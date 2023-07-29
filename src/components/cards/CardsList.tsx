'use client'
import React, { useCallback, useEffect } from 'react'
import customFetch from '@/components/utils/customFetch'
import { useState } from 'react'
import Link from 'next/link'

const PAGE_SIZE = Number(process.env.PAGE_SIZE);

export default function CardsList() {
    const [page, setPage] = useState(1);
    const [isEnd, setIsEnd] = useState(false)
    const [list, setList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const getList = useCallback(async () => {
        setLoading(true)
        try {
          const response = await customFetch(`/api/cards/?page=${page}`, {
            method: 'GET',
          });

          setLoading(false)

          if (!response.success) {
            throw new Error('Server response was not ok.');
          }
    
          const { result } = response;

          if (result.length < 1) {
            setIsEnd(true);
            return;
          }
    
          setList((prev) => [...prev, ...result]);
    
          if (result.length < PAGE_SIZE) {
            setIsEnd(true);
          }
        } catch (error) {
          console.error(error);
        }
    }, [page]);
    
      // Fetch initial data on component mount
    useEffect(() => {
        getList();
    }, [getList]);


    const nextPage = () => {
        if(isEnd || loading) {
            return;
        }
        setPage(prev => (prev + 1))
    }
    

    return (
        <div className='min-h-screen bg-slate-100 p-3'>
            <div className='grid grid-cols-2 grid-flow-row-dense gap-4'>
                {
                    list.map((item: any, index: number) => (
                        <Link href={'/card/'+item.word} key={index} className='rounded-md shadow-md shadow-slate-300 bg-white py-4 text-xl text-center font-bold'>
                            {item.word}
                        </Link>
                    ))
                }
            </div>
            <div className='mt-4'>
                {
                    !isEnd && 
                    <button onClick={nextPage} className='bg-blue-200 active:bg-blue-300 text-white text-center block rounded-md p-2 mx-auto select-none overflow-hidden'>
                        {loading ? 'Loading' : 'Load More'}
                    </button>
                }
                {
                    isEnd && <div className='text-center text-slate-300'>End</div>
                }
            </div>
        </div>
    )
}
