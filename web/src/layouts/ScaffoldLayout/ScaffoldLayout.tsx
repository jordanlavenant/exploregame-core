import { routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

import NavBar from '@/components/NavBar'

type LayoutProps = {
  title: string
  titleTo: keyof typeof routes
  buttonLabel: string
  buttonTo: keyof typeof routes
  children: React.ReactNode
}

const ScaffoldLayout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <NavBar />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  )
}

export default ScaffoldLayout
