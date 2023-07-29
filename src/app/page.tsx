import { authCheck } from '@/components/auth/authCheck'
import CardsList from '@/components/dailyCards/cardsList'
import Header from '@/components/layout/header';

export default function Home() {
  authCheck()
  
  return (
    <main>
      <Header></Header>
      <CardsList></CardsList>
    </main>
  )
}
