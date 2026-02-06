import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { getBookmark } from "../../utils/api_bookmark";
import { addToBookmark } from "../../utils/api_bookmark";
import {
  isUserLoggedIn,
  getCurrentUser,
  getUserToken,
} from "../../utils/api_user";

import {
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  IconButton,
  Container,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Bookmark,
  BookmarkBorder,
  ArrowBack,
  ThumbUp,
  ThumbDown,
} from "@mui/icons-material";

function BookmarkPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [cookies] = useCookies(["userToken"]);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser(cookies);
  const token = getUserToken(cookies);

  useEffect(() => {
    if (!isUserLoggedIn(cookies)) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    getBookmark(token)
      .then((data) => {
        setBookmarks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookmarks", error);
        setLoading(false);
      });
  }, [cookies, triggerFetch]);

  // Bookmark post handler
  const handleBookmark = async (postId) => {
    try {
      const response = await addToBookmark(postId, currentUser._id, token);
      if (response) {
        Swal.fire({
          title: "Success!",
          text: "Bookmark removed successfully.",
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
        text: error.response?.data?.error || "Could not remove bookmark.",
        icon: "error",
        background: "#1E1E1E",
        color: "#E1E1E1",
        confirmButtonColor: "#BB86FC",
      });
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
              🔖 My Bookmarks
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Posts you've saved for later
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Bookmark sx={{ color: "#FFD700", fontSize: "2.5rem" }} />
            <Box>
              <Typography
                variant="h3"
                sx={{ color: "#BB86FC", fontWeight: 700 }}
              >
                {bookmarks.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bookmarked Posts
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Bookmarks Grid */}
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
            <Typography color="text.secondary">Loading bookmarks...</Typography>
          </Box>
        ) : bookmarks.length > 0 ? (
          <Grid container spacing={3}>
            {bookmarks.map((bookmark) => (
              <Grid item xs={12} key={bookmark._id}>
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
                        {bookmark.user?.name?.charAt(0).toUpperCase() || "U"}
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight={600}>
                          {bookmark.user?.name || "Unknown User"}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() => handleBookmark(bookmark._id)}
                      sx={{
                        color: "#FFD700",
                        "&:hover": {
                          background: "rgba(255, 215, 0, 0.15)",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Bookmark fontSize="large" />
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
                      {bookmark.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ marginBottom: 2, lineHeight: 1.7 }}
                    >
                      {bookmark.description}
                    </Typography>

                    {/* Topic Tag */}
                    <Chip
                      label={`#${bookmark.topic?.name || "No Topic"}`}
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
                          {bookmark.likes?.length || 0}
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
                          {bookmark.dislikes?.length || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          dislikes
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              padding: 6,
              borderRadius: 3,
              background: "rgba(187, 134, 252, 0.05)",
              border: "1px dashed rgba(187, 134, 252, 0.3)",
            }}
          >
            <BookmarkBorder
              sx={{
                fontSize: "4rem",
                color: "text.secondary",
                marginBottom: 2,
              }}
            />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ marginBottom: 1 }}
            >
              📭 No bookmarks yet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginBottom: 3 }}
            >
              Start bookmarking posts you'd like to save for later!
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{
                padding: "10px 32px",
                fontWeight: 600,
              }}
            >
              Explore Posts
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default BookmarkPage;
