import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Favorite } from "@mui/icons-material";

function Header() {
  return (
    <div>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)",
          borderBottom: "1px solid rgba(187, 134, 252, 0.2)",
        }}
      >
        <Toolbar sx={{ padding: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "0.5px",
              }}
            >
              GIGGLIT
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
