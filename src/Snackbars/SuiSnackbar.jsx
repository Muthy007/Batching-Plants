import React from "react";
import { Snackbar, Slide, Box, Typography, IconButton } from "@mui/material";
import { CheckCircle, Error, Info, Warning, Close } from "@mui/icons-material";

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const iconMap = {
  success: <CheckCircle />,
  error: <Error />,
  info: <Info />,
  warning: <Warning />,
};

const SuiSnackbar = ({
  open,
  color,
  icon,
  title,
  content,
  dateTime,
  close,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={close}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      TransitionComponent={SlideTransition}
      sx={{ minWidth: "400px", maxWidth: "100%" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderRadius: "4px",
          backgroundColor: color, 
          border: "5px solid #FFFFFF", 
          color: "#000", 
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#4CAF50", 
            borderRadius: "8px", 
            height: "40px",
            width: "40px",
            marginRight: "12px",
          }}
        >
          <Box sx={{ color: "#FFFFFF" }}>{iconMap[icon] || iconMap.info}</Box>
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "16px" }}>
            {content}
          </Typography>
        </Box>

        <IconButton onClick={close} sx={{ color: "#000" }} aria-label="close">
          <Close />
        </IconButton>
      </Box>
    </Snackbar>
  );
};

export default SuiSnackbar;
