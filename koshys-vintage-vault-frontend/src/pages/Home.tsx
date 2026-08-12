import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Home.css'

function Home() {
  return (
    <div className="app">
      {/* Navigation */}
      <Navbar currentPage="home" />

      {/* Hero Section */}
      <section id="home" className="hero landing-hero" aria-labelledby="landing-title">
        <img src="/landing-hero-collection.png" alt="Antique coin, postage stamp, postal cover, and brass magnifying glass" className="hero-background" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-copy">
            <p className="hero-eyebrow">Coins · Stamps · Postal History</p>
            <h1 id="landing-title" className="hero-title">Collect history.<br />Preserve its story.</h1>
            <p className="hero-subtitle">A considered collection of timeless pieces from around the world.</p>
            <p className="hero-description">
              Explore coins, stamps, and postal covers selected for collectors who value history,
              craftsmanship, and the stories behind every object.
            </p>
            <div className="hero-cta">
              <a href="#collections" className="btn btn-primary">Explore the vault</a>
              <a href="#about" className="btn btn-secondary">Our story</a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section id="collections" className="collections">
        <div className="container">
          <div className="section-header">
            <p className="section-kicker">Inside the vault</p>
            <h2 className="section-title">Featured Collections</h2>
            <p className="section-subtitle">Browse each collection and discover the history held within.</p>
          </div>
          
          <div className="collections-grid">
            {/* Stamps Collection */}
            <Link to="/stamps" className="collection-card">
              <img src="/stamps-hero.png" alt="Rare Stamps Collection" className="collection-image" />
              <div className="collection-overlay">
                <h3 className="collection-title">Rare Stamps</h3>
                <p className="collection-description">
                  Philatelic pieces spanning eras, countries, and the evolution of postal communication.
                </p>
              </div>
            </Link>

            {/* Coins Collection */}
            <Link to="/coins" className="collection-card">
              <img src="/coins-collection.png" alt="Antique Coins Collection" className="collection-image" />
              <div className="collection-overlay">
                <h3 className="collection-title">Antique Coins</h3>
                <p className="collection-description">
                  Numismatic pieces that reflect the people, places, and craftsmanship of their time.
                </p>
              </div>
            </Link>

            <Link to="/postal-covers" className="collection-card">
              <img src="/postal-covers-collection.png" alt="Historic postal cover with stamps, postmarks, and wax seal" className="collection-image" />
              <div className="collection-overlay">
                <h3 className="collection-title">Postal Covers</h3>
                <p className="collection-description">
                  Historic envelopes, first-day covers, and postmarked postal history preserving the routes and stories of their time.
                </p>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <p className="section-kicker section-kicker-light">Our perspective</p>
              <h2>A Legacy of Excellence</h2>
              <p>
                Koshy's Vintage Vault brings stamps, coins, and postal history together for collectors
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
                <li><a href="#about">About Us</a></li>
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

export default Home
