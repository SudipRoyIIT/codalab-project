import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Error = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        textAlign="center"
        bgcolor="background.default"
      >
        <ErrorOutlineIcon style={{ fontSize: 120, color: "#FF6F61" }} />
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Typography variant="body1" gutterBottom>
          It looks like you took a wrong turn. Don’t worry... it happens to the
          best of us.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleHomeClick}
          sx={{ mt: 4 }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default Error;
