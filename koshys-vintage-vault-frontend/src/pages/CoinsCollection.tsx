import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCustomItems, type CollectionItem } from '../data/collectionStore'
import './CoinsCollection.css'

function CoinsCollection() {
  const [coins, setCoins] = useState<CollectionItem[]>([])
  useEffect(() => {
    getCustomItems('coins')
      .then(setCoins)
      .catch(error => console.error('Unable to load coins:', error))
  }, [])
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
        </div>
      </section>

      {/* Coins Grid */}
      <section className="coins-grid-section">
        <div className="container">
          <div className="coins-grid">
            {coins.length === 0 && <p className="collection-empty-state">No coins have been added yet.</p>}
            {coins.map((coin) => (
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
                  <h3 className="coin-name">{coin.name}</h3>
                  <div className="coin-meta">
                    <span className="coin-year">{coin.year}</span>
                    <span className="coin-divider">•</span>
                    <span className="coin-country">{coin.country}</span>
                  </div>
                  <p className="coin-description">{coin.description}</p>
                  <div className="coin-footer">
                    <span className="coin-price">{coin.price}</span>
                    <span className="btn btn-primary btn-sm">View details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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
