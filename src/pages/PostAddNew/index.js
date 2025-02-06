import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Typography, TextField, Box, Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import { addNewPost } from "../../utils/api";
import { useCookies } from "react-cookie";
import { getUserToken, isUserLoggedIn } from "../../utils/api_user";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { getTopics } from "../../utils/api";

function PostAddNew() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentUser"]);
  const token = getUserToken(cookies);
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
    getTopics().then((data) => {
      setTopics(data);
    });
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    //check for error
    if (!title || !description || !topic) {
      Swal.fire("Please fill out all the required fields");
    }

    //triger the API
    const newPostData = await addNewPost(title, description, topic, token);

    //check if the newProdcutsData exists or not
    if (newPostData) {
      //show success message
      Swal.fire("Product has been added successfully");
      //redirect back to home page
      navigate("/");
    }
  };

  //   const handleImageUpload = async (files) => {
  //     //trigger the upload API
  //     const { image_url = "" } = await uploadImage(files[0]);
  //     setImage(image_url);
  //   };

  return (
    <Card>
      <Header />
      <Card>
        <CardContent>
          <Button variant="h5" mb={4} LinkComponent={Link} to="/">
            Back
          </Button>
          <Typography variant="h4" align="center" mb={4}>
            Add New Post
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
            Submit
          </Button>
        </CardContent>
      </Card>
    </Card>
  );
}
export default PostAddNew;
