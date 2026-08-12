import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCustomItems, type CollectionItem } from '../data/collectionStore'
import './StampsCollection.css'

const coversData: CollectionItem[] = [
  {
    id: -1,
    name: 'Victorian Registered Cover',
    year: '1892',
    country: 'Great Britain',
    rarity: 'Rare',
    price: 'Price on request',
    description: 'A registered Victorian-era cover with period postal markings and routing details preserved as part of its journey.',
    image: '/stamps-hero.png'
  },
  {
    id: -2,
    name: 'First Flight Cover',
    year: '1930',
    country: 'India',
    rarity: 'Very Rare',
    price: 'Price on request',
    description: 'An early airmail cover commemorating a pioneering flight, complete with historic stamps and cancellation marks.',
    image: '/stamp-inverted-jenny.png'
  },
  {
    id: -3,
    name: 'Independence Day Cover',
    year: '1947',
    country: 'India',
    rarity: 'Rare',
    price: 'Price on request',
    description: 'A postal-history cover from the year of Indian independence, documenting an important moment through its markings and postage.',
    image: '/stamp-blue-mauritius.png'
  }
]

export default function PostalCoversCollection() {
  const [covers, setCovers] = useState(coversData)
  useEffect(() => {
    getCustomItems('covers')
      .then(items => setCovers([...items, ...coversData]))
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
            {covers.map(cover => (
              <article key={`${cover.id}-${cover.image}`} className="stamp-card">
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
                    <button className="btn btn-primary btn-sm">Inquire</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Koshy's Heritage Vault</h3>
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
              <h3>Contact Us</h3>
              <p>Email: info@koshysheritagevault.com</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>Hours: Mon-Sat, 10AM-6PM</p>
              <p><a href="https://www.facebook.com/share/1BNwJgWkdu/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Follow us on Facebook</a></p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Koshy's Heritage Vault. All rights reserved. | Established 1990</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
