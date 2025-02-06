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
} from "@mui/material";
import Swal from "sweetalert2";
import { Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";

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
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        const deleted = await deletePost(postId, cookies.currentUser.token);
        if (deleted) {
          setPosts(posts.filter((post) => post._id !== postId));
          Swal.fire("Deleted!", "The post has been deleted.", "success");
        } else {
          Swal.fire("Error!", "Failed to delete the post.", "error");
        }
      } catch (error) {
        Swal.fire("Error!", "An error occurred while deleting.", "error");
      }
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Button variant="h5" mb={4} LinkComponent={Link} to="/">
        Back
      </Button>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard - All Posts
      </Typography>

      {loading ? (
        <Typography>Loading posts...</Typography>
      ) : (
        posts.map((post) => (
          <Card key={post._id} sx={{ marginBottom: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Created by {post.user?.name || "Unknown User"}
              </Typography>
            </Box>
            <CardContent>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {post.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {post.topic.name}
              </Typography>
            </CardContent>
            <Box
              sx={{ padding: 2, display: "flex", justifyContent: "flex-end" }}
            >
              <IconButton
                onClick={() => handleDelete(post._id)}
                sx={{ fontSize: "1.5rem", color: "error.main" }}
              >
                <Delete />
              </IconButton>
            </Box>
          </Card>
        ))
      )}
    </Box>
  );
}

export default AdminPosts;
