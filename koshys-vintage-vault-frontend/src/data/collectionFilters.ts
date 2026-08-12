export interface CollectionFilterValues {
  search: string
  country: string
  year: string
  currency: string
}

export const emptyCollectionFilters: CollectionFilterValues = { search: '', country: '', year: '', currency: '' }
