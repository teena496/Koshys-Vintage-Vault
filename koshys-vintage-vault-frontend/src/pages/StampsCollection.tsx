import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCustomItems, type CollectionItem } from '../data/collectionStore'
import './StampsCollection.css'

function StampsCollection() {
  const [stamps, setStamps] = useState<CollectionItem[]>([])
  useEffect(() => {
    getCustomItems('stamps')
      .then(setStamps)
      .catch(error => console.error('Unable to load stamps:', error))
  }, [])
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
          <div className="stamps-grid">
            {stamps.length === 0 && <p className="collection-empty-state">No stamps have been added yet.</p>}
            {stamps.map((stamp) => (
              <div key={`${stamp.id}-${stamp.image}`} className="stamp-card">
                <div className="stamp-image-container">
                  <img src={stamp.image} alt={stamp.name} className="stamp-image" />
                  <div className="stamp-rarity-badge">{stamp.rarity}</div>
                </div>
                <div className="stamp-details">
                  <h3 className="stamp-name">{stamp.name}</h3>
                  <div className="stamp-meta">
                    <span className="stamp-year">{stamp.year}</span>
                    <span className="stamp-divider">•</span>
                    <span className="stamp-country">{stamp.country}</span>
                  </div>
                  <p className="stamp-description">{stamp.description}</p>
                  <div className="stamp-footer">
                    <span className="stamp-price">{stamp.price}</span>
                    <Link to={`/collection/stamps/${stamp.id}`} className="btn btn-primary btn-sm detail-card-link" aria-label={`View details for ${stamp.name}`}>View details</Link>
                  </div>
                </div>
              </div>
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

export default StampsCollection
