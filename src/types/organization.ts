export interface Organization {
  id: string
  name: string
  slug: string
  image_url?: string
  created_at: string
}

export type CreateOrganizationDTO = Omit<Organization, 'id' | 'created_at'>

export type UpdateOrganizationDTO = Partial<Omit<Organization, 'id' | 'created_at'>>
