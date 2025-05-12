'use client'

import { useUser } from '@clerk/nextjs'
import Tasks from '@/components/Tasks'

export default function Home() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-zinc-950/50 flex flex-col">
      <div className="flex-1">
        <div className="max-w-2xl mx-auto px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-6">Tareas</h1>
          <Tasks user={user} />
        </div>
      </div>
    </div>
  )
}