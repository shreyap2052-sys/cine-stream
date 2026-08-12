import MovieGrid from "../components/MovieGrid";
import { useFavorites } from "../context/FavoritesContext";

function Favorites() {
  const { favorites } = useFavorites();

  return (
    <main>
      <h1>My Favorites</h1>
      <p>Your saved movies in one place.</p>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <h2>No favorites yet</h2>
          <p>Click the heart on a movie to save it here.</p>
        </div>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </main>
  );
}

export default Favorites;