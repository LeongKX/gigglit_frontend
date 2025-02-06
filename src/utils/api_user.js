import axios from "axios";
import Swal from "sweetalert2";

import { API_URL } from "../constant";

export const userLogin = async (email, password) => {
  try {
    const response = await axios.post(API_URL + "/user/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    Swal.fire(error.response.data.error);
  }
};

export const userSignup = async (name, email, password) => {
  try {
    const response = await axios.post(API_URL + "/user/signup", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    Swal.fire(error.response.data.error);
  }
};

export const getUsers = async (token) => {
  try {
    const response = await axios.get(API_URL + "/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    Swal.fire("Error!", "Failed to fetch users.", "error");
  }
};

export const followUser = async (userId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/user/follow/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error following user:", error);
    Swal.fire("Error!", "Failed to follow user.", "error");
  }
};

export const unfollowUser = async (userId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/user/unfollow/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    Swal.fire("Error!", "Failed to unfollow user.", "error");
  }
};

export const getCurrentUser = (cookies) => {
  return cookies.currentUser ? cookies.currentUser : null;
};

export const isUserLoggedIn = (cookies) => {
  return getCurrentUser(cookies) ? true : false;
};

export const isAdmin = (cookies) => {
  const currentUser = getCurrentUser(cookies);
  return currentUser && currentUser.role === "admin" ? true : false;
};

//function to access cookies.currentUser.token
export const getUserToken = (cookies) => {
  const currentUser = getCurrentUser(cookies);
  return currentUser && currentUser.token ? currentUser.token : "";
};
