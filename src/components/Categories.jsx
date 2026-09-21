import { categories } from '../data';

export default function Categories() {
  return (
    <section className="content-section" id="categories-section">
      <div className="section-header">
        <h2 className="section-title">Explorar Géneros</h2>
      </div>
      <div className="categories-grid">
        {categories.map(cat => (
          <button
            key={cat.label}
            className="category-chip"
            id={`cat-${cat.label.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <span className="icon">{cat.icon}</span>
            <span className="label">{cat.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
