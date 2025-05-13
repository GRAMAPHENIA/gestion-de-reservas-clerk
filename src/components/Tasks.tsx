'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'

interface Task {
  id: string
  name: string
}

interface TasksProps {
  user: any
}

export default function Tasks({ user }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const { session } = useSession()

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      async accessToken() {
        return session?.getToken() ?? null
      },
    }
  )

  useEffect(() => {
    if (!user) return

    async function loadTasks() {
      setLoading(true)
      const { data, error } = await client.from('tasks').select()
      if (!error) setTasks(data)
      setLoading(false)
    }

    loadTasks()
  }, [user])

  async function createTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) {
      return
    }
    await client.from('tasks').insert({ name })
    setName('')
    window.location.reload()
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1">
        <div className="space-y-6">
          {loading && (
            <div className="flex justify-center">
              <div className="text-center">
                <div className="relative animate-spin h-6 w-6 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent"></div>
                </div>
                <p className="text-white text-sm">Esperando datos...</p>
              </div>
            </div>
          )}

          {!loading && tasks.length > 0 && (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 shadow-lg"
                >
                  <p className="text-zinc-200">{task.name}</p>
                </div>
              ))}
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <p className="text-center text-zinc-400">
              No hay tareas. ¡Crea tu primera tarea!
            </p>
          )}
        </div>
      </div>

      <div className="fixed bottom-5 left-0 right-0">
        <div className="max-w-2xl mx-auto px-8 py-4">
          <form onSubmit={createTask} className="flex gap-2">
            <input
              autoFocus
              type="text"
              name="name"
              placeholder="Escribe una nueva tarea..."
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="flex-1 px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
            />
            <button
              type="submit"
              className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-none focus:ring-offset-2 transition-colors border border-zinc-700 cursor-pointer"
            >
              <Image src="/icons/plus.svg" alt="Agregar" width={20} height={20} className="fill-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
