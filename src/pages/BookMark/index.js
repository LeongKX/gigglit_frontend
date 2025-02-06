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
} from "@mui/material";
import { Bookmark } from "@mui/icons-material";

const customScrollbarStyles = {
  "&::-webkit-scrollbar": { width: "8px" },
  "&::-webkit-scrollbar-track": { background: "#2b2b2b" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#555",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#777" },
};

function BookmarkPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [cookies] = useCookies(["userToken"]);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const currentUser = getCurrentUser(cookies);
  const token = getUserToken(cookies);

  useEffect(() => {
    if (!isUserLoggedIn(cookies)) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    if (!currentUser) return;
    getBookmark(token)
      .then((data) => {
        setBookmarks(data);
      })
      .catch((error) => console.error("Error fetching bookmarks", error));
  }, [cookies, triggerFetch]);

  // Bookmark post handler
  const handleBookmark = async (postId) => {
    try {
      const response = await addToBookmark(postId, currentUser._id, token);
      if (response) {
        Swal.fire("Success!", "Post bookmarked successfully.", "success");
        setTriggerFetch(!triggerFetch);
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        error.response?.data?.error || "Could not bookmark.",
        "error"
      );
    }
  };

  return (
    <Card>
      <Header />
      <Card>
        <CardContent>
          <Button variant="h5" mb={4} LinkComponent={Link} to="/">
            Back
          </Button>
          <Typography variant="h4" align="center" mb={4}>
            Bookmark
          </Typography>
        </CardContent>
      </Card>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          padding: 2,
          overflowY: "auto",
          height: "100%",
          ...customScrollbarStyles,
        }}
      >
        {bookmarks?.length > 0 ? (
          bookmarks?.map((bookmark) => (
            <Card
              key={bookmark._id}
              sx={{ marginBottom: 2, backgroundColor: "background.paper" }}
            >
              <CardContent sx={{ position: "relative" }}>
                <Typography variant="h6" gutterBottom>
                  {bookmark.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bookmark.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {bookmark.topic.name}
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
                <Box
                  sx={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isUserLoggedIn(cookies) ? (
                    <IconButton
                      onClick={() => handleBookmark(bookmark._id)}
                      color={
                        currentUser.bookmarks?.includes(bookmark._id)
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
    </Card>
  );
}

export default BookmarkPage;
