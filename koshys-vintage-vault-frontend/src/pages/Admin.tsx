import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { addCustomItem, deleteCustomItem, getCustomItems, updateCustomItem, type CollectionItem, type CollectionType } from '../data/collectionStore'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Admin.css'

interface FormData {
  name: string
  year: string
  country: string
  rarity: string
  price: string
  description: string
  image: File | null
}

function Admin() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<CollectionType>('stamps')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    year: '',
    country: '',
    rarity: '',
    price: '',
    description: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [fileInputKey, setFileInputKey] = useState(0)
  const [savedItems, setSavedItems] = useState<CollectionItem[]>([])
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null)
  const [showForm, setShowForm] = useState(false)
  const formContainerRef = useRef<HTMLDivElement>(null)
  const itemLabel = activeTab === 'stamps' ? 'Stamp' : activeTab === 'coins' ? 'Coin' : 'Postal Cover'

  useEffect(() => {
    let active = true
    getCustomItems(activeTab)
      .then(items => { if (active) setSavedItems(items) })
      .catch(() => {
        if (active) {
          setSubmitStatus('error')
          setStatusMessage('Unable to load saved items. Confirm that the Supabase migrations are deployed.')
        }
      })
    return () => { active = false }
  }, [activeTab])

  useEffect(() => {
    if (submitStatus === 'idle') return
    const timeout = window.setTimeout(() => setSubmitStatus('idle'), 5000)
    return () => window.clearTimeout(timeout)
  }, [submitStatus, statusMessage])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setSubmitStatus('error')
        setStatusMessage('Please choose an image smaller than 2 MB.')
        e.target.value = ''
        return
      }
      setFormData(prev => ({ ...prev, image: file }))
      setSubmitStatus('idle')
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imagePreview || (!editingItem && !formData.image)) {
      setSubmitStatus('error')
      setStatusMessage('Please add an image before saving.')
      return
    }

    try {
      const values = {
        name: formData.name.trim(),
        year: formData.year.trim(),
        country: formData.country.trim(),
        rarity: formData.rarity,
        price: formData.price.trim(),
        description: formData.description.trim()
      }

      if (editingItem) {
        const updatedItem = await updateCustomItem(activeTab, editingItem, values, formData.image)
        setSavedItems(items => items.map(item => item.id === updatedItem.id ? updatedItem : item))
        setStatusMessage(`${itemLabel} updated successfully.`)
      } else {
        const savedItem = await addCustomItem(activeTab, values, formData.image as File)
        setSavedItems(items => [savedItem, ...items])
        setStatusMessage(`${itemLabel} saved and added to the collection.`)
      }

      resetForm()
      setShowForm(false)
      setSubmitStatus('success')
    } catch (error) {
      console.error(error)
      setSubmitStatus('error')
      setStatusMessage('Unable to save this item. Confirm the database and Storage migrations are deployed, then try again.')
    }
  }

  const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Extremely Rare', 'Unique']

  const resetForm = () => {
    setFormData({ name: '', year: '', country: '', rarity: '', price: '', description: '', image: null })
    setImagePreview('')
    setFileInputKey(key => key + 1)
    setEditingItem(null)
  }

  const handleTabChange = (type: CollectionType) => {
    resetForm()
    setShowForm(false)
    setSubmitStatus('idle')
    setActiveTab(type)
  }

  const handleEdit = (item: CollectionItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      year: item.year,
      country: item.country,
      rarity: item.rarity,
      price: item.price,
      description: item.description,
      image: null
    })
    setImagePreview(item.image)
    setFileInputKey(key => key + 1)
    setSubmitStatus('idle')
    setShowForm(true)
    window.setTimeout(() => formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const handleAdd = () => {
    resetForm()
    setShowForm(true)
    window.setTimeout(() => formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const handleCancel = () => {
    resetForm()
    setShowForm(false)
  }

  const handleDelete = async (item: CollectionItem) => {
    const confirmed = window.confirm(`Delete “${item.name}”? This action cannot be undone.`)
    if (!confirmed) return

    try {
      await deleteCustomItem(item)
      setSavedItems(items => items.filter(savedItem => savedItem.id !== item.id))
      setSubmitStatus('success')
      setStatusMessage(`${item.name} was deleted from the collection.`)
    } catch (error) {
      console.error(error)
      setSubmitStatus('error')
      setStatusMessage(`Unable to delete ${item.name}. Please try again.`)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/sign-in', { replace: true })
  }

  return (
    <div className="admin-page">
      {/* Navigation */}
      <Navbar currentPage="admin" />

      {submitStatus !== 'idle' && (
        <div
          className={`toast toast-${submitStatus}`}
          role={submitStatus === 'error' ? 'alert' : 'status'}
          aria-live={submitStatus === 'error' ? 'assertive' : 'polite'}
        >
          <span className="toast-icon" aria-hidden="true">
            {submitStatus === 'success' ? '✓' : '!'}
          </span>
          <p>{statusMessage}</p>
          <button
            type="button"
            className="toast-close"
            onClick={() => setSubmitStatus('idle')}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      {/* Admin Header */}
      <section className="admin-header">
        <div className="container">
          <button className="admin-sign-out" type="button" onClick={handleSignOut}>
            Sign out
          </button>
          <h1 className="admin-title">Admin Panel</h1>
          <p className="admin-subtitle">Manage stamps, coins, and postal covers</p>
        </div>
      </section>

      {/* Admin Content */}
      <section className="admin-content">
        <div className="container">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'stamps' ? 'active' : ''}`}
              onClick={() => handleTabChange('stamps')}
              aria-pressed={activeTab === 'stamps'}
            >
              Stamps
            </button>
            <button
              className={`tab-button ${activeTab === 'coins' ? 'active' : ''}`}
              onClick={() => handleTabChange('coins')}
              aria-pressed={activeTab === 'coins'}
            >
              Coins
            </button>
            <button
              className={`tab-button ${activeTab === 'covers' ? 'active' : ''}`}
              onClick={() => handleTabChange('covers')}
              aria-pressed={activeTab === 'covers'}
            >
              Postal Covers
            </button>
          </div>

          {/* Form */}
          {showForm && <div className="admin-form-container" ref={formContainerRef}>
            {editingItem && (
              <div className="editing-notice" role="status">
                Editing <strong>{editingItem.name}</strong>. Update the fields below or cancel editing.
              </div>
            )}
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-grid">
                {/* Left Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="name">
                      {itemLabel} Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={`e.g., ${activeTab === 'stamps' ? 'Penny Black' : activeTab === 'coins' ? '1933 Double Eagle' : 'First Flight Cover'}`}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="year">Year *</label>
                    <input
                      type="text"
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="e.g., 1840"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="e.g., United States"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="rarity">Rarity *</label>
                    <select
                      id="rarity"
                      name="rarity"
                      value={formData.rarity}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select rarity...</option>
                      {rarityOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">Price *</label>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., $3,000 - $5,000"
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter a detailed description..."
                      rows={6}
                      maxLength={200}
                      aria-describedby="description-count"
                      required
                    />
                    <span id="description-count" className="character-count" aria-live="polite">
                      {formData.description.length}/200 characters
                    </span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="image">Image {editingItem ? '(optional replacement)' : '*'}</label>
                    <input
                      key={fileInputKey}
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      required={!editingItem}
                    />
                    {imagePreview && (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-large">
                  {editingItem ? `Update ${itemLabel}` : `Add ${itemLabel}`}
                </button>
                {editingItem && (
                  <button type="button" className="btn cancel-edit-button" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
                {!editingItem && (
                  <button type="button" className="btn cancel-edit-button" onClick={handleCancel}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>}

          <section className="admin-list-section" aria-labelledby="saved-items-title">
            <div className="admin-list-heading">
              <div>
                <p className="admin-list-eyebrow">Saved inventory</p>
                <h2 id="saved-items-title">
                  {itemLabel} details
                </h2>
              </div>
              <span className="item-count" aria-label={`${savedItems.length} saved items`}>
                {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'}
              </span>
              <button type="button" className="btn btn-primary add-item-button" onClick={handleAdd}>
                Add {itemLabel}
              </button>
            </div>

            {savedItems.length === 0 ? (
              <p className="empty-list-message">
                No {activeTab === 'covers' ? 'postal covers' : activeTab} have been added yet. Complete the form above to create the first entry.
              </p>
            ) : (
              <div className="admin-items-list">
                {savedItems.map(item => (
                  <article className="admin-list-item" key={item.id}>
                    <img src={item.image} alt="" className="admin-list-image" />
                    <div className="admin-list-content">
                      <div className="admin-list-title-row">
                        <h3>{item.name}</h3>
                        <div className="admin-list-actions">
                          <span className="admin-rarity">{item.rarity}</span>
                          <button
                            type="button"
                            className="edit-item-button"
                            onClick={() => handleEdit(item)}
                            aria-label={`Edit ${item.name}`}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="delete-item-button"
                            onClick={() => handleDelete(item)}
                            aria-label={`Delete ${item.name}`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <dl className="admin-item-facts">
                        <div><dt>Year</dt><dd>{item.year}</dd></div>
                        <div><dt>Country</dt><dd>{item.country}</dd></div>
                        <div><dt>Price</dt><dd>{item.price}</dd></div>
                      </dl>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
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

export default Admin
