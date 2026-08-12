import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface NavbarProps {
  currentPage?: string
}

function Navbar({ currentPage }: NavbarProps) {
  const navigate = useNavigate()
  const logoClickTimer = useRef<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => () => {
    if (logoClickTimer.current !== null) {
      window.clearTimeout(logoClickTimer.current)
    }
  }, [])

  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()

    if (logoClickTimer.current !== null) {
      window.clearTimeout(logoClickTimer.current)
      logoClickTimer.current = null
      navigate('/admin')
      setMenuOpen(false)
      return
    }

    logoClickTimer.current = window.setTimeout(() => {
      logoClickTimer.current = null
      navigate('/')
      setMenuOpen(false)
    }, 300)
  }

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="container navbar-content">
        <Link to="/" className="logo-container" onClick={handleLogoClick}>
          <span className="logo-frame">
            <img src="/navbar-brand.png" alt="Koshy's Vintage Vault" className="logo" />
          </span>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-nav-links"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen(open => !open)}
        >
          <span></span><span></span><span></span>
        </button>
        <ul id="primary-nav-links" className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><Link onClick={() => setMenuOpen(false)} to="/" className={currentPage === 'home' ? 'active' : ''} aria-current={currentPage === 'home' ? 'page' : undefined}>Home</Link></li>
          <li><Link onClick={() => setMenuOpen(false)} to="/stamps" className={currentPage === 'stamps' ? 'active' : ''} aria-current={currentPage === 'stamps' ? 'page' : undefined}>Stamps</Link></li>
          <li><Link onClick={() => setMenuOpen(false)} to="/coins" className={currentPage === 'coins' ? 'active' : ''} aria-current={currentPage === 'coins' ? 'page' : undefined}>Coins</Link></li>
          <li><Link onClick={() => setMenuOpen(false)} to="/postal-covers" className={currentPage === 'covers' ? 'active' : ''} aria-current={currentPage === 'covers' ? 'page' : undefined}>Postal Covers</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
