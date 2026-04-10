import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  ListItemText,
  Menu,
  MenuItem,
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import nodata from "../Images/truck.png";
import LoadingOverlay from "../Loading Animations/LoadingOverlay";
import Sidebar from "../Navbars/Sidebar";
import SearchIcon from "@mui/icons-material/Search";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import CloseIcon from "@mui/icons-material/Close";
import { Icon } from "@iconify/react/dist/iconify.js";

const status = ["All", "Draft", "Partially Paid", "Paid", "Due", "Overdue"];

const Invoice = ({ onLogout }) => {
  const navigate = useNavigate();
  const [invoiceTable, setInvoiceTable] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openInvoice, setOpenInvoice] = useState(false);
  const [sureOpen, setSureOpen] = useState(false);
  const [whyIsNotDeletedFirst, setWhyIsNotDeletedFirst] = useState("");
  const [whyIsNotDeletedSecond, setWhyIsNotDeletedSecond] = useState("");
  const [whyIsNotDeletedFirstMessage, setWhyIsNotDeletedFirstMessage] =
    useState("");
  const [whyIsNotDeletedSecondMessage, setWhyIsNotDeletedSecondMessage] =
    useState("");
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

  const handleInvoiceOpen = () => {
    setOpenInvoice(true);
  };

  const handleInvoiceClose = () => {
    setOpenInvoice(false);
  };

  const handleSureOpen = () => {
    setSureOpen(true);
  };

  const handleSureClose = () => {
    setSureOpen(false);
  };

  // Function to handle selecting all checkboxes
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const selected = invoiceTable.map((item) => item.id); // Assuming each item has a unique identifier like `id`
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
    setSelectAll(newSelected.length === invoiceTable.length);
  };

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getInvoiceTable = () => {
    setLoading(true);
    const params = {
      json_type: "get_invoice",
      type: "1",
      id: "",
      user: user,
      org_id: orgid,
    };
    axios
      .post(url, JSON.stringify(params), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        if (JSON.parse(res.data).json_sts === "1") {
          setInvoiceTable(JsonData);
          setLoading(false);
        } else if (JSON.parse(res.data).json_sts === "2") {
          setInvoiceTable([]);
          setLoading(false);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error fetching invoice table:", error);
      });
  };

  useEffect(() => {
    getInvoiceTable();
  }, [token, user]);

  const handleDelete = () => {
    handleSureClose();
    const selectedIds = selectedItems;
    // Filter out items that are selected and map to only the required keys
    const filteredTable = invoiceTable
      .filter((item) => selectedIds.includes(item.id)) // Adjust this condition as per your data structure
      .map((item) => item.id); // Store only the id as an array
    const params = {
      json_type: "delete_invoices",
      invoice_ids: filteredTable,
      user: user,
      org_id: orgid,
      user_id: userid,
    };
    axios
      .post("https://erp-api.schwingcloud.com/Service1.svc/ERP_app2", params, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        if (JSON.parse(res.data).json_sts === "1" && JsonData.length === 0) {
          alert(JSON.parse(res.data).error_msg);
          window.location.reload();
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        } else {
          setWhyIsNotDeletedFirst(
            JsonData[0] ? JsonData[0].invoice_data : "" // Corrected path
          );
          setWhyIsNotDeletedSecond(JsonData[1] ? JsonData[1].invoice_data : "");
          const customerMessage = JsonData[0]?.message;
          const creditMessage = JsonData[1]?.message;
          // Store the messages in state
          setWhyIsNotDeletedFirstMessage(customerMessage);
          setWhyIsNotDeletedSecondMessage(creditMessage);
          handleInvoiceOpen();
          getInvoiceTable();
          setSelectedItems([]);
          setSelectAll(false);
        }
        console.log(JsonData[0] ? JsonData[0].invoice_data : ""); // Corrected path
        console.log(JsonData[1] ? JsonData[1].invoice_data : "");
      })
      .catch((error) => {
        console.error("Error during API request:", error);
      });
  };

  return (
    <React.Fragment>
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
      <Drawer
        anchor="top"
        open={sureOpen}
        onClose={() => handleSureClose()}
        sx={{
          "& .MuiDrawer-paper": {
            width: "35%",
            margin: "auto",
            height: "auto",
            maxHeight: "90vh", // Adjust the height if needed
            borderBottomRightRadius: "10px",
            borderBottomLeftRadius: "10px",
          },
        }}
      >
        <Grid container>
          <Grid
            item
            container
            xs={12}
            sx={{
              width: "100%",
              height: "auto",
              minHeight: 100,
              borderBottom: "0.5px solid #d9d9d9",
              backgroundColor: "#F9F9FB",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              p: 3,
            }}
          >
            <Typography
              sx={{
                display: "flex",
                fontSize: "1.2rem",
                fontFamily: "Helvetica",
                // fontWeight: "bold",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Icon
                icon="mingcute:alert-fill"
                style={{
                  width: "48px",
                  height: "48px",
                  color: "rgb(244, 156, 6)",
                }}
              />
              The selected invoice(s) will be deleted and cannot be retrieved
              later. Are you sure about deleting them?
            </Typography>
          </Grid>
          <Grid
            sx={{
              width: "100%",
              height: "auto",
              minHeight: 88,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 2,
              pl: 2,
              backgroundColor: "white", // Optional: ensures background color
            }}
            elevation={1}
          >
            <Grid>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#408DFB", // Updated color
                  "&:hover": {
                    backgroundColor: "#3070C0", // Slightly darker hover color
                  },
                }}
                size="medium"
                onClick={() => {
                  handleSureClose();
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#408DFB", // Updated color
                  "&:hover": {
                    backgroundColor: "#3070C0", // Slightly darker hover color
                  },
                }}
                size="medium"
                onClick={() => {
                  handleDelete();
                }}
              >
                Ok
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
      <Drawer
        anchor="top"
        open={openInvoice}
        onClose={() => handleInvoiceClose()}
        sx={{
          "& .MuiDrawer-paper": {
            width: "50%",
            margin: "auto",
            height: "auto",
            maxHeight: "90vh", // Adjust the height if needed
            borderBottomRightRadius: "10px",
            borderBottomLeftRadius: "10px",
          },
        }}
      >
        <Grid container>
          <Grid
            item
            container
            xs={12}
            sx={{
              width: "100%",
              height: "auto",
              minHeight: 70,
              borderBottom: "0.5px solid #d9d9d9",
              backgroundColor: "#F9F9FB",
            }}
          >
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                width: "100%",
                height: "auto",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                pl: 2,
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  fontSize: "1.5rem",
                  fontFamily: "Helvetica",
                  // fontWeight: "bold",
                  alignItems: "center",
                }}
              >
                Deletion Failure Summary
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                width: "100%",
                height: "auto",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                pr: 2,
                gap: 2,
              }}
            >
              <CloseIcon
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  handleInvoiceClose();
                }}
              />
            </Grid>
          </Grid>
          {whyIsNotDeletedFirstMessage ? (
            <Grid
              item
              container
              xs={12}
              sx={{
                width: "100%",
                height: "auto",
                minHeight: 70,
                borderBottom: "0.5px solid #d9d9d9",
                backgroundColor: "#F9F9FB",
                fontSize: "20px",
                fontWeight: "bold",
                pl: 2,
                alignItems: "center",
                m: 1,
              }}
            >
              {whyIsNotDeletedFirstMessage ? whyIsNotDeletedFirstMessage : ""}
            </Grid>
          ) : (
            ""
          )}
          {whyIsNotDeletedFirstMessage ? (
            <Grid item xs={12} p={3}>
              <TableContainer>
                <Table sx={{ borderRadius: "10px" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontSize: "1rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                          letterSpacing: 2,
                          border: "1px solid #e6e6e6",
                          borderTopLeftRadius: "8px", // Adding border radius to the top-left corner
                        }}
                      >
                        INVOICE NUMBER
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                          letterSpacing: 2,
                          border: "1px solid #e6e6e6",
                        }}
                      >
                        Customer Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                          letterSpacing: 2,
                          border: "1px solid #e6e6e6",
                          textAlign: "right",
                        }}
                      >
                        INVOICE Amount
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                          letterSpacing: 2,
                          border: "1px solid #e6e6e6",
                          textAlign: "right",
                        }}
                      >
                        INVOICE BALANCE
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {whyIsNotDeletedFirst &&
                      whyIsNotDeletedFirst.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              fontSize: "1.1rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              border: "0.5px solid #e6e6e6",
                            }}
                          >
                            {item.invoice_no}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              color: "#000",
                              border: "0.5px solid #e6e6e6",
                            }}
                          >
                            {item.cust_name}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              color: "#000",
                              border: "0.5px solid #e6e6e6",
                              textAlign: "right",
                            }}
                          >
                            ₹ {item.totalAmount}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              color: "#000",
                              border: "0.5px solid #e6e6e6",
                              textAlign: "right",
                            }}
                          >
                            ₹ {item.due_amount}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : (
            ""
          )}
          {whyIsNotDeletedSecondMessage ? (
            <Grid
              item
              container
              xs={12}
              sx={{
                width: "100%",
                height: "auto",
                minHeight: 70,
                borderBottom: "0.5px solid #d9d9d9",
                backgroundColor: "#F9F9FB",
                fontSize: "20px",
                fontWeight: "bold",
                pl: 2,
                alignItems: "center",
                m: 1,
              }}
            >
              {whyIsNotDeletedSecondMessage ? whyIsNotDeletedSecondMessage : ""}
            </Grid>
          ) : (
            ""
          )}
          {whyIsNotDeletedSecondMessage ? (
            <Grid item xs={12} p={3}>
              <TableContainer>
                <Table sx={{ borderRadius: "10px" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontSize: "1rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                          letterSpacing: 2,
                          border: "1px solid #e6e6e6",
                          borderTopLeftRadius: "8px", // Adding border radius to the top-left corner
                        }}
                      >
                        INVOICE NUMBER
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                          letterSpacing: 2,
                          border: "1px solid #e6e6e6",
                        }}
                      >
                        Customer Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                          letterSpacing: 2,
                          border: "1px solid #e6e6e6",
                          textAlign: "right",
                        }}
                      >
                        INVOICE Amount
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                          letterSpacing: 2,
                          border: "1px solid #e6e6e6",
                          textAlign: "right",
                        }}
                      >
                        INVOICE BALANCE
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {whyIsNotDeletedSecond &&
                      whyIsNotDeletedSecond.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              fontSize: "1.1rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              border: "0.5px solid #e6e6e6",
                            }}
                          >
                            {item.invoice_no}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              color: "#000",
                              border: "0.5px solid #e6e6e6",
                            }}
                          >
                            {item.cust_name}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              color: "#000",
                              border: "0.5px solid #e6e6e6",
                              textAlign: "right",
                            }}
                          >
                            ₹ {item.totalAmount}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              color: "#000",
                              border: "0.5px solid #e6e6e6",
                              textAlign: "right",
                            }}
                          >
                            ₹ {item.due_amount}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : (
            ""
          )}
          <Grid
            sx={{
              width: "100%",
              height: "auto",
              minHeight: 88,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 2,
              pl: 3,
              backgroundColor: "white", // Optional: ensures background color
              borderTop: "1px solid #e6e6e6",
            }}
            elevation={1}
          >
            <Grid>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#408DFB", // Updated color
                  "&:hover": {
                    backgroundColor: "#3070C0", // Slightly darker hover color
                  },
                }}
                size="medium"
                onClick={() => {
                  handleInvoiceClose();
                }}
              >
                Ok
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
      {loading === true ? (
        <LoadingOverlay />
      ) : (
        <Sidebar onLogout={onLogout}>
          <Grid container>
            <Helmet>
              <title>Invoices</title>
            </Helmet>
            <Grid
              item
              container
              xs={12}
              sx={{
                mt: 2,
                width: "100%",
                height: "100%",
                maxHeight: 890,
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
                      display: "flex",
                      fontSize: "1.7rem",
                      fontFamily: "Helvetica",
                      fontWeight: "bold",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={handleClickMenu}
                  >
                    {selectedItem} Invoices
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
                    overflowX: "hidden",
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
                    <Tooltip title="Delete Invoice" arrow>
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
                          handleSureOpen();
                        }}
                      >
                        Delete
                      </Button>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                  <Tooltip title="Create" arrow>
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
                        navigate("/Sales/NewInvoice");
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
                  <Table stickyHeader>
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
                          "Invoice#",
                          "Order Number",
                          "Customer Name",
                          "Status",
                          "Due Date",
                          "Amount",
                          "Balance Due",
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
                      {invoiceTable &&
                        invoiceTable
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
                              item.status === selectedItem ||
                              (selectedItem === "Due" &&
                                item.status.startsWith("Due")) ||
                              (selectedItem === "Overdue" &&
                                item.status.startsWith("Overdue"))
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
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/InvoiceDetailsPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.invoice_date}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: "500 !important",
                                  color: "#408DFB",
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/InvoiceDetailsPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.invoice_no}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/InvoiceDetailsPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.order_numbers}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/InvoiceDetailsPage", {
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
                                  fontWeight: 500, // Added weight for emphasis
                                  color: item.status_color,
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/InvoiceDetailsPage", {
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
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/InvoiceDetailsPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.due_date}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/InvoiceDetailsPage", {
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
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/InvoiceDetailsPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {/* Format the amount with currency symbol */}₹
                                {Number(item.due_amount).toLocaleString(
                                  "en-IN"
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                  {selectedItem && invoiceTable.length === 0 && (
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
                          // textTransform: "uppercase",
                          fontFamily: "Georgia",
                          letterSpacing: 1,
                        }}
                      >
                        Currently, no invoices are available. Select 'Create
                        New' to add a new one.
                      </Typography>
                      <Tooltip title="Create Invoice" arrow>
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
                            navigate("/Sales/NewInvoice");
                          }}
                        >
                          Create New
                        </Button>
                      </Tooltip>
                    </Box>
                  )}
                  {invoiceTable.length > 0 &&
                    selectedItem !== "All" &&
                    !invoiceTable
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
                          item.status === selectedItem ||
                          (selectedItem === "Due" &&
                            item.status.startsWith("Due")) ||
                          (selectedItem === "Overdue" &&
                            item.status.startsWith("Overdue"))
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
                          There are no {selectedItem} Invoices
                        </Typography>
                      </Box>
                    )}
                  {invoiceTable.length > 0 &&
                    !invoiceTable.filter((data) =>
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
                          There are no Invoices
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

export default Invoice;
