import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getCollectionItem, type CollectionItem, type CollectionType } from '../data/collectionStore'
import './CollectionDetail.css'

const routeTypes: Record<string, { storageType: CollectionType; label: string; backPath: string }> = {
  stamps: { storageType: 'stamps', label: 'Stamp', backPath: '/stamps' },
  coins: { storageType: 'coins', label: 'Coin', backPath: '/coins' },
  covers: { storageType: 'covers', label: 'Postal Cover', backPath: '/postal-covers' }
}

export default function CollectionDetail() {
  const { type = '', id = '' } = useParams()
  const routeType = routeTypes[type]
  const numericId = Number(id)
  const invalidRoute = !routeType || !Number.isSafeInteger(numericId) || numericId <= 0
  const [item, setItem] = useState<CollectionItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (invalidRoute) return

    getCollectionItem(numericId)
      .then(setItem)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [invalidRoute, numericId])

  const currentPage = routeType?.storageType ?? 'home'
  const backPath = routeType?.backPath ?? '/'

  return (
    <div className="detail-page">
      <Navbar currentPage={currentPage} />
      <main className="detail-main">
        <div className="container">
          {loading && !invalidRoute && <p className="detail-state" role="status">Loading item…</p>}
          {(notFound || invalidRoute) && (
            <section className="detail-state">
              <h1>Item not found</h1>
              <p>This collectible may have been removed or the link may be incorrect.</p>
              <Link to={backPath} className="btn btn-primary">Back to collection</Link>
            </section>
          )}
          {item && routeType && (
            <>
              <Link to={routeType.backPath} className="detail-back">← Back to {routeType.label}s</Link>
              <article className="detail-layout">
                <div className="detail-image-panel">
                  <img src={item.image} alt={item.name} className="detail-image" />
                </div>
                <div className="detail-content">
                  <p className="detail-eyebrow">{routeType.label}</p>
                  <h1>{item.name}</h1>
                  <span className="detail-rarity">{item.rarity}</span>
                  <dl className="detail-facts">
                    <div><dt>Year</dt><dd>{item.year}</dd></div>
                    <div><dt>Country</dt><dd>{item.country}</dd></div>
                    <div><dt>Price</dt><dd>{item.price}</dd></div>
                  </dl>
                  <div className="detail-description">
                    <h2>About this piece</h2>
                    <p>{item.description}</p>
                  </div>
                </div>
              </article>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
