import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  ListItemText,
  Menu,
  MenuItem,
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
import nodata from "../Images/truck.png";
import LoadingOverlay from "../Loading Animations/LoadingOverlay";
import Sidebar from "../Navbars/Sidebar";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import SearchIcon from "@mui/icons-material/Search";

const status = [
  "All",
  "Draft",
  "Confirmed",
  "Expired",
  "Invoiced",
  "Not Invoiced",
];

const Salesorder = ({ onLogout }) => {
  const navigate = useNavigate();
  const [salesTable, setSalesTable] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
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

  // Function to handle selecting all checkboxes
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const selected = salesTable.map((item) => item.id); // Assuming each item has a unique identifier like `id`
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
    setSelectAll(newSelected.length === salesTable.length);
  };

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getsalesTable = () => {
    setLoading(true);
    const params = {
      json_type: "get_sales_orders",
      type: "1",
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
          setSalesTable(JsonData);
          setLoading(false);
        } else if (JSON.parse(res.data).json_sts === "2") {
          setSalesTable([]);
          setLoading(false);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getsalesTable();
  }, []);

  const handleDelete = () => {
    const selectedIds = selectedItems;
    // Filter out items that are selected and map to only the required keys
    const filteredTable = salesTable
      .filter((item) => selectedIds.includes(item.id)) // Adjust this condition as per your data structure
      .map((item) => item.id); // Store only the id as an array
    const params = {
      json_type: "delete_sales_orders",
      sales_ids: filteredTable,
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
              <title>Sales Order</title>
            </Helmet>
            <Grid
              item
              container
              xs={12}
              sx={{
                mt: 2,
                width: "1700px",
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
                      display: "flex",
                      fontSize: "1.7rem",
                      fontFamily: "Helvetica",
                      fontWeight: "bold",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={handleClickMenu}
                  >
                    {selectedItem} Sales Orders
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
                    <Tooltip title="Delete" arrow>
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
                        navigate("/Sales/NewSalesOrder");
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
                                  "aria-label": "select all salesorders",
                                }}
                                size="medium"
                              />
                            }
                          />
                        </TableCell>
                        {[
                          "Sales Order#",
                          "Reference#",
                          "Customer Name#",
                          "Date",
                          "Invoiced",
                          "Payment",
                          "Amount",
                          "Excepted shipment date",
                          "Order status",
                          "Delivery Menthod",
                          "Sales Person",
                          "Invoiced Amount",
                          "Status",
                          "Company name",
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
                      {salesTable &&
                        salesTable
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
                              item.invoiced === selectedItem
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
                                  navigate("/SalesPage/SalesDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.sales_order_no}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/SalesDetailPage", {
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
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/SalesDetailPage", {
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
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/SalesDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.sales_order_date}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/SalesDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.invoiced}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/SalesDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.payment_sts}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/SalesDetailPage", {
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
                                  navigate("/SalesPage/SalesDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.ex_ship_date}
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
                                  navigate("/SalesPage/SalesDetailPage", {
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
                                  navigate("/SalesPage/SalesDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.delivery_method}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/SalesDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.sales_person}
                              </TableCell>
                              <TableCell
                                sx={{
                                  padding: "10px 16px",
                                  borderBottom: "0.5px solid #e6e6e6",
                                  fontSize: "1.1rem", // Adjusted size
                                  fontWeight: 500, // Added weight for emphasis
                                }}
                                onClick={() => {
                                  navigate("/SalesPage/SalesDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.invoiced_amount}
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
                                  navigate("/SalesPage/SalesDetailPage", {
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
                                  navigate("/SalesPage/SalesDetailPage", {
                                    state: { item },
                                  });
                                }}
                              >
                                {item.cust_name}
                              </TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                  {selectedItem && salesTable.length === 0 && (
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
                        Currently, no salesorders are available. Select 'Create
                        New' to add a new one.
                      </Typography>
                      <Tooltip title="Create Sales Order" arrow>
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
                            navigate("/Sales/NewSalesOrder");
                          }}
                        >
                          Create New
                        </Button>
                      </Tooltip>
                    </Box>
                  )}
                  {salesTable.length > 0 &&
                    selectedItem !== "All" &&
                    !salesTable
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
                          item.status === selectedItem ||
                          item.invoiced === selectedItem
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
                          There are no {selectedItem} Sales Orders
                        </Typography>
                      </Box>
                    )}
                  {salesTable.length > 0 &&
                    !salesTable.filter((data) =>
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
                          There are no Sales Orders
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

export default Salesorder;
