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
  Grid,
  Divider,
  Select,
  MenuItem,
  Dialog,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ModalEditableSeries from "../UsableContent/ModalEditableSeries";
import ModalManageTcs from "../UsableContent/ModalManageTcs";
import ModalManageTds from "../UsableContent/ModalManageTds";
import ModalConfigPaymentTerms from "../UsableContent/ModalConfigPaymentTerms";

const NewSalesOrder = ({ handleClose, initialCustomer }) => {
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
  // State for items
  const [items, setItems] = useState([
    { id: Date.now(), item: null, description: "", quantity: 1, rate: 0, discount: 0, discountType: "%", tax: null, amount: 0 }
  ]);

  // State for totals
  const [shippingCharges, setShippingCharges] = useState(0);
  const [adjustmentLabel, setAdjustmentLabel] = useState("Adjustment");
  const [adjustmentValue, setAdjustmentValue] = useState(0);
  const [taxType, setTaxType] = useState("TDS"); // TDS, TCS

  // Modal states
  const [openSeries, setOpenSeries] = useState(false);
  const [openTcs, setOpenTcs] = useState(false);
  const [openTds, setOpenTds] = useState(false);
  const [openConfigTerms, setOpenConfigTerms] = useState(false);

  const labelStyle = { fontSize: "13px", color: "#444", width: "160px", flexShrink: 0, fontWeight: 500 };
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      height: "32px", fontSize: "13px", borderRadius: "2px",
      "& fieldset": { borderColor: "#dcdfe6" },
    },
    "& .MuiInputBase-input": { padding: "0 10px", height: "32px" }
  };

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), item: null, description: "", quantity: 1, rate: 0, discount: 0, discountType: "%", tax: null, amount: 0 }]);
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
        // Simple amount calculation
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
  const total = subTotal + (parseFloat(shippingCharges) || 0) + (parseFloat(adjustmentValue) || 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", backgroundColor: "#fff" }}>
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
        <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, fontWeight: "bold", color: "#333" }}>New Sales Order</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflowY: "auto", p: { xs: "20px", md: "30px 50px" } }}>
        <Box sx={{ maxWidth: "1250px", mx: "auto", width: "100%" }}>
          {/* Form Fields: Customer Name and Addresses */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "flex-start", mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={{ ...labelStyle, color: "#ff6b6b", mt: 1 }}>Customer Name*</Typography>
            <Box sx={{ flexGrow: 1, width: "100%" }}>
                <Autocomplete 
                options={customers} 
                getOptionLabel={(option) => option.name || ""}
                value={selectedCustomer}
                onChange={(_, v) => setSelectedCustomer(v)}
                fullWidth 
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
                  <Box sx={{ mt: 3, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "13px", color: "#888" }}>GST Treatment :</Typography>
                    <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "#333" }}>{selectedCustomer.gstTreatment || "Registered Business - Regular"}</Typography>
                  </Box>
                )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={{ ...labelStyle, color: "#ff6b6b" }}>Sales Order#</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField value="SO-00001" sx={{ ...inputSx, width: { xs: "100%", sm: "240px" } }} />
              <IconButton size="small" onClick={() => setOpenSeries(true)}><SettingsIcon sx={{ fontSize: 16, color: "#999" }} /></IconButton>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={labelStyle}>Reference#</Typography>
            <TextField placeholder="Enter Reference" sx={{ ...inputSx, width: { xs: "100%", sm: "400px" } }} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={labelStyle}>Order Number</Typography>
            <TextField placeholder="Enter Orderno" sx={{ ...inputSx, width: { xs: "100%", sm: "400px" } }} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={{ ...labelStyle, color: "#ff6b6b" }}>Sales Order Date*</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker defaultValue={dayjs()} slotProps={{ textField: { sx: { ...inputSx, width: "240px" } } }} />
            </LocalizationProvider>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={labelStyle}>Expected Shipment Date</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker defaultValue={dayjs()} slotProps={{ textField: { sx: { ...inputSx, width: "240px" } } }} />
            </LocalizationProvider>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={labelStyle}>Payment Terms</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Select defaultValue="Due on Receipt" sx={{ height: "32px", fontSize: "13px", width: "240px", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#dcdfe6" } }}>
                 <MenuItem value="Due on Receipt">Due on Receipt</MenuItem>
              </Select>
              <IconButton size="small" onClick={() => setOpenConfigTerms(true)}><SettingsIcon sx={{ fontSize: 16, color: "#999" }} /></IconButton>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={labelStyle}>Delivery Method</Typography>
            <Autocomplete options={[]} sx={{ width: "400px" }} renderInput={(params) => <TextField {...params} placeholder="Select Method" sx={inputSx} />} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, mb: "20px", gap: { xs: 1, sm: 0 } }}>
            <Typography sx={labelStyle}>Sales Person</Typography>
            <Autocomplete options={[]} sx={{ width: "400px" }} renderInput={(params) => <TextField {...params} placeholder="Select or Search Salesperson" sx={inputSx} />} />
          </Box>

          {/* Item Table */}
          <Box sx={{ mt: 5 }}>
            <Box sx={{ backgroundColor: "#F9F9FB", p: "8px 12px", border: "1px solid #f0f0f0", borderBottom: 0 }}>
              <Typography sx={{ fontWeight: 600, fontSize: "13px" }}>Item Table</Typography>
            </Box>
            <TableContainer sx={{ border: "1px solid #f0f0f0" }}>
              <Table sx={{ tableLayout: "fixed" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "35%", fontSize: "11px", fontWeight: 700, p: "10px", color: "#888" }}>ITEM DETAILS</TableCell>
                    <TableCell sx={{ width: "12%", fontSize: "11px", fontWeight: 700, p: "10px", color: "#888" }}>QUANTITY</TableCell>
                    <TableCell sx={{ width: "12%", fontSize: "11px", fontWeight: 700, p: "10px", color: "#888" }}>RATE</TableCell>
                    <TableCell sx={{ width: "15%", fontSize: "11px", fontWeight: 700, p: "10px", color: "#888" }}>DISCOUNT</TableCell>
                    <TableCell sx={{ width: "15%", fontSize: "11px", fontWeight: 700, p: "10px", color: "#888" }}>TAX</TableCell>
                    <TableCell sx={{ width: "10%", fontSize: "11px", fontWeight: 700, p: "10px", color: "#888", textAlign: "right" }}>AMOUNT</TableCell>
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
                        <Autocomplete options={[]} renderInput={(params) => <TextField {...params} placeholder="Select Tax" sx={inputSx} />} />
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
                sx={{ mt: 1, textTransform: "none", fontSize: "13px", backgroundColor: "#408DFB", color: "#fff", borderRadius: "2px", "&:hover": { backgroundColor: "#3074d3" }, height: "32px", px: 2 }}
            >
                ADD ROW
            </Button>
          </Box>

          {/* Calculations Section */}
          <Box sx={{ mt: 5, display: "flex", justifyContent: "flex-end", pr: 2 }}>
            <Box sx={{ width: "450px" }}>
               <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography sx={{ fontSize: "13px", color: "#666" }}>Sub Total</Typography>
                  <Typography sx={{ fontSize: "13px" }}>{subTotal.toFixed(2)}</Typography>
               </Box>

               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography sx={{ fontSize: "13px", color: "#666" }}>Shipping Charges</Typography>
                    <Typography sx={{ fontSize: "10px", color: "#408DFB", cursor: "pointer", mt: 0.5 }}>Apply Tax on shipping charges</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField 
                      placeholder="0" 
                      value={shippingCharges} 
                      onChange={(e) => setShippingCharges(e.target.value)}
                      sx={{ ...inputSx, width: "120px" }} 
                    />
                    <Typography sx={{ fontSize: "13px" }}>.00</Typography>
                  </Box>
               </Box>

               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <RadioGroup row value={taxType} onChange={(e) => setTaxType(e.target.value)}>
                        <FormControlLabel value="TDS" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{ fontSize: "11px" }}>TDS</Typography>} />
                        <FormControlLabel value="TCS" control={<Radio size="small" sx={{ p: 0.5 }} />} label={<Typography sx={{ fontSize: "11px" }}>TCS</Typography>} />
                    </RadioGroup>
                    <Autocomplete 
                        options={[]} 
                        sx={{ ...inputSx, width: "120px" }} 
                        renderInput={(params) => <TextField {...params} placeholder="Select Type" sx={inputSx} />} 
                    />
                    <IconButton size="small" onClick={() => taxType === "TDS" ? setOpenTds(true) : setOpenTcs(true)}>
                        <SettingsIcon sx={{ fontSize: 14, color: "#999" }} />
                    </IconButton>
                  </Box>
                  <Typography sx={{ fontSize: "13px" }}>0.00</Typography>
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
                  <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>Total(₹)</Typography>
                  <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>{total.toFixed(2)}</Typography>
               </Box>
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
        bgcolor: "#fff",
        position: 'sticky',
        bottom: 0,
        zIndex: 10
      }}>
        <Button onClick={handleClose} variant="outlined" sx={{ height: "32px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", px: 3, color: '#408DFB', borderColor: '#408DFB' }}>Cancel</Button>
        <Button variant="outlined" sx={{ height: "32px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", px: 3, color: '#408DFB', borderColor: '#408DFB' }}>Save As Draft</Button>
        <Button variant="contained" sx={{ backgroundColor: "#408DFB", height: "32px", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", px: 3 }}>Save and Send</Button>
      </Box>

      {/* Modals */}
      <Dialog open={openSeries} fullWidth maxWidth="sm"><ModalEditableSeries handleClosePrefix={() => setOpenSeries(false)} /></Dialog>
      <Dialog open={openTcs} fullWidth maxWidth="md" onClose={() => setOpenTcs(false)}><ModalManageTcs handleManageTcsClose={() => setOpenTcs(false)} /></Dialog>
      <Dialog open={openTds} fullWidth maxWidth="md" onClose={() => setOpenTds(false)}><ModalManageTds handleManageTdsClose={() => setOpenTds(false)} /></Dialog>
      <Dialog open={openConfigTerms} fullWidth maxWidth="sm" onClose={() => setOpenConfigTerms(false)}><ModalConfigPaymentTerms handleClose={() => setOpenConfigTerms(false)} /></Dialog>
    </Box>
  );
};

export default NewSalesOrder;
