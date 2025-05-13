'use client'

import { useUser } from '@clerk/nextjs'
import OrganizationManager from '@/components/OrganizationManager'

export default function Home() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-zinc-950/50 flex flex-col">
      <div className="flex-1">
        <div className="max-w-2xl mx-auto px-8 py-12">
          <OrganizationManager />
        </div>
      </div>
    </div>
  )
}