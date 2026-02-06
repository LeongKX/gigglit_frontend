import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#BB86FC",
      light: "#E7B9FF",
      dark: "#9965D4",
      contrastText: "#000000",
    },
    secondary: {
      main: "#03DAC6",
      light: "#66FFF5",
      dark: "#00A896",
      contrastText: "#000000",
    },
    error: {
      main: "#CF6679",
      light: "#FF9AA2",
      dark: "#B00020",
    },
    warning: {
      main: "#FFB74D",
    },
    success: {
      main: "#81C784",
    },
    background: {
      default: "#0A0A0A",
      paper: "#1E1E1E",
    },
    text: {
      primary: "#E1E1E1",
      secondary: "#A0A0A0",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h4: {
      fontWeight: 700,
      fontSize: "2.125rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(187, 134, 252, 0.3)",
          },
        },
        contained: {
          background: "linear-gradient(45deg, #BB86FC 30%, #9965D4 90%)",
          "&:hover": {
            background: "linear-gradient(45deg, #E7B9FF 30%, #BB86FC 90%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: "none",
          border: "1px solid rgba(187, 134, 252, 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "rgba(187, 134, 252, 0.3)",
            boxShadow: "0 8px 24px rgba(187, 134, 252, 0.15)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover fieldset": {
              borderColor: "#BB86FC",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#BB86FC",
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.5)",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "scale(1.1)",
            backgroundColor: "rgba(187, 134, 252, 0.1)",
          },
        },
      },
    },
  },
});
