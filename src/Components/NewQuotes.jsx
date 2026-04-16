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

const NewQuotes = ({ handleClose, initialCustomer }) => {
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
            const baseAmount = parseFloat(updated.quantity || 0) * parseFloat(updated.rate || 0);
            const discVal = updated.discountType === '%' ? (baseAmount * parseFloat(updated.discount || 0) / 100) : parseFloat(updated.discount || 0);
            updated.amount = baseAmount - discVal;
            return updated;
        }
        return item;
    }));
  };

  const onCustomerChange = (_, v) => {
    setSelectedCustomer(v);
    if (v) {
      // Auto-fill place of supply if needed
      // setPlaceOfSupply(v.placeOfSupply); 
    }
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
          <Box sx={{ maxWidth: "1150px", mx: "auto", width: "100%" }}>
            {/* Customer Name Row */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 3 }}>
              <Typography sx={{ ...labelStyle, color: "#d32f2f", mt: 1 }}>Customer Name*</Typography>
              <Box sx={{ flexGrow: 1, maxWidth: "550px" }}>
                <Autocomplete
                  options={customers}
                  getOptionLabel={(option) => option.name || ""}
                  value={selectedCustomer}
                  onChange={onCustomerChange}
                  sx={{ width: "100%" }}
                  renderInput={(params) => <TextField {...params} placeholder="Select Customer" sx={inputSx} />}
                />
                
                {/* Dynamic Address Display */}
                {selectedCustomer && (
                  <Box sx={{ mt: 3, display: "flex", gap: 6 }}>
                    {/* Billing Address */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                        <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#888" }}>BILLING ADDRESS</Typography>
                        <EditOutlinedIcon sx={{ fontSize: 13, color: "#408DFB", cursor: "pointer" }} />
                      </Box>
                      <Typography sx={{ fontSize: "13px", color: "#111", lineHeight: 1.6 }}>
                        {selectedCustomer.billingAttention && <>{selectedCustomer.billingAttention}<br /></>}
                        {selectedCustomer.billingAddress1}<br />
                        {selectedCustomer.billingAddress2 && <>{selectedCustomer.billingAddress2}<br /></>}
                        {selectedCustomer.billingCity}, {selectedCustomer.billingState} {selectedCustomer.billingZip}<br />
                        {selectedCustomer.billingCountry}<br />
                        {selectedCustomer.billingPhone && <>Phone No: {selectedCustomer.billingPhone}</>}
                      </Typography>
                    </Box>

                    {/* Shipping Address */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                        <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#888" }}>SHIPPING ADDRESS</Typography>
                        <EditOutlinedIcon sx={{ fontSize: 13, color: "#408DFB", cursor: "pointer" }} />
                      </Box>
                      <Typography sx={{ fontSize: "13px", color: "#111", lineHeight: 1.6 }}>
                        {selectedCustomer.shippingAttention && <>{selectedCustomer.shippingAttention}<br /></>}
                        {selectedCustomer.shippingAddress1}<br />
                        {selectedCustomer.shippingAddress2 && <>{selectedCustomer.shippingAddress2}<br /></>}
                        {selectedCustomer.shippingCity}, {selectedCustomer.shippingState} {selectedCustomer.shippingZip}<br />
                        {selectedCustomer.shippingCountry}<br />
                        {selectedCustomer.shippingPhone && <>Phone No: {selectedCustomer.shippingPhone}</>}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {selectedCustomer && (
                  <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "13px", color: "#888" }}>GST Treatment :</Typography>
                    <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "#333" }}>{selectedCustomer.gstTreatment || "Registered Business - Regular"}</Typography>
                  </Box>
                )}
              </Box>
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
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                sx={{ ...inputSx, width: "100%", maxWidth: "550px" }} 
              />
            </Box>

            {/* Dates Row */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", mb: 2 }}>
              <Typography sx={{ ...labelStyle, color: "#d32f2f" }}>Quote Date*</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexGrow: 1, maxWidth: "550px" }}>
                <DatePicker 
                  value={quoteDate} 
                  onChange={(v) => setQuoteDate(v)}
                  slotProps={{ textField: { sx: { ...inputSx, width: "180px" } } }} 
                />
                <Typography sx={{ fontSize: "13px", color: "#444" }}>Expiry Date</Typography>
                <DatePicker 
                  value={expiryDate}
                  onChange={(v) => setExpiryDate(v)}
                  slotProps={{ textField: { sx: { ...inputSx, width: "180px" } } }} 
                />
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />
            
            {/* Subject Row */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: 4 }}>
              <Typography sx={labelStyle}>Subject</Typography>
              <TextField 
                multiline 
                rows={2} 
                placeholder="Write a subject for this quote" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                sx={{ 
                    "& .MuiOutlinedInput-root": { fontSize: "13px", borderRadius: "2px", "& fieldset": { borderColor: "#dcdfe6" } },
                    width: "100%", maxWidth: "550px" 
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
          p: "18px 50px", 
          borderTop: "1px solid #eee", 
          display: "flex", 
          gap: 2, 
          bgcolor: "#F9F9FB",
          position: 'sticky',
          bottom: 0,
          zIndex: 10
        }}>
          <Button variant="contained" sx={{ bgcolor: "#408DFB", textTransform: "none", px: 4, fontWeight: 700, borderRadius: "2px" }}>SAVE AND SEND</Button>
          <Button variant="contained" sx={{ bgcolor: "#408DFB", textTransform: "none", px: 4, fontWeight: 700, borderRadius: "2px" }}>SAVE AS DRAFT</Button>
          <Button onClick={handleClose} variant="outlined" sx={{ height: "36px", fontSize: "14px", fontWeight: 600, textTransform: "none", px: 4, color: '#333', borderColor: '#ddd', borderRadius: "2px", bgcolor: "#fff" }}>CANCEL</Button>
        </Box>

        {/* Sub-modals */}
        <Dialog open={openSeries} fullWidth maxWidth="md" onClose={() => setOpenSeries(false)}><ModalEditableSeries handleClosePrefix={() => setOpenSeries(false)} /></Dialog>
        <Dialog open={openTcs} fullWidth maxWidth="md" onClose={() => setOpenTcs(false)}><ModalManageTcs handleManageTcsClose={() => setOpenTcs(false)} /></Dialog>
        <Dialog open={openTds} fullWidth maxWidth="md" onClose={() => setOpenTds(false)}><ModalManageTds handleManageTdsClose={() => setOpenTds(false)} /></Dialog>

      </Box>
    </LocalizationProvider>
  );
};

export default NewQuotes;
