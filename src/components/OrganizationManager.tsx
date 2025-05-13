'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@clerk/nextjs'
import { createClient } from '@supabase/supabase-js'
import Image from 'next/image'
import AddOrganization from './AddOrganization'

interface Organization {
  id: string
  name: string
  slug: string
  image_url?: string
  created_at: string
}

export default function OrganizationManager() {
  const [isOpen, setIsOpen] = useState(false)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
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
    if (!session) return

    async function loadOrganizations() {
      setLoading(true)
      try {
        const { data, error } = await client
          .from('organizations')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (!error) {
          setOrganizations(data)
        }
      } catch (error) {
        console.error('Error loading organizations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrganizations()
  }, [session])

  const handleOrganizationCreated = () => {
    setIsOpen(false)
    // Recargar las organizaciones
    client
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) {
          setOrganizations(data)
        }
      })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Organizaciones</h2>
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-zinc-800 rounded-full p-2 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 transition-colors border border-zinc-700 cursor-pointer shadow-lg z-50"
        >
          <Image 
            src="/icons/plus.svg" 
            alt="Crear organización" 
            width={24} 
            height={24} 
            className="fill-white"
          />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {organizations.length > 0 ? (
            organizations.map((org) => (
              <div
                key={org.id}
                className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 shadow-lg"
              >
                <h3 className="text-zinc-200 font-semibold">{org.name}</h3>
                {org.image_url && (
                  <div className="mt-2">
                    <img
                      src={org.image_url}
                      alt={org.name}
                      className="w-full rounded-lg h-32 object-cover"
                    />
                  </div>
                )}
                <p className="text-zinc-400 text-sm mt-1">{org.slug}</p>
                <p className="text-zinc-400 text-sm mt-1">
                  {new Date(org.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-zinc-400">
              No hay organizaciones. ¡Crea tu primera organización!
            </p>
          )}
        </div>
      )}

      {isOpen && (
        <AddOrganization
          onClose={() => setIsOpen(false)}
          onSuccess={handleOrganizationCreated}
        />
      )}
    </div>
  )
}
