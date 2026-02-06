import {
  Typography,
  TextField,
  Box,
  Button,
  Container,
  Paper,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Header from "../../components/Header";
import Swal from "sweetalert2";
import { updatePost, getPost, getTopics } from "../../utils/api";
import { useCookies } from "react-cookie";
import { getUserToken, isUserLoggedIn } from "../../utils/api_user";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { ArrowBack, Edit, Save } from "@mui/icons-material";

function PostEdit() {
  const { id } = useParams();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if (!isUserLoggedIn(cookies)) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    getPost(id).then((postData) => {
      setTitle(postData.title);
      setDescription(postData.description);
      setTopic(postData.topic);
    });
  }, [id]);

  useEffect(() => {
    getTopics().then((data) => {
      setTopics(data);
    });
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // check for error
    if (!title || !description || !topic) {
      Swal.fire({
        title: "Missing Information",
        text: "Please fill out all the required fields",
        icon: "warning",
        background: "#1E1E1E",
        color: "#E1E1E1",
        confirmButtonColor: "#BB86FC",
      });
    } else {
      // trigger the API
      const updatedPost = await updatePost(
        id,
        title,
        description,
        topic,
        token,
      );

      if (updatedPost) {
        Swal.fire({
          title: "Success!",
          text: "Post has been updated successfully!",
          icon: "success",
          background: "#1E1E1E",
          color: "#E1E1E1",
          confirmButtonColor: "#BB86FC",
          timer: 1500,
        });
        navigate("/");
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header />
      <Container maxWidth="md" sx={{ paddingY: 4 }}>
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
              ✏️ Edit Post
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Update your post information
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

        {/* Form Card */}
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            background: "linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)",
            border: "1px solid rgba(187, 134, 252, 0.2)",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              marginBottom: 4,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(187, 134, 252, 0.4)",
              }}
            >
              <Edit sx={{ fontSize: 32, color: "#000" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Post Details
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleFormSubmit}>
            <Box sx={{ marginBottom: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ marginBottom: 1, color: "#BB86FC", fontWeight: 600 }}
              >
                Post Title *
              </Typography>
              <TextField
                required
                fullWidth
                placeholder="Enter post title..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(187, 134, 252, 0.05)",
                    fontSize: "1.1rem",
                  },
                }}
              />
            </Box>

            <Box sx={{ marginBottom: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ marginBottom: 1, color: "#BB86FC", fontWeight: 600 }}
              >
                Description *
              </Typography>
              <TextField
                required
                fullWidth
                multiline
                rows={6}
                placeholder="Update your post description..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(187, 134, 252, 0.05)",
                  },
                }}
              />
            </Box>

            <Box sx={{ marginBottom: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ marginBottom: 1, color: "#BB86FC", fontWeight: 600 }}
              >
                Topic *
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={topic}
                  onChange={(event) => {
                    setTopic(event.target.value);
                  }}
                  sx={{
                    background: "rgba(187, 134, 252, 0.05)",
                  }}
                >
                  {topics.map((topicItem) => {
                    return (
                      <MenuItem key={topicItem._id} value={topicItem._id}>
                        #{topicItem.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                paddingTop: 3,
                borderTop: "1px solid rgba(187, 134, 252, 0.1)",
              }}
            >
              <Button
                component={Link}
                to="/"
                variant="outlined"
                fullWidth
                sx={{
                  padding: "14px",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                startIcon={<Save />}
                sx={{
                  padding: "14px",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default PostEdit;
