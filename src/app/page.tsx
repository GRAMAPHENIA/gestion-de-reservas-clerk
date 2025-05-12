'use client'

import { useEffect, useState } from 'react'
import { useSession, useUser } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  // El hook `useUser()` se usa para asegurarse de que Clerk haya cargado los datos del usuario conectado
  const { user } = useUser()
  // El hook `useSession()` se usa para obtener el objeto de sesión de Clerk
  // El objeto de sesión se usa para obtener el token de sesión de Clerk
  const { session } = useSession()

  // Crear un cliente de Supabase personalizado que inyecta el token de sesión de Clerk en las cabeceras de la solicitud
  function createClerkSupabaseClient() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Las variables de entorno de Supabase no están configuradas');
    }

    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        async accessToken() {
          return session?.getToken() ?? null;
        },
      }
    );
  }

  // Crear un `client` objeto para acceder a los datos de Supabase usando el token de Clerk
  const client = createClerkSupabaseClient()

  // Este `useEffect` esperará a que el objeto User se cargue antes de solicitar
  // las tareas para el usuario conectado
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
    // Insertar tarea en la base de datos "tasks"
    await client.from('tasks').insert({
      name,
    })
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-zinc-950/50 flex flex-col">
      <div className="flex-1">
        <div className="max-w-2xl mx-auto px-8 py-12 space-y-6">
          <h1 className="text-3xl font-bold text-white">Tareas</h1>

          {loading && (
            <div className="fixed inset-0 bg-zinc-900/50 flex items-center justify-center">
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
              {tasks.map((task: any) => (
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

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/50 backdrop-blur-sm border-t border-zinc-800">
        <div className="max-w-2xl mx-auto px-8 py-4">
          <form onSubmit={createTask} className="flex gap-2">
            <input
              autoFocus
              type="text"
              name="name"
              placeholder="Escribe una nueva tarea..."
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="flex-1 px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-800 text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-zinc-500 text-white rounded-xl hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 transition-colors"
            >
              Agregar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}