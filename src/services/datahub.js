const API_URL = import.meta.env.VITE_API_URL;

export const getPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);

  if (!response.ok) {
    throw new Error("Failed to fetch posts.");
  }

  return response.json();
};

export const createPost = async (postData) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(errorData.message || "Failed to create post.");
  }

  return response.json();
};

export const deletePost = async (postId) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(errorData.message || "Failed to delete post.");
  }

  return response.json();
};

export const createPostWithImage = async ({ title, content, image }) => {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("content", content);
  formData.append("image", image);

  const response = await fetch(`${API_URL}/posts/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.message || "Failed to create post with image."
    );
  }

  return response.json();
};