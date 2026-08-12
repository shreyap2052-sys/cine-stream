export const getMoodMovie = async (mood) => {
  const response = await fetch("/api/mood", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mood,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Unable to find a movie recommendation."
    );
  }

  return data.movieTitle;
};