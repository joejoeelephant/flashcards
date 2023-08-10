'use client'
import React from 'react'
import { useRef, useState } from 'react'
import customFetch from '@/components/utils/customFetch';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading,setLoading] = useState(false)
  const router = useRouter()

  const submit = async (event: React.FormEvent) => {
    if(loading) return;
    event.preventDefault();
    setLoading(true)
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    try {
      const response = await customFetch('/api/login', {
        method: 'POST',
        body: {
          email,
          password
        }
      })
      console.log(response);
      router.push('/cards')
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      toast.error(error.message)      
    }
  }


  return (
    <div className='h-screen flex justify-center items-center bg-slate-100'>
      <div className='w-80 rounded-md shadow-md shadow-slate-300 bg-white p-4'>
        <div className='text-2xl text-gray-700 text-center'>
          LoginIn
        </div>
        <div>
          <form onSubmit={submit}>
            <div className='mt-2'>
              <label className='block'>Email:</label>
              <input 
                ref={emailRef}
                type="email" 
                required 
                className='border-2 border-slate-600 rounded-md mt-2 w-full p-2'
              />
            </div>
            <div className='mt-2'>
              <label className='block'>Password:</label>
              <input
                ref={passwordRef}
                type="password" 
                required
                className='border-2 border-slate-600 rounded-md mt-2 w-full p-2'
              />
            </div>
            <div className='mt-4'>
              <button type="submit" className={'w-full p-2 '+ (!loading ? 'bg-blue-400 active:bg-blue-500': 'bg-slate-400 active:bg-slate-500') +' text-white text-center rounded-md'}>
                {loading ? 'Loading...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
