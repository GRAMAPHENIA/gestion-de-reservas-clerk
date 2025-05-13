import { createClient } from '@supabase/supabase-js'
import { Organization, CreateOrganizationDTO, UpdateOrganizationDTO } from '@/types/organization'

export class OrganizationService {
  constructor(private client: ReturnType<typeof createClient>) {}

  async getOrganizations(): Promise<Organization[]> {
    const { data, error } = await this.client
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getOrganizationById(id: string): Promise<Organization | null> {
    const { data, error } = await this.client
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  }

  async createOrganization(org: CreateOrganizationDTO): Promise<Organization> {
    const { data, error } = await this.client
      .from('organizations')
      .insert(org)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateOrganization(id: string, updates: UpdateOrganizationDTO): Promise<Organization> {
    const { data, error } = await this.client
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteOrganization(id: string): Promise<void> {
    const { error } = await this.client
      .from('organizations')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
