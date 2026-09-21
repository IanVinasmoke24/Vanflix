// ===== TMDB API SERVICE =====
// API key gratuita en: https://www.themoviedb.org/settings/api

const KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = 'https://api.themoviedb.org/3';
export const IMG = 'https://image.tmdb.org/t/p/';
const LANG = 'es-MX'; // Español Latino América

/** Fetch genérico con parámetros */
const api = async (path, params = {}) => {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('api_key', KEY);
  url.searchParams.set('language', LANG);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`);
  return res.json();
};

/** Normaliza un item de TMDB a formato común */
export const normalize = (item) => {
  const isTV = item.media_type === 'tv' || !!item.name;
  return {
    id:           item.id,
    title:        item.title || item.name || 'Sin título',
    overview:     item.overview || '',
    year:         (item.release_date || item.first_air_date || '').slice(0, 4),
    rating:       item.vote_average ? Number(item.vote_average).toFixed(1) : '—',
    poster:       item.poster_path  ? `${IMG}w500${item.poster_path}`   : '/poster1.jpg',
    backdrop:     item.backdrop_path? `${IMG}w1280${item.backdrop_path}`: '/hero.jpg',
    media_type:   isTV ? 'tv' : 'movie',
    genre_ids:    item.genre_ids || [],
    seasons:      item.number_of_seasons  || 1,
    numEpisodes:  item.number_of_episodes || null,
  };
};

// ── Endpoints ──────────────────────────────────────────────────────────
export const getTrending      = ()         => api('/trending/all/week').then(r => r.results.map(normalize));
export const getTrendingMovies= ()         => api('/trending/movie/week').then(r => r.results.map(normalize));
export const getTrendingTV    = ()         => api('/trending/tv/week').then(r => r.results.map(normalize));
export const getPopularMovies = (page = 1) => api('/movie/popular', { page }).then(r => r.results.map(normalize));
export const getPopularTV     = (page = 1) => api('/tv/popular',    { page }).then(r => r.results.map(normalize));
export const getTopRatedMovies= ()         => api('/movie/top_rated').then(r => r.results.map(normalize));
export const getTopRatedTV    = ()         => api('/tv/top_rated').then(r => r.results.map(normalize));

export const discoverMovies   = (genreId)  =>
  api('/discover/movie', { with_genres: genreId, sort_by: 'popularity.desc' }).then(r => r.results.map(normalize));

export const discoverTV       = (genreId)  =>
  api('/discover/tv',    { with_genres: genreId, sort_by: 'popularity.desc' }).then(r => r.results.map(normalize));

export const searchAll = (query) =>
  api('/search/multi', { query }).then(r =>
    r.results.filter(i => i.media_type !== 'person').map(normalize)
  );

// Detalles extendidos (número de temporadas, sinopsis completa, etc.)
export const getMovieDetails = (id) => api(`/movie/${id}`).then(normalize);
export const getTVDetails    = (id) => api(`/tv/${id}`).then(item => ({
  ...normalize(item),
  seasons:     item.number_of_seasons,
  numEpisodes: item.number_of_episodes,
  seasonsList: item.seasons?.filter(s => s.season_number > 0) || [],
}));

export const getSeason = (tvId, seasonNumber) =>
  api(`/tv/${tvId}/season/${seasonNumber}`).then(data => ({
    season:   data.season_number,
    name:     data.name,
    episodes: (data.episodes || []).map(ep => ({
      id:       ep.id,
      number:   ep.episode_number,
      name:     ep.name,
      overview: ep.overview,
      runtime:  ep.runtime,
      still:    ep.still_path ? `${IMG}w300${ep.still_path}` : null,
    })),
  }));

// IDs de géneros TMDB más relevantes
export const GENRES = {
  ACTION:    28,
  SCIFI:     878,
  DRAMA:     18,
  COMEDY:    35,
  THRILLER:  53,
  HORROR:    27,
  ANIMATION: 16,
  CRIME:     80,
};
