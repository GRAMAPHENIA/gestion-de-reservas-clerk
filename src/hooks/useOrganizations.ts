import { useState, useEffect, useCallback } from 'react'
import { Organization } from '@/types/organization'
import { OrganizationService } from '@/services/organizationService'

export function useOrganizations(service: OrganizationService) {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true)
      const data = await service.getOrganizations()
      setOrganizations(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching organizations:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [service])

  const createOrganization = useCallback(async (orgData: Omit<Organization, 'id' | 'created_at'>) => {
    try {
      setLoading(true)
      const newOrg = await service.createOrganization(orgData)
      setOrganizations(prev => [newOrg, ...prev])
      return newOrg
    } catch (err) {
      console.error('Error creating organization:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [service])

  const updateOrganization = useCallback(async (id: string, updates: Partial<Organization>) => {
    try {
      setLoading(true)
      const updatedOrg = await service.updateOrganization(id, updates)
      setOrganizations(prev => 
        prev.map(org => org.id === id ? updatedOrg : org)
      )
      return updatedOrg
    } catch (err) {
      console.error('Error updating organization:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [service])

  const deleteOrganization = useCallback(async (id: string) => {
    try {
      setLoading(true)
      await service.deleteOrganization(id)
      setOrganizations(prev => prev.filter(org => org.id !== id))
    } catch (err) {
      console.error('Error deleting organization:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [service])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  return {
    organizations,
    loading,
    error,
    refresh: fetchOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
  }
}
