import React, { useState } from "react";
import {
  Typography,
  TextField,
  Autocomplete,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  InputAdornment,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const NewDeliveryChallan = ({ handleClose }) => {
  const [rows, setRows] = useState([{ id: 1, item: "", quantity: "1.00", unit: "unit" }]);
  const labelStyle = { fontSize: "13px", color: "#444", width: "160px", flexShrink: 0, fontWeight: 500 };
  const inputSx = {
    "& .MuiOutlinedInput-root": { height: "32px", fontSize: "13px", borderRadius: "2px", "& fieldset": { borderColor: "#dcdfe6" } },
    "& .MuiInputBase-input": { padding: "0 10px", height: "32px" }
  };

  const FormRow = ({ label, children, required }) => (
    <Box sx={{ display: "flex", alignItems: "center", mb: "14px" }}>
      <Typography sx={{ ...labelStyle, color: required ? "red" : "#444" }}>{label}</Typography>
      <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>{children}</Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", backgroundColor: "#fff" }}>
      <Box sx={{ 
        p: { xs: "10px 15px", md: "20px 30px" }, 
        borderBottom: "1px solid #eee", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        bgcolor: "#F9F9FB",
        minHeight: "75px",
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, fontWeight: "bold", color: "#333" }}>New Delivery Challan</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: "none", sm: "block" } }} />
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: { xs: "20px", md: "30px 50px" } }}>
        <Box sx={{ maxWidth: "800px" }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "14px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={{ ...labelStyle, color: "red" }}>Customer Name*</Typography>
            <Autocomplete options={[]} fullWidth renderInput={(params) => <TextField {...params} placeholder="Select Customer" sx={inputSx} />} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "14px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={{ ...labelStyle, color: "red" }}>Challan Number*</Typography>
            <TextField value="DC-000001" sx={{ ...inputSx, width: { xs: "100%", sm: "240px" } }} InputProps={{ endAdornment: <InputAdornment position="end"><SettingsIcon sx={{ fontSize: 16, color: "#999" }} /></InputAdornment> }} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "14px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={labelStyle}>Reference#</Typography>
            <TextField placeholder="Enter Reference" sx={{ ...inputSx, width: { xs: "100%", sm: "400px" } }} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "14px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={{ ...labelStyle, color: "red" }}>Challan Date*</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker defaultValue={dayjs()} slotProps={{ textField: { sx: { ...inputSx, width: { xs: "100%", sm: "180px" } } } }} />
            </LocalizationProvider>
          </Box>
        </Box>

        <Box sx={{ mt: 5 }}>
          <TableContainer sx={{ border: "1px solid #f0f0f0" }}>
            <Table sx={{ tableLayout: "fixed" }}>
              <TableHead sx={{ backgroundColor: "#F9F9FB" }}>
                <TableRow>
                  <TableCell sx={{ width: "50%", fontSize: "11px", fontWeight: 700 }}>ITEM DETAILS</TableCell>
                  <TableCell sx={{ width: "20%", fontSize: "11px", fontWeight: 700 }}>QUANTITY</TableCell>
                  <TableCell sx={{ width: "20%", fontSize: "11px", fontWeight: 700 }}>UNIT</TableCell>
                  <TableCell sx={{ width: "10%" }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell><Autocomplete options={[]} renderInput={(params) => <TextField {...params} placeholder="Select Item" sx={inputSx} />} /></TableCell>
                    <TableCell><TextField defaultValue="1.00" sx={inputSx} /></TableCell>
                    <TableCell><TextField defaultValue="unit" sx={inputSx} /></TableCell>
                    <TableCell><IconButton size="small"><CloseIcon sx={{ fontSize: 14 }} /></IconButton></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button startIcon={<AddIcon />} sx={{ mt: 1, textTransform: "none", fontSize: "13px", color: "#408DFB" }}>ADD ROW</Button>
        </Box>
      </Box>

      <Box sx={{ 
        p: "14px 20px", 
        borderTop: "1px solid #f0f0f0", 
        display: "flex", 
        gap: "10px", 
        bgcolor: "#F9F9FB",
        position: 'sticky',
        bottom: 0,
        zIndex: 10
      }}>
        <Button variant="contained" sx={{ backgroundColor: "#408DFB", height: "36px", fontSize: "14px", fontWeight: 600, textTransform: "none", px: 4 }}>Save</Button>
        <Button onClick={handleClose} variant="outlined" sx={{ height: "36px", fontSize: "14px", fontWeight: 600, textTransform: "none", px: 4, color: '#666', borderColor: '#ddd' }}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default NewDeliveryChallan;
