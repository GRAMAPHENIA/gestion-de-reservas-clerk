'use client'
import { useEffect, useState } from 'react'
import { useSession, useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import { TaskForm } from '@/components/TaskForm'

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const { user } = useUser()
  const { session } = useSession()

  function createClerkSupabaseClient() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        async accessToken() {
          return session?.getToken() ?? null
        },
      },
    )
  }

  const client = createClerkSupabaseClient()

  useEffect(() => {
    if (!user) return

    async function loadTasks() {
      setLoading(true)
      const { data, error } = await client
        .from('tasks')
        .select()
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
      if (!error) setTasks(data)
      setLoading(false)
    }

    loadTasks()
  }, [user])

  async function refreshTasks() {
    const { data, error } = await client
      .from('tasks')
      .select()
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (!error) setTasks(data)
  }

  function handleTaskCreated(newTask: any) {
    setTasks([newTask, ...tasks])
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Tareas</h1>
          <p className="text-zinc-600">{user?.fullName}</p>
        </div>

        {loading && <p className="text-center text-gray-500">Cargando...</p>}

        {!loading && (
          <div>
            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg shadow"
                  >
                    <p className="text-lg">{task.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No hay tareas</p>
            )}

            <TaskForm onTaskCreated={handleTaskCreated} />
          </div>
        )}
      </div>
    </div>
  )
}
