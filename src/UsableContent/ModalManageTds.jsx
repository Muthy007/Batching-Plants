import {
  Autocomplete,
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
  Box,
  IconButton,
  Divider
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import SuiSnackbar from "../Snackbars/SuiSnackbar";

const ModalManageTds = (props) => {
  const [taxName, setTaxName] = useState("");
  const [rate, setRate] = useState("");
  const [tdsList, setTdsList] = useState([
    { id: 1, tax_name: "TDS 10%", rate: "10", section_name: "194J", st_date: "2024-04-01", en_date: "2025-03-31" },
  ]);
  const [sectionList, setSectionList] = useState([
    { id: 1, section: "Section 194J - Professional Fees" },
    { id: 2, section: "Section 194C - Contract Payments" },
  ]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSaveTDS = () => {
    if (taxName && rate && selectedSection) {
        setSnackbarMessage("TDS saved successfully!");
        setSnackbarOpen(true);
        setTimeout(() => props.handleManageTdsClose(), 1000);
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <SuiSnackbar open={snackbarOpen} color="#E8F5E9" icon="success" content={snackbarMessage} close={() => setSnackbarOpen(false)} />
      
      <Grid container sx={{ p: 2, borderBottom: "1px solid #eee", bgcolor: "#F9F9FB", alignItems: "center" }}>
        <Grid item xs={6}>
          <Typography variant="h6" fontWeight="bold">Manage TDS</Typography>
        </Grid>
        <Grid item xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={props.handleManageTdsClose}><CloseIcon /></IconButton>
        </Grid>
      </Grid>

      <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
        <Typography variant="subtitle2" gutterBottom sx={{ color: "#666" }}>Add New Tax</Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={4}>
            <TextField fullWidth size="small" label="Tax Name*" value={taxName} onChange={(e) => setTaxName(e.target.value)} />
          </Grid>
          <Grid item xs={4}>
            <TextField fullWidth size="small" label="Rate (%)*" value={rate} onChange={(e) => setRate(e.target.value)} />
          </Grid>
          <Grid item xs={4}>
            <Autocomplete
                size="small"
                options={sectionList}
                getOptionLabel={(o) => o.section}
                value={selectedSection}
                onChange={(_, v) => setSelectedSection(v)}
                renderInput={(params) => <TextField {...params} label="Section*" />}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleSaveTDS} sx={{ bgcolor: "#408DFB", textTransform: "none" }}>Save Tax</Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle2" gutterBottom sx={{ color: "#666" }}>Saved TDS Rates</Typography>
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee" }}>
            <Table size="small">
                <TableHead sx={{ bgcolor: "#fafafa" }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "0.8rem" }}>Tax Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "0.8rem" }}>Rate (%)</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "0.8rem" }}>Section</TableCell>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "0.8rem" }} align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tdsList.map((item) => (
                        <TableRow key={item.id} hover>
                            <TableCell sx={{ fontSize: "0.85rem" }}>{item.tax_name}</TableCell>
                            <TableCell sx={{ fontSize: "0.85rem" }}>{item.rate}</TableCell>
                            <TableCell sx={{ fontSize: "0.85rem" }}>{item.section_name}</TableCell>
                            <TableCell align="right">
                                <IconButton size="small"><EditOutlinedIcon fontSize="small" /></IconButton>
                                <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ModalManageTds;
