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
  Radio,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  Divider,
  Select,
  MenuItem,
  Link
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const NewInvoice = ({ handleClose, initialCustomer }) => {
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
  const [rows, setRows] = useState([{ id: 1, item: "", quantity: "1.00", rate: "0", discount: "0", tax: "", amount: "0.00" }]);
  const [taxPreference, setTaxPreference] = useState('TDS');

  const labelStyle = { fontSize: "13px", color: "#666", width: { xs: '100%', sm: "160px" }, flexShrink: 0, fontWeight: 500, mb: { xs: 1, sm: 0 } };
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

  const removeRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), item: "", quantity: "1.00", rate: "0", discount: "0", tax: "", amount: "0.00" }]);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", backgroundColor: "#fff", width: "100%" }}>
      {/* Header */}
      <Box sx={{ 
        p: { xs: "10px 15px", md: "15px 30px" }, 
        borderBottom: "1px solid #f0f0f0", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        bgcolor: "#fff",
        minHeight: "60px",
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: '20px', height: '24px', border: '2px solid #5a9df8', borderRadius: '2px', borderTopRightRadius: '8px' }} />
            <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "#222", ml: 1 }}>New Invoice</Typography>
        </Box>
        <IconButton onClick={handleClose} size="small"><CloseIcon sx={{ fontSize: 18, color: '#333' }} /></IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflowY: "auto", p: { xs: "20px", md: "30px 40px 50px" } }}>
        <Box sx={{ width: "100%" }}>
          
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px" }}>
            <Typography sx={{ ...labelStyle, color: "red" }}>Customer Name*</Typography>
            <Autocomplete 
                options={customers} 
                getOptionLabel={(option) => option.name || ""}
                value={selectedCustomer}
                onChange={(_, newValue) => setSelectedCustomer(newValue)}
                sx={{ width: { xs: '100%', sm: '60%', md: '50%', lg: '40%' } }}
                renderInput={(params) => <TextField {...params} placeholder="Select Customer" sx={inputSx} />} 
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px" }}>
            <Typography sx={{ ...labelStyle, color: "red" }}>Invoice#*</Typography>
            <TextField 
                value="2024/25-001" 
                sx={{ ...inputSx, width: { xs: '100%', sm: '40%', md: '30%', lg: '25%' } }} 
                InputProps={{ 
                    endAdornment: (
                        <InputAdornment position="end">
                            <SettingsIcon sx={{ fontSize: 16, color: "#aaa", cursor: 'pointer' }} />
                        </InputAdornment>
                    ) 
                }} 
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px" }}>
            <Typography sx={labelStyle}>Order Number</Typography>
            <TextField sx={{ ...inputSx, width: { xs: '100%', sm: '50%', md: '40%', lg: '30%' } }} />
          </Box>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, alignItems: { xs: "flex-start", lg: "center" }, mb: "20px", gap: { xs: 2, lg: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', lg: 'auto' } }}>
                <Typography sx={{ ...labelStyle, color: "red", width: { xs: '100%', sm: '160px' } }}>Invoice Date*</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker defaultValue={dayjs("2026-04-15")} slotProps={{ textField: { sx: { ...inputSx, width: "160px" } } }} />
                </LocalizationProvider>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', lg: 'auto' } }}>
                <Typography sx={{ fontSize: "13px", color: "#666", width: { xs: '100%', sm: '160px', lg: '80px' }, mb: { xs: 1, sm: 0 } }}>Terms</Typography>
                <Autocomplete 
                    options={["Due on Receipt", "Net 15", "Net 30"]} 
                    defaultValue="Due on Receipt"
                    sx={{ width: "160px" }} 
                    renderInput={(params) => <TextField {...params} sx={inputSx} />} 
                />
                <SettingsIcon sx={{ fontSize: 16, color: "#aaa", ml: 1, cursor: 'pointer' }} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', lg: 'auto' } }}>
                <Typography sx={{ fontSize: "13px", color: "#666", width: { xs: '100%', sm: '160px', lg: '80px' }, ml: { lg: 2 }, mb: { xs: 1, sm: 0 } }}>Due Date</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker defaultValue={dayjs("2026-04-15")} slotProps={{ textField: { sx: { ...inputSx, width: "160px" } } }} />
                </LocalizationProvider>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px" }}>
            <Typography sx={labelStyle}>Sales Person</Typography>
            <Autocomplete 
                options={[]} 
                sx={{ width: { xs: '100%', sm: '50%', md: '40%', lg: '30%' } }}
                renderInput={(params) => <TextField {...params} placeholder="Select or Search Salesperson" sx={inputSx} />} 
            />
          </Box>
          
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "40px" }}>
            <Typography sx={labelStyle}>Subject</Typography>
            <TextField fullWidth placeholder="Enter Subject" sx={{ ...inputSx, width: { xs: '100%', sm: '70%', md: '60%', lg: '50%' } }} />
          </Box>

          {/* Table Section */}
          <Box sx={{ mb: 2, width: '100%' }}>
            <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "#666", mb: 1 }}>Item Table</Typography>
            
            <TableContainer sx={{ borderTop: "1px solid #e0e0e0", overflowX: 'auto', mb: 1 }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "30%", fontSize: "11px", fontWeight: 600, color: "#999", borderBottom: '1px solid #e0e0e0', p: '12px 16px' }}>ITEM DETAILS</TableCell>
                    <TableCell sx={{ width: "15%", fontSize: "11px", fontWeight: 600, color: "#999", borderBottom: '1px solid #e0e0e0', p: '12px 16px' }}>QUANTITY</TableCell>
                    <TableCell sx={{ width: "15%", fontSize: "11px", fontWeight: 600, color: "#999", borderBottom: '1px solid #e0e0e0', p: '12px 16px' }}>RATE</TableCell>
                    <TableCell sx={{ width: "15%", fontSize: "11px", fontWeight: 600, color: "#999", borderBottom: '1px solid #e0e0e0', p: '12px 16px' }}>DISCOUNT</TableCell>
                    <TableCell sx={{ width: "15%", fontSize: "11px", fontWeight: 600, color: "#999", borderBottom: '1px solid #e0e0e0', p: '12px 16px' }}>TAX</TableCell>
                    <TableCell align="right" sx={{ width: "10%", fontSize: "11px", fontWeight: 600, color: "#999", borderBottom: '1px solid #e0e0e0', p: '12px 16px' }}>AMOUNT</TableCell>
                    <TableCell sx={{ width: "5%", borderBottom: '1px solid #e0e0e0' }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} sx={{ '& td': { borderBottom: 'none', p: '8px 16px' } }}>
                      <TableCell>
                          <Autocomplete 
                              options={[]} 
                              renderInput={(params) => <TextField {...params} placeholder="Search or select Item" sx={inputSx} />} 
                          />
                      </TableCell>
                      <TableCell>
                          <TextField defaultValue="1.00" fullWidth sx={inputSx} inputProps={{ style: { textAlign: 'right' } }} />
                      </TableCell>
                      <TableCell>
                          <TextField defaultValue="0" fullWidth sx={inputSx} inputProps={{ style: { textAlign: 'right' } }} />
                      </TableCell>
                      <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TextField defaultValue="0" sx={{ ...inputSx, width: '60px', '& .MuiOutlinedInput-root': { borderRadius: '4px 0 0 4px', borderRight: 'none' } }} inputProps={{ style: { textAlign: 'right' } }} />
                              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '0 4px 4px 0', height: '32px', display: 'flex', alignItems: 'center', px: 1 }}>
                                  <Select
                                      variant="standard"
                                      disableUnderline
                                      defaultValue="%"
                                      sx={{ fontSize: '13px', color: '#666' }}
                                  >
                                      <MenuItem value="%">%</MenuItem>
                                      <MenuItem value="Rs">Rs</MenuItem>
                                  </Select>
                              </Box>
                          </Box>
                      </TableCell>
                      <TableCell>
                          <Select
                              displayEmpty
                              value=""
                              sx={{ 
                                height: '32px', 
                                fontSize: '13px', 
                                width: '100%', 
                                bgcolor: '#fff',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' }
                              }}
                          >
                          </Select>
                      </TableCell>
                      <TableCell align="right">
                          <Typography sx={{ fontSize: "14px", color: '#444' }}>0.00</Typography>
                      </TableCell>
                      <TableCell align="center">
                          <IconButton size="small" onClick={() => removeRow(row.id)}>
                              <CloseIcon sx={{ fontSize: 16, color: '#ff4d4f' }} />
                          </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
              <Button 
                  startIcon={<AddIcon fontSize="small"/>} 
                  onClick={addRow}
                  sx={{ 
                      textTransform: "uppercase", 
                      fontSize: "11px", 
                      fontWeight: 600,
                      color: "#fff", 
                      bgcolor: '#8eb8fb',
                      px: 2,
                      py: 0.5,
                      borderRadius: '4px',
                      '&:hover': { bgcolor: '#77a4eb' },
                      minWidth: '100px'
                  }}
              >
                  Add Row
              </Button>
              
              <Box sx={{ width: { xs: '100%', md: '50%', lg: '450px' }, p: 1, ml: 'auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                      <Typography sx={{ fontSize: '13px', color: '#555', fontWeight: 500 }}>Sub Total</Typography>
                      <Typography sx={{ fontSize: '13px', color: '#333' }}>0.00</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                      <Box>
                          <Typography sx={{ fontSize: '13px', color: '#666' }}>Shipping Charges</Typography>
                          <Link href="#" underline="hover" sx={{ fontSize: '11px', color: '#408DFB', display: 'block' }}>Apply Tax on shipping charges</Link>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField sx={{ ...inputSx, width: '120px' }} />
                          <Typography sx={{ fontSize: '13px', color: '#333', width: '30px', textAlign: 'right' }}>.00</Typography>
                      </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <RadioGroup row value={taxPreference} onChange={(e) => setTaxPreference(e.target.value)}>
                              <FormControlLabel value="TDS" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px', color: '#666' }}>TDS</Typography>} />
                              <FormControlLabel value="TCS" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px', color: '#666' }}>TCS</Typography>} />
                          </RadioGroup>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Select
                              displayEmpty
                              value=""
                              sx={{ 
                                height: '32px', 
                                fontSize: '13px', 
                                flex: 1, 
                                minWidth: '120px',
                                bgcolor: '#fff',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' }
                              }}
                          >
                              <MenuItem value="" disabled>Select Type</MenuItem>
                          </Select>
                          <SettingsIcon sx={{ fontSize: 16, color: '#aaa', cursor: 'pointer' }} />
                          <Typography sx={{ fontSize: '13px', color: '#333', width: '30px', textAlign: 'right' }}>0.00</Typography>
                      </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography sx={{ fontSize: '13px', color: '#666' }}>Adjustment</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TextField sx={{ ...inputSx, width: '100px' }} />
                          <TextField sx={{ ...inputSx, width: '100px' }} />
                      </Box>
                  </Box>

                  <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                      <Typography sx={{ fontSize: '15px', color: '#444' }}>Total(₹)</Typography>
                      <Typography sx={{ fontSize: '15px', color: '#444' }}>0.00</Typography>
                  </Box>

              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer Actions */}
      <Box sx={{ 
        p: "15px 30px", 
        display: "flex", 
        gap: "10px", 
        bgcolor: "#fff",
        borderTop: "1px solid #f0f0f0",
      }}>
        <Button variant="contained" sx={{ height: "32px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", px: 2, bgcolor: '#518bf9', boxShadow: 'none', '&:hover': { bgcolor: '#4079e0' } }} onClick={handleClose}>CANCEL</Button>
        <Button variant="contained" sx={{ height: "32px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", px: 2, bgcolor: '#518bf9', boxShadow: 'none', '&:hover': { bgcolor: '#4079e0' } }}>SAVE AS DRAFT</Button>
        <Button variant="contained" sx={{ height: "32px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", px: 2, bgcolor: '#518bf9', boxShadow: 'none', '&:hover': { bgcolor: '#4079e0' } }}>SAVE AND SEND</Button>
      </Box>
    </Box>
  );
};

export default NewInvoice;
