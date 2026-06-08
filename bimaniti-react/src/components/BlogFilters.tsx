import './BlogFilters.css';

interface BlogFiltersProps {
  blogs: { category: string }[];
  search: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
}

export const BlogFilters = ({ blogs, search, onSearchChange, filter, onFilterChange }: BlogFiltersProps) => {
  const categories = [...new Set(blogs.map(blog => blog.category))];

  return (
    <div className="filter-container">
      <div className="search-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          type="text"
          id="blog-search"
          placeholder="Search posts..."
          aria-label="Search posts"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="filter-pills">
        <button
          className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={filter === category ? 'filter-pill active' : 'filter-pill'}
            onClick={() => onFilterChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};
