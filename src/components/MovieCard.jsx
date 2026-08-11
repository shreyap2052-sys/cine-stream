function MovieCard({ movie }) {
  const releaseYear = movie.year || "N/A";
  const rating = Number(movie.rating);

  return (
    <article className="movie-card">
      {movie.poster ? (
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
        />
      ) : (
        <div className="movie-poster-placeholder">
          <span>{movie.title}</span>
        </div>
      )}

      <div className="movie-card-info">
        <h2>{movie.title}</h2>

        <div className="movie-meta">
          <span>{releaseYear}</span>
          <span>
            ★ {Number.isFinite(rating) ? rating.toFixed(1) : "N/A"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;