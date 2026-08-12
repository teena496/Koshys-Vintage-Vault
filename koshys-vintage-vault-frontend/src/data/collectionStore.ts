import { supabase } from '../lib/supabase'
import type { CollectionFilterValues } from './collectionFilters'

export type CollectionType = 'stamps' | 'coins' | 'covers'

export interface CollectionItem {
  id: number
  name: string
  year: string
  country: string
  rarity: string
  price: string
  description: string
  image: string
  imagePath?: string
}

export type NewCollectionItem = Omit<CollectionItem, 'id' | 'image' | 'imagePath'>

export interface CollectionPage {
  items: CollectionItem[]
  total: number
}

export interface CollectionFilterOptions {
  countries: string[]
  years: string[]
}

const databaseTypes: Record<CollectionType, string> = {
  stamps: 'stamp',
  coins: 'coin',
  covers: 'postal_cover'
}

const validRarities = new Set(['Common', 'Uncommon', 'Rare', 'Very Rare', 'Extremely Rare', 'Unique'])

interface CollectionRow {
  id: number
  name: string
  year: string
  country: string
  rarity: string
  price: string
  description: string
  image_url: string
  image_path: string | null
}

function validateItemName(name: string): void {
  const length = name.trim().length
  const maximumLength = 40
  if (length < 1 || length > maximumLength) {
    throw new Error(`Item name must contain between 1 and ${maximumLength} characters.`)
  }
}

function validateItem(item: NewCollectionItem): void {
  validateItemName(item.name)
  if (!/^\d{1,4}$/.test(item.year.trim())) throw new Error('Year must be a number containing up to 4 digits.')
  if (!item.country.trim() || item.country.trim().length > 60) throw new Error('Country must contain between 1 and 60 characters.')
  if (!validRarities.has(item.rarity)) throw new Error('Please select a valid rarity.')
  if (!/^(?:CAD \$|₹)\d+(?:\.\d{1,2})?$/.test(item.price.trim())) {
    throw new Error('Price must use CAD or rupee currency and contain a positive numeric amount.')
  }
  if (Number(item.price.trim().replace(/^(?:CAD \$|₹)/, '')) <= 0) throw new Error('Price must be greater than zero.')
  const descriptionLength = item.description.trim().length
  if (descriptionLength < 10 || descriptionLength > 200) throw new Error('Description must contain between 10 and 200 characters.')
}

function validateImageFile(file: File): void {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Image must be a JPG, PNG, or WebP file.')
  if (file.size > 2 * 1024 * 1024) throw new Error('Image must be smaller than 2 MB.')
}

function toCollectionItem(row: CollectionRow): CollectionItem {
  return {
    id: row.id,
    name: row.name,
    year: row.year,
    country: row.country,
    rarity: row.rarity,
    price: row.price,
    description: row.description,
    image: row.image_url,
    imagePath: row.image_path ?? undefined
  }
}

export async function getCustomItems(type: CollectionType): Promise<CollectionItem[]> {
  const { data, error } = await supabase
    .from('collection_items')
    .select('id, name, year, country, rarity, price, description, image_url, image_path')
    .eq('type', databaseTypes[type])
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as CollectionRow[]).map(toCollectionItem)
}

export async function getCollectionPage(
  type: CollectionType,
  filters: CollectionFilterValues,
  page: number,
  pageSize: number
): Promise<CollectionPage> {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  let query = supabase
    .from('collection_items')
    .select('id, name, year, country, rarity, price, description, image_url, image_path', { count: 'exact' })
    .eq('type', databaseTypes[type])

  if (filters.country) query = query.eq('country', filters.country)
  if (filters.year) query = query.eq('year', filters.year)
  if (filters.currency === 'CAD') query = query.like('price', 'CAD $%')
  if (filters.currency === 'INR') query = query.or('price.like.₹%,price.like.INR%')
  if (filters.search.trim()) {
    const search = filters.search.trim().replace(/[(),]/g, ' ')
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,country.ilike.%${search}%,year.ilike.%${search}%,rarity.ilike.%${search}%`)
  }

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, to)
  if (error) throw error
  return { items: (data as CollectionRow[]).map(toCollectionItem), total: count ?? 0 }
}

export async function getCollectionFilterOptions(type: CollectionType): Promise<CollectionFilterOptions> {
  const { data, error } = await supabase
    .from('collection_items')
    .select('country, year')
    .eq('type', databaseTypes[type])

  if (error) throw error
  const rows = data as Array<Pick<CollectionRow, 'country' | 'year'>>
  return {
    countries: [...new Set(rows.map(row => row.country))].sort((a, b) => a.localeCompare(b)),
    years: [...new Set(rows.map(row => row.year))].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
  }
}

export async function getCollectionItem(id: number): Promise<CollectionItem> {
  const { data, error } = await supabase
    .from('collection_items')
    .select('id, name, year, country, rarity, price, description, image_url, image_path')
    .eq('id', id)
    .single()

  if (error) throw error
  return toCollectionItem(data as CollectionRow)
}

export async function addCustomItem(
  type: CollectionType,
  item: NewCollectionItem,
  imageFile: File
): Promise<CollectionItem> {
  validateItem(item)
  validateImageFile(imageFile)
  const extension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExtension = extension.replace(/[^a-z0-9]/g, '') || 'jpg'
  const imagePath = `${databaseTypes[type]}/${crypto.randomUUID()}.${safeExtension}`

  const { error: uploadError } = await supabase.storage
    .from('collection-images')
    .upload(imagePath, imageFile, { contentType: imageFile.type, upsert: false })

  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage
    .from('collection-images')
    .getPublicUrl(imagePath)

  const { data, error: insertError } = await supabase
    .from('collection_items')
    .insert({
      type: databaseTypes[type],
      name: item.name,
      year: item.year,
      country: item.country,
      rarity: item.rarity,
      price: item.price,
      description: item.description,
      image_url: publicUrlData.publicUrl,
      image_path: imagePath
    })
    .select('id, name, year, country, rarity, price, description, image_url, image_path')
    .single()

  if (insertError) {
    await supabase.storage.from('collection-images').remove([imagePath])
    throw insertError
  }

  return toCollectionItem(data as CollectionRow)
}

export async function deleteCustomItem(item: CollectionItem): Promise<void> {
  const { error } = await supabase.from('collection_items').delete().eq('id', item.id)
  if (error) throw error

  if (item.imagePath) {
    const { error: storageError } = await supabase.storage
      .from('collection-images')
      .remove([item.imagePath])
    if (storageError) console.error('The database item was deleted, but its image could not be removed:', storageError)
  }
}

export async function updateCustomItem(
  type: CollectionType,
  existingItem: CollectionItem,
  updates: NewCollectionItem,
  imageFile: File | null
): Promise<CollectionItem> {
  validateItem(updates)
  if (imageFile) validateImageFile(imageFile)
  let imageUrl = existingItem.image
  let imagePath = existingItem.imagePath
  let newlyUploadedPath: string | undefined

  if (imageFile) {
    const extension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg'
    const safeExtension = extension.replace(/[^a-z0-9]/g, '') || 'jpg'
    newlyUploadedPath = `${databaseTypes[type]}/${crypto.randomUUID()}.${safeExtension}`

    const { error: uploadError } = await supabase.storage
      .from('collection-images')
      .upload(newlyUploadedPath, imageFile, { contentType: imageFile.type, upsert: false })
    if (uploadError) throw uploadError

    imagePath = newlyUploadedPath
    imageUrl = supabase.storage.from('collection-images').getPublicUrl(newlyUploadedPath).data.publicUrl
  }

  const { data, error } = await supabase
    .from('collection_items')
    .update({
      name: updates.name,
      year: updates.year,
      country: updates.country,
      rarity: updates.rarity,
      price: updates.price,
      description: updates.description,
      image_url: imageUrl,
      image_path: imagePath
    })
    .eq('id', existingItem.id)
    .select('id, name, year, country, rarity, price, description, image_url, image_path')
    .single()

  if (error) {
    if (newlyUploadedPath) {
      await supabase.storage.from('collection-images').remove([newlyUploadedPath])
    }
    throw error
  }

  if (newlyUploadedPath && existingItem.imagePath) {
    await supabase.storage.from('collection-images').remove([existingItem.imagePath])
  }

  return toCollectionItem(data as CollectionRow)
}
