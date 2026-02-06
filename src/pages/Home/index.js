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
import { addToBookmark, getBookmark } from "../../utils/api_bookmark";
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
  const [userBookmarks, setUserBookmarks] = useState([]);
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
    const fetchBookmarks = async () => {
      if (!token) return;

      try {
        const bookmarks = await getBookmark(token);
        console.log("Raw bookmarks response:", bookmarks);
        // bookmarks is already an array of posts, not an object with posts property
        const bookmarkedPostIds =
          bookmarks?.map((post) => post._id.toString()) || [];
        setUserBookmarks(bookmarkedPostIds);
        console.log("Fetched bookmarks:", bookmarkedPostIds);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };

    fetchBookmarks();
  }, [triggerFetch, token]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;

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
            : user,
        ),
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
                  (id) => id !== currentUser._id,
                ),
              }
            : user,
        ),
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
      const isBookmarked = userBookmarks.includes(postId);
      const response = await addToBookmark(postId, currentUser._id, token);
      if (response) {
        // Check if the post is in the response to determine if it was added or removed
        const stillBookmarked = response.posts?.some(
          (post) => post._id === postId,
        );

        Swal.fire({
          title: "Success!",
          text: stillBookmarked
            ? "Bookmark added successfully."
            : "Bookmark removed successfully.",
          icon: "success",
          background: "#1E1E1E",
          color: "#E1E1E1",
          confirmButtonColor: "#BB86FC",
          timer: 1500,
        });
        setTriggerFetch(!triggerFetch);
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Could not update bookmark.",
        icon: "error",
        background: "#1E1E1E",
        color: "#E1E1E1",
        confirmButtonColor: "#BB86FC",
      });
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.topic?.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "background.default",
      }}
    >
      <Header />
      <Grid container sx={{ height: "calc(100vh - 64px)", width: "100%" }}>
        {/* Left Sidebar - Users */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            background: "linear-gradient(135deg, #1E1E1E 0%, #252525 100%)",
            padding: 3,
            height: { xs: "auto", md: "100%" },
            order: { xs: 1, md: 1 },
            overflowY: "auto",
            borderRight: "1px solid rgba(187, 134, 252, 0.1)",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 700,
              marginBottom: 3,
              color: "#BB86FC",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            👥 All Users
          </Typography>

          {users?.map((user) => {
            if (currentUser?._id !== user._id) {
              return (
                <Box
                  key={user._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    padding: 2,
                    borderRadius: 2,
                    background: "rgba(187, 134, 252, 0.05)",
                    border: "1px solid rgba(187, 134, 252, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(187, 134, 252, 0.1)",
                      transform: "translateX(5px)",
                    },
                  }}
                >
                  <Typography sx={{ flex: 1, fontWeight: 500 }}>
                    {user.name}
                  </Typography>
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
                    sx={{ minWidth: "90px" }}
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
            padding: 3,
            overflowY: "auto",
            height: { xs: "auto", md: "100%" },
            order: { xs: 3, md: 2 },
            backgroundColor: "background.default",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              marginBottom: 3,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="🔍 Search posts ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                minWidth: 160,
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  background: "rgba(187, 134, 252, 0.05)",
                },
              }}
            />
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
                label="Sort By"
                sx={{
                  background: "rgba(187, 134, 252, 0.05)",
                }}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="mostLikes">👍 Most Likes</MenuItem>
                <MenuItem value="mostDislikes">👎 Most Dislikes</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
              <Card
                key={post._id}
                sx={{
                  marginBottom: 3,
                  background:
                    "linear-gradient(135deg, #1E1E1E 0%, #252525 100%)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                  padding: { xs: 1, sm: 2 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    paddingBottom: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 2,
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      color: "#000",
                    }}
                  >
                    {post.user?.name?.charAt(0).toUpperCase() || "U"}
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>
                      {post.user?.name || "Unknown User"}
                    </Typography>
                  </Box>
                </Box>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: "#E1E1E1",
                      marginBottom: 1,
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: 2 }}
                  >
                    {post.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: 2,
                      background: "rgba(3, 218, 198, 0.15)",
                      border: "1px solid rgba(3, 218, 198, 0.3)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#03DAC6",
                        fontWeight: 600,
                      }}
                    >
                      #{post.topic.name}
                    </Typography>
                  </Box>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 2,
                    paddingTop: 0,
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background: "rgba(187, 134, 252, 0.1)",
                        padding: "6px 12px",
                        borderRadius: 2,
                      }}
                    >
                      <IconButton
                        onClick={() => handleLike(post._id)}
                        size="small"
                        color={
                          post.likes?.includes(currentUser._id)
                            ? "primary"
                            : "default"
                        }
                      >
                        <ThumbUp />
                      </IconButton>
                      <Typography fontWeight={600}>
                        {post.likes?.length}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        background: "rgba(207, 102, 121, 0.1)",
                        padding: "6px 12px",
                        borderRadius: 2,
                      }}
                    >
                      <IconButton
                        onClick={() => handleDislike(post._id)}
                        size="small"
                        color={
                          post.dislikes?.includes(currentUser._id)
                            ? "error"
                            : "default"
                        }
                      >
                        <ThumbDown />
                      </IconButton>
                      <Typography fontWeight={600}>
                        {post.dislikes?.length}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {isUserLoggedIn(cookies) &&
                    post.user?._id === currentUser._id ? (
                      <>
                        <IconButton
                          component={Link}
                          to={`/posts/${post._id}/edit`}
                          sx={{
                            color: "#03DAC6",
                            "&:hover": {
                              background: "rgba(3, 218, 198, 0.1)",
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(post._id)}
                          sx={{
                            color: "#CF6679",
                            "&:hover": {
                              background: "rgba(207, 102, 121, 0.1)",
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </>
                    ) : null}
                    {isUserLoggedIn(cookies) ? (
                      <IconButton
                        onClick={() => {
                          console.log("Clicking bookmark for post:", post._id);
                          console.log("Current bookmarks:", userBookmarks);
                          console.log("Post ID as string:", String(post._id));
                          console.log(
                            "Is bookmarked:",
                            userBookmarks.includes(String(post._id)),
                          );
                          handleBookmark(post._id);
                        }}
                        sx={{
                          color: userBookmarks.includes(String(post._id))
                            ? "#FFD700"
                            : "#A0A0A0",
                          "&:hover": {
                            background: "rgba(255, 215, 0, 0.1)",
                          },
                        }}
                      >
                        <Bookmark />
                      </IconButton>
                    ) : null}
                  </Box>
                </Box>
              </Card>
            ))
          ) : (
            <Box
              sx={{
                marginTop: 8,
                textAlign: "center",
                padding: 4,
                borderRadius: 3,
                background: "rgba(187, 134, 252, 0.05)",
                border: "1px dashed rgba(187, 134, 252, 0.3)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                }}
              >
                📭 No posts found
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginTop: 1 }}
              >
                Start following users to see their posts!
              </Typography>
            </Box>
          )}
        </Grid>

        {/* Right Sidebar - User Info */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            background: "linear-gradient(135deg, #1E1E1E 0%, #252525 100%)",
            padding: 3,
            height: { xs: "auto", md: "100%" },
            order: { xs: 2, md: 3 },
            textAlign: "center",
            borderLeft: "1px solid rgba(187, 134, 252, 0.1)",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {isUserLoggedIn(cookies) ? (
            <>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "#000",
                  boxShadow: "0 4px 20px rgba(187, 134, 252, 0.4)",
                }}
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  marginBottom: 0.5,
                }}
              >
                {currentUser.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: 3 }}
              >
                {currentUser.email}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                sx={{
                  marginBottom: 2,
                  borderRadius: 2,
                  padding: "10px",
                  fontWeight: 600,
                  "&:hover": {
                    background: "rgba(207, 102, 121, 0.1)",
                  },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
              <Box
                sx={{
                  borderTop: "1px solid rgba(187, 134, 252, 0.2)",
                  paddingTop: 2,
                  marginTop: 2,
                }}
              />
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 2,
                  fontWeight: 700,
                }}
              >
                Welcome to Gigglit
              </Typography>
              <Button
                variant={
                  location.pathname === "/login" ? "contained" : "outlined"
                }
                color="primary"
                component={Link}
                to="/login"
                fullWidth
                sx={{ marginBottom: 2 }}
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
                fullWidth
                sx={{ marginBottom: 3 }}
              >
                Sign Up
              </Button>
              <Box
                sx={{
                  borderTop: "1px solid rgba(187, 134, 252, 0.2)",
                  paddingTop: 2,
                  marginTop: 2,
                }}
              />
            </>
          )}
          {isAdmin(cookies) && (
            <Box sx={{ marginTop: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  marginBottom: 2,
                  color: "#03DAC6",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                🛠️ ADMIN TOOLS
              </Typography>
              <Button
                component={Link}
                to="/topics/new"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ marginBottom: 1.5 }}
              >
                Add New Topic
              </Button>
              <Button
                component={Link}
                to="/adminPosts"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ marginBottom: 2 }}
              >
                All Posts
              </Button>
              <Box
                sx={{
                  borderTop: "1px solid rgba(187, 134, 252, 0.2)",
                  paddingTop: 2,
                  marginTop: 2,
                }}
              />
            </Box>
          )}
          {isUserLoggedIn(cookies) && (
            <Box sx={{ marginTop: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  marginBottom: 2,
                  color: "#BB86FC",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                ✨ QUICK ACTIONS
              </Typography>
              <Button
                component={Link}
                to="/posts/new"
                variant="contained"
                color="success"
                fullWidth
                sx={{ marginBottom: 1.5 }}
              >
                ✍️ Create Post
              </Button>
              <Button
                component={Link}
                to="/bookmark"
                variant="contained"
                color="success"
                fullWidth
              >
                🔖 My Bookmarks
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
