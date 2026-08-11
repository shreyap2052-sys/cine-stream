function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search movies..."
        aria-label="Search movies"
      />
    </div>
  );
}

export default SearchBar;