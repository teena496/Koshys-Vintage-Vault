import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Home.css'

function Home() {
  return (
    <div className="app">
      {/* Navigation */}
      <Navbar currentPage="home" />

      {/* Hero Section */}
      <section id="home" className="hero">
        <img src="/stamps-hero.png" alt="Vintage Stamps Collection" className="hero-background" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <img src="/brand-logo.png" alt="Koshy's Heritage Vault — coins, stamps, stories through time" className="hero-logo" />
          <h1 className="hero-title">Koshy's Heritage Vault</h1>
          <p className="hero-subtitle">Timeless Treasures from Bygone Eras</p>
          <p className="hero-description">
            Discover our curated collection of rare stamps and coins, each piece telling a unique story 
            from history. We specialize in premium collectibles that connect you to the past.
          </p>
          <div className="hero-cta">
            <Link to="/stamps" className="btn btn-primary">Explore Collections</Link>
            <a href="#contact" className="btn btn-secondary">Contact Us</a>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section id="collections" className="collections">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Collections</h2>
            <p className="section-subtitle">Explore our finest stamps and coins from around the world</p>
          </div>
          
          <div className="collections-grid">
            {/* Stamps Collection */}
            <Link to="/stamps" className="collection-card">
              <img src="/stamps-hero.png" alt="Rare Stamps Collection" className="collection-image" />
              <div className="collection-overlay">
                <h3 className="collection-title">Rare Stamps</h3>
                <p className="collection-description">
                  Exquisite philatelic treasures from different eras and countries. Each stamp is carefully 
                  authenticated and preserved to museum-quality standards.
                </p>
              </div>
            </Link>

            {/* Coins Collection */}
            <Link to="/coins" className="collection-card">
              <img src="/coins-collection.png" alt="Antique Coins Collection" className="collection-image" />
              <div className="collection-overlay">
                <h3 className="collection-title">Antique Coins</h3>
                <p className="collection-description">
                  Historic numismatic pieces including gold and silver coins from ancient civilizations 
                  to modern rarities. Investment-grade collectibles.
                </p>
              </div>
            </Link>

            {/* Expert Authentication */}
            <Link to="/postal-covers" className="collection-card">
              <img src="/stamp-inverted-jenny.png" alt="Historic postal covers" className="collection-image" />
              <div className="collection-overlay">
                <h3 className="collection-title">Postal Covers</h3>
                <p className="collection-description">
                  Historic envelopes, first-day covers, and postmarked postal history preserving the routes and stories of their time.
                </p>
              </div>
            </Link>

            {/* Expert Authentication */}
            <div className="collection-card">
              <img src="/examining.png" alt="Expert Authentication" className="collection-image" />
              <div className="collection-overlay">
                <h3 className="collection-title">Expert Authentication</h3>
                <p className="collection-description">
                  Every piece in our collection is meticulously examined and authenticated by our team 
                  of experts to ensure authenticity and quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>A Legacy of Excellence</h2>
              <p>
                Koshy's Heritage Vault brings stamps, coins, and postal history together for collectors
                who value the stories carried by every piece.
              </p>
              <p>
                Each item in our collection is carefully selected, authenticated, and documented. We pride 
                ourselves on our expertise, integrity, and commitment to helping collectors build 
                meaningful collections that stand the test of time.
              </p>
              <p>
                Whether you're a seasoned collector or just beginning your journey into the world of 
                philately and numismatics, we're here to guide you with our knowledge and passion for 
                these timeless treasures.
              </p>
            </div>
            <div>
              <img src="/examining.png" alt="Examining Collectibles" className="about-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
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
                <li><a href="#about">About Us</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Connect</h3>
              <p><a href="https://www.facebook.com/share/1BNwJgWkdu/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Follow us on Facebook</a></p>
            </div>
            
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Koshy's Heritage Vault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
