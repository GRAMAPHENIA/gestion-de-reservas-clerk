'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useSession } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'

interface AddOrganizationProps {
  onClose: () => void
  onSuccess?: () => void
}

export default function AddOrganization({ onClose, onSuccess }: AddOrganizationProps) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo debe ser menor a 5MB')
        return
      }
      setImage(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim() || !slug.trim()) return

    setLoading(true)

    try {
      // Subir imagen a Supabase Storage si existe
      let imageUrl = ''
      if (image) {
        const { data, error } = await client.storage
          .from('organizations')
          .upload(`images/${slug}/${image.name}`, image)

        if (error) throw error

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/organizations/images/${slug}/${image.name}`
      }

      // Crear organización en Supabase
      await client.from('organizations').insert({
        id: crypto.randomUUID(),
        name,
        slug,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
      })

      onClose()
      onSuccess?.()
    } catch (error) {
      console.error('Error creating organization:', error)
      alert('Error al crear la organización')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-zinc-900/50 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-zinc-800/50 rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Nueva Organización</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <Image
              src="/icons/close.svg"
              alt="Cerrar"
              width={20}
              height={20}
              className="fill-current"
            />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección de imagen */}
          <div className="flex items-center gap-4">
            <div 
              className="border-dashed border-2 border-zinc-700 rounded-xl p-6 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Image
                src="/icons/upload.svg"
                alt="Subir imagen"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <p className="text-zinc-400 text-sm w-48">
              Aspecto recomendado 1:1,<br />máximo 5MB
            </p>
          </div>
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              placeholder="Nombre de la organización"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-1">URL</label>
            <input
              type="text"
              name="slug"
              placeholder="mi-nombre"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-zinc-200 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-zinc-500 text-white rounded-xl hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
