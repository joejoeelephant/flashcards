'use client'
import React from 'react'
import { useRef } from 'react'
import customFetch from '@/components/utils/customFetch';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter()

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    customFetch('/api/login', {
      method: 'POST',
      body: {
        email,
        password
      }
    }).then(response => {
      console.log(response);
      router.push('/cards')
    }).catch(err => {
      console.log(err)
    })
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
              <button type="submit" className='w-full p-2 bg-blue-400 active:blue-500 text-white text-center rounded-md'>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
