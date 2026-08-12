import { useEffect, useState, type MouseEvent } from 'react'
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
  const [zoomActive, setZoomActive] = useState(false)
  const [magnifier, setMagnifier] = useState({ visible: false, x: 0, y: 0, imageX: 50, imageY: 50 })

  useEffect(() => {
    if (invalidRoute) return

    getCollectionItem(numericId)
      .then(setItem)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [invalidRoute, numericId])

  const currentPage = routeType?.storageType ?? 'home'
  const backPath = routeType?.backPath ?? '/'

  const positionMagnifier = (event: MouseEvent<HTMLButtonElement>) => {
    const image = event.currentTarget.querySelector('img')
    const panelBounds = event.currentTarget.parentElement?.getBoundingClientRect()
    if (!image || !panelBounds) return
    const imageBounds = image.getBoundingClientRect()
    const lensRadius = 133
    const pointerX = event.clientX - panelBounds.left
    const pointerY = event.clientY - panelBounds.top
    const clampLensPosition = (position: number, panelSize: number) =>
      panelSize <= lensRadius * 2
        ? panelSize / 2
        : Math.min(Math.max(position, lensRadius), panelSize - lensRadius)

    setMagnifier({
      visible: true,
      x: clampLensPosition(pointerX, panelBounds.width),
      y: clampLensPosition(pointerY, panelBounds.height),
      imageX: Math.min(100, Math.max(0, ((event.clientX - imageBounds.left) / imageBounds.width) * 100)),
      imageY: Math.min(100, Math.max(0, ((event.clientY - imageBounds.top) / imageBounds.height) * 100))
    })
  }

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
                  <button
                    type="button"
                    className={`detail-image-button${zoomActive ? ' zoom-active' : ''}`}
                    aria-label={`${zoomActive ? 'Disable' : 'Enable'} image magnifier for ${item.name}`}
                    aria-pressed={zoomActive}
                    onClick={event => {
                      if (zoomActive) {
                        setZoomActive(false)
                        setMagnifier(current => ({ ...current, visible: false }))
                      } else {
                        setZoomActive(true)
                        positionMagnifier(event)
                      }
                    }}
                    onMouseEnter={event => { if (zoomActive) positionMagnifier(event) }}
                    onMouseMove={event => { if (zoomActive) positionMagnifier(event) }}
                    onMouseLeave={() => setMagnifier(current => ({ ...current, visible: false }))}
                  >
                    <img src={item.image} alt={item.name} className="detail-image" />
                  </button>
                  <div
                    className={`detail-magnifier${magnifier.visible ? ' is-visible' : ''}`}
                    aria-hidden="true"
                    style={{
                      left: magnifier.x,
                      top: magnifier.y,
                      backgroundImage: `url(${item.image})`,
                      backgroundPosition: `${magnifier.imageX}% ${magnifier.imageY}%`
                    }}
                  />
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
