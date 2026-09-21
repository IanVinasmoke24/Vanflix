import { useRef } from 'react';

function MovieCard({ movie, onSelect }) {
  return (
    <div
      className="movie-card"
      onClick={() => onSelect(movie)}
      id={`card-${movie.id}`}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(movie)}
    >
      {movie.badge && <span className="card-badge">{movie.badge}</span>}
      <img src={movie.poster} alt={movie.title} loading="lazy" />
      <div className="card-overlay">
        <div className="card-title">{movie.title}</div>
        <div className="card-info">
          <span className="card-rating">⭐ {movie.rating}</span>
          <span>•</span>
          <span>{movie.year}</span>
          <span>•</span>
          <span>{movie.media_type === 'tv' ? '📺 Serie' : '🎬 Película'}</span>
        </div>
        <div className="card-actions">
          <button className="card-btn play" aria-label={`Reproducir ${movie.title}`}>▶</button>
          <button className="card-btn add" aria-label={`Añadir ${movie.title} a mi lista`}>＋</button>
        </div>
      </div>
    </div>
  );
}

export default function MovieRow({ title, movies, onSelect }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="content-section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <a href="#" className="section-link" onClick={e => e.preventDefault()}>
          Ver todo ›
        </a>
      </div>
      <div className="movies-row-wrapper">
        <button
          className="row-btn left"
          onClick={() => scroll(-1)}
          aria-label="Desplazar izquierda"
        >
          ‹
        </button>
        <div className="movies-row" ref={rowRef}>
          {movies.map(m => (
            <MovieCard key={m.id} movie={m} onSelect={onSelect} />
          ))}
        </div>
        <button
          className="row-btn right"
          onClick={() => scroll(1)}
          aria-label="Desplazar derecha"
        >
          ›
        </button>
      </div>
    </section>
  );
}
