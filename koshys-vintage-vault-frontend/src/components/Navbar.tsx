import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface NavbarProps {
  currentPage?: string
}

function Navbar({ currentPage }: NavbarProps) {
  const navigate = useNavigate()
  const logoClickTimer = useRef<number | null>(null)

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
      return
    }

    logoClickTimer.current = window.setTimeout(() => {
      logoClickTimer.current = null
      navigate('/')
    }, 300)
  }

  return (
    <nav className="navbar" aria-label="Primary navigation">
      <div className="container navbar-content">
        <Link to="/" className="logo-container" onClick={handleLogoClick}>
          <img src="/brand-logo.png" alt="Koshy's Heritage Vault" className="logo" />
          <h1 className="brand-name">Koshy's Heritage Vault</h1>
        </Link>
        <ul className="nav-links">
          <li><Link to="/" className={currentPage === 'home' ? 'active' : ''} aria-current={currentPage === 'home' ? 'page' : undefined}>Home</Link></li>
          <li><Link to="/stamps" className={currentPage === 'stamps' ? 'active' : ''} aria-current={currentPage === 'stamps' ? 'page' : undefined}>Stamps</Link></li>
          <li><Link to="/coins" className={currentPage === 'coins' ? 'active' : ''} aria-current={currentPage === 'coins' ? 'page' : undefined}>Coins</Link></li>
          <li><Link to="/postal-covers" className={currentPage === 'covers' ? 'active' : ''} aria-current={currentPage === 'covers' ? 'page' : undefined}>Postal Covers</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
