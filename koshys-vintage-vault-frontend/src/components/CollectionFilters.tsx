import type { CollectionFilterOptions } from '../data/collectionStore'
import { emptyCollectionFilters, type CollectionFilterValues } from '../data/collectionFilters'
import './CollectionFilters.css'

interface CollectionFiltersProps {
  options: CollectionFilterOptions
  values: CollectionFilterValues
  onChange: (values: CollectionFilterValues) => void
}

export default function CollectionFilters({ options, values, onChange }: CollectionFiltersProps) {
  const hasFilters = Boolean(values.search || values.country || values.year || values.currency)

  const update = (field: keyof CollectionFilterValues, value: string) => onChange({ ...values, [field]: value })

  return (
    <div className="collection-filters" aria-label="Filter collection">
      <div className="collection-filter-field collection-filter-search">
        <label htmlFor="collection-search">Search</label>
        <input
          id="collection-search"
          type="search"
          value={values.search}
          onChange={event => update('search', event.target.value)}
          placeholder="Search the collection…"
          maxLength={80}
        />
      </div>
      <div className="collection-filter-field">
        <label htmlFor="collection-country">Country</label>
        <select id="collection-country" value={values.country} onChange={event => update('country', event.target.value)}>
          <option value="">All countries</option>
          {options.countries.map(country => <option key={country} value={country}>{country}</option>)}
        </select>
      </div>
      <div className="collection-filter-field">
        <label htmlFor="collection-year">Year</label>
        <select id="collection-year" value={values.year} onChange={event => update('year', event.target.value)}>
          <option value="">All years</option>
          {options.years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>
      <div className="collection-filter-field">
        <label htmlFor="collection-currency">Currency</label>
        <select id="collection-currency" value={values.currency} onChange={event => update('currency', event.target.value)}>
          <option value="">All currencies</option>
          <option value="CAD">CAD ($)</option>
          <option value="INR">Rupee (₹)</option>
        </select>
      </div>
      {hasFilters && (
        <button type="button" className="collection-filter-clear" onClick={() => onChange(emptyCollectionFilters)}>
          Clear filters
        </button>
      )}
    </div>
  )
}
