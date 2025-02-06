import Header from "../../components/Header";
import { Typography, TextField, Box, Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

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
        text: "Category added successfully",
        icon: "success",
      });
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this topic?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
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
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to delete topic",
          icon: "error",
        });
      }
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
            Topics
          </Typography>
          <Box mb={2} sx={{ display: "flex" }} gap={1}>
            <TextField
              label="Topic Name"
              required
              fullWidth
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            {isAdmin(cookies) && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleFormSubmit}
              >
                ADD
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="topics table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topics.length > 0 ? (
              topics.map((topic) => (
                <TableRow key={topic._id}>
                  <TableCell>{topic.name}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/topics/${topic._id}/edit`}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(topic._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No topics found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
export default TopicAddNew;
