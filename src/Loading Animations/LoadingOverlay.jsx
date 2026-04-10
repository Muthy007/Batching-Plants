import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

const LoadingOverlay = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.7)", 
      zIndex: 9999, 
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ color: "#408DFB" }} />
      <Typography
        sx={{
          fontSize: "1rem",
          color: "#408DFB",
          textTransform: "uppercase",
          letterSpacing: 1,
          fontWeight: "600",
        }}
      >
        Processing...
      </Typography>
    </Box>
  </Box>
);

export default LoadingOverlay;
