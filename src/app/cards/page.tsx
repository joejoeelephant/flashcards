import React from 'react'
import { authCheck } from '@/components/auth/authCheck'
import CardsList from '@/components/cards/CardsList'
export default function page() {
  authCheck()

  return (
    <div>
      <CardsList></CardsList>
    </div>
  )
}
