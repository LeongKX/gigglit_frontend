import Header from "../../components/Header";
import {
  Typography,
  TextField,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Chip,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import {
  ArrowBack,
  Add,
  Edit,
  Delete,
  Category,
  TrendingUp,
} from "@mui/icons-material";

import { isAdmin, getUserToken } from "../../utils/api_user";
import { getTopics, addNewTopic, deleteTopic } from "../../utils/api";

function TopicAddNew() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);
  const [topics, setTopics] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!isAdmin(cookies)) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    getTopics().then((data) => {
      setTopics(data);
    });
  }, []);

  useEffect(() => {
    if (!isAdmin(cookies)) {
      navigate("/login");
    }
  }, [cookies, navigate]);

  const handleFormSubmit = async () => {
    if (!name) {
      Swal.fire({
        title: "Error",
        text: "Please fill out all the required fields",
        icon: "error",
        background: "#1E1E1E",
        color: "#E1E1E1",
        confirmButtonColor: "#BB86FC",
      });
      return;
    }
    const newTopicData = await addNewTopic(name, token);
    if (newTopicData) {
      const newData = await getTopics();
      setTopics(newData);
      setName("");
      Swal.fire({
        title: "Success",
        text: "Topic added successfully",
        icon: "success",
        background: "#1E1E1E",
        color: "#E1E1E1",
        confirmButtonColor: "#BB86FC",
        timer: 1500,
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this topic?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#CF6679",
      cancelButtonColor: "#BB86FC",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#1E1E1E",
      color: "#E1E1E1",
    });
    if (confirmed.isConfirmed) {
      const deleted = await deleteTopic(id, token);
      if (deleted) {
        const latestTopics = await getTopics();
        setTopics(latestTopics);
        Swal.fire({
          title: "Deleted!",
          text: "Topic deleted successfully",
          icon: "success",
          background: "#1E1E1E",
          color: "#E1E1E1",
          confirmButtonColor: "#BB86FC",
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to delete topic",
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
              📚 Topic Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage discussion topics
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

        {/* Add New Topic Card */}
        <Card
          sx={{
            marginBottom: 4,
            background: "linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)",
            border: "1px solid rgba(187, 134, 252, 0.2)",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ padding: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                marginBottom: 3,
              }}
            >
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
                  boxShadow: "0 4px 20px rgba(187, 134, 252, 0.4)",
                }}
              >
                <Add sx={{ color: "#000", fontSize: "1.8rem" }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Add New Topic
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Topic Name"
                required
                fullWidth
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter topic name..."
                sx={{
                  flex: 1,
                  minWidth: "250px",
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(187, 134, 252, 0.05)",
                  },
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleFormSubmit();
                  }
                }}
              />
              {isAdmin(cookies) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFormSubmit}
                  startIcon={<Add />}
                  sx={{
                    padding: "12px 32px",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  Add Topic
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

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
            <TrendingUp sx={{ color: "#03DAC6", fontSize: "2.5rem" }} />
            <Box>
              <Typography
                variant="h3"
                sx={{ color: "#BB86FC", fontWeight: 700 }}
              >
                {topics.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Topics Available
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* Topics Grid */}
        {topics.length > 0 ? (
          <Grid container spacing={3}>
            {topics.map((topic) => (
              <Grid item xs={12} sm={6} md={4} key={topic._id}>
                <Card
                  sx={{
                    background:
                      "linear-gradient(135deg, #1E1E1E 0%, #252525 100%)",
                    border: "1px solid rgba(187, 134, 252, 0.1)",
                    borderRadius: 3,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "rgba(187, 134, 252, 0.3)",
                      boxShadow: "0 8px 24px rgba(187, 134, 252, 0.15)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ padding: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        marginBottom: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background:
                            "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Category sx={{ color: "#000", fontSize: "1.5rem" }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#E1E1E1",
                            wordBreak: "break-word",
                          }}
                        >
                          {topic.name}
                        </Typography>
                        <Chip
                          label={`#${topic.name.toLowerCase().replace(/\s+/g, "")}`}
                          size="small"
                          sx={{
                            marginTop: 1,
                            background: "rgba(3, 218, 198, 0.15)",
                            border: "1px solid rgba(3, 218, 198, 0.3)",
                            color: "#03DAC6",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        marginTop: 3,
                        paddingTop: 2,
                        borderTop: "1px solid rgba(187, 134, 252, 0.1)",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/topics/${topic._id}/edit`}
                        startIcon={<Edit />}
                        fullWidth
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(topic._id)}
                        startIcon={<Delete />}
                        fullWidth
                        sx={{
                          fontWeight: 600,
                          "&:hover": {
                            background: "rgba(207, 102, 121, 0.1)",
                          },
                        }}
                      >
                        Delete
                      </Button>
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
            <Category
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
              📭 No topics found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start by adding your first topic above!
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
export default TopicAddNew;
