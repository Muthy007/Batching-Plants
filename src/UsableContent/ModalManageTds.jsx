import {
  Autocomplete,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
  IconButton,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SuiSnackbar from "../Snackbars/SuiSnackbar";

const ModalManageTds = (props) => {
  const [view, setView] = useState("list"); // "list" | "add" | "edit"
  const [taxName, setTaxName] = useState("");
  const [rate, setRate] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [isHigherRate, setIsHigherRate] = useState(false);
  const [payableAccount, setPayableAccount] = useState("TDS Payable");
  const [receivableAccount, setReceivableAccount] = useState("TDS Receivable");

  const [tdsList, setTdsList] = useState([
    { id: 1, tax_name: "Dividend (Reduced)", rate: "7.5", section: "Section 194" },
    { id: 2, tax_name: "Other Interest than securities", rate: "10", section: "Section 194A" },
    { id: 3, tax_name: "Other Interest than securities (Reduced)", rate: "7.5", section: "Section 194A" },
    { id: 4, tax_name: "Dividend", rate: "10", section: "Section 194B" },
    { id: 5, tax_name: "Payment of contractors for Others", rate: "2", section: "Section 194C" },
    { id: 6, tax_name: "Payment of contractors for Others (Reduced)", rate: "1.5", section: "Section 194C" },
    { id: 7, tax_name: "Payment of contractors HUF/Indiv", rate: "1", section: "Section 194C" },
    { id: 8, tax_name: "Payment of contractors HUF/Indiv (Reduced)", rate: "0.75", section: "Section 194C" },
    { id: 9, tax_name: "Commission or Brokerage", rate: "5", section: "Section 194H" },
    { id: 10, tax_name: "Commission or Brokerage (Reduced)", rate: "3.75", section: "Section 194H" },
  ]);

  const [sectionList] = useState([
    { id: 1, section: "194 - Dividend" },
    { id: 2, section: "194A - Interest other than securities" },
    { id: 3, section: "194B - Winnings from lotteries" },
    { id: 4, section: "194C - Contractors" },
    { id: 5, section: "194H - Commission" },
    { id: 6, section: "194I - Rent" },
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleEditClick = (item) => {
    setTaxName(item.tax_name);
    setRate(item.rate);
    setSelectedSection(sectionList.find(s => s.section.includes(item.section)) || null);
    setView("edit");
  };

  const handleSaveTDS = () => {
    setSnackbarMessage(view === "add" ? "Tax added successfully!" : "Tax updated successfully!");
    setSnackbarOpen(true);
    setTimeout(() => {
        setView("list");
        // Reset form
        setTaxName("");
        setRate("");
        setSelectedSection(null);
        setIsHigherRate(false);
    }, 800);
  };

  const renderList = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: 600, fontSize: "1.2rem", color: "#333" }}>Manage TDS</Typography>
        <IconButton onClick={props.handleManageTdsClose} size="small"><CloseIcon /></IconButton>
      </Box>
      <Box sx={{ p: "30px 40px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography sx={{ fontSize: "1.45rem", fontWeight: 500, color: "#111" }}>TDS taxes</Typography>
            <Button 
                variant="contained" 
                startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={() => setView("add")}
                sx={{ bgcolor: "#408DFB", textTransform: "none", borderRadius: "4px", px: 4, py: 1.2, fontWeight: 600, fontSize: "0.9rem", boxShadow: "none" }}
            >
                NEW TDS TAX
            </Button>
        </Box>

        <TableContainer component={Box} sx={{ flexGrow: 1, overflowY: "auto" }}>
            <Table stickyHeader size="medium">
                <TableHead>
                    <TableRow>
                        {["TAX NAME", "RATE(%)", "SECTION"].map((head) => (
                            <TableCell key={head} sx={{ fontWeight: 700, bgcolor: "#fff", color: "#A9AEBC", fontSize: "0.75rem", borderBottom: "1px solid #eee", py: 2, letterSpacing: "0.5px" }}>
                                {head}
                            </TableCell>
                        ))}
                        <TableCell sx={{ bgcolor: "#fff", borderBottom: "1px solid #eee" }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tdsList.map((item) => (
                        <TableRow key={item.id} sx={{ "&:hover": { bgcolor: "#f9f9f9", "& .action-icons": { opacity: 1 } } }}>
                            <TableCell sx={{ fontSize: "0.95rem", color: "#333", borderBottom: "1px solid #eee", py: 2.2 }}>{item.tax_name}</TableCell>
                            <TableCell sx={{ fontSize: "0.95rem", color: "#333", borderBottom: "1px solid #eee" }}>{item.rate}</TableCell>
                            <TableCell sx={{ fontSize: "0.95rem", color: "#333", borderBottom: "1px solid #eee" }}>{item.section}</TableCell>
                            <TableCell sx={{ borderBottom: "1px solid #eee", textAlign: "right", pr: 3 }}>
                                <Box className="action-icons" sx={{ opacity: 0, transition: "0.2s" }}>
                                    <IconButton onClick={() => handleEditClick(item)} size="small" sx={{ color: "#408DFB", mr: 1 }}><EditOutlinedIcon sx={{ fontSize: 20 }} /></IconButton>
                                    <IconButton size="small" sx={{ color: "#FF4D4D" }}><DeleteIcon sx={{ fontSize: 20 }} /></IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
      </Box>
    </Box>
  );

  const renderForm = (isEdit = false) => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      {/* Header */}
      <Box sx={{ px: 3, py: 2.2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: 600, fontSize: "1.15rem" }}>{isEdit ? "Edit Tax" : "New Tax"}</Typography>
        <IconButton onClick={() => setView("list")} size="small"><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ p: "50px 60px", flexGrow: 1 }}>
        <Grid container columnSpacing={8} rowSpacing={10}>
          {/* Row 1: Tax Name and Rate */}
          <Grid item xs={6}>
            <Typography sx={{ color: "#FF4D4D", fontSize: "15px", mb: 1.5, fontWeight: 500 }}>Tax Name*</Typography>
            <TextField 
                fullWidth 
                size="medium"
                value={taxName} 
                onChange={(e) => setTaxName(e.target.value)} 
                sx={{ 
                    "& .MuiOutlinedInput-root": { height: "45px", bgcolor: "#fff", borderRadius: "4px", fontSize: "14px", "& fieldset": { borderColor: "#ddd" } },
                    "& .MuiInputBase-input": { padding: "10px 14px" }
                }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ color: "#FF4D4D", fontSize: "15px", mb: 1.5, fontWeight: 500 }}>Rate(%)*</Typography>
            <TextField 
                fullWidth 
                size="medium"
                type="number" 
                value={rate} 
                onChange={(e) => setRate(e.target.value)}
                sx={{ 
                    "& .MuiOutlinedInput-root": { height: "45px", bgcolor: "#fff", borderRadius: "4px", fontSize: "14px", "& fieldset": { borderColor: "#ddd" } },
                    "& .MuiInputBase-input": { padding: "10px 14px" }
                }}
            />
          </Grid>
          
          {/* Row 2: Section (Perfectly aligned with left column) */}
          <Grid item xs={6}>
            <Typography sx={{ color: "#FF4D4D", fontSize: "15px", mb: 1.5, fontWeight: 500 }}>Section*</Typography>
            <Autocomplete
                size="medium"
                options={sectionList}
                getOptionLabel={(o) => o.section}
                value={selectedSection}
                onChange={(_, v) => setSelectedSection(v)}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
                sx={{ 
                    "& .MuiOutlinedInput-root": { height: "45px", bgcolor: "#fff", borderRadius: "4px", py: 0.3, "& fieldset": { borderColor: "#ddd" } },
                    "& .MuiInputBase-input": { height: "100%", padding: "0 10px !important" }
                }}
            />
          </Grid>
          <Grid item xs={6} />
          
          {/* Row 3: Account selections */}
          <Grid item xs={6}>
            <Typography sx={{ color: "#FF4D4D", fontSize: "15px", mb: 1.5, fontWeight: 500 }}>TDS Payable Account</Typography>
            <Autocomplete
                size="medium"
                options={["TDS Payable", "TDS Expenses", "Other"]}
                value={payableAccount}
                onChange={(_, v) => setPayableAccount(v)}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
                sx={{ 
                    "& .MuiOutlinedInput-root": { height: "45px", bgcolor: "#fff", borderRadius: "4px", py: 0.3, "& fieldset": { borderColor: "#ddd" } },
                    "& .MuiInputBase-input": { height: "100%", padding: "0 10px !important" }
                }}
            />
          </Grid>
          
          <Grid item xs={6}>
            <Typography sx={{ color: "#FF4D4D", fontSize: "15px", mb: 1.5, fontWeight: 500 }}>TCS Receivable Account</Typography>
            <Autocomplete
                size="medium"
                options={["TDS Receivable", "TCS Income", "Other"]}
                value={receivableAccount}
                onChange={(_, v) => setReceivableAccount(v)}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
                sx={{ 
                    "& .MuiOutlinedInput-root": { height: "45px", bgcolor: "#fff", borderRadius: "4px", py: 0.3, "& fieldset": { borderColor: "#ddd" } },
                    "& .MuiInputBase-input": { height: "100%", padding: "0 10px !important" }
                }}
            />
          </Grid>

          {/* Row 4: Checkbox */}
          <Grid item xs={12}>
            <FormControlLabel
                control={<Checkbox checked={isHigherRate} onChange={(e) => setIsHigherRate(e.target.checked)} sx={{ color: "#ccc", "&.Mui-checked": { color: "#408DFB" } }} />}
                label={<Typography sx={{ fontSize: "1.1rem", color: "#333", fontWeight: 500 }}>This is a Higher TDS Rate</Typography>}
                sx={{ mt: 1 }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box sx={{ p: "25px 40px", borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", gap: 3, bgcolor: "#fff" }}>
        <Button 
            onClick={() => setView("list")} 
            variant="contained"
            sx={{ bgcolor: "#408DFB", color: "#fff", textTransform: "none", px: 5, py: 1.2, borderRadius: "4px", fontWeight: 600, fontSize: "0.95rem", boxShadow: "none", "&:hover": { bgcolor: "#3378d8" } }}
        >
            CANCEL
        </Button>
        <Button 
            variant="contained" 
            onClick={handleSaveTDS} 
            sx={{ bgcolor: "#408DFB", textTransform: "none", px: 5, py: 1.2, borderRadius: "4px", fontWeight: 600, fontSize: "0.95rem", boxShadow: "none" }}
        >
            SAVE
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "550px", display: "flex", flexDirection: "column" }}>
      <SuiSnackbar open={snackbarOpen} color="#E8F5E9" icon="success" content={snackbarMessage} close={() => setSnackbarOpen(false)} />
      {view === "list" ? renderList() : renderForm(view === "edit")}
    </Box>
  );
};

export default ModalManageTds;
