import { useState, useEffect, useCallback } from 'react';
import { getSeason, getTVDetails } from '../services/tmdb';

/**
 * Player de video usando unlimplay.com
 * Soporta películas y series con selector de temporada/episodio.
 */
export default function Player({ item, onClose }) {
  const isTV = item.media_type === 'tv';

  // Estado de temporada / episodio (solo series)
  const [season,   setSeason]   = useState(1);
  const [episode,  setEpisode]  = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [tvInfo,   setTvInfo]   = useState(null);
  const [loadingEp, setLoadingEp] = useState(false);

  // Bloquear scroll y Escape para cerrar
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // Si es serie, cargamos detalles y episodios de la temporada
  useEffect(() => {
    if (!isTV) return;
    setLoadingEp(true);
    Promise.all([
      getTVDetails(item.id).catch(() => null),
      getSeason(item.id, season).catch(() => ({ episodes: [] })),
    ]).then(([details, seasonData]) => {
      setTvInfo(details);
      setEpisodes(seasonData.episodes || []);
      setEpisode(1);
    }).finally(() => setLoadingEp(false));
  }, [item.id, isTV, season]);

  // URL del iframe
  const iframeSrc = isTV
    ? `https://unlimplay.com/f/embed/tv/${item.id}/${season}/${episode}`
    : `https://unlimplay.com/f/embed/movie/${item.id}`;

  const totalSeasons = tvInfo?.seasons || item.seasons || 1;

  const seasonOptions = Array.from({ length: totalSeasons }, (_, i) => i + 1);

  return (
    <div
      className="player-backdrop"
      id="player-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="player-wrap">
        {/* ── Header ── */}
        <div className="player-header">
          <div className="player-title">
            <span className="player-logo">VANFLIX</span>
            <span className="player-sep">›</span>
            <span>{item.title}</span>
            {isTV && (
              <span className="player-ep-label">
                T{season} · E{episode}
                {episodes[episode - 1] ? ` — ${episodes[episode - 1].name}` : ''}
              </span>
            )}
          </div>
          <button
            id="player-close-btn"
            className="player-close"
            onClick={onClose}
            aria-label="Cerrar reproductor"
          >
            ✕
          </button>
        </div>

        {/* ── Iframe ── */}
        <div className="player-iframe-wrap">
          <iframe
            key={iframeSrc}
            src={iframeSrc}
            title={item.title}
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* ── Panel de episodios (solo series) ── */}
        {isTV && (
          <div className="player-episodes-panel">
            {/* Selector de temporada */}
            <div className="player-season-row">
              <span className="player-panel-label">Temporada:</span>
              <div className="player-season-pills">
                {seasonOptions.map(s => (
                  <button
                    key={s}
                    id={`season-btn-${s}`}
                    className={`season-pill${season === s ? ' active' : ''}`}
                    onClick={() => setSeason(s)}
                  >
                    T{s}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de episodios */}
            <div className="player-ep-list">
              {loadingEp ? (
                <div className="player-loading">Cargando episodios...</div>
              ) : episodes.length > 0 ? (
                episodes.map(ep => (
                  <button
                    key={ep.number}
                    id={`ep-btn-${season}-${ep.number}`}
                    className={`ep-item${episode === ep.number ? ' active' : ''}`}
                    onClick={() => setEpisode(ep.number)}
                  >
                    {ep.still && (
                      <img src={ep.still} alt={ep.name} className="ep-thumb" />
                    )}
                    <div className="ep-info">
                      <span className="ep-num">Episodio {ep.number}</span>
                      <span className="ep-name">{ep.name}</span>
                      {ep.runtime && (
                        <span className="ep-runtime">{ep.runtime} min</span>
                      )}
                    </div>
                    <span className={`ep-play-icon${episode === ep.number ? ' playing' : ''}`}>
                      {episode === ep.number ? '▶' : '›'}
                    </span>
                  </button>
                ))
              ) : (
                <p className="player-loading">No hay episodios disponibles.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
