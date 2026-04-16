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

const StatusTabs = ["BASIC INFO", "GST INFO", "ADDRESS", "CONTACT DETAILS"];

const ModalCustomerMaster = (props) => {
  const [activeTab, setActiveTab] = useState("BASIC INFO");
  const [selectedMemberType, setSelectedMemberType] = useState("");
  const [salutationsList, setSalutationsList] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDisplayName, setCompanyDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState("");
  
  const [selectedGstTreatment, setSelectedGstTreatment] = useState(null);
  const [selectedTaxType, setSelectedTaxType] = useState("");
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

  // Populate form if initialData is provided (Edit Mode)
  useEffect(() => {
    if (props.initialData) {
      const d = props.initialData;
      setSelectedMemberType(d.type || "Business");
      setSalutationsList(Salutations.find(s => s.label === d.salutation) || null);
      setFirstName(d.firstName || "");
      setLastName(d.lastName || "");
      setCompanyName(d.company || "");
      setCompanyDisplayName(d.name || "");
      setEmail(d.email || "");
      setPhone(d.phone || "");
      setMobile(d.mobile || "");
      
      setSelectedGstTreatment(mockGstTreatments.find(g => g.gst_head === d.gstTreatment) || null);
      setPanNo(d.panNo || "");
      setGstIn(d.gstIn || "");
      // Note: State finding might be tricky depending on how they are stored, 
      // but we'll try to find by name for now.
      const suppliedStates = getStatesByCountry("India");
      setSelectedPlaceOfSupply(suppliedStates.find(s => s.name === d.placeOfSupply) || null);
      setSelectedTaxType(d.taxPreference || "Taxable");

      setBillingAttention(d.billingAttention || "");
      setBillingAddress1(d.billingAddress1 || "");
      setBillingAddress2(d.billingAddress2 || "");
      setBillingCity(d.billingCity || "");
      setBillingZip(d.billingZip || "");
      setBillingPhone(d.billingPhone || "");
      setBillingFax(d.billingFax || "");
      setSelectedBillingCountry(d.billingCountry || null);
      setSelectedBillingState(d.billingState || null);

      setShippingAttention(d.shippingAttention || "");
      setShippingAddress1(d.shippingAddress1 || "");
      setShippingAddress2(d.shippingAddress2 || "");
      setShippingCity(d.shippingCity || "");
      setShippingZip(d.shippingZip || "");
      setShippingPhone(d.shippingPhone || "");
      setShippingFax(d.shippingFax || "");
      setSelectedShippingCountry(d.shippingCountry || null);
      setSelectedShippingState(d.shippingState || null);

      if (d.contacts && d.contacts.length > 0) {
        setContacts(d.contacts);
      }
    }
  }, [props.initialData]);

  const handleSave = () => {
    const isEdit = !!props.initialData;
    const customerObj = {
      id: isEdit ? props.initialData.id : Date.now(),
      createdAt: isEdit ? props.initialData.createdAt : new Date().toLocaleString(),
      // Basic Info
      salutation: salutationsList?.label || "",
      firstName,
      lastName,
      name: companyDisplayName || `${firstName} ${lastName}`.trim() || "Unnamed Customer",
      company: companyName,
      email,
      phone,
      mobile,
      type: selectedMemberType || "Business",
      // GST Info
      gstTreatment: selectedGstTreatment?.gst_head || "",
      panNo,
      gstIn,
      placeOfSupply: selectedPlaceOfSupply?.name || "",
      taxPreference: selectedTaxType || "Taxable",
      // Billing Address
      billingAttention,
      billingAddress1,
      billingAddress2,
      billingCity,
      billingZip,
      billingPhone,
      billingFax,
      billingCountry: selectedBillingCountry,
      billingState: selectedBillingState,
      // Shipping Address
      shippingAttention,
      shippingAddress1,
      shippingAddress2,
      shippingCity,
      shippingZip,
      shippingPhone,
      shippingFax,
      shippingCountry: selectedShippingCountry,
      shippingState: selectedShippingState,
      // Contacts
      contacts,
      receivables: 0,
    };
    if (props.onSave) props.onSave(customerObj);
    setSnackbarMessage(isEdit ? "Customer updated successfully!" : "Customer saved successfully!");
    setSnackbarOpen(true);
    setTimeout(() => { props.handleClose(); }, 1000);
  };

  const countries = Country.getAllCountries();
  const getStatesByCountry = (countryName) => {
    const country = countries.find(c => c.name === countryName);
    return country ? State.getStatesOfCountry(country.isoCode) : [];
  };

  const LabelWithInfo = ({ label, required }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography sx={{ fontWeight: "400", fontSize: "0.85rem", color: "#333", whiteSpace: "nowrap" }}>
        {label}{required && "*"}
      </Typography>
      <InfoOutlinedIcon sx={{ fontSize: 16, color: "#666" }} />
    </Box>
  );

  const handleNext = () => {
    const currentIndex = StatusTabs.indexOf(activeTab);
    if (currentIndex < StatusTabs.length - 1) {
        setActiveTab(StatusTabs[currentIndex + 1]);
    } else {
        handleSave();
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <SuiSnackbar open={snackbarOpen} color={snackbarSeverity === "success" ? "#E8F5E9" : "#ff9999"} icon={snackbarSeverity} content={snackbarMessage} close={handleCloseSnackbar} />
      
      {/* Header */}
      <Box sx={{ 
        p: { xs: "10px 15px", md: "15px 30px" }, 
        borderBottom: "1px solid #e6e6e6", 
        bgcolor: "#F9F9FB", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        minHeight: "65px",
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1a1a1a" }}>{props.initialData ? "Edit Customer" : "New Customer"}</Typography>
        <IconButton onClick={props.handleClose} size="small"><CloseIcon sx={{ fontSize: 20 }} /></IconButton>
      </Box>

      {/* Tabs */}
      <Box sx={{ 
        display: "flex", 
        gap: { xs: 1, sm: 4 }, 
        px: 3, 
        mt: 2,
        borderBottom: "1px solid #e6e6e6",
        bgcolor: "#fff",
        zIndex: 9,
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' }
      }}>
        {StatusTabs.map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            sx={{
              pb: 1, pt: 2,
              borderRadius: 0,
              color: activeTab === tab ? "#408DFB" : "#111",
              borderBottom: activeTab === tab ? "2px solid #408DFB" : "none",
              fontWeight: "700",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              whiteSpace: 'nowrap',
              minWidth: 'auto',
              px: 0
            }}
          >
            {tab}
          </Button>
        ))}
      </Box>

      {/* Content Area */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: { xs: 2, md: 4 } }}>
        {activeTab === "BASIC INFO" && (
          <Box sx={{ maxWidth: 850, mt: 5 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box sx={{ minWidth: 220, width: '25%' }}><LabelWithInfo label="Customer Type" /></Box>
              <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
                <RadioGroup row value={selectedMemberType} onChange={(e) => setSelectedMemberType(e.target.value)}>
                    <FormControlLabel value="Business" control={<Radio size="small" />} label={<Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>Business</Typography>} sx={{ mr: 4 }} />
                    <FormControlLabel value="Individual" control={<Radio size="small" />} label={<Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>Individual</Typography>} />
                </RadioGroup>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box sx={{ minWidth: 220, width: '25%' }}><LabelWithInfo label="Primary Contact" /></Box>
              <Box sx={{ flexGrow: 1, maxWidth: 600, display: "flex", gap: 1.5 }}>
                <Autocomplete
                    size="small"
                    options={Salutations}
                    getOptionLabel={(o) => o.label}
                    value={salutationsList}
                    onChange={(_, val) => setSalutationsList(val)}
                    renderInput={(params) => <TextField {...params} placeholder="Salutation" sx={{ width: 140 }} />}
                />
                <TextField size="small" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} sx={{ flex: 1 }} />
                <TextField size="small" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} sx={{ flex: 1 }} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box sx={{ minWidth: 220, width: '25%' }}><LabelWithInfo label="Company Name" /></Box>
              <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
                <TextField size="small" fullWidth placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box sx={{ minWidth: 220, width: '25%' }}><LabelWithInfo label="Customer Display Name" required /></Box>
              <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
                <TextField size="small" fullWidth placeholder="Company Display Name" value={companyDisplayName} onChange={(e) => setCompanyDisplayName(e.target.value)} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box sx={{ minWidth: 220, width: '25%' }}><LabelWithInfo label="Customer E-mail" required /></Box>
              <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
                <TextField 
                    size="small" 
                    fullWidth 
                    placeholder="Email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ fontSize: 18, color: "#999" }} /></InputAdornment> }}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box sx={{ minWidth: 220, width: '25%' }}><LabelWithInfo label="Customer Phone" /></Box>
              <Box sx={{ flexGrow: 1, maxWidth: 600, display: "flex", gap: 1.5 }}>
                <TextField 
                    size="small" 
                    placeholder="Phone"
                    fullWidth 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><LocalPhoneIcon sx={{ fontSize: 18, color: "#999" }} /></InputAdornment> }}
                />
                <TextField 
                    size="small" 
                    placeholder="Mobile"
                    fullWidth 
                    value={mobile} 
                    onChange={(e) => setMobile(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneAndroidIcon sx={{ fontSize: 18, color: "#999" }} /></InputAdornment> }}
                />
              </Box>
            </Box>
          </Box>
        )}

        {activeTab === "GST INFO" && (
          <Box sx={{ maxWidth: 850, mt: 5 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box sx={{ minWidth: 220, width: '25%' }}><LabelWithInfo label="GST Treatment" required /></Box>
              <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
                <Autocomplete size="small" fullWidth options={mockGstTreatments} getOptionLabel={(o) => o.gst_head} value={selectedGstTreatment} onChange={(_, val) => setSelectedGstTreatment(val)} renderInput={(params) => <TextField {...params} placeholder="Select GST Treatment" />} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box sx={{ minWidth: 220, width: '25%' }}><LabelWithInfo label="PAN No" /></Box>
              <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
                <TextField size="small" fullWidth placeholder="PAN No" value={panNo} onChange={(e) => setPanNo(e.target.value)} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box sx={{ minWidth: 220, width: '25%' }}><LabelWithInfo label="Place of Supply" required /></Box>
              <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
                <Autocomplete size="small" fullWidth options={getStatesByCountry("India")} getOptionLabel={(o) => o?.name || ""} value={selectedPlaceOfSupply} onChange={(_, val) => setSelectedPlaceOfSupply(val)} renderInput={(params) => <TextField {...params} placeholder="Select State" />} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Box sx={{ minWidth: 220, width: '25%' }}><LabelWithInfo label="Tax Preference" /></Box>
              <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
                <RadioGroup row value={selectedTaxType} onChange={(e) => setSelectedTaxType(e.target.value)}>
                    <FormControlLabel value="Taxable" control={<Radio size="small" />} label={<Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>Taxable</Typography>} sx={{ mr: 4 }} />
                    <FormControlLabel value="Exempt" control={<Radio size="small" />} label={<Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>Exempt</Typography>} />
                </RadioGroup>
              </Box>
            </Box>
          </Box>
        )}

        {activeTab === "ADDRESS" && (
           <Grid container spacing={4} sx={{ mt: 5 }}>
             <Grid item xs={12} md={6}>
             <Typography sx={{ fontWeight: "bold", mb: 2, color: "#408DFB", fontSize: '0.85rem' }}>BILLING ADDRESS</Typography>
             <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
               <TextField size="small" label="Attention" fullWidth value={billingAttention} onChange={(e) => setBillingAttention(e.target.value)} />
               <Autocomplete size="small" options={countries} getOptionLabel={(o) => o.name} value={selectedBillingCountry ? countries.find(c => c.name === selectedBillingCountry) : null} onChange={(_, val) => { setSelectedBillingCountry(val?.name || null); setSelectedBillingState(null); }} renderInput={(params) => <TextField {...params} label="Country" />} />
               <TextField size="small" label="Address Line 1" multiline rows={2} fullWidth value={billingAddress1} onChange={(e) => setBillingAddress1(e.target.value)} />
               <TextField size="small" label="Address Line 2" fullWidth value={billingAddress2} onChange={(e) => setBillingAddress2(e.target.value)} />
               <Box sx={{ display: "flex", gap: 1 }}>
                 <TextField size="small" label="City" fullWidth value={billingCity} onChange={(e) => setBillingCity(e.target.value)} />
                 <Autocomplete size="small" options={selectedBillingCountry ? getStatesByCountry(selectedBillingCountry) : []} getOptionLabel={(o) => o.name} value={selectedBillingState ? getStatesByCountry(selectedBillingCountry).find(s => s.name === selectedBillingState) : null} onChange={(_, val) => setSelectedBillingState(val?.name || null)} sx={{ flexGrow: 1 }} renderInput={(params) => <TextField {...params} label="State" />} />
               </Box>
               <TextField size="small" label="Zip Code" fullWidth value={billingZip} onChange={(e) => setBillingZip(e.target.value)} />
             </Box>
           </Grid>
           <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontWeight: "bold", color: "#408DFB", fontSize: '0.85rem' }}>SHIPPING ADDRESS</Typography>
                <Button size="small" onClick={() => { setShippingAttention(billingAttention); setShippingAddress1(billingAddress1); setShippingAddress2(billingAddress2); setShippingCity(billingCity); setShippingZip(billingZip); setSelectedShippingCountry(selectedBillingCountry); setSelectedShippingState(selectedBillingState); }} sx={{ textTransform: "none", fontSize: "0.7rem", color: '#408DFB' }}>Copy Billing Address</Button>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField size="small" label="Attention" fullWidth value={shippingAttention} onChange={(e) => setShippingAttention(e.target.value)} />
                <Autocomplete size="small" options={countries} getOptionLabel={(o) => o.name} value={selectedShippingCountry ? countries.find(c => c.name === selectedShippingCountry) : null} onChange={(_, val) => { setSelectedShippingCountry(val?.name || null); setSelectedShippingState(null); }} renderInput={(params) => <TextField {...params} label="Country" />} />
                <TextField size="small" label="Address Line 1" multiline rows={2} fullWidth value={shippingAddress1} onChange={(e) => setShippingAddress1(e.target.value)} />
                <TextField size="small" label="Address Line 2" fullWidth value={shippingAddress2} onChange={(e) => setShippingAddress2(e.target.value)} />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField size="small" label="City" fullWidth value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} />
                  <Autocomplete size="small" options={selectedShippingCountry ? getStatesByCountry(selectedShippingCountry) : []} getOptionLabel={(o) => o.name} value={selectedShippingState ? getStatesByCountry(selectedShippingCountry).find(s => s.name === selectedShippingState) : null} onChange={(_, val) => setSelectedShippingState(val?.name || null)} sx={{ flexGrow: 1 }} renderInput={(params) => <TextField {...params} label="State" />} />
                </Box>
                <TextField size="small" label="Zip Code" fullWidth value={shippingZip} onChange={(e) => setShippingZip(e.target.value)} />
              </Box>
           </Grid>
         </Grid>
        )}

        {activeTab === "CONTACT DETAILS" && (
          <Box sx={{ mt: 5 }}>
            <Typography sx={{ fontWeight: "700", mb: 2, fontSize: '0.9rem' }}>Contact Persons</Typography>
            <Grid container spacing={2}>
              {contacts.map((contact, idx) => (
                <Grid item xs={12} key={idx} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2 }}>
                   <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Autocomplete size="small" options={Salutations} renderInput={(params) => <TextField {...params} placeholder="Sal" sx={{ width: 100 }} />} />
                    <TextField size="small" placeholder="First Name" sx={{ flexGrow: 1 }} />
                    <TextField size="small" placeholder="Last Name" sx={{ flexGrow: 1 }} />
                   </Box>
                   <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField size="small" placeholder="Email Address" sx={{ flexGrow: 1 }} />
                    <TextField size="small" placeholder="Work Phone" sx={{ width: 180 }} />
                    <TextField size="small" placeholder="Mobile" sx={{ width: 180 }} />
                   </Box>
                </Grid>
              ))}
            </Grid>
            <Button variant="outlined" size="small" onClick={() => setContacts([...contacts, { salutation: null, f_name: "", l_name: "", email: "", phone: "", mobile: "", is_primary: false }])} sx={{ mt: 1, textTransform: "none", color: '#408DFB', borderColor: '#408DFB' }}>Add Contact Person</Button>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ 
        p: 2, 
        borderTop: "1px solid #e6e6e6", 
        display: "flex", 
        justifyContent: "flex-end",
        gap: 1.5, 
        bgcolor: "#fff",
        position: 'sticky',
        bottom: 0,
        zIndex: 10
      }}>
        <Button variant="text" onClick={props.handleClose} sx={{ color: "#408DFB", textTransform: "uppercase", fontSize: "0.8rem", fontWeight: "bold", px: 3 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleNext} sx={{ bgcolor: "#408DFB", color: "#fff", "&:hover": { bgcolor: "#357abd" }, textTransform: "uppercase", fontSize: "0.8rem", fontWeight: "bold", px: 4, minWidth: 100 }}>
          {activeTab === StatusTabs[StatusTabs.length - 1] ? "Save" : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default ModalCustomerMaster;
