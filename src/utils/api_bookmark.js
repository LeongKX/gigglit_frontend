import axios from "axios";
import Swal from "sweetalert2";

import { API_URL } from "../constant";

// Get bookmarks for a user
export const getBookmark = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/bookmarks/`, {
      headers: { Authorization: "Bearer " + token },
    });
    return response.data;
  } catch (error) {
    Swal.fire(
      "Error",
      error.response?.data?.error || "Something went wrong",
      "error"
    );
  }
};

// Add/remove a post from bookmarks
export const addToBookmark = async (postId, userId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/bookmarks/${postId}`,
      { userId },
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    Swal.fire(
      "Error",
      error.response?.data?.error || "Something went wrong",
      "error"
    );
  }
};
