'use client'
import { useState } from 'react';
import { useSupabase } from '@/lib/use-supabase';
import { useUser } from '@clerk/nextjs';

interface TaskFormProps {
  onTaskCreated: (newTask: any) => void;
}

export function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [name, setName] = useState('');
  const { user } = useUser();
  const supabase = useSupabase();

  async function createTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    const { data, error } = await supabase.from('tasks').insert({
      name,
      user_id: user.id,
    }).select().single();

    if (error) throw error;
    
    onTaskCreated(data);
    setName('');
  }

  return (
    <form onSubmit={createTask} className="mt-8">
      <div className="flex space-x-4">
        <input
          autoFocus
          type="text"
          name="name"
          placeholder="Nueva tarea..."
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-zinc-500 text-white rounded-lg hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          Agregar
        </button>
      </div>
    </form>
  );
}
