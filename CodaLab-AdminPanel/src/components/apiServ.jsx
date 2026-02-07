// apiService.js

const BASE_URL = import.meta.env.VITE_BASE_URL; // Replace with your actual API base URL

export async function updatePost(id, updatedData) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/Admin/private/updateNews/${id}`,
      {
        method: "PUT", // or 'PATCH' depending on your API endpoint
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: JSON.stringify(updatedData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update post");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function deletePost(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/Admin/private/deleteNews/${id}`,
      {
        method: "DELETE",

        "Content-Type": "application/json",
        // Add any authorization headers if needed
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export async function uploadPost(newPost) {
  try {
    const response = await fetch(`${BASE_URL}/api/Admin/private/createNews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any authorization headers if needed

        authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
      body: JSON.stringify(newPost),
    });
    if (!response.ok) {
      throw new Error("Failed to upload post");
    }
    return await response.json();
  } catch (error) {
    console.error("Error uploading post:", error);
    throw error;
  }
}

export async function updateGalleryPost(id, updatedData) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/Admin/private/updateMemory/${id}`,
      {
        method: "PUT", // or 'PATCH' depending on your API endpoint
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: JSON.stringify(updatedData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update post");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function deleteGalleryPost(id) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/Admin/private/deleteMemory/${id}`,
      {
        method: "DELETE",

        "Content-Type": "application/json",
        // Add any authorization headers if needed
        headers: {
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export async function uploadGalleryPost(newPost) {
  try {
    console.log("Ramesh");
    const response = await fetch(`${BASE_URL}/api/Admin/private/createMemory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any authorization headers if needed

        //"authorization":'Bearer ' + localStorage.getItem('accessToken')
      },
      body: JSON.stringify(newPost),
    });
    if (!response.ok) {
      throw new Error("Failed to upload post");
    }
    console.log("This is from response side", response);
    return await response.json();
  } catch (error) {
    console.error("Error uploading post:", error);
    throw error;
  }
}
