import Header from '@/components/layout/header';

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <>
        <Header></Header>
        {children}
      </>
    )
  }