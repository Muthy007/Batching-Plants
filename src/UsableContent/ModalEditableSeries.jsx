import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SuiSnackbar from "../Snackbars/SuiSnackbar";

const ModalEditableSeries = (props) => {
  const [editDetails, setEditDetails] = useState([
    { module: "Quotes", prefix: "QT", starting_number: "001", suffix: "", preview: "QT-001" },
    { module: "Invoices", prefix: "INV", starting_number: "001", suffix: "", preview: "INV-001" },
    { module: "Sales Orders", prefix: "SO", starting_number: "001", suffix: "", preview: "SO-001" },
  ]);
  const [prefix, setPrefix] = useState([]);
  const [startingNumber, setStartingNumber] = useState([]);
  const [suffix, setSuffix] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    setPrefix(editDetails.map((item) => item.prefix));
    setStartingNumber(editDetails.map((item) => item.starting_number));
    setSuffix(editDetails.map((item) => item.suffix));
  }, [editDetails]);

  const handlePrefixChange = (index, newValue) => {
    const newPrefix = [...prefix];
    newPrefix[index] = newValue;
    setPrefix(newPrefix);
  };

  const handleStartingNumberChange = (index, newValue) => {
    const newStartingNumber = [...startingNumber];
    newStartingNumber[index] = newValue;
    setStartingNumber(newStartingNumber);
  };

  const handleSuffixChange = (index, newValue) => {
    const newSuffix = [...suffix];
    newSuffix[index] = newValue;
    setSuffix(newSuffix);
  };

  const handleSaveEditSeries = () => {
    setSnackbarMessage("Series updated successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setTimeout(() => {
        props.handleClosePrefix();
    }, 1000);
  };

  return (
    <Box sx={{ p: 0, bgcolor: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
      <SuiSnackbar
        open={snackbarOpen}
        color={snackbarSeverity === "success" ? "#E8F5E9" : "#ff9999"}
        icon={snackbarSeverity}
        content={snackbarMessage}
        close={() => setSnackbarOpen(false)}
      />
      <Grid container sx={{ p: 2, borderBottom: "1px solid #e6e6e6", bgcolor: "#F9F9FB", alignItems: "center" }}>
        <Grid item xs={6}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>Edit Series</Typography>
        </Grid>
        <Grid item xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CloseIcon sx={{ cursor: "pointer" }} onClick={props.handleClosePrefix} />
        </Grid>
      </Grid>

      <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}>
        <TableContainer component={Paper} elevation={0}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {["Module", "Prefix", "Starting Number", "Suffix", "Preview"].map((head) => (
                  <TableCell key={head} sx={{ fontWeight: "bold", bgcolor: "#f5f5f5", color: "#666", fontSize: "0.8rem" }}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {editDetails.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontSize: "0.9rem" }}>{item.module}</TableCell>
                  <TableCell><TextField size="small" value={prefix[index] || ""} onChange={(e) => handlePrefixChange(index, e.target.value)} /></TableCell>
                  <TableCell><TextField size="small" value={startingNumber[index] || ""} onChange={(e) => handleStartingNumberChange(index, e.target.value)} /></TableCell>
                  <TableCell><TextField size="small" value={suffix[index] || ""} onChange={(e) => handleSuffixChange(index, e.target.value)} /></TableCell>
                  <TableCell sx={{ fontSize: "0.9rem", color: "#408DFB" }}>{prefix[index]}-{startingNumber[index]}{suffix[index] ? "-" + suffix[index] : ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid #e6e6e6", display: "flex", justifyContent: "flex-end", gap: 2, bgcolor: "#F9F9FB" }}>
        <Button variant="outlined" onClick={props.handleClosePrefix} sx={{ textTransform: "none", px: 4 }}>Cancel</Button>
        <Button variant="contained" onClick={handleSaveEditSeries} sx={{ bgcolor: "#408DFB", textTransform: "none", px: 4 }}>Save</Button>
      </Box>
    </Box>
  );
};

export default ModalEditableSeries;
