import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";

import Header from "../../components/Header";
import { userLogin } from "../../utils/api_user";

function Login() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["currentUser"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      Swal.fire("Please fill up all the fields");
      return;
    }

    try {
      const userData = await userLogin(email, password);

      if (!userData) {
        Swal.fire("Invalid credentials, please try again.");
        return;
      }

      setCookie("currentUser", userData, {
        maxAge: 60 * 60 * 24 * 30,
      });

      Swal.fire("You have successfully logged in.");
      navigate("/");
    } catch (error) {
      Swal.fire("Login failed. Please check your credentials.");
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
          Login
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
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
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
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account?{" "}
            <Link href="/signup" variant="body2">
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
export default Login;
