import { useState, useEffect } from 'react';
import { movies } from '../data';

export default function Search({ onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults(movies.slice(0, 8));
      return;
    }
    const q = query.toLowerCase();
    setResults(
      movies.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genre.some(g => g.toLowerCase().includes(q))
      )
    );
  }, [query]);

  return (
    <div className="search-overlay" id="search-overlay">
      <div className="search-input-wrap">
        <input
          id="search-input"
          autoFocus
          type="text"
          placeholder="Buscar películas, series, géneros..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="search-close-btn" onClick={onClose} aria-label="Cerrar búsqueda">
          ✕
        </button>
      </div>

      <div className="search-results">
        {results.map(m => (
          <div
            key={m.id}
            className="movie-card"
            style={{ flex: 'none', width: '100%' }}
            onClick={() => { onSelect(m); onClose(); }}
            id={`search-result-${m.id}`}
            role="button"
            tabIndex={0}
          >
            <img src={m.poster} alt={m.title} />
            <div className="card-overlay" style={{ opacity: 1, background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 60%)' }}>
              <div className="card-title">{m.title}</div>
              <div className="card-info">
                <span className="card-rating">⭐ {m.rating}</span>
                <span>•</span>
                <span>{m.genre[0]}</span>
              </div>
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <p style={{ color: 'var(--text-dim)', gridColumn: '1/-1', textAlign: 'center', paddingTop: '3rem' }}>
            No se encontraron resultados para "{query}"
          </p>
        )}
      </div>
    </div>
  );
}
