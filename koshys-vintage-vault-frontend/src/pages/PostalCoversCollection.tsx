import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCustomItems, type CollectionItem } from '../data/collectionStore'
import './StampsCollection.css'

export default function PostalCoversCollection() {
  const [covers, setCovers] = useState<CollectionItem[]>([])
  useEffect(() => {
    getCustomItems('covers')
      .then(setCovers)
      .catch(error => console.error('Unable to load postal covers:', error))
  }, [])

  return (
    <div className="stamps-page">
      <Navbar currentPage="covers" />

      <section className="page-header">
        <div className="container">
          <h1 className="page-title">Postal Covers Collection</h1>
          <p className="page-subtitle">
            Explore historic envelopes, postmarks, routes, and first-day covers that document postal history
          </p>
        </div>
      </section>

      <section className="stamps-grid-section">
        <div className="container">
          <div className="stamps-grid">
            {covers.length === 0 && <p className="collection-empty-state">No postal covers have been added yet.</p>}
            {covers.map(cover => (
              <Link
                key={`${cover.id}-${cover.image}`}
                to={`/collection/covers/${cover.id}`}
                className="stamp-card detail-card-link"
                aria-label={`View details for ${cover.name}`}
              >
                <div className="stamp-image-container">
                  <img src={cover.image} alt={cover.name} className="stamp-image" />
                  <div className="stamp-rarity-badge">{cover.rarity}</div>
                </div>
                <div className="stamp-details">
                  <h2 className="stamp-name">{cover.name}</h2>
                  <div className="stamp-meta">
                    <span>{cover.year}</span>
                    <span className="stamp-divider">•</span>
                    <span>{cover.country}</span>
                  </div>
                  <p className="stamp-description">{cover.description}</p>
                  <div className="stamp-footer">
                    <span className="stamp-price">{cover.price}</span>
                    <span className="btn btn-primary btn-sm">View details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Koshy's Vintage Vault</h3>
              <p>Your trusted source for rare stamps, coins, and postal history.</p>
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
