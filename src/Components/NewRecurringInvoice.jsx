import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const NewRecurringInvoice = ({ handleClose }) => {
  const [items, setItems] = useState([{ id: Date.now(), item: null, quantity: 1, rate: 0, amount: 0 }]);
  const [profileName, setProfileName] = useState("");
  const [repeatEvery, setRepeatEvery] = useState(1);
  const [repeatUnit, setRepeatUnit] = useState("Month(s)");
  const [startDate, setStartDate] = useState(dayjs());

  const handleAddItem = () => setItems([...items, { id: Date.now(), item: null, quantity: 1, rate: 0, amount: 0 }]);
  
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.amount = updated.quantity * updated.rate;
        return updated;
      }
      return item;
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
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
          <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, fontWeight: "bold", color: "#333" }}>New Recurring Invoice</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />
            <IconButton onClick={handleClose}><CloseIcon /></IconButton>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 4 }}>
          <Grid container spacing={2} sx={{ maxWidth: 800 }}>
             <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1, sm: 0 } }}>
                <Typography sx={{ width: { xs: "100%", sm: 160 }, fontWeight: "600", color: "red", fontSize: "0.9rem" }}>Profile Name*</Typography>
                <TextField size="small" fullWidth value={profileName} onChange={(e) => setProfileName(e.target.value)} />
             </Grid>

             <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1, sm: 0 } }}>
                <Typography sx={{ width: { xs: "100%", sm: 160 }, fontWeight: "600", fontSize: "0.9rem" }}>Repeat Every</Typography>
                <Box sx={{ display: "flex", gap: 1, flexGrow: 1, width: "100%" }}>
                    <TextField size="small" type="number" value={repeatEvery} onChange={(e) => setRepeatEvery(e.target.value)} sx={{ width: 100 }} />
                    <Select size="small" value={repeatUnit} onChange={(e) => setRepeatUnit(e.target.value)} sx={{ width: 150 }}>
                        <MenuItem value="Week(s)">Week(s)</MenuItem>
                        <MenuItem value="Month(s)">Month(s)</MenuItem>
                        <MenuItem value="Year(s)">Year(s)</MenuItem>
                    </Select>
                </Box>
             </Grid>

             <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1, sm: 0 } }}>
                <Typography sx={{ width: { xs: "100%", sm: 160 }, fontWeight: "600", color: "red", fontSize: "0.9rem" }}>Starts On*</Typography>
                <DatePicker value={startDate} onChange={setStartDate} slotProps={{ textField: { size: 'small', fullWidth: true, sx: { width: { xs: "100%", sm: "auto" } } } }} />
             </Grid>
          </Grid>

          <Box sx={{ mt: 5 }}>
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #eee" }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: "#F9F9FB" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>ITEM DETAILS</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">QTY</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">RATE</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="right">AMOUNT</TableCell>
                    <TableCell sx={{ width: 50 }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell><Autocomplete size="small" options={[]} renderInput={(params) => <TextField {...params} placeholder="Select Product" />} /></TableCell>
                      <TableCell align="right"><TextField size="small" type="number" value={row.quantity} onChange={(e) => handleItemChange(row.id, 'quantity', e.target.value)} sx={{ width: 80 }} /></TableCell>
                      <TableCell align="right"><TextField size="small" type="number" value={row.rate} onChange={(e) => handleItemChange(row.id, 'rate', e.target.value)} sx={{ width: 100 }} /></TableCell>
                      <TableCell align="right">{row.amount.toFixed(2)}</TableCell>
                      <TableCell><IconButton onClick={() => setItems(items.filter(i => i.id !== row.id))} size="small" color="error"><DeleteOutlineIcon fontSize="small" /></IconButton></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button startIcon={<AddIcon />} onClick={handleAddItem} sx={{ mt: 1, textTransform: "none" }}>Add Row</Button>
          </Box>
        </Box>

        <Box sx={{ 
          p: 2, 
          borderTop: "1px solid #eee", 
          bgcolor: "#F9F9FB", 
          display: "flex", 
          gap: 2,
          position: 'sticky',
          bottom: 0,
          zIndex: 10
        }}>
          <Button variant="contained" sx={{ bgcolor: "#408DFB", textTransform: "none", px: 4, fontWeight: 'bold' }}>Save</Button>
          <Button variant="outlined" onClick={handleClose} sx={{ textTransform: "none", px: 4, color: '#666', borderColor: '#ddd' }}>Cancel</Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default NewRecurringInvoice;
