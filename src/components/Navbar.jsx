import { useState, useEffect } from 'react';

export default function Navbar({ onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('Inicio');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Inicio', 'Series', 'Películas', 'Mis Listas', 'Novedades'];

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="main-navbar">
      <div className="navbar-left">
        <span className="navbar-logo">VANFLIX</span>
        <ul className="navbar-links">
          {links.map(l => (
            <li key={l}>
              <a
                href="#"
                className={active === l ? 'active' : ''}
                onClick={e => { e.preventDefault(); setActive(l); }}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-right">
        <button
          id="search-btn"
          className="navbar-search-btn"
          aria-label="Buscar"
          onClick={onSearchOpen}
        >
          🔍
        </button>
        <button className="navbar-avatar" id="user-avatar" aria-label="Perfil">
          V
        </button>
      </div>
    </nav>
  );
}
