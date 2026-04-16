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
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SuiSnackbar from "../Snackbars/SuiSnackbar";

const ModalEditableSeries = (props) => {
  const [view, setView] = useState("preferences"); // "preferences" | "edit"
  const [editDetails, setEditDetails] = useState([
    { module: "Journal", prefix: "JN-", starting_number: "0001", suffix: "-AL", preview: "JN-0001-AL" },
    { module: "Credit Note", prefix: "TN-", starting_number: "0001", suffix: "", preview: "TN-0001" },
    { module: "Customer Payment", prefix: "GN-", starting_number: "01", suffix: "", preview: "GN-01" },
    { module: "Purchase Order", prefix: "PO-", starting_number: "00001", suffix: "", preview: "PO-00001" },
    { module: "Sales Order", prefix: "SO-", starting_number: "00001", suffix: "", preview: "SO-00001" },
    { module: "Vendor Payment", prefix: "", starting_number: "1", suffix: "", preview: "1" },
    { module: "Retainer Invoice", prefix: "RET-", starting_number: "00001", suffix: "", preview: "RET-00001" },
    { module: "Vendor Credits", prefix: "DN-", starting_number: "00001", suffix: "", preview: "DN-00001" },
    { module: "Bill of Supply", prefix: "BOS-", starting_number: "000001", suffix: "", preview: "BOS-000001" },
    { module: "Debit Note", prefix: "CDN-", starting_number: "000001", suffix: "", preview: "CDN-000001" },
    { module: "Invoice", prefix: "2024/25-", starting_number: "001", suffix: "", preview: "2024/25-001" },
    { module: "Quote", prefix: "QT-", starting_number: "000001", suffix: "", preview: "QT-000001" },
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleFieldChange = (index, field, value) => {
    const newData = [...editDetails];
    newData[index][field] = value;
    
    // Update preview
    const { prefix, starting_number, suffix } = newData[index];
    let preview = `${prefix}${starting_number}`;
    if (suffix) preview += `${suffix}`;
    newData[index].preview = preview;
    
    setEditDetails(newData);
  };

  const handleSaveEditSeries = () => {
    setSnackbarMessage("Series configuration saved successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setTimeout(() => {
        setView("preferences");
    }, 800);
  };

  const renderPreferences = () => (
    <Box sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: 600, fontSize: "1.2rem", color: "#333" }}>Configure Invoice Number Preferences</Typography>
        <IconButton onClick={props.handleClosePrefix} size="small"><CloseIcon /></IconButton>
      </Box>
      <Box sx={{ p: 4, flexGrow: 1 }}>
        <Box sx={{ border: "1px solid #eee", borderRadius: "8px", p: 3, mb: 4, position: "relative", bgcolor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
           <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#111", mb: 0.5 }}>Associated Series</Typography>
           <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>Default Transaction Series</Typography>
           <Typography 
             onClick={() => setView("edit")}
             sx={{ position: "absolute", top: 24, right: 24, color: "#408DFB", fontSize: "0.85rem", cursor: "pointer", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}
           >
             Configure
           </Typography>
        </Box>
        <Divider sx={{ mb: 4 }} />
        <Typography sx={{ fontSize: "0.85rem", color: "#666", lineHeight: 1.6, maxWidth: "500px" }}>
            Your invoice numbers are set on auto-generate mode to save your time. Are you sure about changing this setting?
        </Typography>
      </Box>
    </Box>
  );

  const renderEditSeries = () => (
    <Box sx={{ p: 0, height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: 600, fontSize: "1.2rem", color: "#333" }}>Edit Series</Typography>
        <IconButton onClick={() => setView("preferences")} size="small"><CloseIcon /></IconButton>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 0 }}>
        <TableContainer component={Box} elevation={0}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {["MODULE", "PREFIX", "STARTING NUMBER", "SUFFIX", "PREVIEW"].map((head) => (
                  <TableCell key={head} sx={{ fontWeight: 700, bgcolor: "#fff", color: "#999", fontSize: "0.7rem", borderBottom: "1px solid #eee", py: 1.5 }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {editDetails.map((item, index) => (
                <TableRow key={index} sx={{ "&:hover": { bgcolor: "#fafafa" } }}>
                  <TableCell sx={{ fontSize: "0.85rem", color: "#333", borderBottom: "1px solid #f5f5f5", py: 1.5 }}>{item.module}</TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #f5f5f5" }}>
                    <TextField 
                      fullWidth size="small" value={item.prefix} 
                      onChange={(e) => handleFieldChange(index, "prefix", e.target.value)} 
                      sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.85rem", height: "34px" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #f5f5f5" }}>
                    <TextField 
                      fullWidth size="small" value={item.starting_number} 
                      onChange={(e) => handleFieldChange(index, "starting_number", e.target.value)} 
                      sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.85rem", height: "34px" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: "1px solid #f5f5f5" }}>
                    <TextField 
                      fullWidth size="small" value={item.suffix} 
                      onChange={(e) => handleFieldChange(index, "suffix", e.target.value)} 
                      sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.85rem", height: "34px" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.85rem", color: "#666", borderBottom: "1px solid #f5f5f5" }}>{item.preview}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ p: 2.5, borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", gap: 2, bgcolor: "#fff" }}>
        <Button onClick={() => setView("preferences")} sx={{ color: "#fff", bgcolor: "#408DFB", textTransform: "none", px: 4, borderRadius: "2px", "&:hover": { bgcolor: "#3378d8" } }}>CANCEL</Button>
        <Button variant="contained" onClick={handleSaveEditSeries} sx={{ bgcolor: "#408DFB", textTransform: "none", px: 4, borderRadius: "2px", fontWeight: 600, boxShadow: "none" }}>SAVE</Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "500px", display: "flex", flexDirection: "column" }}>
      <SuiSnackbar
        open={snackbarOpen}
        color={snackbarSeverity === "success" ? "#E8F5E9" : "#ff9999"}
        icon={snackbarSeverity}
        content={snackbarMessage}
        close={() => setSnackbarOpen(false)}
      />
      {view === "preferences" ? renderPreferences() : renderEditSeries()}
    </Box>
  );
};

export default ModalEditableSeries;
