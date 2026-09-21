export default function Footer() {
  const cols = [
    {
      title: 'Plataforma',
      links: ['Inicio', 'Películas', 'Series', 'Documentales'],
    },
    {
      title: 'Cuenta',
      links: ['Mi Perfil', 'Mi Lista', 'Historial', 'Configuración'],
    },
    {
      title: 'Soporte',
      links: ['Centro de Ayuda', 'Contacto', 'Términos de Uso', 'Privacidad'],
    },
    {
      title: 'Empresa',
      links: ['Sobre Vanflix', 'Prensa', 'Empleos', 'Blog'],
    },
  ];

  return (
    <footer className="footer" id="main-footer">
      <div className="footer-logo">VANFLIX</div>
      <p className="footer-tagline">Streaming ilimitado. Sin anuncios. Sin límites.</p>

      <nav className="footer-grid">
        {cols.map(col => (
          <div key={col.title} className="footer-col">
            <h4>{col.title}</h4>
            <ul>
              {col.links.map(l => (
                <li key={l}>
                  <a href="#" onClick={e => e.preventDefault()}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="footer-bottom">
        <span>© 2025 Vanflix. Todos los derechos reservados.</span>
        <span style={{ color: '#E50914', fontWeight: 700 }}>
          Hecho con ❤️ por Vanflix Studios
        </span>
      </div>
    </footer>
  );
}
