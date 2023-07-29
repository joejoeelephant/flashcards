import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <div className='p-2 bg-blue-400 text-white'>
        <div className='flex justify-end gap-4'>
            <Link href={'/'}>
                Home
            </Link>
            <Link href={'/cards'}>
                Cards
            </Link>
            <Link href={'/addcard'}>
                Add Card
            </Link>
        </div>
    </div>
  )
}
