import React from "react";
import EmailView from "../EmailView/EmailView";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router";

const MailHome = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query parameters
  const params = new URLSearchParams(location.search);
  const organisationId = params.get("organisationId");
  const customerId = params.get("customerId");
  const organisation = params.get("organisation");

  console.log("Quote ID:", organisationId);
  console.log("Customer ID:", customerId);
  console.log("organisation:", organisation);
  return (
    <EmailView onLogout={onLogout}>
      <Box>
        {/* Header Section */}
        <Grid container sx={{ backgroundColor: "#21263C", padding: "16px" }}>
          <Grid item xs={8}>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold" }}>
              {organisation}
            </Typography>
          </Grid>
          <Grid item xs={4} textAlign="right">
            <Button
              variant="contained"
              sx={{ backgroundColor: "#fff", color: "#408DFB" }}
              onClick={() => {
                onLogout();
                navigate(
                  `/?organisationId=${organisationId}&organisation=${organisation}&customerId=${customerId}`
                );
              }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </Box>
    </EmailView>
  );
};

export default MailHome;
