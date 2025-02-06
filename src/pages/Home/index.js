import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header";

import {
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import { getUsers, followUser, unfollowUser } from "../../utils/api_user";

import {
  getPostByUserId,
  deletePost,
  likePost,
  dislikePost,
} from "../../utils/api";
import { addToBookmark } from "../../utils/api_bookmark";
import {
  isUserLoggedIn,
  getCurrentUser,
  getUserToken,
  isAdmin,
} from "../../utils/api_user";

import Swal from "sweetalert2";
import {
  Bookmark,
  Delete,
  Edit,
  ThumbDown,
  ThumbUp,
} from "@mui/icons-material";

function Home() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [cookies, , removeCookie] = useCookies(["currentUser"]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState("");
  const currentUser = getCurrentUser(cookies);
  const token = getUserToken(cookies);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeCookie("currentUser", { path: "/" });
    setUsers([]);
    setPosts([]);
    setTriggerFetch(false);

    navigate("/login");
  };

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        const deleted = await deletePost(id, token);
        if (deleted) {
          setTriggerFetch(!triggerFetch);
          Swal.fire("Deleted!", "The post has been deleted.", "success");
        } else {
          Swal.fire("Error!", "Failed to delete post.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", "An error occurred while deleting.", "error");
      }
    }
  };

  const handleLike = async (postId) => {
    const data = await likePost(postId, token);
    console.log(data);
    setTriggerFetch(!triggerFetch);
  };

  const handleDislike = async (postId) => {
    const data = await dislikePost(postId, token);
    console.log(data);
    setTriggerFetch(!triggerFetch);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!cookies.currentUser) {
        setPosts([]);
        return;
      }

      try {
        const data = await getPostByUserId(cookies.currentUser._id);
        setPosts(data.map((post) => ({ ...post })));
        console.log(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, [triggerFetch, cookies.currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return; // Prevent fetching if token is missing

      try {
        const response = await getUsers(token);
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleFollow = async (userId) => {
    try {
      await followUser(userId, token);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? { ...user, followers: [...user.followers, currentUser._id] }
            : user
        )
      );
      // Fetch the updated posts after following a user
      const updatedPosts = await getPostByUserId(cookies.currentUser._id);
      setPosts(updatedPosts);
      Swal.fire("Success!", "You are now following this user.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to follow user.", "error");
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await unfollowUser(userId, token);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                followers: user.followers.filter(
                  (id) => id !== currentUser._id
                ),
              }
            : user
        )
      );
      const updatedPosts = await getPostByUserId(cookies.currentUser._id);
      setPosts(updatedPosts);
      Swal.fire("Success!", "You have unfollowed this user.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to unfollow user.", "error");
    }
  };

  const handleBookmark = async (postId) => {
    try {
      const response = await addToBookmark(postId, currentUser._id, token);
      if (response) {
        Swal.fire("Success!");
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        error.response?.data?.error || "Could not bookmark.",
        "error"
      );
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.topic?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortCriteria === "mostLikes") {
      return b.likes.length - a.likes.length;
    } else if (sortCriteria === "mostDislikes") {
      return b.dislikes.length - a.dislikes.length;
    } else {
      return 0;
    }
  });

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header />
      <Grid container sx={{ height: "calc(100vh - 64px)", width: "100%" }}>
        {/* Left Sidebar - Users */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
            height: { xs: "auto", md: "100%" },
            order: { xs: 1, md: 1 },
          }}
        >
          <Typography variant="h6" gutterBottom>
            All Users
          </Typography>

          {users?.map((user) => {
            if (currentUser?._id !== user._id) {
              return (
                <Box
                  key={user._id}
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Typography sx={{ flex: 1 }}>{user.name}</Typography>
                  <Button
                    variant={
                      user.followers.includes(currentUser._id)
                        ? "outlined"
                        : "contained"
                    }
                    color="primary"
                    size="small"
                    onClick={() => {
                      user.followers.includes(currentUser._id)
                        ? handleUnfollow(user._id)
                        : handleFollow(user._id);
                      setTriggerFetch(!triggerFetch);
                    }}
                  >
                    {user.followers.includes(currentUser._id)
                      ? "Unfollow"
                      : "Follow"}
                  </Button>
                </Box>
              );
            }
          })}
        </Grid>

        {/* Main Content - Posts */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            padding: 2,
            overflowY: "auto",
            height: { xs: "auto", md: "100%" },
            order: { xs: 3, md: 2 }, // Order for mobile and desktop
          }}
        >
          <Box
            sx={{ display: "flex", gap: 2, marginBottom: 2, flexWrap: "wrap" }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search posts ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                maxWidth: "500px",
                marginBottom: { xs: "8px", sm: "0" }, // Stack on small screens
              }}
            />
            <FormControl sx={{ minWidth: 120, flex: 1 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="mostLikes">Most Likes</MenuItem>
                <MenuItem value="mostDislikes">Most Dislikes</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
              <Card
                key={post._id}
                sx={{
                  marginBottom: 2,
                  backgroundColor: "background.paper",
                  boxShadow: 3,
                  padding: { xs: 1, sm: 2 }, // Add padding for mobile
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", marginTop: 2 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Created by {post.user?.name || "Unknown User"}
                  </Typography>
                </Box>
                <CardContent sx={{ position: "relative" }}>
                  <Typography variant="h6" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.topic.name}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      onClick={() => handleLike(post._id)}
                      color={
                        post.likes?.includes(currentUser._id)
                          ? "primary"
                          : "default"
                      }
                    >
                      <ThumbUp />
                    </IconButton>
                    <Typography>{post.likes?.length}</Typography>
                    <IconButton
                      onClick={() => handleDislike(post._id)}
                      color={
                        post.dislikes?.includes(currentUser._id)
                          ? "error"
                          : "default"
                      }
                    >
                      <ThumbDown />
                    </IconButton>
                    <Typography>{post.dislikes?.length}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {isUserLoggedIn(cookies) &&
                    post.user?._id === currentUser._id ? (
                      <>
                        <IconButton
                          component={Link}
                          to={`/posts/${post._id}/edit`}
                          sx={{ fontSize: "1.5rem" }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(post._id)}
                          sx={{ fontSize: "1.5rem" }}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    ) : null}
                    {isUserLoggedIn(cookies) ? (
                      <IconButton
                        onClick={() => handleBookmark(post._id)}
                        color={
                          currentUser.bookmarks?.includes(post._id)
                            ? "success"
                            : "default"
                        }
                        sx={{ fontSize: "1.5rem" }}
                      >
                        <Bookmark />
                      </IconButton>
                    ) : null}
                  </Box>
                </Box>
              </Card>
            ))
          ) : (
            <Typography
              variant="h6"
              align="center"
              sx={{ marginTop: 4, color: "text.secondary" }}
            >
              No posts found
            </Typography>
          )}
        </Grid>

        {/* Right Sidebar - User Info */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            backgroundColor: "background.paper",
            padding: 2,
            height: { xs: "auto", md: "100%" },
            order: { xs: 2, md: 3 },
            textAlign: "center",
          }}
        >
          {isUserLoggedIn(cookies) ? (
            <>
              <Typography variant="h6">{currentUser.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {currentUser.email}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                sx={{ marginTop: 2 }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={
                  location.pathname === "/login" ? "contained" : "outlined"
                }
                color="primary"
                component={Link}
                to="/login"
                sx={{ marginBottom: 1, width: "100%" }}
              >
                Login
              </Button>
              <Button
                variant={
                  location.pathname === "/signup" ? "contained" : "outlined"
                }
                color="primary"
                component={Link}
                to="/signup"
                sx={{ marginBottom: 1, width: "100%" }}
              >
                Sign Up
              </Button>
            </>
          )}
          {isAdmin(cookies) && (
            <>
              <Button
                component={Link}
                to="/topics/new"
                variant="contained"
                color="success"
                sx={{ marginTop: 2, width: "100%" }}
              >
                Add New Topic
              </Button>
              <Button
                component={Link}
                to="/adminPosts"
                variant="contained"
                color="success"
                sx={{ marginTop: 2, width: "100%" }}
              >
                All Posts
              </Button>
            </>
          )}
          {isUserLoggedIn(cookies) && (
            <>
              <Button
                component={Link}
                to="/posts/new"
                variant="contained"
                color="success"
                sx={{ marginTop: 1, width: "100%" }}
              >
                Add New
              </Button>
              <Button
                component={Link}
                to="/bookmark"
                variant="contained"
                color="success"
                sx={{ marginTop: 1, width: "100%" }}
              >
                Bookmark
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
