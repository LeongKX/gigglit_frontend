import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Link from "@mui/material/Link";

import Header from "../../components/Header";
import { userSignup } from "../../utils/api_user";

function SignUp() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      Swal.fire("Please fill up all the fields");
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire("Your password does not match");
      return;
    }

    try {
      const userData = await userSignup(name, email, password);
      if (!userData) {
        Swal.fire("Signup failed. Please try again.");
        return;
      }

      setCookie("currentUser", userData, { maxAge: 60 * 60 * 24 * 30 });

      Swal.fire("You have successfully signed up. Happy shopping!");
      navigate("/");
    } catch (error) {
      Swal.fire("Signup failed. Please check your details and try again.");
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={handleFormSubmit}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            label="Name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Confirm
          </Button>
          <Typography variant="body2" align="center">
            Already a user?{" "}
            <Link href="/login" variant="body2">
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
export default SignUp;
