import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Container,
} from "@mui/material";
import Swal from "sweetalert2";
import {
  Delete,
  ArrowBack,
  ThumbUp,
  ThumbDown,
  Person,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

import Header from "../../components/Header";
import { getPosts, deletePost } from "../../utils/api";
import { isAdmin } from "../../utils/api_user";

function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["currentUser"]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin(cookies)) {
      navigate("/login");
      return;
    }

    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [cookies, navigate]);

  const handleDelete = async (postId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CF6679",
      cancelButtonColor: "#BB86FC",
      confirmButtonText: "Yes, delete it!",
      background: "#1E1E1E",
      color: "#E1E1E1",
    });

    if (confirmed.isConfirmed) {
      try {
        const deleted = await deletePost(postId, cookies.currentUser.token);
        if (deleted) {
          setPosts(posts.filter((post) => post._id !== postId));
          Swal.fire({
            title: "Deleted!",
            text: "The post has been deleted.",
            icon: "success",
            background: "#1E1E1E",
            color: "#E1E1E1",
            confirmButtonColor: "#BB86FC",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete the post.",
            icon: "error",
            background: "#1E1E1E",
            color: "#E1E1E1",
            confirmButtonColor: "#BB86FC",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "An error occurred while deleting.",
          icon: "error",
          background: "#1E1E1E",
          color: "#E1E1E1",
          confirmButtonColor: "#BB86FC",
        });
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header />
      <Container maxWidth="lg" sx={{ paddingY: 4 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 1,
              }}
            >
              🛠️ Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage all posts across the platform
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            startIcon={<ArrowBack />}
            sx={{
              borderRadius: 2,
              padding: "10px 24px",
              fontWeight: 600,
              borderColor: "#BB86FC",
              color: "#BB86FC",
              "&:hover": {
                borderColor: "#E7B9FF",
                background: "rgba(187, 134, 252, 0.1)",
              },
            }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Stats Card */}
        <Card
          sx={{
            marginBottom: 4,
            background: "linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)",
            border: "1px solid rgba(187, 134, 252, 0.2)",
            borderRadius: 3,
            padding: 3,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{ color: "#BB86FC", fontWeight: 700 }}
                >
                  {posts.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Posts
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{ color: "#03DAC6", fontWeight: 700 }}
                >
                  {new Set(posts.map((p) => p.user?._id)).size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="h3"
                  sx={{ color: "#81C784", fontWeight: 700 }}
                >
                  {new Set(posts.map((p) => p.topic?.name)).size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Topics
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>

        {/* Posts Section */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: "#BB86FC" }} size={60} />
            <Typography color="text.secondary">Loading posts...</Typography>
          </Box>
        ) : posts.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              padding: 6,
              borderRadius: 3,
              background: "rgba(187, 134, 252, 0.05)",
              border: "1px dashed rgba(187, 134, 252, 0.3)",
            }}
          >
            <Typography variant="h6" color="text.secondary">
              📭 No posts available
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {posts.map((post) => (
              <Grid item xs={12} key={post._id}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #1E1E1E 0%, #252525 100%)",
                    border: "1px solid rgba(187, 134, 252, 0.1)",
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "rgba(187, 134, 252, 0.3)",
                      boxShadow: "0 8px 24px rgba(187, 134, 252, 0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {/* Post Header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: 2.5,
                      paddingBottom: 1.5,
                      borderBottom: "1px solid rgba(187, 134, 252, 0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
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
                        <Typography variant="caption" color="text.secondary">
                          {post.user?.email || "No email"}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() => handleDelete(post._id)}
                      sx={{
                        color: "#CF6679",
                        "&:hover": {
                          background: "rgba(207, 102, 121, 0.15)",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Delete fontSize="large" />
                    </IconButton>
                  </Box>

                  {/* Post Content */}
                  <CardContent sx={{ padding: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "#E1E1E1",
                        marginBottom: 1.5,
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ marginBottom: 2, lineHeight: 1.7 }}
                    >
                      {post.description}
                    </Typography>

                    {/* Topic Tag */}
                    <Chip
                      label={`#${post.topic?.name || "No Topic"}`}
                      sx={{
                        background: "rgba(3, 218, 198, 0.15)",
                        border: "1px solid rgba(3, 218, 198, 0.3)",
                        color: "#03DAC6",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        marginBottom: 2,
                      }}
                    />

                    {/* Post Stats */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 3,
                        marginTop: 2,
                        paddingTop: 2,
                        borderTop: "1px solid rgba(187, 134, 252, 0.1)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          padding: "6px 12px",
                          borderRadius: 2,
                          background: "rgba(187, 134, 252, 0.1)",
                        }}
                      >
                        <ThumbUp
                          sx={{ color: "#BB86FC", fontSize: "1.2rem" }}
                        />
                        <Typography fontWeight={600} color="#BB86FC">
                          {post.likes?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          likes
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          padding: "6px 12px",
                          borderRadius: 2,
                          background: "rgba(207, 102, 121, 0.1)",
                        }}
                      >
                        <ThumbDown
                          sx={{ color: "#CF6679", fontSize: "1.2rem" }}
                        />
                        <Typography fontWeight={600} color="#CF6679">
                          {post.dislikes?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          dislikes
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          padding: "6px 12px",
                          borderRadius: 2,
                          background: "rgba(129, 199, 132, 0.1)",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Posted on{" "}
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default AdminPosts;
