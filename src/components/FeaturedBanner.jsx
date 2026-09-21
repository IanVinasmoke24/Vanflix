export default function FeaturedBanner({ movie, onSelect }) {
  return (
    <div
      className="featured-banner"
      id="featured-banner"
      onClick={() => onSelect(movie)}
      role="button"
      tabIndex={0}
    >
      <img src={movie.backdrop} alt={movie.title} />
      <div className="featured-banner-overlay">
        <div className="featured-banner-label">🎬 Vanflix Original</div>
        <div className="featured-banner-title">{movie.title}</div>
        <p className="featured-banner-desc">
          {(movie.overview || '').slice(0, 90)}{movie.overview?.length > 90 ? '...' : ''}
        </p>
      </div>
    </div>
  );
}
