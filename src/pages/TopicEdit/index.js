import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Typography,
  TextField,
  Box,
  Button,
  Container,
  Paper,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Swal from "sweetalert2";

import { editTopic, getTopic } from "../../utils/api";
import { isAdmin, getUserToken } from "../../utils/api_user";
import Header from "../../components/Header";
import { ArrowBack, Edit, Save, Category } from "@mui/icons-material";

function TopicEdit() {
  const { id } = useParams();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isAdmin(cookies)) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    getTopic(id).then((topicData) => {
      setName(topicData.name);
    });
  }, [id]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!name) {
      Swal.fire({
        title: "Missing Information",
        text: "Please fill out all the required field",
        icon: "warning",
        background: "#1E1E1E",
        color: "#E1E1E1",
        confirmButtonColor: "#BB86FC",
      });
    } else {
      const updatedTopic = await editTopic(id, name, token);
      if (updatedTopic) {
        Swal.fire({
          title: "Success!",
          text: "Topic has been updated successfully!",
          icon: "success",
          background: "#1E1E1E",
          color: "#E1E1E1",
          confirmButtonColor: "#BB86FC",
          timer: 1500,
        });
        navigate("/topics/new");
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Header />
      {isAdmin(cookies) ? (
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
                  background:
                    "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: 1,
                }}
              >
                ✏️ Edit Topic
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Update topic information
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/topics/new"
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
              Back to Topics
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
                  background:
                    "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(187, 134, 252, 0.4)",
                }}
              >
                <Category sx={{ fontSize: 32, color: "#000" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Topic Details
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleFormSubmit}>
              <Box sx={{ marginBottom: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ marginBottom: 1, color: "#BB86FC", fontWeight: 600 }}
                >
                  Topic Name *
                </Typography>
                <TextField
                  required
                  fullWidth
                  placeholder="Enter topic name..."
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "rgba(187, 134, 252, 0.05)",
                      fontSize: "1.1rem",
                    },
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleFormSubmit(e);
                    }
                  }}
                />
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
                  to="/topics/new"
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

          {/* Info Card */}
          <Card
            sx={{
              marginTop: 3,
              background:
                "linear-gradient(135deg, rgba(3, 218, 198, 0.1) 0%, rgba(187, 134, 252, 0.1) 100%)",
              border: "1px solid rgba(3, 218, 198, 0.2)",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ marginBottom: 2, fontWeight: 700 }}
              >
                💡 About Topics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Topics help organize posts into categories. Make sure the topic
                name is clear and descriptive so users can easily find relevant
                content.
              </Typography>
            </CardContent>
          </Card>
        </Container>
      ) : (
        <Container maxWidth="md" sx={{ paddingY: 8, textAlign: "center" }}>
          <Typography variant="h5" color="text.secondary">
            Access Denied
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ marginTop: 2 }}
          >
            You need admin privileges to edit topics.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            sx={{ marginTop: 3 }}
          >
            Go to Home
          </Button>
        </Container>
      )}
    </Box>
  );
}
export default TopicEdit;
