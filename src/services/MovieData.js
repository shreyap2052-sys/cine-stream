const movies = [
  {
    id: 1,
    title: "Inception",
    year: "2010",
    rating: 8.8,
    poster: null,
  },
  {
    id: 2,
    title: "Interstellar",
    year: "2014",
    rating: 8.7,
    poster: null,
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: "2008",
    rating: 9.0,
    poster: null,
  },
  {
    id: 4,
    title: "Dune",
    year: "2021",
    rating: 8.0,
    poster: null,
  },
  {
    id: 5,
    title: "Oppenheimer",
    year: "2023",
    rating: 8.6,
    poster: null,
  },
  {
    id: 6,
    title: "The Matrix",
    year: "1999",
    rating: 8.7,
    poster: null,
  },
  {
    id: 7,
    title: "Avengers: Endgame",
    year: "2019",
    rating: 8.4,
    poster: null,
  },
  {
    id: 8,
    title: "Spider-Man: Into the Spider-Verse",
    year: "2018",
    rating: 8.4,
    poster: null,
  },
  {
    id: 9,
    title: "The Prestige",
    year: "2006",
    rating: 8.5,
    poster: null,
  },
  {
    id: 10,
    title: "Whiplash",
    year: "2014",
    rating: 8.5,
    poster: null,
  },
  {
    id: 11,
    title: "Parasite",
    year: "2019",
    rating: 8.5,
    poster: null,
  },
  {
    id: 12,
    title: "Gladiator",
    year: "2000",
    rating: 8.5,
    poster: null,
  },
  {
    id: 13,
    title: "The Shawshank Redemption",
    year: "1994",
    rating: 9.3,
    poster: null,
  },
  {
    id: 14,
    title: "Fight Club",
    year: "1999",
    rating: 8.8,
    poster: null,
  },
  {
    id: 15,
    title: "Forrest Gump",
    year: "1994",
    rating: 8.8,
    poster: null,
  },
  {
    id: 16,
    title: "The Godfather",
    year: "1972",
    rating: 9.2,
    poster: null,
  },
  {
    id: 17,
    title: "Pulp Fiction",
    year: "1994",
    rating: 8.9,
    poster: null,
  },
  {
    id: 18,
    title: "The Lord of the Rings",
    year: "2001",
    rating: 8.9,
    poster: null,
  },
  {
    id: 19,
    title: "Mad Max: Fury Road",
    year: "2015",
    rating: 8.1,
    poster: null,
  },
  {
    id: 20,
    title: "John Wick",
    year: "2014",
    rating: 7.4,
    poster: null,
  },
  {
    id: 21,
    title: "Arrival",
    year: "2016",
    rating: 7.9,
    poster: null,
  },
  {
    id: 22,
    title: "Blade Runner 2049",
    year: "2017",
    rating: 8.0,
    poster: null,
  },
  {
    id: 23,
    title: "The Social Network",
    year: "2010",
    rating: 7.8,
    poster: null,
  },
  {
    id: 24,
    title: "Everything Everywhere All at Once",
    year: "2022",
    rating: 7.7,
    poster: null,
  },
];

const PAGE_SIZE = 8;

export const getLocalMovies = (page = 1) => {
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageMovies = movies.slice(startIndex, startIndex + PAGE_SIZE);

  return Promise.resolve({
    results: pageMovies,
    hasMore: startIndex + PAGE_SIZE < movies.length,
  });
};

export const searchLocalMovies = (query) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return Promise.resolve([]);
  }

  return Promise.resolve(
    movies.filter((movie) =>
      movie.title.toLowerCase().includes(normalizedQuery)
    )
  );
};