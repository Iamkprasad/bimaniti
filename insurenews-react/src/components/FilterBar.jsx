import { CATEGORIES } from '../data/categories';

export default function FilterBar({
  searchValue,
  onSearchChange,
  activeFilter,
  onFilterChange,
  categories = CATEGORIES,
  searchPlaceholder = 'Search...',
}) {
  return (
    <div className="filter-section">
      <input
        type="text"
        className="search-input"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={e => onSearchChange(e.target.value)}
      />
      <div className="filter-bar" style={{ marginTop: '1rem' }}>
        <button
          className={`filter-btn${activeFilter === 'all' ? ' active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn${activeFilter === cat ? ' active' : ''}`}
            onClick={() => onFilterChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
