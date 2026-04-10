import React from "react";
import { Grid } from "@mui/material";
import { Helmet } from "react-helmet";
import Sidebar from "../Navbars/Sidebar";

const Home = ({ onLogout }) => {
  return (
    <Sidebar onLogout={onLogout}>
      <Grid container>
        <Helmet>
          <title>Home</title>
        </Helmet>
      </Grid>
    </Sidebar>
  );
};

export default Home;
