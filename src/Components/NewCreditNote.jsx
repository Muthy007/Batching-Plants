import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const NewCreditNote = ({ handleClose, initialCustomer }) => {
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
  const [items, setItems] = useState([{ id: Date.now(), item: null, quantity: 1, rate: 0, discount: 0, discountType: "%", tax: null, amount: 0 }]);
  const [taxType, setTaxType] = useState('TDS');

  const handleAddItem = () => setItems([...items, { id: Date.now(), item: null, quantity: 1, rate: 0, discount: 0, discountType: "%", tax: null, amount: 0 }]);
  
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.amount = updated.quantity * updated.rate; // simplified demo logic
        return updated;
      }
      return item;
    }));
  };

  const labelStyle = { fontSize: "12px", color: "#666", width: { xs: '100%', sm: "200px" }, flexShrink: 0, mb: { xs: 1, sm: 0 }, pt: { sm: 1 } };
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      height: "32px",
      fontSize: "13px",
      borderRadius: "4px",
      backgroundColor: "#fff",
      "& fieldset": { borderColor: "#e0e0e0" }
    },
    "& .MuiInputBase-input": { padding: "0 10px", height: "32px" }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", backgroundColor: "#fff", width: "100%" }}>
        {/* Header Bar */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          px: 3,
          minHeight: "50px",
          borderBottom: "1px solid #eee",
          bgcolor: "#fff"
        }}>
          <Typography sx={{ fontSize: "16px", fontWeight: "bold", color: "#111" }}>New Credit Note</Typography>
          <IconButton onClick={handleClose} size="small"><CloseIcon sx={{ fontSize: 20 }} /></IconButton>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", p: { xs: "20px", md: "30px 4% 50px" } }}>
          <Box sx={{ width: "100%" }}>
            
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
              <Typography sx={{ ...labelStyle, color: "red" }}>Customer Name*</Typography>
              <Autocomplete 
                  options={customers} 
                  getOptionLabel={(option) => option.name || ""}
                  value={selectedCustomer}
                  onChange={(_, v) => setSelectedCustomer(v)}
                  sx={{ width: { xs: '100%', sm: '60%', md: '500px' } }}
                  renderInput={(params) => <TextField {...params} placeholder="Select Customer" sx={inputSx} />} 
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
              <Typography sx={labelStyle}>Reason</Typography>
              <Autocomplete 
                  options={[]} 
                  sx={{ width: { xs: '100%', sm: '60%', md: '500px' } }}
                  renderInput={(params) => <TextField {...params} sx={inputSx} />} 
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
              <Typography sx={{ ...labelStyle, color: "red" }}>Credit Note#*</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField value="TN-0001" sx={{ ...inputSx, width: "220px" }} />
                <SettingsIcon sx={{ fontSize: 18, color: "#999", cursor: "pointer" }} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
              <Typography sx={labelStyle}>Reference</Typography>
              <TextField placeholder="Enter Reference" sx={{ ...inputSx, width: { xs: '100%', sm: '60%', md: '500px' } }} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
              <Typography sx={{ ...labelStyle, color: "red" }}>Credit Note Date*</Typography>
              <DatePicker defaultValue={dayjs("2026-04-15")} slotProps={{ textField: { sx: { ...inputSx, width: "220px" } } }} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
              <Typography sx={labelStyle}>Sales Person</Typography>
              <Autocomplete 
                  options={[]} 
                  sx={{ width: { xs: '100%', sm: '60%', md: '500px' } }}
                  renderInput={(params) => <TextField {...params} placeholder="Select or Search Salesperson" sx={inputSx} />} 
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 5 }}>
              <Typography sx={labelStyle}>Subject</Typography>
              <TextField multiline rows={3} placeholder="Let your customer know what this Credit Note is for." sx={{ "& .MuiOutlinedInput-root": { fontSize: "13px", backgroundColor: "#fff" }, width: { xs: '100%', sm: '60%', md: '500px' } }} />
            </Box>

            {/* Item Table Header Info */}
            <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#666", mb: 2 }}>Item Table</Typography>

            <TableContainer sx={{ overflowX: 'auto', borderBottom: '1px solid #eee' }}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ '& th': { fontSize: "11px", fontWeight: 700, color: "#888", borderBottom: '1px solid #eee', py: 1.5, textTransform: 'uppercase' } }}>
                    <TableCell>ITEM DETAILS</TableCell>
                    <TableCell width="120">QUANTITY</TableCell>
                    <TableCell width="140">RATE</TableCell>
                    <TableCell width="200">DISCOUNT</TableCell>
                    <TableCell width="160">TAX</TableCell>
                    <TableCell align="right" width="120">AMOUNT</TableCell>
                    <TableCell width="40"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ py: 1.5, borderBottom: 'none' }}>
                        <Autocomplete size="small" options={[]} renderInput={(params) => <TextField {...params} placeholder="Search or select Item" sx={inputSx} />} />
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderBottom: 'none' }}>
                        <TextField size="small" fullWidth type="number" value={row.quantity} onChange={(e) => handleItemChange(row.id, 'quantity', e.target.value)} sx={{...inputSx, '& .MuiOutlinedInput-root': { height: '36px' }}} />
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderBottom: 'none' }}>
                        <TextField size="small" fullWidth type="number" value={row.rate} onChange={(e) => handleItemChange(row.id, 'rate', e.target.value)} sx={{...inputSx, '& .MuiOutlinedInput-root': { height: '36px' }}} />
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderBottom: 'none' }}>
                        <Box sx={{ display: 'flex' }}>
                          <TextField size="small" value={row.discount} onChange={(e) => handleItemChange(row.id, 'discount', e.target.value)} sx={{...inputSx, width: '60%', '& .MuiOutlinedInput-root': { height: '36px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}} />
                          <Autocomplete 
                            options={['%', '₹']} 
                            value={row.discountType}
                            onChange={(e, val) => handleItemChange(row.id, 'discountType', val)}
                            sx={{ width: '40%' }}
                            renderInput={(params) => <TextField {...params} sx={{...inputSx, '& .MuiOutlinedInput-root': { height: '36px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none' }}} />} 
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderBottom: 'none' }}>
                        <Autocomplete size="small" options={[]} renderInput={(params) => <TextField {...params} sx={{...inputSx, '& .MuiOutlinedInput-root': { height: '36px' }}} />} />
                      </TableCell>
                      <TableCell align="right" sx={{ py: 1.5, borderBottom: 'none', fontSize: '13px', fontWeight: 'bold', color: '#444' }}>
                        {row.amount.toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ py: 1.5, borderBottom: 'none' }}>
                        <IconButton onClick={() => setItems(items.filter(i => i.id !== row.id))} size="small"><CloseRoundedIcon sx={{ fontSize: 16, color: '#ff6b6b' }} /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
              <Box>
                <Button startIcon={<AddIcon />} onClick={handleAddItem} sx={{ bgcolor: "#d3e2f7", color: "#1967d2", textTransform: "none", fontSize: '12px', fontWeight: 600, px: 2, py: 0.5 }}>ADD ROW</Button>
              </Box>

              <Box sx={{ width: { xs: '100%', lg: '500px' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontSize: '13px', color: '#666', width: '200px' }}>Sub Total</Typography>
                  <Typography sx={{ fontSize: '13px', color: '#333' }}>0.00</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ width: '200px' }}>
                    <Typography sx={{ fontSize: '13px', color: '#666' }}>Shipping Charges</Typography>
                    <Typography sx={{ fontSize: '11px', color: '#518bf9', cursor: 'pointer', mt: 0.5 }}>Apply Tax on shipping charges</Typography>
                  </Box>
                  <TextField size="small" placeholder=".00" sx={{ width: "120px", ...inputSx, mr: { xs: 0, sm: 'auto' } }} />
                  <Typography sx={{ fontSize: '13px', color: '#333' }}>.00</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <RadioGroup row value={taxType} onChange={(e) => setTaxType(e.target.value)} sx={{ width: '200px' }}>
                      <FormControlLabel value="TDS" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '12px', color: '#555' }}>TDS</Typography>} sx={{ m: 0, mr: 1 }} />
                      <FormControlLabel value="TCS" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '12px', color: '#555' }}>TCS</Typography>} sx={{ m: 0 }} />
                  </RadioGroup>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, mr: 2 }}>
                    <Autocomplete options={[]} sx={{ width: "120px" }} renderInput={(params) => <TextField {...params} placeholder="Select Type" sx={inputSx} />} />
                    <SettingsIcon sx={{ fontSize: 16, color: "#ccc", cursor: "pointer" }} />
                  </Box>
                  <Typography sx={{ fontSize: '13px', color: '#333' }}>0.00</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography sx={{ fontSize: '13px', color: '#666', width: '200px' }}>Adjustment</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flex: 1, mr: 2 }}>
                    <TextField size="small" sx={{ width: "80px", ...inputSx }} />
                    <TextField size="small" sx={{ width: "120px", ...inputSx }} />
                  </Box>
                  <Typography sx={{ fontSize: '13px', color: '#333' }}>0.00</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ fontSize: '15px', color: '#333', fontWeight: 600 }}>Total(₹)</Typography>
                  <Typography sx={{ fontSize: '15px', color: '#333', fontWeight: 600 }}>0.00</Typography>
                </Box>
              </Box>
            </Box>

          </Box>
        </Box>

        <Box sx={{ 
          p: "15px 30px", 
          display: "flex", 
          gap: "10px", 
          bgcolor: "#fff",
          borderTop: "1px solid #f0f0f0"
        }}>
          <Button variant="contained" sx={{ height: "32px", fontSize: "12px", fontWeight: 600, px: 2, bgcolor: '#518bf9', boxShadow: 'none', '&:hover': { bgcolor: '#4079e0' } }} onClick={handleClose}>CANCEL</Button>
          <Button variant="contained" sx={{ height: "32px", fontSize: "12px", fontWeight: 600, px: 2, bgcolor: '#518bf9', boxShadow: 'none', '&:hover': { bgcolor: '#4079e0' } }}>SAVE AS DRAFT</Button>
          <Button variant="contained" sx={{ height: "32px", fontSize: "12px", fontWeight: 600, px: 2, bgcolor: '#518bf9', boxShadow: 'none', '&:hover': { bgcolor: '#4079e0' } }}>SAVE AS OPEN</Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default NewCreditNote;
