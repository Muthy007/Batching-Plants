import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import LoadingOverlay from "../Loading Animations/LoadingOverlay";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import nodata from "../Images/truck.png";
import Sidebar from "../Navbars/Sidebar";

const status = [
  "All",
  "Draft",
  "Sent",
  "Accepted",
  "Declined",
  "Expired",
  "Invoiced",
];

const Quotes = ({ onLogout }) => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const navigate = useNavigate();
  const [quoteTable, setQuoteTable] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [selectedItem, setSelectedItem] = useState("All");
  const [searchText, setSearchText] = useState("");

  const handleItemClick = (item) => {
    setSelectedItem(item); // Update selected item
    handleCloseMenu(); // Close the menu
  };

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
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

  const handleCheckboxChange = (column) => {
    setSelectedColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const columnOptions = Object.keys(selectedColumns);
  const selectedCount = columnOptions.filter(
    (col) => selectedColumns[col]
  ).length;

  // Filter columns based on search query
  const filteredColumns = columnOptions
    .filter((column) => column.toLowerCase().includes(searchQuery))
    .sort((a, b) =>
      selectedColumns[a] === selectedColumns[b]
        ? 0
        : selectedColumns[a]
        ? -1
        : 1
    );

  // Function to handle selecting all checkboxes
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const selected = quoteTable.map((item) => item.id); // Assuming each item has a unique identifier like `id`
      setSelectedItems(selected);
      setSelectAll(true);
    } else {
      setSelectedItems([]);
      setSelectAll(false);
    }
  };

  // Function to handle individual checkbox clicks
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

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getquoteTable = () => {
    setLoading(true);
    const params = {
      json_type: "get_quotes",
      type: "1",
      id: "",
      user: user,
      org_id: orgid,
    };
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        if (JSON.parse(res.data).json_sts === "1") {
          setQuoteTable(JsonData);
          setLoading(false);
        } else if (JSON.parse(res.data).json_sts === "2") {
          setQuoteTable([]);
          setLoading(false);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getquoteTable();
  }, []);

  const handleDelete = () => {
    const selectedIds = selectedItems;
    // Filter out items that are selected and map to only the required keys
    const filteredTable = quoteTable
      .filter((item) => selectedIds.includes(item.id)) // Adjust this condition as per your data structure
      .map((item) => item.id); // Store only the id as an array
    const params = {
      json_type: "delete_quotes",
      quote_ids: filteredTable,
      user: user,
      org_id: orgid,
      user_id: userid,
    };
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data);
        if (JsonData.json_sts === "1") {
          alert(JsonData.error_msg);
          window.location.reload();
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        } else {
          alert(JsonData.error_msg);
          window.location.reload();
        }
      });
  };

  return (
    <React.Fragment>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "0%",
            left: "50%",
            transform: "translate(-50%, 0)",
            width: 700,
            height: 800,
            bgcolor: "background.paper",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            p: 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            overflow: "hidden",
          }}
        >
          {/* Header with Close button and "selected of selected" */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              bgcolor: "#F9F9FB",
              p: 2,
              borderRadius: "8px 8px 0 0",
              borderBottom: "1px solid #e6e6e6",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Customize Columns
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{ color: "#666", marginRight: "auto" }}
              >
                {selectedCount} of {columnOptions.length} Selected
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Search bar with adornment */}
          <Box sx={{ pl: 2, pr: 2, pt: 2 }}>
            <TextField
              fullWidth
              placeholder="Search"
              variant="outlined"
              autoComplete="off"
              size="small"
              sx={{ mb: 2 }}
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Scrollable List */}
          <Box
            sx={{
              minHeight: 550,
              maxHeight: 550,
              overflowY: "auto",
              p: 2,
            }}
          >
            <List>
              {filteredColumns.map((column, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#F9F9FB",
                    borderRadius: 2,
                    mb: 1,
                    p: 1.5,
                    height: 45,
                  }}
                >
                  <ListItemIcon>
                    <DragIndicatorIcon sx={{ color: "#888" }} />
                  </ListItemIcon>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedColumns[column]}
                        onChange={() => handleCheckboxChange(column)}
                      />
                    }
                    label={
                      <ListItemText
                        primary={column}
                        primaryTypographyProps={{
                          fontWeight: "medium",
                        }}
                      />
                    }
                  />
                  {["Date", "Quote Number"].includes(column) && (
                    <LockIcon sx={{ color: "#888", ml: 1 }} />
                  )}
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Footer with Save and Cancel buttons */}
          <Box
            display="flex"
            justifyContent="flex-end"
            sx={{
              bgcolor: "#F9F9FB",
              p: 2,
              borderTop: "1px solid #ddd",
              borderRadius: "0 0 8px 8px",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClose}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
      <Menu
        open={openMenu}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <div
          style={{
            padding: 5,
            width: "300px",
            borderRadius: "10px",
          }}
        >
          {/* Search Box */}
          <Box sx={{ padding: "8px" }}>
            <TextField
              variant="outlined"
              autoComplete="off"
              size="small"
              fullWidth
              placeholder="Search status..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
                "& input": {
                  fontSize: "1rem",
                },
              }}
            />
          </Box>

          {/* Menu Items */}
          {status.map((item, index) => {
            // Filter directly during mapping
            if (!item.toLowerCase().includes(searchText.toLowerCase())) {
              return null; // Skip rendering this item
            }
            return (
              <MenuItem
                key={index}
                onClick={() => handleItemClick(item)}
                sx={{
                  "&:hover": {
                    bgcolor: "#408dfb",
                    color: "white",
                  },
                  "& .MuiTypography-root": {
                    fontSize: "1.1rem",
                    fontFamily: "helvetica",
                    fontWeight: 300,
                  },
                  borderRadius: 2,
                }}
              >
                <ListItemText primary={item} />
              </MenuItem>
            );
          })}

          {/* No Matches Found */}
          {status.every(
            (item) => !item.toLowerCase().includes(searchText.toLowerCase())
          ) && (
            <Box sx={{ textAlign: "center", padding: "10px" }}>
              <ListItemText
                primary="No matches found"
                sx={{ fontSize: "1rem" }}
              />
            </Box>
          )}
        </div>
      </Menu>

      {loading === true ? (
        <LoadingOverlay />
      ) : (
        <Sidebar onLogout={onLogout}>
          <Grid container>
            <Helmet>
              <title>Quotes</title>
            </Helmet>
            <Grid
              item
              container
              xs={12}
              sx={{
                mt: 2,
                width: "1805px",
                height: "100%",
                minHeight: 890,
              }}
            >
              <Grid
                item
                container
                xs={12}
                sx={{
                  mt: 2,
                  width: "100%",
                  height: "100%",
                  minHeight: 70,
                  borderBottom: "1px solid #e6e6e6",
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    width: "100%",
                    height: "100%",
                    minHeight: 70,
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    pl: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.7rem",
                      fontFamily: "Helvetica",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={handleClickMenu}
                  >
                    {selectedItem} Quotes
                    <ExpandMoreRounded
                      sx={{
                        width: 40,
                        height: 40,
                        color: "#408DFB",
                        cursor: "pointer",
                      }}
                      onClick={handleClickMenu}
                    />
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    pr: 2,
                    gap: 2,
                  }}
                >
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    placeholder="Search..."
                    size="small"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#F0F0F0",
                        "& fieldset": {
                          borderColor: "#D0D0D0",
                        },
                        "&:hover fieldset": {
                          borderColor: "#408DFB",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#408DFB",
                        },
                      },
                      "& .MuiInputBase-input": {
                        padding: "10px",
                        fontSize: "14px",
                      },
                      "& .MuiInputAdornment-root": {
                        color: "#408DFB",
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {selectedItems.length > 0 ? (
                    <Tooltip title="Delete Quotes" arrow>
                      <Button
                        sx={{
                          width: "100px",
                          borderRadius: 2,
                          backgroundColor: "#408DFB", // Updated color
                          "&:hover": {
                            backgroundColor: "#3070C0", // Slightly darker hover color
                          },
                        }}
                        variant="contained"
                        onClick={() => {
                          handleDelete();
                        }}
                      >
                        Delete
                      </Button>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                  <Tooltip title="Create Quotes" arrow>
                    <Button
                      sx={{
                        width: "100px",
                        borderRadius: 2,
                        backgroundColor: "#408DFB", // Updated color
                        "&:hover": {
                          backgroundColor: "#3070C0", // Slightly darker hover color
                        },
                      }}
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        navigate("/Sales/NewQuotes");
                      }}
                    >
                      New
                    </Button>
                  </Tooltip>
                  {/* <IconButton
                    aria-label="menu"
                    sx={{
                      border: "1px solid black",
                      borderRadius: "12px", // Rounded corners for the IconButton
                      padding: "8px",
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton> */}
                </Grid>
              </Grid>

              {/* Table Section */}
              <Grid
                item
                container
                xs={12}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 837,
                  minHeight: 837,
                }}
              >
                <TableContainer
                  sx={{
                    width: "100%",
                    maxHeight: 837,
                    overflowX: "auto",
                    minHeight: 837,
                  }}
                >
                  <Table
                    stickyHeader
                    sx={{
                      minWidth: "2800px", // Adjust the minimum width to show only 8 columns
                      width: "auto",
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontSize: "1.2rem",
                            fontFamily: "Helvetica",
                            textTransform: "uppercase",
                            padding: "10px 16px",
                            color: "#6C7184",
                            borderBottom: "0.5px solid #e6e6e6",
                            backgroundColor: "#F5F5F5", // Soft background for headers
                          }}
                        >
                          {/* Icon for customizable columns */}
                          <IconButton
                            sx={{
                              padding: 0, // Reduce padding for a better fit
                              //  mr: 1, // Margin right to give space between icon and checkbox
                            }}
                            aria-label="customize columns"
                            onClick={() => {
                              handleOpen();
                            }}
                          >
                            <ViewColumnIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "14px",
                            fontFamily: "Helvetica",
                            textTransform: "uppercase",
                            padding: "0px 16px",
                            color: "#6C7184",
                            borderBottom: "0.5px solid #e6e6e6",
                            backgroundColor: "#F5F5F5", // Soft background for headers
                          }}
                        >
                          <FormControlLabel
                            sx={{ p: 1.2 }}
                            control={
                              <Checkbox
                                checked={selectAll}
                                onChange={handleSelectAllClick}
                                inputProps={{
                                  "aria-label": "select all quotes",
                                }}
                                size="medium"
                              />
                            }
                          />
                        </TableCell>
                        {[
                          "Date",
                          "Quote Number",
                          "Reference#",
                          "Customer Name",
                          "Quote Status",
                          "Total",
                          "Sub tOtal",
                          "Expiry Date",
                          "Company name",
                          "Accepted date",
                          "Declined date",
                          "Sales Person",
                        ].map((header) => (
                          <TableCell
                            key={header}
                            sx={{
                              fontSize: "15px",
                              fontFamily: "Helvetica",
                              textTransform: "uppercase",
                              padding: "0px 16px",
                              color: "#6C7184",
                              borderBottom: "0.5px solid #e6e6e6",
                              backgroundColor: "#F5F5F5", // Soft background for headers
                              fontWeight: "bold",
                              letterSpacing: 1,
                            }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {quoteTable &&
                        quoteTable
                          .filter((data) =>
                            Object.values(data).some((row) =>
                              row
                                .toString()
                                .toLowerCase()
                                .includes(search.toLowerCase())
                            )
                          )
                          .filter(
                            (item) =>
                              selectedItem === "All" ||
                              item.status === selectedItem
                          )
                          .map((item, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: "#f0f4ff", // Highlight row on hover
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                              ></TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                              >
                                <Checkbox
                                  checked={selectedItems.includes(item.id)}
                                  onChange={(event) =>
                                    handleCheckboxClick(event, item.id)
                                  }
                                  size="medium"
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/QuoteDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.quote_date}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/QuoteDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.quote_no}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/QuoteDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.reference}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/QuoteDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.cust_name}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight
                                  color: item.status_color,
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/QuoteDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.status}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/QuoteDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {/* Format the amount with currency symbol */}₹
                                {Number(item.total).toLocaleString("en-IN")}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/QuoteDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {/* Format the amount with currency symbol */}₹
                                {Number(item.sub_total).toLocaleString("en-IN")}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/QuoteDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.exp_date}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/QuoteDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.exp_date}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/QuoteDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.exp_date}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/QuoteDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.exp_date}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/QuoteDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.sales_person}
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                  {/* Case 1: No data for "All" */}
                  {selectedItem && quoteTable.length === 0 && (
                    <Box
                      sx={{
                        textAlign: "center",
                        p: 20,
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={nodata}
                        style={{ height: "200px", width: "250px" }}
                      />
                      <Typography
                        sx={{
                          fontSize: "1.5rem",
                          color: "#6C7184",
                          fontFamily: "Georgia",
                          letterSpacing: 1,
                        }}
                      >
                        Currently, no quotes are available. Select 'Create New'
                        to add a new one.
                      </Typography>
                      <Tooltip title="Create Quotes" arrow>
                        <Button
                          sx={{
                            width: "200px",
                            height: 50,
                            borderRadius: 2,
                            backgroundColor: "#408DFB", // Updated color
                            mt: 3,
                            fontSize: "1.2rem",
                            "&:hover": {
                              backgroundColor: "#3070C0", // Slightly darker hover color
                            },
                          }}
                          variant="contained"
                          startIcon={
                            <AddIcon sx={{ width: "30px", height: "30px" }} />
                          }
                          onClick={() => {
                            navigate("/Sales/NewQuotes");
                          }}
                        >
                          Create New
                        </Button>
                      </Tooltip>
                    </Box>
                  )}
                  {quoteTable.length > 0 &&
                    selectedItem !== "All" &&
                    !quoteTable
                      .filter((data) =>
                        Object.values(data).some((row) =>
                          row
                            .toString()
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        )
                      )
                      .filter((item) => item.status === selectedItem)
                      .length && (
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 3,
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "1.3rem",
                            color: "#6C7184",
                            fontFamily: "Georgia",
                            letterSpacing: 1,
                          }}
                        >
                          There are no {selectedItem} Quotes
                        </Typography>
                      </Box>
                    )}
                  {quoteTable.length > 0 &&
                    !quoteTable.filter((data) =>
                      Object.values(data).some((row) =>
                        row
                          .toString()
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      )
                    ).length && (
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 3,
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "1.3rem",
                            color: "#6C7184",
                            fontFamily: "Georgia",
                            letterSpacing: 1,
                          }}
                        >
                          There are no Quotes
                        </Typography>
                      </Box>
                    )}
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Sidebar>
      )}
    </React.Fragment>
  );
};

export default Quotes;
