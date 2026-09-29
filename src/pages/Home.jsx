import { useCallback, useEffect, useRef, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import SearchBar from "../components/SearchBar";
import MoodMatcher from "../components/MoodMatcher";
import useDebounce from "../hooks/useDebounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { searchMovies } from "../services/omdb";
import { getMoodMovie } from "../services/mood";
import {
  getPosts,
  createPost,
  createPostWithImage,
  deletePost,
} from "../services/dataHub";

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");
const [postFormError, setPostFormError] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [newPostImage, setNewPostImage] = useState(null);

  const sentinelRef = useRef(null);
  const debouncedQuery = useDebounce(searchQuery, 500);

  const loadMovies = useCallback(async (query, moviePage = 1) => {
    const data = await searchMovies(query, moviePage);
    return data;
  }, []);

  const loadInitialMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await loadMovies("movie", 1);

      setMovies(data.results);
      setPage(1);
      setHasMore(data.hasMore);
    } catch (err) {
      setError("Unable to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loadMovies]);


  useEffect(() => {
  const loadPosts = async () => {
    try {
      setPostsLoading(true);
      setPostsError("");

      const data = await getPosts();

      setPosts(data);
    } catch (err) {
      console.error("Data Hub error:", err);
      setPostsError("Unable to connect to Data Hub.");
    } finally {
      setPostsLoading(false);
    }
  };

  loadPosts();
}, []);

const handleCreatePost = async (event) => {
  event.preventDefault();

  const title = newPostTitle.trim();
  const content = newPostContent.trim();

  if (!title || !content) {
    setPostFormError("Please enter both a title and content.");
    return;
  }

  if (!newPostImage) {
    setPostFormError("Please select an image.");
    return;
  }

  try {
    setPostSubmitting(true);
    setPostsError("");
    setPostFormError("");

    const newPost = await createPostWithImage({
      title,
      content,
      image: newPostImage,
    });

    setPosts((currentPosts) => [newPost, ...currentPosts]);

    setNewPostTitle("");
    setNewPostContent("");
    setNewPostImage(null);
  } catch (error) {
    console.error("Create post error:", error);
    setPostsError(error.message || "Unable to create post.");
  } finally {
    setPostSubmitting(false);
  }
};
  
    

const handleDeletePost = async (postId) => {
  try {
    setDeletingPostId(postId);
    setPostsError("");

    await deletePost(postId);

    setPosts((currentPosts) =>
      currentPosts.filter((post) => post._id !== postId)
    );
  } catch (error) {
    console.error("Delete post error:", error);
    setPostsError(error.message || "Unable to delete post.");
  } finally {
    setDeletingPostId(null);
  }
};

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      loadInitialMovies();
    }
  }, [debouncedQuery, loadInitialMovies]);

  const loadMoreMovies = useCallback(async () => {
    if (loadingMore || !hasMore || debouncedQuery.trim()) {
      return;
    }

    try {
      setLoadingMore(true);

      const nextPage = page + 1;
      const data = await loadMovies("movie", nextPage);

      setMovies((prevMovies) => [
        ...prevMovies,
        ...data.results,
      ]);

      setPage(nextPage);
      setHasMore(data.hasMore);
    } catch (err) {
      setError("Unable to load more movies.");
    } finally {
      setLoadingMore(false);
    }
  }, [
    page,
    loadingMore,
    hasMore,
    debouncedQuery,
    loadMovies,
  ]);

  useInfiniteScroll({
    target: sentinelRef,
    onIntersect: loadMoreMovies,
    enabled:
      hasMore &&
      !loading &&
      !loadingMore &&
      !debouncedQuery.trim(),
  });

  useEffect(() => {
    const query = debouncedQuery.trim();

    if (!query) {
      return;
    }

    const searchOMDb = async () => {
      try {
        setLoading(true);
        setError("");
        setPage(1);

        const data = await loadMovies(query, 1);

        setMovies(data.results);
        setHasMore(data.hasMore);
      } catch (err) {
        setError("Unable to search movies. Please try again.");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    searchOMDb();
  }, [debouncedQuery, loadMovies]);

  const handleMovieSuggestion = async (mood) => {
    try {
      setLoading(true);
      setError("");

      const movieTitle = await getMoodMovie(mood);

      const data = await searchMovies(movieTitle, 1);

      if (data.results.length === 0) {
        setMovies([]);
        setError(
          `We couldn't find "${movieTitle}" in the movie database.`
        );
        return;
      }

      setMovies(data.results.slice(0, 1));
      setHasMore(false);
      setPage(1);
    } catch (err) {
      console.error("Mood matcher error:", err);

      setError(
        "Unable to generate a movie recommendation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <p className="page-subtitle">
        Discover your next movie.
      </p>

      <MoodMatcher
        onMovieSuggestion={handleMovieSuggestion}
      />

     <section className="data-hub-section">
  <h2>Data Hub Posts</h2>

  <form onSubmit={handleCreatePost} className="post-form">
    <input
      type="text"
      placeholder="Post title..."
      value={newPostTitle}
      onChange={(event) => setNewPostTitle(event.target.value)}
      maxLength={100}
    />

    <textarea
      placeholder="Post content..."
      value={newPostContent}
      onChange={(event) => setNewPostContent(event.target.value)}
      rows="3"
      maxLength={500}
    />

    <input
  type="file"
  accept="image/*"
  onChange={(event) => setNewPostImage(event.target.files[0] || null)}
   />

    <button type="submit" disabled={postSubmitting}>
      {postSubmitting ? "Adding..." : "Add Post"}
    </button>
  </form>

  {postFormError && (
  <p className="post-form-error">{postFormError}</p>
)}

  {postsLoading && <p>Loading posts...</p>}

  {postsError && <p>{postsError}</p>}

  {!postsLoading && posts.length === 0 && (
    <p>No Data Hub posts found.</p>
  )}

  {!postsLoading && posts.length > 0 && (
    <div className="posts-list">
      {posts.map((post) => (
       <article key={post._id} className="post-card">
  <div>
    {post.imageUrl && (
      <img
        src={post.imageUrl}
        alt={post.title}
        className="post-image"
      />
    )}

    <h3>{post.title}</h3>
    <p>{post.content}</p>

    {post.authorId && (
      <small>By {post.authorId.name}</small>
    )}
  </div>

  <button
    type="button"
    onClick={() => handleDeletePost(post._id)}
    disabled={deletingPostId === post._id}
  >
    {deletingPostId === post._id ? "Deleting..." : "Delete"}
  </button>
</article>
      ))}
    </div>
  )}
</section>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {loading && <p>Loading movies...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          {movies.length > 0 ? (
            <MovieGrid movies={movies} />
          ) : (
            <p>No movies found.</p>
          )}

          <div
            ref={sentinelRef}
            className="scroll-sentinel"
            aria-hidden="true"
          />

          {loadingMore && (
            <p className="loading-more">
              Loading more movies...
            </p>
          )}

          {!hasMore && !debouncedQuery.trim() && (
            <p className="end-message">
              You've reached the end.
            </p>
          )}
        </>
      )}
    </main>
  );
}

export default Home;