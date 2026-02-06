import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { LockOutlined } from "@mui/icons-material";

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
      Swal.fire({
        title: "Missing Information",
        text: "Please fill up all the fields",
        icon: "warning",
        background: "#1E1E1E",
        color: "#E1E1E1",
        confirmButtonColor: "#BB86FC",
      });
      return;
    }

    try {
      const userData = await userLogin(email, password);

      if (!userData) {
        Swal.fire({
          title: "Login Failed",
          text: "Invalid credentials, please try again.",
          icon: "error",
          background: "#1E1E1E",
          color: "#E1E1E1",
          confirmButtonColor: "#BB86FC",
        });
        return;
      }

      setCookie("currentUser", userData, {
        maxAge: 60 * 60 * 24 * 30,
      });

      Swal.fire({
        title: "Welcome Back!",
        text: "You have successfully logged in.",
        icon: "success",
        background: "#1E1E1E",
        color: "#E1E1E1",
        confirmButtonColor: "#BB86FC",
        timer: 1500,
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Login failed. Please check your credentials.",
        icon: "error",
        background: "#1E1E1E",
        color: "#E1E1E1",
        confirmButtonColor: "#BB86FC",
      });
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, sm: 4, md: 5 },
            maxWidth: 450,
            width: "100%",
            background: "linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)",
            border: "1px solid rgba(187, 134, 252, 0.2)",
            borderRadius: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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
                marginBottom: 2,
                boxShadow: "0 4px 20px rgba(187, 134, 252, 0.4)",
              }}
            >
              <LockOutlined sx={{ fontSize: 32, color: "#000" }} />
            </Box>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                marginBottom: 3,
                fontWeight: 700,
                background: "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome Back
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ width: "100%" }}
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
                sx={{ marginBottom: 2 }}
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
                sx={{ marginBottom: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  marginBottom: 2,
                  padding: "12px",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Sign In
              </Button>
              <Typography variant="body2" align="center" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  sx={{
                    color: "#BB86FC",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      color: "#E7B9FF",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
export default Login;
