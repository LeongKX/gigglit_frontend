import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, TextField, Box, Button } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Swal from "sweetalert2";

import { editTopic, getTopic } from "../../utils/api";
import { isAdmin, getUserToken } from "../../utils/api_user";
import Header from "../../components/Header";

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
      Swal.fire("Please fill out all the required field");
    } else {
      const updatedTopic = await editTopic(id, name, token);
      if (updatedTopic) {
        Swal.fire("Topic has been edited successfully!");
        navigate("/topics/new");
      }
    }
  };

  return (
    <Card>
      <Header />
      <Card>
        {isAdmin(cookies) ? (
          <CardContent>
            <Typography variant="h4" align="center" mb={4}>
              Edit Topic
            </Typography>
            <Box mb={2}>
              <TextField
                label="Topic"
                required
                fullWidth
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
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
        ) : null}
      </Card>
    </Card>
  );
}
export default TopicEdit;
