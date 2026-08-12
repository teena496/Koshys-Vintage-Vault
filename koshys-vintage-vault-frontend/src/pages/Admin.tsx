import { useEffect, useRef, useState } from 'react'
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
  currency: 'CAD' | 'INR'
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
    currency: 'CAD',
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
  const [adminMenuOpen, setAdminMenuOpen] = useState(false)
  const formContainerRef = useRef<HTMLDivElement>(null)
  const adminMenuRef = useRef<HTMLElement>(null)
  const adminMenuToggleRef = useRef<HTMLButtonElement>(null)
  const itemLabel = activeTab === 'stamps' ? 'Stamp' : activeTab === 'coins' ? 'Coin' : 'Postal Cover'
  const nameCharacterLimit = 40

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

  useEffect(() => {
    if (!showForm) return
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowForm(false)
        setEditingItem(null)
      }
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeOnEscape)
    window.setTimeout(() => formContainerRef.current?.focus(), 0)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [showForm])

  useEffect(() => {
    if (!adminMenuOpen) return
    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node
      if (!adminMenuRef.current?.contains(target) && !adminMenuToggleRef.current?.contains(target)) {
        setAdminMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [adminMenuOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setSubmitStatus('error')
        setStatusMessage('Please choose a JPG, PNG, or WebP image.')
        e.target.value = ''
        return
      }
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

    const trimmedName = formData.name.trim()
    const trimmedYear = formData.year.trim()
    const trimmedCountry = formData.country.trim()
    const trimmedPrice = formData.price.trim().replace(/^[$₹]\s*/, '')
    const trimmedDescription = formData.description.trim()

    if (!trimmedName || !trimmedYear || !trimmedCountry || !formData.rarity || !trimmedPrice || !trimmedDescription) {
      setSubmitStatus('error')
      setStatusMessage('Please complete every required field.')
      return
    }

    if (!/^\d{1,4}$/.test(trimmedYear)) {
      setSubmitStatus('error')
      setStatusMessage('Year must be a number containing up to 4 digits.')
      return
    }

    if (!/^\d+(\.\d{1,2})?$/.test(trimmedPrice) || Number(trimmedPrice) <= 0) {
      setSubmitStatus('error')
      setStatusMessage('Price must be a positive number with up to 2 decimal places.')
      return
    }

    if (trimmedDescription.length < 10) {
      setSubmitStatus('error')
      setStatusMessage('Description must contain at least 10 characters.')
      return
    }

    if (!imagePreview || (!editingItem && !formData.image)) {
      setSubmitStatus('error')
      setStatusMessage('Please add an image before saving.')
      return
    }

    try {
      const values = {
        name: trimmedName,
        year: trimmedYear,
        country: trimmedCountry,
        rarity: formData.rarity,
        price: `${formData.currency === 'CAD' ? 'CAD $' : '₹'}${trimmedPrice}`,
        description: trimmedDescription
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
      setStatusMessage(error instanceof Error ? error.message : 'Unable to save this item. Please try again.')
    }
  }

  const rarityOptions = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Extremely Rare', 'Unique']

  const resetForm = () => {
    setFormData({ name: '', year: '', country: '', rarity: '', price: '', currency: 'CAD', description: '', image: null })
    setImagePreview('')
    setFileInputKey(key => key + 1)
    setEditingItem(null)
  }

  const handleTabChange = (type: CollectionType) => {
    resetForm()
    setShowForm(false)
    setAdminMenuOpen(false)
    setSubmitStatus('idle')
    setActiveTab(type)
  }

  const handleEdit = (item: CollectionItem) => {
    const isRupeePrice = item.price.trim().startsWith('₹') || item.price.trim().startsWith('INR')
    const numericPrice = item.price.replace(/,/g, '').match(/\d+(?:\.\d+)?/)?.[0] ?? ''
    setEditingItem(item)
    setFormData({
      name: item.name,
      year: item.year,
      country: item.country,
      rarity: item.rarity,
      price: numericPrice,
      currency: isRupeePrice ? 'INR' : 'CAD',
      description: item.description,
      image: null
    })
    setImagePreview(item.image)
    setFileInputKey(key => key + 1)
    setSubmitStatus('idle')
    setShowForm(true)
  }

  const handleAdd = () => {
    resetForm()
    setShowForm(true)
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
          <button
            type="button"
            className="admin-brand-home"
            onDoubleClick={() => navigate('/')}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                navigate('/')
              }
            }}
            aria-label="Return to main website (double-click)"
            title="Double-click to return to the main website"
          >
            <img src="/admin-navbar-brand.png" alt="Koshy's Vintage Vault Admin" className="admin-brand-mark" />
          </button>
          <button
            type="button"
            className="admin-menu-toggle"
            ref={adminMenuToggleRef}
            aria-label="Toggle collection navigation"
            aria-expanded={adminMenuOpen}
            aria-controls="admin-collection-navigation"
            onClick={() => setAdminMenuOpen(open => !open)}
          >
            <span></span><span></span><span></span>
          </button>
          <nav
            id="admin-collection-navigation"
            ref={adminMenuRef}
            className={`tab-navigation${adminMenuOpen ? ' open' : ''}`}
            aria-label="Collection management"
          >
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
          </nav>
          <button className="admin-sign-out" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </section>

      {/* Admin Content */}
      <section className="admin-content">
        <div className="container">
          {/* Form */}
          {showForm && <div className="admin-modal-backdrop" onMouseDown={event => {
            if (event.target === event.currentTarget) handleCancel()
          }}>
          <div
            className="admin-form-container"
            ref={formContainerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-form-title"
            tabIndex={-1}
          >
            <div className="admin-form-header">
              <div>
                <p className="admin-list-eyebrow">Inventory editor</p>
                <h2 id="admin-form-title">{editingItem ? `Edit ${itemLabel}` : `Add ${itemLabel}`}</h2>
              </div>
              <button type="button" className="admin-modal-close" onClick={handleCancel} aria-label="Close form">×</button>
            </div>
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
                      maxLength={nameCharacterLimit}
                      aria-describedby="name-count"
                      required
                    />
                    <span id="name-count" className="character-count" aria-live="polite">
                      {formData.name.length}/{nameCharacterLimit} characters
                    </span>
                  </div>

                  <div className="form-group">
                    <label htmlFor="year">Year *</label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      placeholder="e.g., 1840"
                      min="0"
                      max="9999"
                      step="1"
                      inputMode="numeric"
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
                      maxLength={60}
                      aria-describedby="country-count"
                      required
                    />
                    <span id="country-count" className="character-count" aria-live="polite">
                      {formData.country.length}/60 characters
                    </span>
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
                    <div className="price-field-row">
                      <select
                        id="currency"
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        aria-label="Currency"
                      >
                        <option value="CAD">CAD ($)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder={formData.currency === 'CAD' ? '3000' : '200000'}
                        min="0.01"
                        step="0.01"
                        inputMode="decimal"
                        required
                      />
                    </div>
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
                      minLength={10}
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
                      accept="image/jpeg,image/png,image/webp"
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
          </div>
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
                <span className="add-item-label-full">Add {itemLabel}</span>
                <span className="add-item-label-mobile">+ Add</span>
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

    </div>
  )
}

export default Admin
