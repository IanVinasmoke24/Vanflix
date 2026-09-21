import { useEffect } from 'react';

export default function Modal({ movie, onClose, onPlay }) {
  const isTV = movie.media_type === 'tv';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      id="movie-modal-backdrop"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label={movie.title}>
        {/* Hero */}
        <div className="modal-hero">
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            onError={e => { e.target.src = '/hero.jpg'; }}
          />
          <div className="modal-hero-overlay" />
          <button
            id="modal-close-btn"
            className="modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>

          {/* Título sobre el hero */}
          <div className="modal-hero-title">
            <h2 className="modal-title">{movie.title}</h2>
            {isTV && (
              <span className="modal-type-badge">Serie</span>
            )}
          </div>
        </div>

        <div className="modal-body">
          {/* Meta */}
          <div className="modal-meta">
            <span className="rating">⭐ {movie.rating}</span>
            {movie.year && <span>{movie.year}</span>}
            {isTV
              ? <span>🎬 {movie.seasons} temporada{movie.seasons !== 1 ? 's' : ''}</span>
              : null
            }
          </div>

          {/* Acciones */}
          <div className="modal-actions">
            <button
              id="modal-play-btn"
              className="btn-play"
              style={{ fontSize: '0.95rem', padding: '12px 28px' }}
              onClick={() => { onClose(); onPlay(movie); }}
            >
              ▶ {isTV ? 'Ver serie' : 'Ver película'}
            </button>
            <button
              className="btn-info"
              style={{ fontSize: '0.9rem', padding: '10px 20px' }}
            >
              ＋ Mi Lista
            </button>
            <button
              className="btn-info"
              style={{ fontSize: '0.9rem', padding: '10px 16px' }}
              title="Me gusta"
            >
              👍
            </button>
          </div>

          {/* Descripción */}
          <p className="modal-desc">
            {movie.overview || 'Sin descripción disponible.'}
          </p>

          {/* Info adicional */}
          {movie.cast && (
            <p className="modal-cast">
              <strong style={{ color: '#999' }}>Reparto: </strong>
              <span>{movie.cast}</span>
            </p>
          )}

          <p className="modal-cast" style={{ marginTop: '0.5rem' }}>
            <strong style={{ color: '#999' }}>ID TMDB: </strong>
            <span style={{ fontFamily: 'monospace', color: '#E50914' }}>{movie.id}</span>
            &nbsp;·&nbsp;
            <strong style={{ color: '#999' }}>Tipo: </strong>
            <span>{isTV ? 'Serie de TV' : 'Película'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
