import { useState } from "react";

function MoodMatcher({ onMovieSuggestion }) {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const query = mood.trim();

    if (!query) {
      return;
    }

    setLoading(true);

    try {
      await onMovieSuggestion(query);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mood-matcher">
      <div className="mood-matcher-heading">
        <span className="mood-label">Mood Matcher</span>
        <h2>What do you feel like watching?</h2>
        <p>
          Describe your mood and we'll find a movie for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mood-form">
        <input
          type="text"
          value={mood}
          onChange={(event) => setMood(event.target.value)}
          placeholder="e.g. I want something funny and adventurous"
          aria-label="Describe your mood"
        />

        <button type="submit" disabled={loading || !mood.trim()}>
          {loading ? "Finding..." : "Find a movie"}
        </button>
      </form>
    </section>
  );
}

export default MoodMatcher;