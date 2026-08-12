import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CollectionFilters from '../components/CollectionFilters'
import CollectionPagination from '../components/CollectionPagination'
import { useCollectionBrowser } from '../hooks/useCollectionBrowser'
import './StampsCollection.css'

function StampsCollection() {
  const { items: stamps, filters, setFilters, options, page, setPage, total, totalPages, loading } = useCollectionBrowser('stamps')
  return (
    <div className="stamps-page">
      {/* Navigation */}
      <Navbar currentPage="stamps" />

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Rare Stamps Collection</h1>
          <p className="page-subtitle">
            Discover our curated selection of the world's most sought-after philatelic treasures
          </p>
        </div>
      </section>

      {/* Stamps Grid */}
      <section className="stamps-grid-section">
        <div className="container">
          <CollectionFilters options={options} values={filters} onChange={setFilters} />
          <div className="stamps-grid">
            {loading && <p className="collection-empty-state" role="status">Loading stamps…</p>}
            {!loading && total === 0 && <p className="collection-empty-state">No stamps match the selected filters.</p>}
            {!loading && stamps.map((stamp) => (
              <Link
                key={`${stamp.id}-${stamp.image}`}
                to={`/collection/stamps/${stamp.id}`}
                className="stamp-card detail-card-link"
                aria-label={`View details for ${stamp.name}`}
              >
                <div className="stamp-image-container">
                  <img src={stamp.image} alt={stamp.name} className="stamp-image" />
                  <div className="stamp-rarity-badge">{stamp.rarity}</div>
                </div>
                <div className="stamp-details">
                  <div className="stamp-title-row">
                    <h3 className="stamp-name">{stamp.name}</h3>
                    <span className="stamp-price">{stamp.price}</span>
                  </div>
                  <div className="stamp-meta">
                    <span className="stamp-year">{stamp.year}</span>
                    <span className="stamp-divider">•</span>
                    <span className="stamp-country">{stamp.country}</span>
                  </div>
                  <p className="stamp-description">{stamp.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <CollectionPagination page={page} totalPages={totalPages} total={total} onChange={setPage} />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Koshy's Vintage Vault</h3>
              <p>
                Your trusted source for rare stamps and coins. Preserving history, one collectible at a time.
              </p>
            </div>
            
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/stamps">Stamps</Link></li>
                <li><Link to="/coins">Coins</Link></li>
                <li><Link to="/postal-covers">Postal Covers</Link></li>
                <li><a href="/#about">About Us</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Connect</h3>
              <p><a href="https://www.facebook.com/share/1BNwJgWkdu/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Follow us on Facebook</a></p>
            </div>
            
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Koshy's Vintage Vault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default StampsCollection
