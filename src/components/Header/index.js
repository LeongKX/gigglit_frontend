import { AppBar, Toolbar, Typography } from "@mui/material";

function Header() {
  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: "#121212" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GIGGLIT
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
