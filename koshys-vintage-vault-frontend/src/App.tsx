import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import StampsCollection from './pages/StampsCollection'
import CoinsCollection from './pages/CoinsCollection'
import PostalCoversCollection from './pages/PostalCoversCollection'
import CollectionDetail from './pages/CollectionDetail'
import Admin from './pages/Admin'
import ScrollToTop from './components/ScrollToTop'
import SignIn from './pages/SignIn'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stamps" element={<StampsCollection />} />
          <Route path="/coins" element={<CoinsCollection />} />
          <Route path="/postal-covers" element={<PostalCoversCollection />} />
          <Route path="/collection/:type/:id" element={<CollectionDetail />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
