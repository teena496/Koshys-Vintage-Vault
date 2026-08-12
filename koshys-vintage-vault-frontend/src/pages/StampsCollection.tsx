import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCustomItems, type CollectionItem } from '../data/collectionStore'
import './StampsCollection.css'

const stampsData: CollectionItem[] = [
  {
    id: 1,
    name: 'Penny Black',
    year: '1840',
    country: 'Great Britain',
    rarity: 'Rare',
    price: '$3,000 - $5,000',
    description: 'The world\'s first adhesive postage stamp used in a public postal system. Features Queen Victoria\'s profile. A cornerstone of any serious philatelic collection.',
    image: '/stamp-penny-black.png'
  },
  {
    id: 2,
    name: 'Inverted Jenny',
    year: '1918',
    country: 'United States',
    rarity: 'Extremely Rare',
    price: '$1,000,000+',
    description: 'One of the most famous stamp errors in history. Features an upside-down Curtiss JN-4 biplane. Only 100 sheets were printed with this error.',
    image: '/stamp-inverted-jenny.png'
  },
  {
    id: 3,
    name: 'Blue Mauritius',
    year: '1847',
    country: 'Mauritius',
    rarity: 'Extremely Rare',
    price: '$500,000+',
    description: 'One of the rarest stamps in the world. Only 12 unused copies are known to exist. Features Queen Victoria and the inscription "POST OFFICE".',
    image: '/stamp-blue-mauritius.png'
  },
  {
    id: 4,
    name: 'Basel Dove',
    year: '1845',
    country: 'Switzerland',
    rarity: 'Very Rare',
    price: '$15,000 - $25,000',
    description: 'Switzerland\'s first stamp, featuring an embossed white dove carrying a letter. Highly sought after by collectors worldwide.',
    image: '/stamps-hero.png'
  },
  {
    id: 5,
    name: 'Hawaiian Missionaries',
    year: '1851',
    country: 'Hawaii',
    rarity: 'Extremely Rare',
    price: '$50,000+',
    description: 'Early Hawaiian stamps used by missionaries. Primitive printing and paper quality make surviving examples extremely valuable.',
    image: '/stamps-hero.png'
  },
  {
    id: 6,
    name: 'Treskilling Yellow',
    year: '1855',
    country: 'Sweden',
    rarity: 'Unique',
    price: '$2,300,000+',
    description: 'The most valuable stamp in the world. A color error - should have been printed in blue-green. Only one copy exists.',
    image: '/stamps-hero.png'
  }
]

function StampsCollection() {
  const [stamps, setStamps] = useState(stampsData)
  useEffect(() => {
    getCustomItems('stamps')
      .then(items => setStamps([...items, ...stampsData]))
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
                    <button className="btn btn-primary btn-sm">Inquire</button>
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
              <h3>Koshy's Heritage Vault</h3>
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

export default StampsCollection
