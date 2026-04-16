import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const ModalConfigPaymentTerms = ({ handleClose }) => {
  const STORAGE_KEY = "batchingplant_payment_terms";
  
  const [terms, setTerms] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        { name: "Net 15", days: "15" },
        { name: "Net 30", days: "30" },
        { name: "Net 45", days: "45" },
        { name: "Net 60", days: "60" },
        { name: "Net 80", days: "80" },
        { name: "", days: "" }, // Start with one empty row as shown in sample
      ];
    } catch {
      return [{ name: "", days: "" }];
    }
  });

  const handleAddRow = () => {
    setTerms([...terms, { name: "", days: "" }]);
  };

  const handleUpdate = (index, field, value) => {
    const updated = [...terms];
    updated[index][field] = value;
    setTerms(updated);
  };

  const handleSave = () => {
    // Filter out empty rows before saving if needed, but here we'll save what the user entered
    localStorage.setItem(STORAGE_KEY, JSON.stringify(terms.filter(t => t.name.trim() !== "")));
    handleClose();
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      height: "38px",
      fontSize: "14px",
      borderRadius: "4px",
      "& fieldset": { borderColor: "#ddd" },
    },
    "& .MuiInputBase-input": { padding: "0 14px" }
  };

  return (
    <Box sx={{ bgcolor: "#fff", display: "flex", flexDirection: "column", height: "100%", maxHeight: "600px" }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontSize: "1.4rem", fontWeight: 500, color: "#222" }}>Config Payment Terms</Typography>
        <IconButton onClick={handleClose} size="small"><CloseIcon /></IconButton>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: "30px 40px", flexGrow: 1, overflowY: "auto" }}>
        {/* Table Headers */}
        <Grid container sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#666", letterSpacing: "0.5px" }}>TERM NAME</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#666", letterSpacing: "0.5px" }}>NUMBER OF DAYS</Typography>
          </Grid>
        </Grid>

        {/* Rows */}
        {terms.map((term, index) => (
          <Grid container key={index} spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                value={term.name} 
                onChange={(e) => handleUpdate(index, "name", e.target.value)}
                sx={inputSx}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField 
                fullWidth 
                value={term.days} 
                onChange={(e) => handleUpdate(index, "days", e.target.value)}
                sx={inputSx}
              />
            </Grid>
          </Grid>
        ))}

        {/* Add New Button */}
        <Button 
          startIcon={<AddCircleIcon sx={{ fontSize: "20px" }} />}
          onClick={handleAddRow}
          sx={{ 
            color: "#408DFB", 
            textTransform: "none", 
            fontSize: "1rem", 
            fontWeight: 500, 
            mt: 1,
            "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
          }}
        >
          Add New
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={handleClose}
          sx={{ bgcolor: "#4d91ff", px: 4, textTransform: "none", fontWeight: 600, boxShadow: "none" }}
        >
          CANCEL
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          sx={{ bgcolor: "#4d91ff", px: 4, textTransform: "none", fontWeight: 600, boxShadow: "none" }}
        >
          SAVE
        </Button>
      </Box>
    </Box>
  );
};

export default ModalConfigPaymentTerms;
