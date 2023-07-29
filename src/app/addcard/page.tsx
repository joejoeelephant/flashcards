import React from 'react'
import Card from '@/components/addcard/card'
import { authCheck } from '@/components/auth/authCheck'
const AddCard = () => {
    authCheck()
    
    return (
        <div className='h-screen bg-slate-100 flex justify-center items-center'>
            <Card></Card>
        </div>
    )
}

export default AddCard
