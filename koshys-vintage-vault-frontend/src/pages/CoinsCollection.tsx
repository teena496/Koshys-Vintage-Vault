import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CollectionFilters from '../components/CollectionFilters'
import CollectionPagination from '../components/CollectionPagination'
import { useCollectionBrowser } from '../hooks/useCollectionBrowser'
import './CoinsCollection.css'

function CoinsCollection() {
  const { items: coins, filters, setFilters, options, page, setPage, total, totalPages, loading } = useCollectionBrowser('coins')
  return (
    <div className="coins-page">
      {/* Navigation */}
      <Navbar currentPage="coins" />

      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Rare Coins Collection</h1>
          <p className="page-subtitle">
            Discover our curated selection of the world's most sought-after numismatic treasures
          </p>
          <CollectionFilters options={options} values={filters} onChange={setFilters} />
        </div>
      </section>

      {/* Coins Grid */}
      <section className="coins-grid-section">
        <div className="container">
          <div className="coins-grid">
            {loading && <p className="collection-empty-state" role="status">Loading coins…</p>}
            {!loading && total === 0 && <p className="collection-empty-state">No coins match the selected filters.</p>}
            {!loading && coins.map((coin) => (
              <Link
                key={`${coin.id}-${coin.image}`}
                to={`/collection/coins/${coin.id}`}
                className="coin-card detail-card-link"
                aria-label={`View details for ${coin.name}`}
              >
                <div className="coin-image-container">
                  <img src={coin.image} alt={coin.name} className="coin-image" />
                  <div className="coin-rarity-badge">{coin.rarity}</div>
                </div>
                <div className="coin-details">
                  <div className="coin-title-row">
                    <h3 className="coin-name">{coin.name}</h3>
                    <span className="coin-price">{coin.price}</span>
                  </div>
                  <div className="coin-meta">
                    <span className="coin-year">{coin.year}</span>
                    <span className="coin-divider">•</span>
                    <span className="coin-country">{coin.country}</span>
                  </div>
                  <p className="coin-description">{coin.description}</p>
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

export default CoinsCollection
