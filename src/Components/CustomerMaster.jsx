import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  Divider,
  Drawer,
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
  Tooltip,
  Typography,
  Box,
  Stack
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ModalCustomerMaster from "../UsableContent/ModalCustomerMaster";
import SuiSnackbar from "../Snackbars/SuiSnackbar";

const CustomerMaster = ({ onNewClick, onClose }) => {
  const [customerTable, setCustomerTable] = useState([]); // Empty by default as requested
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Table Columns (Standardized with missing names)
  const columns = [
    { id: "type", label: "CUSTOMER TYPE", minWidth: 150 },
    { id: "name", label: "DISPLAY NAME", minWidth: 200 },
    { id: "company", label: "COMPANY NAME", minWidth: 200 },
    { id: "email", label: "E-MAIL", minWidth: 200 },
    { id: "phone", label: "WORK PHONE", minWidth: 150 },
    { id: "receivables", label: "RECEIVABLES", minWidth: 150, align: "right" },
    { id: "gstTreatment", label: "GST TREATMENT", minWidth: 200 },
    { id: "gstin", label: "GSTIN", minWidth: 200 },
  ];

  const handleCheckboxClick = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff", position: "relative" }}>
      <SuiSnackbar
        open={snackbarOpen}
        color="#E8F5E9"
        icon="success"
        content={snackbarMessage}
        close={() => setSnackbarOpen(false)}
      />

      {/* Header Section (Standardized & Complete) */}
      <Box sx={{ 
        p: { xs: "10px 15px", md: "10px 30px" }, 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between", 
        alignItems: { xs: "flex-start", sm: "center" }, 
        borderBottom: "1px solid #eee",
        bgcolor: "#F9F9FB", 
        minHeight: "75px",
        gap: { xs: 2, sm: 0 }
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 3 }, width: { xs: "100%", sm: "auto" } }}>
            <Typography sx={{ 
              fontSize: { xs: "1.2rem", md: "1.5rem" }, 
              fontWeight: "bold", 
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#333",
              whiteSpace: "nowrap"
            }}>
                All Customers
            </Typography>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              bgcolor: "#fff", 
              border: "1px solid #ddd", 
              borderRadius: 1, 
              px: { xs: 1, md: 2 },
              flexGrow: { xs: 1, sm: 0 }
            }}>
                <SearchIcon sx={{ color: "gray", fontSize: "1.2rem" }} />
                <TextField
                    variant="standard"
                    placeholder="Search..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{ disableUnderline: true, sx: { px: 1, py: 0.8, width: { xs: "100%", sm: 200, md: 300 }, fontSize: "0.95rem" } }}
                />
            </Box>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onNewClick}
                sx={{ bgcolor: "#408DFB", textTransform: "none", borderRadius: "4px", px: 4, height: "36px", fontWeight: "600" }}
            >
                New
            </Button>
            <IconButton size="small"><MoreVertIcon /></IconButton>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
                <CloseIcon />
            </IconButton>
        </Stack>
      </Box>

      {/* Filter Chips / Quick Actions */}
      <Box sx={{ px: 2, py: 1, display: "flex", gap: 1, borderBottom: "1px solid #eee", bgcolor: "#fafafa" }}>
        <Button size="small" variant="text" startIcon={<FilterListIcon />} sx={{ color: "#666", textTransform: "none" }}>Filter</Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} elevation={0} sx={{ flexGrow: 1, overflowY: "auto" }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox size="small" indeterminate={selectedItems.length > 0 && selectedItems.length < customerTable.length} checked={customerTable.length > 0 && selectedItems.length === customerTable.length} />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} sx={{ fontWeight: "bold", color: "#666", fontSize: "0.75rem", py: 1.5 }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {customerTable.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 12 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Box component="img" src="/src/assets/truck.png" sx={{ width: 180, opacity: 0.8, mb: 1 }} />
                            <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: "#666", letterSpacing: 1 }}>SCHWING STETTER</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mb: 2 }}>
                                Currently, no customers are available. Select 'Create New' to add a new one.
                            </Typography>
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />}
                                onClick={onNewClick}
                                sx={{ bgcolor: "#408DFB", textTransform: "none", px: 4, py: 1 }}
                            >
                                CREATE NEW
                            </Button>
                        </Box>
                    </TableCell>
                </TableRow>
            ) : (
                customerTable.map((row) => (
                    <TableRow key={row.id} hover onClick={() => handleRowClick(row)} sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f9f9fb" } }}>
                        <TableCell padding="checkbox">
                            <Checkbox size="small" checked={selectedItems.includes(row.id)} onClick={(e) => { e.stopPropagation(); handleCheckboxClick(row.id); }} />
                        </TableCell>
                        <TableCell sx={{ color: "#408DFB", fontWeight: "600" }}>{row.type || "Business"}</TableCell>
                        <TableCell sx={{ fontWeight: "500" }}>{row.name}</TableCell>
                        <TableCell>{row.company}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell align="right" sx={{ color: row.receivables > 0 ? "red" : "inherit" }}>₹{row.receivables?.toLocaleString() || "0.00"}</TableCell>
                        <TableCell>{row.gstTreatment || "-"}</TableCell>
                        <TableCell>{row.gstin || "-"}</TableCell>
                    </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* New Customer Modal is now handled by Sidebar's activeModule and viewType */}

      {/* Details Drawer (Ported from legacy functionality) */}
      <Drawer
        anchor="right"
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        PaperProps={{ sx: { width: 600 } }}
      >
        {selectedCustomer && (
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", bgcolor: "#f9f9fb" }}>
                    <Typography variant="h6" fontWeight="bold">{selectedCustomer.name}</Typography>
                    <IconButton onClick={() => setIsDetailsOpen(false)}><CloseIcon /></IconButton>
                </Box>
                <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
                    <Typography variant="subtitle2" color="gray" gutterBottom>OVERVIEW</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="gray">Email</Typography>
                            <Typography variant="body2">{selectedCustomer.email}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="caption" color="gray">Phone</Typography>
                            <Typography variant="body2">{selectedCustomer.phone}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="subtitle2" color="gray" gutterBottom>ADDRESS</Typography>
                    {/* Placeholder for address logic */}
                    <Typography variant="body2">No address provided</Typography>
                </Box>
            </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default CustomerMaster;
