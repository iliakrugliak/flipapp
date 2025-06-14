'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/auth/check')
      if (!res.ok) router.push('/login')
    }
    checkAuth()
  }, [router])

  return <>{children}</>
}