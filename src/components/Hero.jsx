export default function Hero({ movie, onInfo, onPlay }) {
  return (
    <section className="hero" id="hero-section">
      <div className="hero-bg" style={{ backgroundImage: `url('${movie.backdrop}')` }} />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-badge">
          🔥 &nbsp;{movie.media_type === 'tv' ? 'SERIE TENDENCIA' : 'TENDENCIA #1 EN VANFLIX'}
        </div>
        <h1 className="hero-title">
          {movie.title}
        </h1>
        <div className="hero-meta">
          <span className="rating">⭐ {movie.rating}</span>
          {movie.year && <><span className="dot">•</span><span>{movie.year}</span></>}
          {movie.media_type === 'tv' && (
            <><span className="dot">•</span>
            <span style={{ background: 'rgba(229,9,20,0.15)', border: '1px solid rgba(229,9,20,0.4)', color: '#E50914', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
              📺 Serie
            </span></>
          )}
        </div>
        <p className="hero-description">
          {movie.overview
            ? movie.overview.slice(0, 180) + (movie.overview.length > 180 ? '...' : '')
            : 'Contenido exclusivo en Vanflix.'}
        </p>
        <div className="hero-actions">
          <button
            id="hero-play-btn"
            className="btn-play"
            onClick={() => onPlay(movie)}
          >
            ▶ Ver ahora
          </button>
          <button
            id="hero-info-btn"
            className="btn-info"
            onClick={() => onInfo(movie)}
          >
            ℹ️ Más info
          </button>
        </div>
      </div>
    </section>
  );
}
