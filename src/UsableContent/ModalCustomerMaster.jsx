import {
  Autocomplete,
  Button,
  FormControlLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Box,
  IconButton
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { Country, State } from "country-state-city";
import SuiSnackbar from "../Snackbars/SuiSnackbar";

const Salutations = [
  { label: "Mr." },
  { label: "Mrs." },
  { label: "Ms." },
  { label: "Miss." },
  { label: "Dr." },
];

const mockGstTreatments = [
  { id: 1, gst_head: "Registered Business - Regular", gst_desc: "Business that is registered under GST", gst: 1, place: 1 },
  { id: 2, gst_head: "Registered Business - Composition", gst_desc: "Business that has opted for the composition scheme", gst: 1, place: 1 },
  { id: 3, gst_head: "Unregistered Business", gst_desc: "Business that is not registered under GST", gst: 0, place: 0 },
  { id: 4, gst_head: "Consumer", gst_desc: "A regular consumer", gst: 0, place: 0 },
  { id: 5, gst_head: "Overseas", gst_desc: "Persons or entities residing outside India", gst: 0, place: 0 },
];

const ModalCustomerMaster = (props) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedMemberType, setSelectedMemberType] = useState("Business");
  const [salutationsList, setSalutationsList] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDisplayName, setCompanyDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  
  const [selectedGstTreatment, setSelectedGstTreatment] = useState(null);
  const [selectedTaxType, setSelectedTaxType] = useState("Taxable");
  const [panNo, setPanNo] = useState("");
  const [gstIn, setGstIn] = useState("");
  const [selectedPlaceOfSupply, setSelectedPlaceOfSupply] = useState(null);

  const [billingAttention, setBillingAttention] = useState("");
  const [billingAddress1, setBillingAddress1] = useState("");
  const [billingAddress2, setBillingAddress2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingFax, setBillingFax] = useState("");
  const [selectedBillingCountry, setSelectedBillingCountry] = useState(null);
  const [selectedBillingState, setSelectedBillingState] = useState(null);

  const [shippingAttention, setShippingAttention] = useState("");
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingZip, setShippingZip] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingFax, setShippingFax] = useState("");
  const [selectedShippingCountry, setSelectedShippingCountry] = useState(null);
  const [selectedShippingState, setSelectedShippingState] = useState(null);

  const [contacts, setContacts] = useState([{ salutation: null, f_name: "", l_name: "", email: "", phone: "", mobile: "", is_primary: true }]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  const handleSave = () => {
    // Ported from handleSaveClick logic but without axios
    setSnackbarMessage("Customer saved successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    setTimeout(() => {
        props.handleClose();
    }, 1000);
  };

  const countries = Country.getAllCountries();
  const getStatesByCountry = (countryName) => {
    const country = countries.find(c => c.name === countryName);
    return country ? State.getStatesOfCountry(country.isoCode) : [];
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <SuiSnackbar
        open={snackbarOpen}
        color={snackbarSeverity === "success" ? "#E8F5E9" : "#ff9999"}
        icon={snackbarSeverity}
        content={snackbarMessage}
        close={handleCloseSnackbar}
      />
      
      {/* Header */}
      <Box sx={{ 
        p: { xs: "10px 15px", md: "20px 30px" }, 
        borderBottom: "1px solid #e6e6e6", 
        bgcolor: "#F9F9FB", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        minHeight: "75px",
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <Typography sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, fontWeight: "bold", fontFamily: "Inter, sans-serif", color: "#333" }}>
          New Customer
        </Typography>
        <IconButton onClick={props.handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Box sx={{ 
        display: "flex", 
        gap: { xs: 1, sm: 3 }, 
        px: 2, 
        pt: 1, 
        borderBottom: "1px solid #e6e6e6",
        position: 'sticky',
        top: "75px",
        bgcolor: "#fff",
        zIndex: 9,
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' }
      }}>
        {["basic", "gst", "address", "contacts"].map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            sx={{
              pb: 1,
              borderRadius: 0,
              color: activeTab === tab ? "#408DFB" : "#666",
              borderBottom: activeTab === tab ? "3px solid #408DFB" : "none",
              fontWeight: "600",
              textTransform: "uppercase",
              fontSize: "0.85rem",
              whiteSpace: 'nowrap'
            }}
          >
            {tab.replace("_", " ")} Info
          </Button>
        ))}
      </Box>

      {/* Content Area */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
        {activeTab === "basic" && (
          <Grid container spacing={3} sx={{ maxWidth: 800 }}>
            <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1, sm: 0 } }}>
              <Typography sx={{ width: { xs: "100%", sm: 160 }, fontWeight: "600", fontSize: "0.9rem" }}>Customer Type</Typography>
              <RadioGroup row value={selectedMemberType} onChange={(e) => setSelectedMemberType(e.target.value)}>
                <FormControlLabel value="Business" control={<Radio size="small" />} label="Business" />
                <FormControlLabel value="Individual" control={<Radio size="small" />} label="Individual" />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1, sm: 0 } }}>
              <Typography sx={{ width: { xs: "100%", sm: 160 }, fontWeight: "600", fontSize: "0.9rem" }}>Primary Contact</Typography>
              <Box sx={{ display: "flex", gap: 1, flexGrow: 1, width: "100%" }}>
                <Autocomplete
                  size="small"
                  options={Salutations}
                  getOptionLabel={(o) => o.label}
                  value={salutationsList}
                  onChange={(_, val) => setSalutationsList(val)}
                  renderInput={(params) => <TextField {...params} placeholder="Salutation" sx={{ width: 80 }} />}
                />
                <TextField size="small" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} sx={{ flexGrow: 1 }} />
                <TextField size="small" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} sx={{ flexGrow: 1 }} />
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1, sm: 0 } }}>
              <Typography sx={{ width: { xs: "100%", sm: 160 }, fontWeight: "600", fontSize: "0.9rem" }}>Company Name</Typography>
              <TextField size="small" fullWidth value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1, sm: 0 } }}>
              <Typography sx={{ width: { xs: "100%", sm: 160 }, fontWeight: "600", color: "red", fontSize: "0.9rem" }}>Display Name*</Typography>
              <TextField size="small" fullWidth value={companyDisplayName} onChange={(e) => setCompanyDisplayName(e.target.value)} />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1, sm: 0 } }}>
              <Typography sx={{ width: { xs: "100%", sm: 160 }, fontWeight: "600", color: "red", fontSize: "0.9rem" }}>Email*</Typography>
              <TextField 
                size="small" 
                fullWidth 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon fontSize="small" /></InputAdornment> }}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1, sm: 0 } }}>
              <Typography sx={{ width: { xs: "100%", sm: 160 }, fontWeight: "600", fontSize: "0.9rem" }}>Phone / Mobile</Typography>
              <Box sx={{ display: "flex", gap: 1, flexGrow: 1, width: "100%" }}>
                <TextField 
                  size="small" 
                  fullWidth 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneIcon fontSize="small" /></InputAdornment> }}
                />
                <TextField 
                  size="small" 
                  fullWidth 
                  value={mobile} 
                  onChange={(e) => setMobile(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneAndroidIcon fontSize="small" /></InputAdornment> }}
                />
              </Box>
            </Grid>
          </Grid>
        )}

        {activeTab === "gst" && (
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: 160, fontWeight: "500" }}>GST Treatment*</Typography>
              <Autocomplete
                size="small"
                fullWidth
                options={mockGstTreatments}
                getOptionLabel={(o) => o.gst_head}
                value={selectedGstTreatment}
                onChange={(_, val) => setSelectedGstTreatment(val)}
                renderInput={(params) => <TextField {...params} placeholder="Select GST Treatment" />}
              />
            </Grid>

            {selectedGstTreatment?.gst === 1 && (
              <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ width: 160, fontWeight: "500" }}>GSTIN*</Typography>
                <TextField size="small" fullWidth value={gstIn} onChange={(e) => setGstIn(e.target.value)} />
              </Grid>
            )}

            <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: 160, fontWeight: "500" }}>PAN No</Typography>
              <TextField size="small" fullWidth value={panNo} onChange={(e) => setPanNo(e.target.value)} />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: 160, fontWeight: "500" }}>Place of Supply*</Typography>
              <Autocomplete
                size="small"
                fullWidth
                options={getStatesByCountry("India")}
                getOptionLabel={(o) => o.name}
                value={selectedPlaceOfSupply}
                onChange={(_, val) => setSelectedPlaceOfSupply(val)}
                renderInput={(params) => <TextField {...params} placeholder="Select State" />}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ width: 160, fontWeight: "500" }}>Tax Preference</Typography>
              <RadioGroup row value={selectedTaxType} onChange={(e) => setSelectedTaxType(e.target.value)}>
                <FormControlLabel value="Taxable" control={<Radio size="small" />} label="Taxable" />
                <FormControlLabel value="Exempt" control={<Radio size="small" />} label="Exempt" />
              </RadioGroup>
            </Grid>
          </Grid>
        )}

        {activeTab === "address" && (
          <Grid container spacing={4}>
            {/* Billing Address */}
            <Grid item xs={12} md={6}>
              <Typography sx={{ fontWeight: "bold", mb: 2, color: "#408DFB" }}>BILLING ADDRESS</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField size="small" label="Attention" fullWidth value={billingAttention} onChange={(e) => setBillingAttention(e.target.value)} />
                <Autocomplete
                  size="small"
                  options={countries}
                  getOptionLabel={(o) => o.name}
                  value={selectedBillingCountry ? countries.find(c => c.name === selectedBillingCountry) : null}
                  onChange={(_, val) => {
                    setSelectedBillingCountry(val?.name || null);
                    setSelectedBillingState(null);
                  }}
                  renderInput={(params) => <TextField {...params} label="Country" />}
                />
                <TextField size="small" label="Address Line 1" multiline rows={2} fullWidth value={billingAddress1} onChange={(e) => setBillingAddress1(e.target.value)} />
                <TextField size="small" label="Address Line 2" fullWidth value={billingAddress2} onChange={(e) => setBillingAddress2(e.target.value)} />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField size="small" label="City" fullWidth value={billingCity} onChange={(e) => setBillingCity(e.target.value)} />
                  <Autocomplete
                    size="small"
                    options={selectedBillingCountry ? getStatesByCountry(selectedBillingCountry) : []}
                    getOptionLabel={(o) => o.name}
                    value={selectedBillingState ? getStatesByCountry(selectedBillingCountry).find(s => s.name === selectedBillingState) : null}
                    onChange={(_, val) => setSelectedBillingState(val?.name || null)}
                    sx={{ flexGrow: 1 }}
                    renderInput={(params) => <TextField {...params} label="State" />}
                  />
                </Box>
                <TextField size="small" label="Zip Code" fullWidth value={billingZip} onChange={(e) => setBillingZip(e.target.value)} />
              </Box>
            </Grid>

            {/* Shipping Address */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontWeight: "bold", color: "#408DFB" }}>SHIPPING ADDRESS</Typography>
                <Button 
                    size="small" 
                    startIcon={<InfoOutlinedIcon fontSize="small" />}
                    onClick={() => {
                        setShippingAttention(billingAttention);
                        setShippingAddress1(billingAddress1);
                        setShippingAddress2(billingAddress2);
                        setShippingCity(billingCity);
                        setShippingZip(billingZip);
                        setSelectedShippingCountry(selectedBillingCountry);
                        setSelectedShippingState(selectedBillingState);
                    }}
                    sx={{ textTransform: "none", fontSize: "0.75rem" }}
                >
                    Copy Billing Address
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField size="small" label="Attention" fullWidth value={shippingAttention} onChange={(e) => setShippingAttention(e.target.value)} />
                <Autocomplete
                  size="small"
                  options={countries}
                  getOptionLabel={(o) => o.name}
                  value={selectedShippingCountry ? countries.find(c => c.name === selectedShippingCountry) : null}
                  onChange={(_, val) => {
                    setSelectedShippingCountry(val?.name || null);
                    setSelectedShippingState(null);
                  }}
                  renderInput={(params) => <TextField {...params} label="Country" />}
                />
                <TextField size="small" label="Address Line 1" multiline rows={2} fullWidth value={shippingAddress1} onChange={(e) => setShippingAddress1(e.target.value)} />
                <TextField size="small" label="Address Line 2" fullWidth value={shippingAddress2} onChange={(e) => setShippingAddress2(e.target.value)} />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField size="small" label="City" fullWidth value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} />
                  <Autocomplete
                    size="small"
                    options={selectedShippingCountry ? getStatesByCountry(selectedShippingCountry) : []}
                    getOptionLabel={(o) => o.name}
                    value={selectedShippingState ? getStatesByCountry(selectedShippingCountry).find(s => s.name === selectedShippingState) : null}
                    onChange={(_, val) => setSelectedShippingState(val?.name || null)}
                    sx={{ flexGrow: 1 }}
                    renderInput={(params) => <TextField {...params} label="State" />}
                  />
                </Box>
                <TextField size="small" label="Zip Code" fullWidth value={shippingZip} onChange={(e) => setShippingZip(e.target.value)} />
              </Box>
            </Grid>
          </Grid>
        )}

        {activeTab === "contacts" && (
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 2 }}>Contact Persons</Typography>
            <Grid container spacing={2}>
              {contacts.map((contact, idx) => (
                <Grid item xs={12} key={idx} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2, position: "relative" }}>
                   <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Autocomplete
                        size="small"
                        options={Salutations}
                        renderInput={(params) => <TextField {...params} placeholder="Sal" sx={{ width: 80 }} />}
                    />
                    <TextField size="small" placeholder="First Name" sx={{ flexGrow: 1 }} />
                    <TextField size="small" placeholder="Last Name" sx={{ flexGrow: 1 }} />
                   </Box>
                   <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField size="small" placeholder="Email Address" sx={{ flexGrow: 1 }} />
                    <TextField size="small" placeholder="Work Phone" sx={{ width: 200 }} />
                    <TextField size="small" placeholder="Mobile" sx={{ width: 200 }} />
                   </Box>
                </Grid>
              ))}
            </Grid>
            <Button 
                variant="outlined" 
                size="small" 
                onClick={() => setContacts([...contacts, { salutation: null, f_name: "", l_name: "", email: "", phone: "", mobile: "", is_primary: false }])}
                sx={{ mt: 1, textTransform: "none" }}
            >
                Add Contact Person
            </Button>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: "1px solid #e6e6e6", 
        display: "flex", 
        gap: 2, 
        bgcolor: "#F9F9FB",
        position: 'sticky',
        bottom: 0,
        zIndex: 10
      }}>
        <Button variant="contained" onClick={handleSave} sx={{ bgcolor: "#408DFB", color: "#fff", "&:hover": { bgcolor: "#357abd" }, textTransform: "none", px: 4, fontWeight: 'bold' }}>
          Save
        </Button>
        <Button variant="outlined" onClick={props.handleClose} sx={{ textTransform: "none", px: 4, color: '#666', borderColor: '#ddd' }}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ModalCustomerMaster;
