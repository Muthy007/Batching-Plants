import {
  Autocomplete,
  Button,
  Grid,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SuiSnackbar from "../Snackbars/SuiSnackbar";

const ModalManageTcs = (props) => {
  const [view, setView] = useState("list"); // "list" | "add" | "edit"
  const [taxName, setTaxName] = useState("");
  const [rate, setRate] = useState("");
  const [selectedNature, setSelectedNature] = useState(null);
  const [isHigherRate, setIsHigherRate] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [payableAccount, setPayableAccount] = useState("TCS Payable");
  const [receivableAccount, setReceivableAccount] = useState("TCS Receivable");

  const [tcsList, setTcsList] = useState([
    { id: 1, tax_name: "Sale of Motor Vehicle", rate: "1", nature: "206C(1F)", status: "Active" },
  ]);

  const [natureList] = useState([
    { id: 1, label: "206C(1) - Alcoholic Liquor for human consumption" },
    { id: 2, label: "206C(1) - Tendu leaves" },
    { id: 3, label: "206C(1) - Timber obtained under a forest lease" },
    { id: 4, label: "206C(1C) - Parking lot, Toll plaza, Mining and quarrying" },
    { id: 5, label: "206C(1F) - Sale of motor vehicle" },
    { id: 6, label: "206C(1H) - Sale of any goods" },
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleEditClick = (item) => {
    setTaxName(item.tax_name);
    setRate(item.rate);
    setSelectedNature(natureList.find(n => n.label.includes(item.nature)) || null);
    setView("edit");
  };

  const handleSaveTCS = () => {
    setSnackbarMessage(view === "add" ? "Tax added successfully!" : "Tax updated successfully!");
    setSnackbarOpen(true);
    setTimeout(() => {
        setView("list");
        // Reset form
        setTaxName("");
        setRate("");
        setSelectedNature(null);
        setIsHigherRate(false);
        setStartDate(null);
        setEndDate(null);
    }, 800);
  };

  const renderList = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontWeight: 600, fontSize: "1.2rem", color: "#333" }}>Manage TCS</Typography>
        <IconButton onClick={props.handleManageTcsClose} size="small"><CloseIcon /></IconButton>
      </Box>
      <Box sx={{ p: "30px 40px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography sx={{ fontSize: "1.45rem", fontWeight: 500, color: "#111" }}>TCS taxes</Typography>
            <Button 
                variant="contained" 
                startIcon={<AddIcon sx={{ fontSize: 18 }} />}
                onClick={() => setView("add")}
                sx={{ bgcolor: "#408DFB", textTransform: "none", borderRadius: "4px", px: 4, py: 1.2, fontWeight: 600, fontSize: "0.9rem", boxShadow: "none" }}
            >
                NEW TCS TAX
            </Button>
        </Box>

        <TableContainer component={Box} sx={{ flexGrow: 1, overflowY: "auto" }}>
            <Table stickyHeader size="medium">
                <TableHead>
                    <TableRow>
                        {["TAX NAME", "RATE(%)", "NATURE OF COLLECTION"].map((head) => (
                            <TableCell key={head} sx={{ fontWeight: 700, bgcolor: "#fff", color: "#A9AEBC", fontSize: "0.75rem", borderBottom: "1px solid #eee", py: 2, letterSpacing: "0.5px" }}>
                                {head}
                            </TableCell>
                        ))}
                        <TableCell sx={{ bgcolor: "#fff", borderBottom: "1px solid #eee" }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tcsList.map((item) => (
                        <TableRow key={item.id} sx={{ "&:hover": { bgcolor: "#f9f9f9", "& .action-icons": { opacity: 1 } } }}>
                            <TableCell sx={{ fontSize: "0.95rem", color: "#333", borderBottom: "1px solid #eee", py: 2.2 }}>{item.tax_name}</TableCell>
                            <TableCell sx={{ fontSize: "0.95rem", color: "#333", borderBottom: "1px solid #eee" }}>{item.rate}</TableCell>
                            <TableCell sx={{ fontSize: "0.95rem", color: "#333", borderBottom: "1px solid #eee" }}>{item.nature}</TableCell>
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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

            {/* Row 2: Nature of Collection (Aligned with left column) */}
            <Grid item xs={6}>
                <Typography sx={{ color: "#FF4D4D", fontSize: "15px", mb: 1.5, fontWeight: 500 }}>Nature of Collection*</Typography>
                <Autocomplete
                    size="medium"
                    options={natureList}
                    getOptionLabel={(o) => o.label}
                    value={selectedNature}
                    onChange={(_, v) => setSelectedNature(v)}
                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                    sx={{ 
                        "& .MuiOutlinedInput-root": { height: "45px", bgcolor: "#fff", borderRadius: "4px", py: 0.3, "& fieldset": { borderColor: "#ddd" } },
                        "& .MuiInputBase-input": { height: "100%", padding: "0 10px !important" }
                    }}
                />
            </Grid>
            <Grid item xs={6} />

            {/* Row 3: Account selection */}
            <Grid item xs={6}>
                <Typography sx={{ color: "#FF4D4D", fontSize: "15px", mb: 1.5, fontWeight: 500 }}>TDS Payable Account</Typography>
                <Autocomplete
                    size="medium"
                    options={["TCS Payable", "Other"]}
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
                    options={["TCS Receivable", "Other"]}
                    value={receivableAccount}
                    onChange={(_, v) => setReceivableAccount(v)}
                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                    sx={{ 
                        "& .MuiOutlinedInput-root": { height: "45px", bgcolor: "#fff", borderRadius: "4px", py: 0.3, "& fieldset": { borderColor: "#ddd" } },
                        "& .MuiInputBase-input": { height: "100%", padding: "0 10px !important" }
                    }}
                />
            </Grid>

            {/* Row 4: Higher rate checkbox */}
            <Grid item xs={12}>
                <FormControlLabel
                    control={<Checkbox checked={isHigherRate} onChange={(e) => setIsHigherRate(e.target.checked)} sx={{ color: "#ccc", "&.Mui-checked": { color: "#408DFB" } }} />}
                    label={<Typography sx={{ fontSize: "1.1rem", color: "#333", fontWeight: 500 }}>This is a Higher TCS Rate</Typography>}
                    sx={{ mt: 1 }}
                />
            </Grid>

            {/* Row 5: Applicable Period */}
            <Grid item xs={12}>
                <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                        <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: "#111" }}>Applicable Period</Typography>
                        <HelpOutlineIcon sx={{ fontSize: 22, color: "#666" }} />
                    </Box>
                    <Grid container columnSpacing={10}>
                        <Grid item xs={5}>
                            <Typography sx={{ fontSize: "14px", mb: 1.5, color: "#333", fontWeight: 500 }}>Start Date</Typography>
                            <DatePicker 
                                value={startDate}
                                onChange={(v) => setStartDate(v)}
                                slotProps={{ textField: { fullWidth: true, size: "medium", sx: { "& .MuiOutlinedInput-root": { borderRadius: "4px", height: "45px", "& fieldset": { borderColor: "#ddd" } } } } }}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography sx={{ fontSize: "14px", mb: 1.5, color: "#333", fontWeight: 500 }}>End Date</Typography>
                            <DatePicker 
                                value={endDate}
                                onChange={(v) => setEndDate(v)}
                                slotProps={{ textField: { fullWidth: true, size: "medium", sx: { "& .MuiOutlinedInput-root": { borderRadius: "4px", height: "45px", "& fieldset": { borderColor: "#ddd" } } } } }}
                            />
                        </Grid>
                    </Grid>
                </Box>
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
                onClick={handleSaveTCS} 
                sx={{ bgcolor: "#408DFB", textTransform: "none", px: 5, py: 1.2, borderRadius: "4px", fontWeight: 600, fontSize: "0.95rem", boxShadow: "none" }}
            >
                SAVE
            </Button>
        </Box>
        </Box>
    </LocalizationProvider>
  );

  return (
    <Box sx={{ minHeight: "650px", display: "flex", flexDirection: "column" }}>
      <SuiSnackbar open={snackbarOpen} color="#E8F5E9" icon="success" content={snackbarMessage} close={() => setSnackbarOpen(false)} />
      {view === "list" ? renderList() : renderForm(view === "edit")}
    </Box>
  );
};

export default ModalManageTcs;
