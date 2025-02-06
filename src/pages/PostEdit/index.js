import { Typography, TextField, Box, Button } from "@mui/material";
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
      Swal.fire("Please fill out all the required fields");
    } else {
      // trigger the API
      const updatedPost = await updatePost(
        id,
        title,
        description,
        topic,
        token
      );

      if (updatedPost) {
        Swal.fire("Product has been edited successfully!");
        navigate("/");
      }
    }
  };

  return (
    <>
      <Header />
      <Card>
        <CardContent>
          <Button variant="h5" mb={4} LinkComponent={Link} to="/">
            Back
          </Button>
          <Typography variant="h4" align="center" mb={4}>
            Edit Post
          </Typography>
          <Box mb={2}>
            <TextField
              label="Title"
              required
              fullWidth
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              required
              fullWidth
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Box>
          <Box mb={2}>
            <FormControl sx={{ minWidth: "100%" }}>
              <InputLabel id="demo-simple-select-label">Topic</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={topic}
                label="topic"
                onChange={(event) => {
                  console.log(event.target.value);
                  setTopic(event.target.value);
                }}
                sx={{
                  width: "100%",
                }}
              >
                {topics.map((topic) => {
                  return <MenuItem value={topic._id}>{topic.name}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFormSubmit}
          >
            Update
          </Button>
        </CardContent>
      </Card>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default PostEdit;
