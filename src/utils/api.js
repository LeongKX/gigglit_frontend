import axios from "axios";
import Swal from "sweetalert2";

import { API_URL } from "../constant";

//get products (public data)
export const getPosts = async () => {
  try {
    const response = await axios.get(API_URL + "/posts");
    return response.data;
  } catch (error) {
    Swal.fire(error.response.data.error);
  }
};

export const getPostByUserId = async (_id) => {
  try {
    const response = await axios.get(API_URL + "/posts/" + _id + "/user");
    return response.data;
  } catch (error) {
    console.log(error);
    Swal.fire(error.response.data.error);
  }
};

// get product (public data)
export const getPost = async (_id) => {
  try {
    const response = await axios.get(API_URL + "/posts/" + _id);
    return response.data;
  } catch (error) {
    console.log(error);
    Swal.fire(error.response.data.error);
  }
};

//add new product
export const addNewPost = async (title, description, topic, token) => {
  try {
    const response = await axios.post(
      API_URL + "/posts",
      {
        title: title,
        description: description,
        topic: topic,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
          //Bearer sfagrafiigiuao143u3
        },
      }
    );
    return response.data;
  } catch (error) {
    Swal.fire(error.response.data.error);
  }
};

// update product
export const updatePost = async (id, title, description, topic, token) => {
  try {
    const response = await axios.put(
      API_URL + "/posts/" + id,
      {
        title: title,
        description: description,
        topic: topic,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    Swal.fire(error.response.data.error);
  }
};

// delete product
export const deletePost = async (_id, token) => {
  try {
    const response = await axios.delete(API_URL + `/posts/${_id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error) {
    Swal.fire(error.response.data.error);
  }
};

export const getTopics = async () => {
  try {
    const response = await axios.get(API_URL + "/topics");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTopic = async (_id) => {
  try {
    const response = await axios.get(API_URL + "/topics/" + _id);
    return response.data;
  } catch (error) {
    Swal.fire(error.response.data.error);
  }
};

export const addNewTopic = async (name, token) => {
  try {
    const response = await axios.post(
      API_URL + "/topics",
      { name: name },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    Swal.fire(error.response.data.error);
  }
};

export const deleteTopic = async (_id, token) => {
  try {
    const response = await axios.delete(API_URL + `/topics/${_id}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response.data;
  } catch (error) {
    Swal.fire(error.response.data.error);
  }
};

export const editTopic = async (_id, name, token) => {
  try {
    const response = await axios.put(
      API_URL + "/topics/" + _id,
      {
        name: name,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    Swal.fire(error.response.data.error);
  }
};

export const likePost = async (postId, token) => {
  try {
    const response = await axios.put(
      API_URL + `/posts/${postId}/like`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    Swal.fire(error.response.data.error);
  }
};

export const dislikePost = async (postId, token) => {
  try {
    const response = await axios.put(
      API_URL + `/posts/${postId}/dislike`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error) {
    Swal.fire(error.response.data.error);
  }
};

export const getBookmark = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}?_id=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
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

export const addToBookmark = async (postId, userId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/${postId}?_id=${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    Swal.fire(
      "Error",
      error.response?.data?.error || "Something went wrong",
      "error"
    );
  }
};
