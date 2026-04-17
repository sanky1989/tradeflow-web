import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Dashboard = () => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TradeFlow Dashboard
          </Typography>

          <Typography sx={{ mr: 2 }}>
            {user?.FullName}
          </Typography>

          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Typography variant="h4">Welcome 👋</Typography>
        <Typography sx={{ mt: 2 }}>
          You are successfully logged in.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;