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
  Select,
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const NewDeliveryChallan = ({ handleClose, initialCustomer }) => {
  const STORAGE_KEY = "batchingplant_customers";
  const [customers, setCustomers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedCustomer, setSelectedCustomer] = useState(initialCustomer || null);
  const [items, setItems] = useState([
    { id: Date.now(), item: null, quantity: 1, rate: 0, discount: 0, discountType: "%", tax: null, amount: 0 }
  ]);
  const [adjustmentLabel, setAdjustmentLabel] = useState("Adjustment");
  const [adjustmentValue, setAdjustmentValue] = useState(0);

  const labelStyle = { fontSize: "13px", color: "#444", width: "160px", flexShrink: 0, fontWeight: 500 };
  const inputSx = {
    "& .MuiOutlinedInput-root": { height: "32px", fontSize: "13px", borderRadius: "2px", "& fieldset": { borderColor: "#dcdfe6" } },
    "& .MuiInputBase-input": { padding: "0 10px", height: "32px" }
  };

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), item: null, quantity: 1, rate: 0, discount: 0, discountType: "%", tax: null, amount: 0 }]);
  };

  const handleDeleteItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        const base = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.rate) || 0);
        const discountValue = updated.discountType === "%" 
          ? (base * (parseFloat(updated.discount) || 0) / 100)
          : (parseFloat(updated.discount) || 0);
        updated.amount = base - discountValue;
        return updated;
      }
      return item;
    }));
  };

  const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
  const total = subTotal + (parseFloat(adjustmentValue) || 0);

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
        <Box sx={{ maxWidth: "1000px" }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={{ ...labelStyle, color: "#ff6b6b" }}>Customer Name*</Typography>
            <Autocomplete 
              options={customers} 
              getOptionLabel={(option) => option.name || ""}
              value={selectedCustomer}
              onChange={(_, v) => setSelectedCustomer(v)}
              fullWidth 
              renderInput={(params) => <TextField {...params} placeholder="Select Customer" sx={inputSx} />} 
            />
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={{ ...labelStyle, color: "#ff6b6b" }}>Delivery Challan#*</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField value="DC-00001" sx={{ ...inputSx, width: { xs: "100%", sm: "240px" } }} />
              <IconButton size="small"><SettingsIcon sx={{ fontSize: 16, color: "#999" }} /></IconButton>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={labelStyle}>Reference #</Typography>
            <TextField placeholder="Enter Reference" sx={{ ...inputSx, width: { xs: "100%", sm: "400px" } }} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={{ ...labelStyle, color: "#ff6b6b" }}>Delivery Challan Date*</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker defaultValue={dayjs()} slotProps={{ textField: { sx: { ...inputSx, width: "240px" } } }} />
            </LocalizationProvider>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={labelStyle}>Challan Type</Typography>
            <Select defaultValue="none" displayEmpty sx={{ height: "32px", fontSize: "13px", width: "400px", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dcdfe6" }, color: "#999" }}>
               <MenuItem value="none" disabled>Choose a proper challan type.</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Item Table exactly mirrored to reference layout */}
        <Box sx={{ mt: 5 }}>
          <Box sx={{ backgroundColor: "#F9F9FB", p: "8px 12px", border: "1px solid #f0f0f0", borderBottom: 0 }}>
            <Typography sx={{ fontWeight: 600, fontSize: "13px" }}>Item Table</Typography>
          </Box>
          <TableContainer sx={{ border: "1px solid #f0f0f0" }}>
            <Table sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "35%", fontSize: "11px", fontWeight: 700, p: "10px", color: "#888", letterSpacing: 1 }}>ITEM DETAILS</TableCell>
                  <TableCell sx={{ width: "12%", fontSize: "11px", fontWeight: 700, p: "10px", color: "#888", letterSpacing: 1 }}>QUANTITY</TableCell>
                  <TableCell sx={{ width: "12%", fontSize: "11px", fontWeight: 700, p: "10px", color: "#888", letterSpacing: 1 }}>RATE</TableCell>
                  <TableCell sx={{ width: "15%", fontSize: "11px", fontWeight: 700, p: "10px", color: "#888", letterSpacing: 1 }}>DISCOUNT</TableCell>
                  <TableCell sx={{ width: "15%", fontSize: "11px", fontWeight: 700, p: "10px", color: "#888", letterSpacing: 1 }}>TAX</TableCell>
                  <TableCell sx={{ width: "10%", fontSize: "11px", fontWeight: 700, p: "10px", color: "#888", textAlign: "right", letterSpacing: 1 }}>AMOUNT</TableCell>
                  <TableCell sx={{ width: "4%" }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ p: "8px" }}>
                      <Autocomplete options={[]} renderInput={(params) => <TextField {...params} placeholder="Search or select Item" sx={inputSx} />} />
                    </TableCell>
                    <TableCell sx={{ p: "8px" }}>
                      <TextField 
                        value={row.quantity} 
                        onChange={(e) => handleItemChange(row.id, "quantity", e.target.value)} 
                        sx={inputSx} 
                      />
                    </TableCell>
                    <TableCell sx={{ p: "8px" }}>
                      <TextField 
                        value={row.rate} 
                        onChange={(e) => handleItemChange(row.id, "rate", e.target.value)} 
                        sx={inputSx} 
                      />
                    </TableCell>
                    <TableCell sx={{ p: "8px" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField 
                          value={row.discount} 
                          onChange={(e) => handleItemChange(row.id, "discount", e.target.value)} 
                          sx={{ ...inputSx, flex: 1 }} 
                        />
                        <Select 
                          value={row.discountType} 
                          onChange={(e) => handleItemChange(row.id, "discountType", e.target.value)}
                          sx={{ height: "32px", fontSize: "12px", "& .MuiOutlinedInput-notchedOutline": { borderLeft: 0, borderRadius: "0 2px 2px 0" } }}
                        >
                          <MenuItem value="%">%</MenuItem>
                          <MenuItem value="Fixed">₹</MenuItem>
                        </Select>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ p: "8px" }}>
                      <Autocomplete options={[]} renderInput={(params) => <TextField {...params} sx={inputSx} />} />
                    </TableCell>
                    <TableCell sx={{ p: "8px", textAlign: "right", fontSize: "13px" }}>
                      {row.amount.toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ p: "8px" }}>
                      <IconButton size="small" onClick={() => handleDeleteItem(row.id)}>
                        <CloseIcon sx={{ fontSize: 14, color: "red" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button 
              startIcon={<AddIcon />} 
              onClick={handleAddItem}
              sx={{ mt: 1, textTransform: "none", fontSize: "13px", backgroundColor: "#8eb6f8", color: "#fff", borderRadius: "4px", "&:hover": { backgroundColor: "#699df5" }, height: "32px", px: 2 }}
          >
              ADD ROW
          </Button>
        </Box>

        {/* Calculations Section */}
        <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}>
          <Box sx={{ width: "400px" }}>
             <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography sx={{ fontSize: "13px", color: "#666" }}>Sub Total</Typography>
                <Typography sx={{ fontSize: "13px" }}>{subTotal.toFixed(2)}</Typography>
             </Box>
             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <TextField 
                  value={adjustmentLabel} 
                  onChange={(e) => setAdjustmentLabel(e.target.value)}
                  sx={{ ...inputSx, width: "100px", "& .MuiOutlinedInput-root": { border: "1px solid #eee", bgcolor: "#f9f9f9" } }} 
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField 
                    value={adjustmentValue} 
                    onChange={(e) => setAdjustmentValue(e.target.value)}
                    sx={{ ...inputSx, width: "120px" }} 
                  />
                </Box>
             </Box>
             <Divider sx={{ my: 2 }} />
             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>Total(₹)</Typography>
                <Typography sx={{ fontSize: "16px", fontWeight: "bold", color: "#555" }}>{total.toFixed(2)}</Typography>
             </Box>
          </Box>
        </Box>

      </Box>

      <Box sx={{ 
        p: "14px 20px", 
        borderTop: "1px solid #f0f0f0", 
        display: "flex", 
        gap: "10px", 
        bgcolor: "#fff",
        position: 'sticky',
        bottom: 0,
        zIndex: 10
      }}>
        <Button onClick={handleClose} variant="outlined" sx={{ height: "32px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", px: 3, color: '#408DFB', borderColor: '#408DFB' }}>CANCEL</Button>
        <Button variant="contained" sx={{ backgroundColor: "#408DFB", height: "32px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", px: 3 }}>SAVE</Button>
      </Box>
    </Box>
  );
};

export default NewDeliveryChallan;
