import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../Navbars/Sidebar";
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import EditItemMaster from "../UsableContent/EditItemMaster";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SuiSnackbar from "../Snackbars/SuiSnackbar";
import ModalItemMaster from "../UsableContent/ModalItemMaster";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: 950,
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const ItemDetailPage = ({ onLogout }) => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state || {};
  const [itemTable, setItemTable] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Quotes");
  const [menuWidth, setMenuWidth] = useState(null);
  const buttonRef = useRef(null);
  const [historyDetails, setHistoryDetails] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be 'error', 'warning', 'info', 'success'

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    handleCloseAnchor();
  };

  const options = [
    "Quotes",
    "Sales Orders",
    "Invoices",
    "Delivery Challans",
    "Credit Notes",
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNewOpen = () => {
    setNewOpen(true);
  };

  const handleNewClose = () => {
    setNewOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getItemTable = () => {
    const params = {
      json_type: "get_item_details",
      type: "1",
      id: "",
      org_id: orgid,
      user: user,
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
          setItemTable(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getItemTable();
  }, []);

  const getItemDetails = () => {
    const params = {
      json_type: "get_item_details",
      type: "2",
      id: item.id,
      org_id: orgid,
      user: user,
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
          setItemDetails(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getItemDetails();
  }, [item]);

  useEffect(() => {
    if (anchorEl && buttonRef.current) {
      setMenuWidth(buttonRef.current.offsetWidth);
    }
  }, [anchorEl]);

  const url1 = `https://erp-api.schwingcloud.com/Service1.svc/GetTransactionDetails?organization_id=${orgid}&documentType=${selectedOption}&documentId=${item.id}&user=${user}`;

  const url2 = `https://erp-api.schwingcloud.com/Service1.svc/GetCommentsHistory?organization_id=${orgid}&cust_id=&entity_id=${item.id}&entity_type=item&user=${user}`;

  const GetTransactionDetails = () => {
    axios
      .get(url1, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).Data;
        if (JSON.parse(res.data).Code === 1) {
          setTransactionDetails(JsonData);
        } else if (JSON.parse(res.data).Code === 5) {
          onLogout();
          navigate("/");
        } else {
          setTransactionDetails([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching email details:", error);
      });
  };

  useEffect(() => {
    GetTransactionDetails();
  }, [item, selectedOption]);

  const getHistoryDetails = () => {
    axios
      .get(url2, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        if (JSON.parse(res.data).json_sts === "1") {
          setHistoryDetails(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        } else {
          setHistoryDetails([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching email details:", error);
      });
  };

  useEffect(() => {
    getHistoryDetails();
  }, [item]);

  return (
    <React.Fragment>
      <SuiSnackbar
        open={snackbarOpen}
        color={
          snackbarSeverity === "success"
            ? "#E8F5E9"
            : snackbarSeverity === "field missing"
            ? "#71c178"
            : snackbarSeverity === "error"
            ? "#ff9999"
            : "#FEEDEE"
        }
        icon={snackbarSeverity}
        title={
          snackbarSeverity.charAt(0).toUpperCase() + snackbarSeverity.slice(1)
        }
        content={snackbarMessage}
        dateTime={new Date().toLocaleString()}
        close={handleCloseSnackbar}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <EditItemMaster
            handleClose={handleClose}
            getItemTable={getItemTable}
            id={item.id}
            getItemDetails={getItemDetails}
            GetTransactionDetails={GetTransactionDetails}
            getHistoryDetails={getHistoryDetails}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
          />
        </Box>
      </Modal>
      <Modal
        open={newOpen}
        onClose={handleNewClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ModalItemMaster
            handleClose={handleNewClose}
            getItemTable={getItemTable}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
          />
        </Box>
      </Modal>
      <Sidebar onLogout={onLogout}>
        <Grid container>
          <Helmet>
            <title>Item | View</title>
          </Helmet>
          <Grid
            item
            container
            xs={12}
            sx={{
              mt: 2,
              width: "100%",
              height: "100%",
              minHeight: 920,
              maxHeight: 920,
            }}
          >
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                borderRight: "1px solid #e6e6e6",
                width: "100%",
                height: "100%",
                minHeight: 920,
                maxHeight: 920,
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
                  md={8}
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
                    }}
                  >
                    Items
                    {/* <ExpandMoreRounded
                      sx={{
                        width: 40,
                        height: 40,
                        color: "#408DFB",
                        cursor: "pointer",
                      }}
                    /> */}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    width: "100%",
                    height: "100%",
                    minHeight: 70,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    pr: 2,
                    gap: 2,
                  }}
                >
                  <Grid>
                    <Tooltip title="Create" arrow>
                      <Button
                        sx={{
                          width: "100px",
                          borderRadius: 2,
                          display: "flex",
                          backgroundColor: "#408DFB", // Updated color
                          "&:hover": {
                            backgroundColor: "#3070C0", // Slightly darker hover color
                          },
                        }}
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          handleNewOpen();
                        }}
                      >
                        new
                      </Button>
                    </Tooltip>
                  </Grid>
                  {/* <Grid>
                    <IconButton
                      aria-label="menu"
                      sx={{ border: "1px solid #999999" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Grid> */}
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={12}
                sx={{
                  width: "100%",
                  height: "100%",
                  minHeight: 815,
                }}
              >
                <TableContainer
                  sx={{
                    width: "100%",
                    maxHeight: 815,
                  }}
                >
                  <Table stickyHeader>
                    <TableBody>
                      {itemTable &&
                        itemTable.map((item, index) => (
                          <TableRow key={index} sx={{ cursor: "pointer" }}>
                            <TableCell
                              sx={{
                                fontSize: "1.3rem",
                                fontFamily: "Helvetica",
                                borderBottom: "0.5px solid #e6e6e6",
                                fontWeight: "bold",
                              }}
                              onClick={() => {
                                navigate("/ItemView", {
                                  state: { item },
                                });
                              }}
                            >
                              {/* Customer Name */}
                              <div>{item.name}</div>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "1.2rem",
                                fontFamily: "Helvetica",
                                borderBottom: "0.5px solid #e6e6e6",
                                textAlign: "right",
                              }}
                              onClick={() => {
                                navigate("/ItemView", {
                                  state: { item },
                                });
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(item.sales_s_price).toLocaleString(
                                "en-IN"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              md={9}
              sx={{ borderRight: "1px solid #e6e6e6", minHeight: 920 }}
            >
              <Grid
                item
                container
                xs={12}
                sx={{ mt: 2, borderBottom: "1px solid #e6e6e6", minHeight: 71 }}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{ display: "flex", alignItems: "center", pl: 2 }}
                >
                  <Typography
                    sx={{ fontSize: "1.2rem", fontFamily: "Helvetica" }}
                  >
                    {item ? item.name : ""}
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
                  <Grid>
                    <button
                      aria-label="Close"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        border: "1px solid #e6e6e6",
                        backgroundColor: "#fff",
                        height: "30px",
                        width: "60px",
                        borderRadius: "5px",
                      }}
                      onClick={handleOpen}
                    >
                      Edit
                    </button>
                  </Grid>
                  <Tooltip title="Close" arrow>
                    <CloseIcon onClick={() => navigate("/Create/Item")} />
                  </Tooltip>
                </Grid>
              </Grid>

              {/* Tab Section */}
              <Grid
                item
                container
                xs={12}
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  overflowY: "auto",
                  pb: 3,
                  pt: 2,
                }}
              >
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  aria-label="Item detail tabs"
                  sx={{ pl: 1 }}
                >
                  <Tab
                    label="Overview"
                    sx={{
                      textTransform: "initial",
                      fontStyle: "Helvetica",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  />
                  <Tab
                    label="Transactions"
                    sx={{
                      textTransform: "initial",
                      fontStyle: "Helvetica",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  />
                  <Tab
                    label="History"
                    sx={{
                      textTransform: "initial",
                      fontStyle: "Helvetica",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  />
                </Tabs>

                {/* Tab Content */}
                <Box sx={{ width: "100%" }}>
                  {selectedTab === 0 && (
                    <>
                      <Grid p={3}>
                        <Grid item xs={12} container sx={{ minHeight: 45 }}>
                          <Grid
                            item
                            xs={12}
                            md={2.7}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#777777",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              Item Type
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={9.3}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography sx={{ fontSize: "18px" }}>
                              {itemDetails[0]?.type}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container sx={{ minHeight: 45 }}>
                          <Grid
                            item
                            xs={12}
                            md={2.7}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#777777",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              {itemDetails[0]?.hsn_code ? "HSN Code" : "SAC"}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={9.3}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography sx={{ fontSize: "18px" }}>
                              {itemDetails[0]?.hsn_code
                                ? itemDetails[0]?.hsn_code
                                : itemDetails[0]?.sac_code}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container sx={{ minHeight: 45 }}>
                          <Grid
                            item
                            xs={12}
                            md={2.7}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#777777",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              Unit
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={9.3}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography sx={{ fontSize: "18px" }}>
                              {" "}
                              {itemDetails[0]?.unit}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container sx={{ minHeight: 45 }}>
                          <Grid
                            item
                            xs={12}
                            md={2.7}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#777777",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              Created Source
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={9.3}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography sx={{ fontSize: "18px" }}>
                              User
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container sx={{ minHeight: 45 }}>
                          <Grid
                            item
                            xs={12}
                            md={2.7}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#777777",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              Tax Preference
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={9.3}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography sx={{ fontSize: "18px" }}>
                              {itemDetails[0]?.tax_pre}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container sx={{ minHeight: 45 }}>
                          <Grid
                            item
                            xs={12}
                            md={2.7}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#777777",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              Intra State Tax Rate
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={9.3}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography sx={{ fontSize: "18px" }}>
                              {itemDetails[0]?.iGST}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container sx={{ minHeight: 45 }}>
                          <Grid
                            item
                            xs={12}
                            md={2.7}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#777777",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              Inter State Tax Rate
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={9.3}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography sx={{ fontSize: "18px" }}>
                              {itemDetails[0]?.GST_intra}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          container
                          sx={{ minHeight: 45, mt: 5 }}
                        >
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "bold",
                              fontFamily: "helvetica",
                            }}
                          >
                            Purchase Information
                          </Typography>
                        </Grid>
                        <Grid item xs={12} container sx={{ minHeight: 45 }}>
                          <Grid
                            item
                            xs={12}
                            md={2.7}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#777777",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              Cost Price
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={9.3}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography sx={{ fontSize: "18px" }}>
                              {/* Format the amount with currency symbol */}₹
                              {Number(
                                itemDetails[0]?.pur_c_price
                              ).toLocaleString("en-IN")}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container sx={{ minHeight: 45 }}>
                          <Grid
                            item
                            xs={12}
                            md={2.7}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#777777",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              Purchase Account
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={9.3}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography sx={{ fontSize: "18px" }}>
                              Cost of Goods Sold
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          container
                          sx={{ minHeight: 45, mt: 5 }}
                        >
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "bold",
                              fontFamily: "helvetica",
                            }}
                          >
                            Sales Information
                          </Typography>
                        </Grid>
                        <Grid item xs={12} container sx={{ minHeight: 45 }}>
                          <Grid
                            item
                            xs={12}
                            md={2.7}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#777777",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              Selling Price
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={9.3}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography sx={{ fontSize: "18px" }}>
                              {/* Format the amount with currency symbol */}₹
                              {Number(
                                itemDetails[0]?.sales_s_price
                              ).toLocaleString("en-IN")}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} container sx={{ minHeight: 45 }}>
                          <Grid
                            item
                            xs={12}
                            md={2.7}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#777777",
                            }}
                          >
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              Sales Account
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={9.3}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <Typography sx={{ fontSize: "18px" }}>
                              Sales
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}
                  {selectedTab === 1 && (
                    <>
                      <Grid item xs={12} container sx={{ minHeight: 50, p: 3 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <Button
                            ref={buttonRef}
                            variant="outlined"
                            onClick={handleClick}
                            endIcon={<ArrowDropDownIcon />}
                            style={{
                              textTransform: "none",
                              borderRadius: "6px",
                              color: "#333",
                              borderColor: "#d3d3d3",
                              padding: "5px 10px",
                              fontSize: "18px",
                            }}
                          >
                            Filter By:{" "}
                            <span
                              style={{
                                color: "#408DFB",
                                marginLeft: "5px",
                                fontWeight: "bold",
                              }}
                            >
                              {selectedOption}
                            </span>
                          </Button>

                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseAnchor}
                            PaperProps={{
                              style: {
                                borderRadius: "10px",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                padding: "5px",
                                marginTop: 3,
                                width: menuWidth, // Set menu width to button width
                              },
                            }}
                          >
                            {options.map((option) => (
                              <MenuItem
                                key={option}
                                onClick={() => handleSelect(option)}
                                style={{
                                  padding: "8px 16px",
                                  color:
                                    selectedOption === option
                                      ? "#408DFB"
                                      : "#333",
                                  backgroundColor:
                                    selectedOption === option
                                      ? "rgba(64, 141, 251, 0.1)"
                                      : "white",
                                  borderRadius: "4px",
                                  fontWeight:
                                    selectedOption === option
                                      ? "bold"
                                      : "normal",
                                }}
                                onMouseOver={(e) =>
                                  (e.target.style.backgroundColor = "#e0f2ff")
                                }
                                onMouseOut={(e) =>
                                  (e.target.style.backgroundColor =
                                    selectedOption === option
                                      ? "rgba(64, 141, 251, 0.1)"
                                      : "white")
                                }
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </Menu>
                        </div>
                      </Grid>
                      {transactionDetails.length > 0 ? (
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            minHeight: 200,
                          }}
                        >
                          <TableContainer
                            sx={{
                              width: "100%",
                              maxHeight: 821,
                              //boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for table
                              overflowX: "auto",
                            }}
                          >
                            <Table stickyHeader>
                              <TableHead>
                                <TableRow sx={{}}>
                                  <TableCell
                                    sx={{
                                      backgroundColor: "#F9F9FB",
                                      color: "#6C757D",
                                      textTransform: "uppercase",
                                      fontFamily: "Helvetica",
                                      p: 1,
                                      borderTop: "1px solid #e6e6e6",
                                    }}
                                  >
                                    Date
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      backgroundColor: "#F9F9FB",
                                      color: "#6C757D",
                                      textTransform: "uppercase",
                                      fontFamily: "Helvetica",
                                      p: 1,
                                      borderTop: "1px solid #e6e6e6",
                                    }}
                                  >
                                    {selectedOption === "Quotes"
                                      ? " Quote Number"
                                      : selectedOption === "Sales Orders"
                                      ? "Sales Order#"
                                      : selectedOption === "Invoices"
                                      ? "invoice number"
                                      : selectedOption === "Delivery Challans"
                                      ? "Delivery Challan#"
                                      : selectedOption === "Credit Notes"
                                      ? "Credit Notes#"
                                      : selectedOption === "Recurring Invoices"
                                      ? "Recurring Invoices#"
                                      : selectedOption === "Purchase Orders"
                                      ? "Purchase Orders#"
                                      : selectedOption === "Bills"
                                      ? "Bills#"
                                      : selectedOption === "Vendor Credits"
                                      ? "Vendor Credits#"
                                      : ""}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      backgroundColor: "#F9F9FB",
                                      color: "#6C757D",
                                      textTransform: "uppercase",
                                      fontFamily: "Helvetica",
                                      p: 1,
                                      borderTop: "1px solid #e6e6e6",
                                    }}
                                  >
                                    Customer Name
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      backgroundColor: "#F9F9FB",
                                      color: "#6C757D",
                                      textTransform: "uppercase",
                                      fontFamily: "Helvetica",
                                      p: 1,
                                      borderTop: "1px solid #e6e6e6",
                                    }}
                                  >
                                    Quantity Sold
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      backgroundColor: "#F9F9FB",
                                      color: "#6C757D",
                                      textTransform: "uppercase",
                                      fontFamily: "Helvetica",
                                      p: 1,
                                      borderTop: "1px solid #e6e6e6",
                                      textAlign: "right",
                                    }}
                                  >
                                    Price
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      backgroundColor: "#F9F9FB",
                                      color: "#6C757D",
                                      textTransform: "uppercase",
                                      fontFamily: "Helvetica",
                                      p: 1,
                                      borderTop: "1px solid #e6e6e6",
                                      textAlign: "right",
                                    }}
                                  >
                                    Total
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      backgroundColor: "#F9F9FB",
                                      color: "#6C757D",
                                      textTransform: "uppercase",
                                      fontFamily: "Helvetica",
                                      p: 1,
                                      borderTop: "1px solid #e6e6e6",
                                      textAlign: "center",
                                    }}
                                  >
                                    Status
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {transactionDetails &&
                                  transactionDetails.map((item, index) => (
                                    <TableRow
                                      key={index}
                                      hover
                                      style={{
                                        borderBottom: "1px solid #e6e6e6",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        if (selectedOption === "Quotes") {
                                          navigate(
                                            "/SalesPage/QuoteDetailPage",
                                            {
                                              state: { item },
                                            }
                                          );
                                        } else if (
                                          selectedOption === "Sales Orders"
                                        ) {
                                          navigate(
                                            "/SalesPage/SalesDetailPage",
                                            {
                                              state: { item },
                                            }
                                          );
                                        } else if (
                                          selectedOption === "Invoices"
                                        ) {
                                          navigate(
                                            "/SalesPage/InvoiceDetailsPage",
                                            {
                                              state: { item },
                                            }
                                          );
                                        } else if (
                                          selectedOption === "Delivery Challans"
                                        ) {
                                          navigate(
                                            "/SalesPage/DeliveryChallanDetailPage",
                                            {
                                              state: { item },
                                            }
                                          );
                                        } else if (
                                          selectedOption === "Credit Notes"
                                        ) {
                                          navigate(
                                            "/SalesPage/CreditNoteDetailPage",
                                            {
                                              state: { item },
                                            }
                                          );
                                        }
                                      }}
                                    >
                                      <TableCell
                                        sx={{
                                          fontFamily: "Helvetica",
                                          p: 1,
                                          borderTop: "1px solid #e6e6e6",
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {item.date}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontFamily: "Helvetica",
                                          p: 1,
                                          borderTop: "1px solid #e6e6e6",
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                          color: "#408DFB",
                                        }}
                                      >
                                        {selectedOption === "Quotes"
                                          ? `${item.quote_no}`
                                          : selectedOption === "Sales Orders"
                                          ? `${item.sales_order_no}`
                                          : selectedOption === "Invoices"
                                          ? `${item.invoice_no}`
                                          : selectedOption ===
                                            "Delivery Challans"
                                          ? `${item.delivery_no}`
                                          : selectedOption === "Credit Notes"
                                          ? `${item.credit_no}`
                                          : selectedOption ===
                                            "Recurring Invoices"
                                          ? `${item.recurring_invoice}`
                                          : selectedOption === "Purchase Orders"
                                          ? `${item.purchase_order_no}`
                                          : selectedOption === "Bills"
                                          ? `${item.bill_no}`
                                          : selectedOption === "Vendor Credits"
                                          ? `${item.vendor_no}`
                                          : ""}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontFamily: "Helvetica",
                                          p: 1,
                                          borderTop: "1px solid #e6e6e6",
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {item.customer_name}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontFamily: "Helvetica",
                                          p: 1,
                                          borderTop: "1px solid #e6e6e6",
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {item.quantity_sold}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontFamily: "Helvetica",
                                          p: 1,
                                          borderTop: "1px solid #e6e6e6",
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                          textAlign: "right",
                                        }}
                                      >
                                        {/* Format the amount with currency symbol */}
                                        ₹
                                        {Number(item.price).toLocaleString(
                                          "en-IN"
                                        )}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontFamily: "Helvetica",
                                          p: 1,
                                          borderTop: "1px solid #e6e6e6",
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                          textAlign: "right",
                                        }}
                                      >
                                        {/* Format the amount with currency symbol */}
                                        ₹
                                        {Number(
                                          item.total_amount
                                        ).toLocaleString("en-IN")}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontFamily: "Helvetica",
                                          p: 1,
                                          borderTop: "1px solid #e6e6e6",
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                          textAlign: "center",
                                        }}
                                      >
                                        {item.stage}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      ) : (
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            minHeight: 200,
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center",
                            fontFamily: "Helvetica",
                            fontSize: "25px",
                            fontWeight: "bold",
                          }}
                        >
                          No Transactions Available
                        </Grid>
                      )}
                    </>
                  )}
                  {selectedTab === 2 && (
                    <>
                      {historyDetails.length > 0 ? (
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            minHeight: 200,
                            mt: 3,
                          }}
                        >
                          <TableContainer
                            sx={{
                              width: "100%",
                              maxHeight: 726,
                              //boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for table
                              overflowX: "auto",
                            }}
                          >
                            <Table stickyHeader>
                              <TableHead>
                                <TableRow sx={{}}>
                                  <TableCell
                                    width="30%"
                                    sx={{
                                      backgroundColor: "#F9F9FB",
                                      color: "#6C757D",
                                      textTransform: "uppercase",
                                      fontFamily: "Helvetica",
                                      p: 1,
                                      borderTop: "1px solid #e6e6e6",
                                    }}
                                  >
                                    Date
                                  </TableCell>
                                  <TableCell
                                    width="80%"
                                    sx={{
                                      backgroundColor: "#F9F9FB",
                                      color: "#6C757D",
                                      textTransform: "uppercase",
                                      fontFamily: "Helvetica",
                                      p: 1,
                                      borderTop: "1px solid #e6e6e6",
                                      textAlign: "left",
                                    }}
                                  >
                                    Details
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {historyDetails &&
                                  historyDetails.map((item, index) => (
                                    <TableRow
                                      key={index}
                                      hover
                                      style={{
                                        borderBottom: "1px solid #e6e6e6",
                                      }}
                                    >
                                      <TableCell
                                        width="30%"
                                        sx={{
                                          fontFamily: "Helvetica",
                                          p: 1,
                                          borderTop: "1px solid #e6e6e6",
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {item.date + item.time}
                                      </TableCell>
                                      <TableCell
                                        width="80%"
                                        sx={{
                                          fontFamily: "Helvetica",
                                          p: 1,
                                          borderTop: "1px solid #e6e6e6",
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                          textAlign: "left",
                                        }}
                                      >
                                        {item.head} by - {item.created_by}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      ) : (
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            minHeight: 200,
                            alignItems: "center",
                            display: "flex",
                            justifyContent: "center",
                            fontFamily: "Helvetica",
                            fontSize: "25px",
                            fontWeight: "bold",
                          }}
                        >
                          No History Available
                        </Grid>
                      )}
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Sidebar>
    </React.Fragment>
  );
};

export default ItemDetailPage;
