import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  ListItemText,
  ListItemIcon,
  Modal,
  FormControlLabel,
  Divider,
} from "@mui/material";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import AddIcon from "@mui/icons-material/Add";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

const statusList = [
  "All",
  "Draft",
  "Sent",
  "Accepted",
  "Declined",
  "Expired",
  "Invoiced",
];

const Quotes = ({ onNewClick, onClose }) => {
  const [quoteTable, setQuoteTable] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [searchText, setSearchText] = useState("");
  const [isCustomizeOpen, setCustomizeOpen] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState({
    Date: true,
    "Quote Number": true,
    "Reference#": true,
    "Customer Name": true,
    "Quote Status": true,
    Total: true,
    "Sub Total": true,
    "Expiry Date": true,
    "Company Name": true,
    "Accepted Date": true,
  });

  useEffect(() => {
    // Mock data for UI development
    setQuoteTable([
      { id: 1, quote_date: "2026-04-09", quote_no: "QT-000001", reference: "REF-001", cust_name: "John Doe", status: "Draft", total: 5000, sub_total: 4500, exp_date: "2026-05-09", company_name: "ABC Corp", status_color: "gray" },
      { id: 2, quote_date: "2026-04-09", quote_no: "QT-000002", reference: "REF-002", cust_name: "Jane Smith", status: "Sent", total: 12000, sub_total: 11000, exp_date: "2026-05-09", company_name: "XYZ Ltd", status_color: "blue" },
    ]);
  }, []);

  const handleStatusMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleStatusMenuClose = () => setAnchorEl(null);
  
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    handleStatusMenuClose();
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedItems(quoteTable.map((item) => item.id));
      setSelectAll(true);
    } else {
      setSelectedItems([]);
      setSelectAll(false);
    }
  };

  const handleCheckboxClick = (event, id) => {
    const selectedIndex = selectedItems.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selectedItems, id];
    } else {
      newSelected = selectedItems.filter((item) => item !== id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.length === quoteTable.length);
  };

  const columnOptions = Object.keys(selectedColumns);
  const selectedCount = columnOptions.filter((col) => selectedColumns[col]).length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", overflow: "hidden", backgroundColor: "#fff" }}>
      {/* Header Bar */}
      <Box sx={{ 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between", 
        alignItems: { xs: "flex-start", sm: "center" }, 
        p: { xs: "10px 15px", md: "20px 30px" }, 
        borderBottom: "1px solid #f0f0f0",
        bgcolor: "#F9F9FB",
        minHeight: "75px",
        gap: { xs: 2, sm: 0 }
      }}>
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer", width: { xs: "100%", sm: "auto" } }} onClick={handleStatusMenuOpen}>
          <Typography sx={{ 
            fontWeight: 700, 
            fontSize: { xs: "1.2rem", md: "1.5rem" }, 
            color: "#1a1a1a", 
            fontFamily: "Helvetica",
            whiteSpace: "nowrap"
          }}>
            {selectedStatus === "All" ? "All status" : selectedStatus} Quotes
          </Typography>
          <ExpandMoreRounded sx={{ ml: 1, color: "#408DFB", fontSize: "24px" }} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: { xs: "100%", sm: "auto" }, justifyContent: { xs: "space-between", sm: "flex-end" } }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: { xs: "100%", sm: "200px", md: "250px" },
              "& .MuiOutlinedInput-root": {
                height: "36px",
                borderRadius: "4px",
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                "& fieldset": { borderColor: "transparent" },
              },
              "& .MuiInputBase-input": { fontSize: "14px" }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: "#999" }} />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: "18px" }} />}
            onClick={onNewClick}
            sx={{
              backgroundColor: "#408DFB",
              height: "36px",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "none",
              px: { xs: 2, md: 3 },
              boxShadow: "none",
              whiteSpace: "nowrap",
              '&:hover': { backgroundColor: "#3070C0" }
            }}
          >
            New
          </Button>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, display: { xs: "none", sm: "block" } }} />
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main Table Area */}
      <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <TableContainer sx={{ flex: 1, overflow: "auto" }}>
          <Table stickyHeader sx={{ minWidth: 1500 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60, p: 1, backgroundColor: "#f9f9f9" }}>
                  <IconButton size="small" onClick={() => setCustomizeOpen(true)}>
                    <ViewColumnIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell sx={{ width: 50, p: 1, backgroundColor: "#f9f9f9" }}>
                  <Checkbox size="small" checked={selectAll} onChange={handleSelectAllClick} />
                </TableCell>
                {[
                  "DATE", "QUOTE NUMBER", "REFERENCE#", "CUSTOMER NAME", 
                  "QUOTE STATUS", "TOTAL", "SUB TOTAL", "EXPIRY DATE", 
                  "COMPANY NAME", "ACCEPTED DATE"
                ].map((header) => (
                  selectedColumns[header] !== false && (
                    <TableCell key={header} sx={{ 
                      fontSize: "11px", 
                      fontWeight: 700, 
                      color: "#888", 
                      textTransform: "uppercase",
                      backgroundColor: "#f9f9f9",
                      borderBottom: "1px solid #eee"
                    }}>
                      {header}
                    </TableCell>
                  )
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {quoteTable.map((row, index) => (
                <TableRow key={index} hover sx={{ cursor: "pointer" }}>
                  <TableCell />
                  <TableCell>
                    <Checkbox size="small" checked={selectedItems.includes(row.id)} onChange={(e) => handleCheckboxClick(e, row.id)} />
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px", color: row.status_color === "red" ? "red" : "#333" }}>{row.quote_date}</TableCell>
                  <TableCell sx={{ fontSize: "13px", color: "#408DFB" }}>{row.quote_no}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.reference}</TableCell>
                  <TableCell sx={{ fontSize: "13px", fontWeight: 600 }}>{row.cust_name}</TableCell>
                  <TableCell>
                    <Box sx={{ 
                      display: "inline-block", 
                      px: 1, 
                      py: 0.2, 
                      borderRadius: "4px", 
                      fontSize: "11px", 
                      fontWeight: 600,
                      backgroundColor: row.status === "Draft" ? "#f0f0f0" : "#e3f2fd",
                      color: row.status === "Draft" ? "#666" : "#1976d2"
                    }}>
                      {row.status.toUpperCase()}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>₹{row.total.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>₹{row.sub_total.toLocaleString()}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.exp_date}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.company_name}</TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>{row.accepted_date || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Status Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleStatusMenuClose}>
        {statusList.map((st) => (
          <MenuItem key={st} onClick={() => handleStatusSelect(st)} sx={{ minWidth: 160, fontSize: "14px" }}>
            {st} Quotes
          </MenuItem>
        ))}
      </Menu>

      {/* Customize Columns Modal */}
      <Modal open={isCustomizeOpen} onClose={() => setCustomizeOpen(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 400, bgcolor: "white", boxShadow: 24, p: 0, borderRadius: 2, overflow: "hidden"
        }}>
          <Box sx={{ p: 2, backgroundColor: "#f9f9f9", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: 700 }}>Customize Columns</Typography>
            <IconButton size="small" onClick={() => setCustomizeOpen(false)}><CloseIcon fontSize="small"/></IconButton>
          </Box>
          <Box sx={{ p: 2, maxHeight: 400, overflowY: "auto" }}>
            <List>
              {columnOptions.map((col) => (
                <ListItem key={col} dense sx={{ display: "flex", alignItems: "center" }}>
                  <ListItemIcon sx={{ minWidth: 32 }}><DragIndicatorIcon sx={{ fontSize: 18, color: "#ccc" }}/></ListItemIcon>
                  <FormControlLabel
                    control={<Checkbox size="small" checked={selectedColumns[col]} onChange={() => setSelectedColumns(prev => ({...prev, [col]: !prev[col]}))}/>}
                    label={<Typography sx={{ fontSize: "14px" }}>{col}</Typography>}
                  />
                  {["Date", "Quote Number"].includes(col) && <LockIcon sx={{ fontSize: 14, color: "#999", ml: 1 }}/>}
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ p: 2, borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={() => setCustomizeOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
            <Button variant="contained" onClick={() => setCustomizeOpen(false)} sx={{ textTransform: "none", backgroundColor: "#1976d2" }}>Save</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Quotes;
