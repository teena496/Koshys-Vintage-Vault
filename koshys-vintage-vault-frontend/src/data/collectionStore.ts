import { supabase } from '../lib/supabase'

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

const databaseTypes: Record<CollectionType, string> = {
  stamps: 'stamp',
  coins: 'coin',
  covers: 'postal_cover'
}

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

export async function addCustomItem(
  type: CollectionType,
  item: NewCollectionItem,
  imageFile: File
): Promise<CollectionItem> {
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
