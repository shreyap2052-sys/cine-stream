export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const { mood } = req.body || {};

  if (!mood || typeof mood !== "string") {
    return res.status(400).json({
      error: "Mood description is required.",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Gemini API key is not configured.",
    });
  }

  try {
    const prompt = `
You are a movie recommendation assistant.

The user says:
"${mood.trim()}"

Suggest exactly ONE movie that matches the user's mood.

Return ONLY the movie title as plain text.
Do not include quotes, explanations, years, ratings, or additional text.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);

      return res.status(response.status).json({
        error: "Gemini request failed.",
      });
    }

    const data = await response.json();

    const movieTitle =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!movieTitle) {
      return res.status(500).json({
        error: "Gemini returned no movie title.",
      });
    }

    return res.status(200).json({
      movieTitle,
    });
  } catch (error) {
    console.error("Mood matcher error:", error);

    return res.status(500).json({
      error: "Unable to generate a movie recommendation.",
    });
  }
}