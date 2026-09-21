import { useState, useEffect } from 'react';
import './index.css';
import {
  getTrendingMovies,
  getTrendingTV,
  getPopularMovies,
  getPopularTV,
  getTopRatedMovies,
  getTopRatedTV,
  discoverMovies,
  discoverTV,
  searchAll,
  GENRES,
} from './services/tmdb';
import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import MovieRow     from './components/MovieRow';
import FeaturedBanner from './components/FeaturedBanner';
import Categories   from './components/Categories';
import Modal        from './components/Modal';
import Player       from './components/Player';
import Footer       from './components/Footer';

const NO_KEY = !import.meta.env.VITE_TMDB_API_KEY ||
               import.meta.env.VITE_TMDB_API_KEY === 'your_tmdb_api_key_here';

export default function App() {
  // ── Datos ─────────────────────────────────────────────────────────────
  const [rows,    setRows]    = useState({});
  const [hero,    setHero]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(NO_KEY);

  // ── UI ────────────────────────────────────────────────────────────────
  const [selected,    setSelected]    = useState(null); // Modal
  const [playerItem,  setPlayerItem]  = useState(null); // Player
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // ── Carga inicial ─────────────────────────────────────────────────────
  useEffect(() => {
    if (NO_KEY) { setLoading(false); return; }

    const safe = (p) => Promise.resolve(p).catch(() => []);

    Promise.all([
      safe(getTrendingMovies()),
      safe(getTrendingTV()),
      safe(getPopularMovies()),
      safe(getPopularTV()),
      safe(getTopRatedMovies()),
      safe(getTopRatedTV()),
      safe(discoverMovies(GENRES.ACTION)),
      safe(discoverMovies(GENRES.SCIFI)),
      safe(discoverTV(GENRES.CRIME)),
      safe(discoverMovies(GENRES.ANIMATION)),
    ]).then(([
      trendMovies, trendTV, popMovies, popTV,
      topMovies,   topTV,   action,   scifi,
      crimeTV,     animated,
    ]) => {
      const all = [...(trendMovies||[]), ...(trendTV||[])];
      setHero(all.find(i => i.backdrop) || all[0] || null);
      setRows({
        trendMovies: trendMovies||[], trendTV: trendTV||[],
        popMovies:   popMovies||[],   popTV:   popTV||[],
        topMovies:   topMovies||[],   topTV:   topTV||[],
        action:      action||[],      scifi:   scifi||[],
        crimeTV:     crimeTV||[],     animated:animated||[],
      });
    }).catch(() => setApiError(true))
      .finally(() => setLoading(false));
  }, []);

  // ── Búsqueda en tiempo real ───────────────────────────────────────────
  useEffect(() => {
    if (!searchOpen || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      searchAll(searchQuery).then(setSearchResults).catch(() => {});
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, searchOpen]);

  const openPlayer = (item) => {
    setSelected(null);
    setPlayerItem(item);
  };

  // ── Pantalla sin API key ──────────────────────────────────────────────
  if (apiError) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif',
        padding: '2rem', textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔑</div>
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '3rem',
          color: '#E50914', letterSpacing: '2px', marginBottom: '1rem' }}>
          VANFLIX
        </h1>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>
          Configura tu API Key de TMDB
        </h2>
        <p style={{ color: '#b3b3b3', maxWidth: '480px', lineHeight: 1.7, marginBottom: '2rem' }}>
          Vanflix usa <strong style={{ color: '#fff' }}>The Movie Database (TMDB)</strong> para
          obtener datos reales de películas y series. La API es <strong style={{ color: '#46d369' }}>100% gratuita</strong>.
        </p>
        <ol style={{ color: '#b3b3b3', textAlign: 'left', lineHeight: 2, marginBottom: '2rem' }}>
          <li>Regístrate en <a href="https://www.themoviedb.org" target="_blank"
            style={{ color: '#E50914' }}>themoviedb.org</a></li>
          <li>Ve a <strong style={{ color: '#fff' }}>Configuración → API</strong> y copia tu key</li>
          <li>Crea el archivo <code style={{ background: '#1a1a1a', padding: '2px 8px',
            borderRadius: '4px' }}>.env</code> en la raíz del proyecto</li>
          <li>Agrega: <code style={{ background: '#1a1a1a', padding: '2px 8px', borderRadius: '4px',
            color: '#E50914' }}>VITE_TMDB_API_KEY=tu_api_key</code></li>
          <li>Reinicia el servidor: <code style={{ background: '#1a1a1a', padding: '2px 8px',
            borderRadius: '4px' }}>npm run dev</code></li>
        </ol>
        <p style={{ color: '#737373', fontSize: '0.85rem' }}>
          El streaming usa <strong style={{ color: '#fff' }}>unlimplay.com</strong> — sin configuración extra.
        </p>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0a0a0a', flexDirection: 'column', gap: '1.5rem',
      }}>
        <div className="vanflix-spinner" />
        <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem',
          color: '#E50914', letterSpacing: '3px' }}>
          VANFLIX
        </span>
      </div>
    );
  }

  const r = rows;

  return (
    <>
      {/* Navbar */}
      <Navbar onSearchOpen={() => setSearchOpen(true)} />

      <main>
        {/* Hero */}
        {hero && (
          <Hero
            movie={hero}
            onInfo={setSelected}
            onPlay={openPlayer}
          />
        )}

        {/* Búsqueda en overlay */}
        {searchOpen && (
          <div className="search-overlay" id="search-overlay">
            <div className="search-input-wrap">
              <input
                id="search-input"
                autoFocus
                type="text"
                placeholder="Buscar películas, series..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button
                className="search-close-btn"
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                aria-label="Cerrar búsqueda"
              >✕</button>
            </div>
            <div className="search-results">
              {searchResults.map(m => (
                <div
                  key={m.id}
                  className="movie-card"
                  style={{ flex: 'none', width: '100%' }}
                  onClick={() => { setSelected(m); setSearchOpen(false); setSearchQuery(''); }}
                  id={`search-result-${m.id}`}
                  role="button"
                  tabIndex={0}
                >
                  <img src={m.poster} alt={m.title}
                    onError={e => { e.target.src = '/poster1.jpg'; }} />
                  <div className="card-overlay" style={{
                    opacity: 1,
                    background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 60%)',
                  }}>
                    <div className="card-title">{m.title}</div>
                    <div className="card-info">
                      <span className="card-rating">⭐ {m.rating}</span>
                      <span>•</span>
                      <span>{m.media_type === 'tv' ? '📺 Serie' : '🎬 Película'}</span>
                    </div>
                  </div>
                </div>
              ))}
              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <p style={{ color: 'var(--text-dim)', gridColumn: '1/-1',
                  textAlign: 'center', paddingTop: '3rem' }}>
                  No se encontraron resultados para "{searchQuery}"
                </p>
              )}
              {searchQuery.length < 2 && (
                <p style={{ color: 'var(--text-dim)', gridColumn: '1/-1',
                  textAlign: 'center', paddingTop: '3rem' }}>
                  Escribe al menos 2 caracteres para buscar...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Filas de contenido */}
        {r.trendMovies?.length > 0 && (
          <MovieRow title="🔥 Películas en Tendencia"
            movies={r.trendMovies} onSelect={setSelected} />
        )}
        {r.trendTV?.length > 0 && (
          <MovieRow title="📺 Series en Tendencia"
            movies={r.trendTV} onSelect={setSelected} />
        )}

        {/* Banner destacado */}
        {r.topMovies?.[0] && (
          <FeaturedBanner movie={r.topMovies[0]} onSelect={setSelected} />
        )}

        {r.topMovies?.length > 0 && (
          <MovieRow title="⭐ Películas Mejor Valoradas"
            movies={r.topMovies} onSelect={setSelected} />
        )}
        {r.topTV?.length > 0 && (
          <MovieRow title="🏆 Series Mejor Valoradas"
            movies={r.topTV} onSelect={setSelected} />
        )}

        {/* Géneros */}
        <Categories />

        {r.action?.length > 0 && (
          <MovieRow title="💥 Acción" movies={r.action} onSelect={setSelected} />
        )}
        {r.scifi?.length > 0 && (
          <MovieRow title="🚀 Ciencia Ficción" movies={r.scifi} onSelect={setSelected} />
        )}
        {r.crimeTV?.length > 0 && (
          <MovieRow title="🕵️ Series de Crimen" movies={r.crimeTV} onSelect={setSelected} />
        )}
        {r.animated?.length > 0 && (
          <MovieRow title="🎭 Animación" movies={r.animated} onSelect={setSelected} />
        )}
        {r.popMovies?.length > 0 && (
          <MovieRow title="🎬 Películas Populares" movies={r.popMovies} onSelect={setSelected} />
        )}
        {r.popTV?.length > 0 && (
          <MovieRow title="📡 Series Populares" movies={r.popTV} onSelect={setSelected} />
        )}
      </main>

      <Footer />

      {/* Modal de detalle */}
      {selected && !playerItem && (
        <Modal
          movie={selected}
          onClose={() => setSelected(null)}
          onPlay={openPlayer}
        />
      )}

      {/* Player de video */}
      {playerItem && (
        <Player
          item={playerItem}
          onClose={() => setPlayerItem(null)}
        />
      )}
    </>
  );
}
