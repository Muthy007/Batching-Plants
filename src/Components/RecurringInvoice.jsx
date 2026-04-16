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
  Typography,
  Divider,
} from "@mui/material";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";

const statusList = ["All", "Active", "Stopped", "Expired"];

const RecurringInvoice = ({ onNewClick, onClose }) => {
  const [tableData, setTableData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");

  useEffect(() => {
    // Component mounted, no mock data
    setTableData([]);
  }, []);

  const handleStatusMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleStatusMenuClose = () => setAnchorEl(null);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedItems(tableData.map((item) => item.id));
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
    setSelectAll(newSelected.length === tableData.length);
  };

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
            whiteSpace: "nowrap"
          }}>
             {selectedStatus} Recurring Invoices
          </Typography>
          <ExpandMoreRounded sx={{ ml: 1, color: "#408DFB" }} />
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
              }
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
            startIcon={<AddIcon />}
            onClick={onNewClick}
            sx={{
              backgroundColor: "#408DFB",
              height: "36px",
              textTransform: "none",
              fontSize: "14px",
              fontWeight: 600,
              px: { xs: 2, md: 3 },
              boxShadow: "none",
              whiteSpace: "nowrap"
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

      {/* Table Area */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <TableContainer sx={{ height: "100%" }}>
          <Table stickyHeader sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 50, backgroundColor: "#f9f9f9" }}><IconButton size="small"><ViewColumnIcon fontSize="small"/></IconButton></TableCell>
                <TableCell sx={{ width: 50, backgroundColor: "#f9f9f9" }}><Checkbox size="small" checked={selectAll} onChange={handleSelectAllClick}/></TableCell>
                {["Profile Name", "Customer Name", "Frequency", "Last Invoice Date", "Next Invoice Date", "Status", "Amount"].map(h => (
                  <TableCell key={h} sx={{ fontSize: "11px", fontWeight: 700, color: "#888", backgroundColor: "#f9f9f9" }}>{h.toUpperCase()}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 12, borderBottom: "none" }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              <Box component="img" src="/src/assets/truck.png" sx={{ width: 180, opacity: 0.8, mb: 1 }} />
                              <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: "#666", letterSpacing: 1 }}>SCHWING STETTER</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mb: 2 }}>
                                  Currently, no recurring invoices are available. Select 'Create New' to add a new one.
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
                tableData.map((row) => (
                  <TableRow key={row.id} hover sx={{ cursor: "pointer" }}>
                    <TableCell />
                    <TableCell><Checkbox size="small" checked={selectedItems.includes(row.id)} onChange={e => handleCheckboxClick(e, row.id)}/></TableCell>
                    <TableCell sx={{ fontSize: "14px", color: "#408DFB", fontWeight: 600 }}>{row.name}</TableCell>
                    <TableCell sx={{ fontSize: "13px" }}>{row.customer}</TableCell>
                    <TableCell sx={{ fontSize: "13px" }}>{row.frequency}</TableCell>
                    <TableCell sx={{ fontSize: "13px" }}>{row.last_date}</TableCell>
                    <TableCell sx={{ fontSize: "13px" }}>{row.next_date}</TableCell>
                    <TableCell>
                      <Typography sx={{ 
                        fontSize: "11px", fontWeight: 700, px: 1, py: 0.2, borderRadius: 1, display: "inline-block",
                        backgroundColor: "#e8f5e9", color: "#2e7d32"
                      }}>
                        {row.status.toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: "13px" }}>₹{row.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleStatusMenuClose}>
        {statusList.map(st => (
          <MenuItem key={st} onClick={() => { setSelectedStatus(st); handleStatusMenuClose(); }}>{st}</MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default RecurringInvoice;
