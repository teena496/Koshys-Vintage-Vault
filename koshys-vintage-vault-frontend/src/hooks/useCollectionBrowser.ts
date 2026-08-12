import { useEffect, useState } from 'react'
import { emptyCollectionFilters, type CollectionFilterValues } from '../data/collectionFilters'
import { getCollectionFilterOptions, getCollectionPage, type CollectionFilterOptions, type CollectionItem, type CollectionType } from '../data/collectionStore'

const pageSize = 12

export function useCollectionBrowser(type: CollectionType) {
  const [items, setItems] = useState<CollectionItem[]>([])
  const [filters, setFilterState] = useState<CollectionFilterValues>(emptyCollectionFilters)
  const [options, setOptions] = useState<CollectionFilterOptions>({ countries: [], years: [] })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollectionFilterOptions(type).then(setOptions).catch(error => console.error('Unable to load filter options:', error))
  }, [type])

  useEffect(() => {
    let active = true
    const timeout = window.setTimeout(() => {
      setLoading(true)
      getCollectionPage(type, filters, page, pageSize)
        .then(result => {
          if (!active) return
          setItems(result.items)
          setTotal(result.total)
        })
        .catch(error => console.error('Unable to load collection:', error))
        .finally(() => { if (active) setLoading(false) })
    }, filters.search ? 300 : 0)

    return () => {
      active = false
      window.clearTimeout(timeout)
    }
  }, [filters, page, type])

  const setFilters = (values: CollectionFilterValues) => {
    setPage(1)
    setFilterState(values)
  }

  return { items, filters, setFilters, options, page, setPage, total, totalPages: Math.max(1, Math.ceil(total / pageSize)), loading }
}
