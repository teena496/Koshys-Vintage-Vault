import './CollectionPagination.css'

interface CollectionPaginationProps {
  page: number
  totalPages: number
  total: number
  onChange: (page: number) => void
}

export default function CollectionPagination({ page, totalPages, total, onChange }: CollectionPaginationProps) {
  if (totalPages <= 1) return null
  return (
    <nav className="collection-pagination" aria-label="Collection pages">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1}>Previous</button>
      <span>Page {page} of {totalPages} · {total} items</span>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page === totalPages}>Next</button>
    </nav>
  )
}
