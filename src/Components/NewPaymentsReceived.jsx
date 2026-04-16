import React, { useState } from "react";
import {
  Typography,
  TextField,
  Autocomplete,
  Button,
  IconButton,
  Box,
  InputAdornment,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const NewPaymentsReceived = ({ handleClose, initialCustomer }) => {
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
  const [activeTab, setActiveTab] = useState(0);
  const [taxDeducted, setTaxDeducted] = useState("no");

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

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

  const multilineInputSx = {
    "& .MuiOutlinedInput-root": {
      fontSize: "13px",
      borderRadius: "4px",
      backgroundColor: "#fff",
      "& fieldset": { borderColor: "#e0e0e0" }
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", backgroundColor: "#fff", width: "100%" }}>
      {/* Header with Tabs */}
      <Box sx={{ bgcolor: "#242d3c", height: "40px", display: "flex", justifyContent: "flex-end" }}>
         {/* Top dark bar simulation from screenshot */}
         <IconButton onClick={handleClose} size="small" sx={{ color: "#fff", mr: 1 }}><CloseIcon fontSize="small" /></IconButton>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff', px: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ minHeight: '40px', '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '13px', color: '#333', minHeight: '40px', py: 0, mx: 1, px: 0, minWidth: 'auto' } }}>
          <Tab label="Invoice Payment" />
          <Tab label="Customer Advance" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={{ flex: 1, overflowY: "auto", p: { xs: "20px", md: "30px 4% 50px" } }}>
        <Box sx={{ width: "100%" }}>

          {activeTab === 0 && (
            // INVOICE PAYMENT TAB
            <>
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
                <Typography sx={{ ...labelStyle, color: "red" }}>Amount Received*</Typography>
                <Box sx={{ width: { xs: '100%', sm: '60%', md: '500px' } }}>
                  <TextField fullWidth placeholder="INR" sx={inputSx} />
                  <FormControlLabel 
                    control={<Checkbox size="small" sx={{ py: 0.5 }} />} 
                    label={<Typography sx={{ fontSize: '12px', color: '#666' }}>Received full amount</Typography>} 
                    sx={{ mt: 0.5, ml: 0 }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={labelStyle}>Bank Charges (if any)</Typography>
                <TextField sx={{ ...inputSx, width: { xs: '100%', sm: '60%', md: '500px' } }} />
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={{ ...labelStyle, color: "red" }}>Payment Date*</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker defaultValue={dayjs("2026-04-15")} slotProps={{ textField: { sx: { ...inputSx, width: "200px" } } }} />
                </LocalizationProvider>
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={{ ...labelStyle, color: "red" }}>Payment#*</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField value="GN-01" sx={{ ...inputSx, width: "200px" }} />
                  <SettingsIcon sx={{ fontSize: 16, color: "#aaa", cursor: "pointer" }} />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={labelStyle}>Payment Mode</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Autocomplete 
                      options={["Cash"]} 
                      defaultValue="Cash"
                      sx={{ width: "200px" }}
                      renderInput={(params) => <TextField {...params} sx={inputSx} />} 
                  />
                  <SettingsIcon sx={{ fontSize: 16, color: "#aaa", cursor: "pointer" }} />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={{ ...labelStyle, color: "red" }}>Deposit To*</Typography>
                <Autocomplete 
                    options={[]} 
                    sx={{ width: { xs: '100%', sm: '60%', md: '500px' } }}
                    renderInput={(params) => <TextField {...params} placeholder="Select an account" sx={inputSx} />} 
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={labelStyle}>Reference #</Typography>
                <TextField placeholder="Enter Reference" sx={{ ...inputSx, width: { xs: '100%', sm: '60%', md: '500px' } }} />
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 5 }}>
                <Typography sx={labelStyle}>Tax Deducted?</Typography>
                <RadioGroup row value={taxDeducted} onChange={(e) => setTaxDeducted(e.target.value)}>
                    <FormControlLabel value="no" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px', color: '#555' }}>No Tax deducted</Typography>} />
                    <FormControlLabel value="yes" control={<Radio size="small" />} label={<Typography sx={{ fontSize: '13px', color: '#555' }}>Yes, TDS (Income Tax)</Typography>} />
                </RadioGroup>
              </Box>

              {/* Unpaid Invoices Table Section */}
              <Box sx={{ width: '100%', mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: 1 }}>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>Unpaid Invoices</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#aaa' }}>Filter by Date Range</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#518bf9', cursor: 'pointer' }}>Clear Applied Amount</Typography>
                </Box>

                <TableContainer sx={{ borderTop: "1px solid #eee", borderBottom: '1px solid #eee' }}>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontSize: "11px", fontWeight: 600, color: "#888", borderBottom: '1px solid #eee', py: 1.5 }}>DATE</TableCell>
                        <TableCell sx={{ fontSize: "11px", fontWeight: 600, color: "#888", borderBottom: '1px solid #eee', py: 1.5 }}>INVOICE NUMBER</TableCell>
                        <TableCell align="center" sx={{ fontSize: "11px", fontWeight: 600, color: "#888", borderBottom: '1px solid #eee', py: 1.5 }}>INVOICE AMOUNT</TableCell>
                        <TableCell align="center" sx={{ fontSize: "11px", fontWeight: 600, color: "#888", borderBottom: '1px solid #eee', py: 1.5 }}>AMOUNT DUE</TableCell>
                        <TableCell align="center" sx={{ fontSize: "11px", fontWeight: 600, color: "#888", borderBottom: '1px solid #eee', py: 1.5 }}>PAYMENT</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3, borderBottom: 'none' }}>
                          <Typography sx={{ fontSize: '13px', color: '#888' }}>
                            There are no unpaid invoices associated with this customer.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, flexDirection: { xs: 'column-reverse', md: 'row' }, gap: 4 }}>
                  <Typography sx={{ fontSize: '11px', color: '#888' }}>**List contains only SENT invoices</Typography>
                  
                  {/* Summary Block */}
                  <Box sx={{ width: { xs: '100%', sm: '400px' }, bgcolor: '#fafafa', p: 3, borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
                       <Typography sx={{ fontSize: '12px', color: '#555', mr: 8 }}>Total</Typography>
                       <Typography sx={{ fontSize: '12px', color: '#333' }}>0</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ fontSize: '13px', color: '#666' }}>Amount Received :</Typography>
                        <Typography sx={{ fontSize: '13px', color: '#333' }}>0.00</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ fontSize: '13px', color: '#666' }}>Amount used for Payments :</Typography>
                        <Typography sx={{ fontSize: '13px', color: '#333' }}>0.00</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ fontSize: '13px', color: '#666' }}>Amount Refunded :</Typography>
                        <Typography sx={{ fontSize: '13px', color: '#333' }}>0.00</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <WarningAmberIcon sx={{ fontSize: 16, color: '#ff6b6b' }} />
                          <Typography sx={{ fontSize: '13px', color: '#666' }}>Amount in Excess:</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '13px', color: '#666' }}>₹ 0.00</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Notes */}
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontSize: '12px', color: '#666', mb: 1 }}>Notes (Internal use. Not visible to customer)</Typography>
                <TextField multiline rows={4} fullWidth sx={multilineInputSx} />
              </Box>
            </>
          )}

          {activeTab === 1 && (
            // CUSTOMER ADVANCE TAB
            <>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={{ ...labelStyle, color: "red" }}>Customer Name*</Typography>
                <Autocomplete 
                    options={[]} 
                    sx={{ width: { xs: '100%', sm: '60%', md: '500px' } }}
                    renderInput={(params) => <TextField {...params} placeholder="Select Customer" sx={inputSx} />} 
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={labelStyle}>Description of Supply</Typography>
                <Box sx={{ width: { xs: '100%', sm: '60%', md: '500px' } }}>
                  <TextField multiline rows={3} fullWidth sx={multilineInputSx} />
                  <Typography sx={{ fontSize: '11px', color: '#999', mt: 0.5 }}>Will be displayed on the 'Payment Receipt'</Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={{ ...labelStyle, color: "red" }}>Amount Received*</Typography>
                <TextField placeholder="INR" sx={{ ...inputSx, width: { xs: '100%', sm: '60%', md: '500px' } }} />
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={labelStyle}>Bank Charges (if any)</Typography>
                <TextField sx={{ ...inputSx, width: { xs: '100%', sm: '60%', md: '500px' } }} />
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={labelStyle}>Tax</Typography>
                <Autocomplete 
                    options={[]} 
                    sx={{ width: { xs: '100%', sm: '60%', md: '500px' } }}
                    renderInput={(params) => <TextField {...params} sx={inputSx} />} 
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={{ ...labelStyle, color: "red" }}>Payment Date*</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker defaultValue={dayjs("2026-04-15")} slotProps={{ textField: { sx: { ...inputSx, width: "200px" } } }} />
                </LocalizationProvider>
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={{ ...labelStyle, color: "red" }}>Payment#*</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField value="GN-01" sx={{ ...inputSx, width: "200px" }} />
                  <SettingsIcon sx={{ fontSize: 16, color: "#aaa", cursor: "pointer" }} />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={labelStyle}>Payment Mode</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Autocomplete 
                      options={["Cash"]} 
                      defaultValue="Cash"
                      sx={{ width: "200px" }}
                      renderInput={(params) => <TextField {...params} sx={inputSx} />} 
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
                <Typography sx={{ ...labelStyle, color: "red" }}>Deposit To*</Typography>
                <Autocomplete 
                    options={[]} 
                    sx={{ width: { xs: '100%', sm: '60%', md: '500px' } }}
                    renderInput={(params) => <TextField {...params} placeholder="Select an account" sx={inputSx} />} 
                />
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 5 }}>
                <Typography sx={labelStyle}>Reference #</Typography>
                <TextField placeholder="Enter Reference" sx={{ ...inputSx, width: { xs: '100%', sm: '60%', md: '500px' } }} />
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontSize: '12px', color: '#666', mb: 1 }}>Notes (Internal use. Not visible to customer)</Typography>
                <TextField multiline rows={4} fullWidth sx={multilineInputSx} />
              </Box>
            </>
          )}

        </Box>
      </Box>

      <Box sx={{ 
        p: "15px 30px", 
        display: "flex", 
        gap: "10px", 
        bgcolor: "#fff",
        borderTop: "1px solid #f0f0f0"
      }}>
        <Button variant="contained" sx={{ height: "32px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", px: 2, bgcolor: '#518bf9', boxShadow: 'none', '&:hover': { bgcolor: '#4079e0' } }} onClick={handleClose}>CANCEL</Button>
        <Button variant="contained" sx={{ height: "32px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", px: 2, bgcolor: '#518bf9', boxShadow: 'none', '&:hover': { bgcolor: '#4079e0' } }}>SAVE</Button>
      </Box>
    </Box>
  );
};

export default NewPaymentsReceived;
