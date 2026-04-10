import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Divider,
  Dialog,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ModalEditableSeries from "../UsableContent/ModalEditableSeries";
import ModalManageTcs from "../UsableContent/ModalManageTcs";
import ModalManageTds from "../UsableContent/ModalManageTds";
import SuiSnackbar from "../Snackbars/SuiSnackbar";

const NewQuotes = ({ handleClose }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [quoteNumber, setQuoteNumber] = useState("QT-001");
  const [quoteDate, setQuoteDate] = useState(dayjs());
  const [expiryDate, setExpiryDate] = useState(dayjs().add(30, 'day'));
  const [reference, setReference] = useState("");
  const [selectedSalesperson, setSelectedSalesperson] = useState(null);
  const [subject, setSubject] = useState("");
  
  // Item Table State
  const [items, setItems] = useState([
    { id: Date.now(), item: null, description: "", quantity: 1, rate: 0, discount: 0, discountType: "%", amount: 0 }
  ]);

  // Sub-modals
  const [openSeries, setOpenSeries] = useState(false);
  const [openTcs, setOpenTcs] = useState(false);
  const [openTds, setOpenTds] = useState(false);

  // Totals
  const [shippingCharges, setShippingCharges] = useState(0);
  const [adjustment, setAdjustment] = useState(0);
  const [taxType, setTaxType] = useState("None"); // TDS, TCS, None

  // Styles from NewDeliveryChallan
  const labelStyle = { fontSize: "13px", color: "#444", width: "160px", flexShrink: 0, fontWeight: 500 };
  const inputSx = {
    "& .MuiOutlinedInput-root": { height: "32px", fontSize: "13px", borderRadius: "2px", "& fieldset": { borderColor: "#dcdfe6" } },
    "& .MuiInputBase-input": { padding: "0 10px", height: "32px" }
  };

  // Mock Data
  const customers = [
    { label: "Acme Corp", email: "contact@acme.com", address: "123 Industrial Way" },
    { label: "Global Industries", email: "info@global.com", address: "456 Tech Park" },
  ];

  const products = [
    { label: "Concrete Mixer", rate: 50000, description: "Heavy duty mixer" },
    { label: "Cement Silo", rate: 120000, description: "50T Capacity" },
  ];

  const salespersons = [
    { label: "John Doe" },
    { label: "Jane Smith" },
  ];

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), item: null, description: "", quantity: 1, rate: 0, discount: 0, discountType: "%", amount: 0 }]);
  };

  const handleDeleteItem = (id) => {
    if (items.length > 1) {
        setItems(items.filter(i => i.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => {
        if (item.id === id) {
            const updated = { ...item, [field]: value };
            if (field === 'item' && value) {
                updated.rate = value.rate;
                updated.description = value.description;
            }
            // Recalculate amount
            const baseAmount = updated.quantity * updated.rate;
            const discVal = updated.discountType === '%' ? (baseAmount * updated.discount / 100) : updated.discount;
            updated.amount = baseAmount - discVal;
            return updated;
        }
        return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal + parseFloat(shippingCharges || 0) + parseFloat(adjustment || 0);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff", overflow: 'hidden' }}>
        {/* Header */}
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
          <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, fontWeight: "bold", color: "#333" }}>New Quote</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />
            <IconButton onClick={handleClose}><CloseIcon /></IconButton>
          </Box>
        </Box>

        {/* Form Content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: { xs: "20px", md: "30px 50px" } }}>
          <Box sx={{ maxWidth: "800px" }}>
            {/* Customer Name */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "14px", gap: { xs: 1, sm: 0 } }}>
              <Typography sx={{ ...labelStyle, color: "red" }}>Customer Name*</Typography>
              <Autocomplete
                options={customers}
                value={selectedCustomer}
                onChange={(_, v) => setSelectedCustomer(v)}
                fullWidth
                renderInput={(params) => <TextField {...params} placeholder="Select Customer" sx={inputSx} />}
              />
            </Box>

            {/* Quote# */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "14px", gap: { xs: 1, sm: 0 } }}>
              <Typography sx={{ ...labelStyle, color: "red" }}>Quote#*</Typography>
              <TextField 
                value={quoteNumber} 
                onChange={(e) => setQuoteNumber(e.target.value)}
                sx={{ ...inputSx, width: { xs: "100%", sm: "240px" } }} 
                InputProps={{ 
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setOpenSeries(true)} size="small">
                        <SettingsOutlinedIcon sx={{ fontSize: 16, color: "#999" }} />
                      </IconButton>
                    </InputAdornment>
                  ) 
                }} 
              />
            </Box>

            {/* Reference# */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "14px", gap: { xs: 1, sm: 0 } }}>
              <Typography sx={labelStyle}>Reference#</Typography>
              <TextField 
                placeholder="Enter Reference" 
                sx={{ ...inputSx, width: { xs: "100%", sm: "400px" } }} 
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </Box>

            {/* Quote Date and Expiry Date */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, mb: "14px", gap: { xs: 0, lg: 4 } }}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: { xs: "14px", lg: 0 }, gap: { xs: 1, sm: 0 } }}>
                <Typography sx={{ ...labelStyle, color: "red" }}>Quote Date*</Typography>
                <DatePicker 
                  value={quoteDate} 
                  onChange={setQuoteDate} 
                  slotProps={{ textField: { sx: { ...inputSx, width: { xs: "100%", sm: "180px" } } } }} 
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1, sm: 0 } }}>
                <Typography sx={{ ...labelStyle, width: { xs: "160px", lg: "100px" } }}>Expiry Date</Typography>
                <DatePicker 
                  value={expiryDate} 
                  onChange={setExpiryDate} 
                  slotProps={{ textField: { sx: { ...inputSx, width: { xs: "100%", sm: "180px" } } } }} 
                />
              </Box>
            </Box>

            {/* Salesperson */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "14px", gap: { xs: 1, sm: 0 } }}>
              <Typography sx={labelStyle}>Salesperson</Typography>
              <Autocomplete
                options={salespersons}
                value={selectedSalesperson}
                onChange={(_, v) => setSelectedSalesperson(v)}
                fullWidth
                renderInput={(params) => <TextField {...params} placeholder="Select Salesperson" sx={inputSx} />}
              />
            </Box>

            {/* Subject */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "flex-start" }, mb: "14px", gap: { xs: 1, sm: 0 } }}>
              <Typography sx={{ ...labelStyle, mt: "8px" }}>Subject</Typography>
              <TextField 
                multiline 
                rows={2} 
                placeholder="Write a subject for this quote" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{ 
                  "& .MuiOutlinedInput-root": { fontSize: "13px", borderRadius: "2px", "& fieldset": { borderColor: "#dcdfe6" } },
                  "& .MuiInputBase-input": { padding: "10px" },
                  width: "100%"
                }} 
              />
            </Box>
          </Box>

          {/* Item Table Section */}
          <Box sx={{ mt: 5 }}>
            <TableContainer sx={{ border: "1px solid #f0f0f0" }}>
              <Table sx={{ tableLayout: "fixed" }}>
                <TableHead sx={{ bgcolor: "#F9F9FB" }}>
                  <TableRow>
                    <TableCell sx={{ width: "35%", fontSize: "11px", fontWeight: 700 }}>ITEM DETAILS</TableCell>
                    <TableCell sx={{ width: "12%", fontSize: "11px", fontWeight: 700 }} align="right">QUANTITY</TableCell>
                    <TableCell sx={{ width: "15%", fontSize: "11px", fontWeight: 700 }} align="right">RATE</TableCell>
                    <TableCell sx={{ width: "18%", fontSize: "11px", fontWeight: 700 }} align="right">DISCOUNT</TableCell>
                    <TableCell sx={{ width: "15%", fontSize: "11px", fontWeight: 700 }} align="right">AMOUNT</TableCell>
                    <TableCell sx={{ width: "5%" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell sx={{ verticalAlign: 'top', py: 1 }}>
                        <Autocomplete
                          options={products}
                          value={row.item}
                          onChange={(_, v) => handleItemChange(row.id, 'item', v)}
                          renderInput={(params) => <TextField {...params} placeholder="Select Product" sx={inputSx} />}
                        />
                        <TextField 
                            fullWidth 
                            placeholder="Description" 
                            value={row.description}
                            onChange={(e) => handleItemChange(row.id, 'description', e.target.value)}
                            sx={{ 
                              mt: 1, 
                              "& .MuiOutlinedInput-root": { height: "auto", fontSize: "12px", borderRadius: "2px", "& fieldset": { borderColor: "#dcdfe6" } },
                              "& .MuiInputBase-input": { padding: "5px 10px" }
                            }} 
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ verticalAlign: 'top', py: 1 }}>
                        <TextField 
                            type="number" 
                            value={row.quantity} 
                            onChange={(e) => handleItemChange(row.id, 'quantity', e.target.value)}
                            sx={inputSx}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ verticalAlign: 'top', py: 1 }}>
                        <TextField 
                            type="number" 
                            value={row.rate} 
                            onChange={(e) => handleItemChange(row.id, 'rate', e.target.value)}
                            sx={inputSx}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ verticalAlign: 'top', py: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                            <TextField 
                                type="number" 
                                value={row.discount} 
                                onChange={(e) => handleItemChange(row.id, 'discount', e.target.value)}
                                sx={{ ...inputSx, width: 70 }}
                            />
                            <Select 
                                size="small" 
                                value={row.discountType}
                                onChange={(e) => handleItemChange(row.id, 'discountType', e.target.value)}
                                sx={{ 
                                  height: "32px", 
                                  fontSize: "12px", 
                                  ml: 0.5,
                                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dcdfe6" }
                                }}
                            >
                                <MenuItem value="%">%</MenuItem>
                                <MenuItem value="₹">₹</MenuItem>
                            </Select>
                        </Box>
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, fontSize: '13px', pt: 2 }}>
                        {row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: 'top', pt: 1.5 }}>
                        <IconButton size="small" onClick={() => handleDeleteItem(row.id)} color="error"><DeleteOutlineIcon sx={{ fontSize: 18 }} /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button startIcon={<AddIcon />} onClick={handleAddItem} sx={{ mt: 1, textTransform: "none", fontSize: "13px", color: "#408DFB" }}>ADD ROW</Button>
          </Box>

          {/* Totals Section */}
          <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end" }}>
            <Box sx={{ width: { xs: '100%', sm: 400 }, p: 2, bgcolor: "#F9F9FB", borderRadius: "4px", border: "1px solid #f0f0f0" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography sx={{ fontSize: '13px', color: '#666' }}>Sub Total</Typography>
                <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>₹ {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
              </Box>
              
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontSize: '13px', color: '#666' }}>Shipping Charges</Typography>
                <TextField 
                    type="number" 
                    value={shippingCharges} 
                    onChange={(e) => setShippingCharges(e.target.value)}
                    sx={{ ...inputSx, width: 120, "& .MuiInputBase-input": { textAlign: "right" } }} 
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontSize: '13px', color: '#666' }}>Adjustment</Typography>
                <TextField 
                    type="number" 
                    value={adjustment} 
                    onChange={(e) => setAdjustment(e.target.value)}
                    sx={{ ...inputSx, width: 120, "& .MuiInputBase-input": { textAlign: "right" } }} 
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Select 
                      size="small" 
                      value={taxType} 
                      onChange={(e) => setTaxType(e.target.value)} 
                      sx={{ height: '32px', fontSize: '12px', minWidth: '80px' }}
                    >
                        <MenuItem value="None">None</MenuItem>
                        <MenuItem value="TDS">TDS</MenuItem>
                        <MenuItem value="TCS">TCS</MenuItem>
                    </Select>
                    <IconButton size="small" onClick={() => taxType === 'TDS' ? setOpenTds(true) : setOpenTcs(true)} disabled={taxType === 'None'}><SettingsOutlinedIcon sx={{ fontSize: 16 }} /></IconButton>
                </Box>
                <Typography sx={{ fontSize: '13px' }}>₹ 0.00</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: '15px', fontWeight: "bold" }}>Total ( ₹ )</Typography>
                <Typography sx={{ fontSize: '15px', fontWeight: "bold", color: "#408DFB" }}>₹ {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
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

        {/* Sub-modals */}
        <Dialog open={openSeries} fullWidth maxWidth="md"><ModalEditableSeries handleClosePrefix={() => setOpenSeries(false)} /></Dialog>
        <Dialog open={openTcs} fullWidth maxWidth="md"><ModalManageTcs handleManageTcsClose={() => setOpenTcs(false)} /></Dialog>
        <Dialog open={openTds} fullWidth maxWidth="md"><ModalManageTds handleManageTdsClose={() => setOpenTds(false)} /></Dialog>

      </Box>
    </LocalizationProvider>
  );
};

export default NewQuotes;
