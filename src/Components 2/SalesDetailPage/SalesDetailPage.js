import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import CloseIcon from "@mui/icons-material/Close";
import { Icon } from "@iconify/react/dist/iconify.js";
import { makeStyles } from "@mui/styles";
import numWords from "num-words";
import { Helmet } from "react-helmet";
import html2pdf from "html2pdf.js";
import Sidebar from "../../Navbars/Sidebar";
import LoadingDots from "../../Loading Animations/LoadingDots";
import CommentsHistory from "../../UsableContent/CommentsHistory";
import SuiSnackbar from "../../Snackbars/SuiSnackbar";

const useStyles = makeStyles(() => ({
  ribbon: {
    position: "absolute",
    background: "#ff0000",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "1.2em",
    fontWeight: "bold",
    textAlign: "center",
    transform: "rotate(-45deg)",
    width: "210px",
    top: "20px",
    left: "-80px",
    "&::before": {
      content: '""',
      position: "absolute",
      left: "0px",
      top: "100%",
      zIndex: "-1",
      borderLeft: "3px solid #ff0000",
      borderRight: "3px solid transparent",
      borderBottom: "3px solid transparent",
      borderTop: "3px solid #ff0000",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      right: "0px",
      top: "100%",
      zIndex: "-1",
      borderLeft: "3px solid transparent",
      borderRight: "3px solid #ff0000",
      borderBottom: "3px solid transparent",
      borderTop: "3px solid #ff0000",
    },
  },
}));
const SalesDetailPage = ({ onLogout }) => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const data = localStorage.getItem("data");
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { item, create, sent, edit } = location.state || {};
  const [salesTable, setSalesTable] = useState([]);
  const [salesDetails, setSalesDetails] = useState([]);
  const [address, setAddress] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);
  const [userData, setUserData] = useState([]);
  const pdfContentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be 'error', 'warning', 'info', 'success'

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (create) {
      setSnackbarMessage("Your salerorder has been created.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (sent) {
      setSnackbarMessage("Your salerorder has been sent.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (edit) {
      setSnackbarMessage("Your salerorder has been updated.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  }, [create, sent, edit]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setUserData(JSON.parse(data));
  }, []);

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getsalesTable = () => {
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
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getsalesTable();
  }, []);

  const getSalesDetails = () => {
    setLoading(true);
    const params = {
      json_type: "get_sales_orders",
      sales_ids: [item.id],
      org_id: orgid,
      type: "2",
      includeFullDetails: "true",
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
          setSalesDetails(JsonData);
          setAddress(JSON.parse(res.data).data);
          setItemDetails(JsonData[0].item_details);
          setLoading(false);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getSalesDetails();
  }, [item]);

  const convertToWordsWithoutDecimal = (number) => {
    const integerPart = Math.floor(number); // Remove the decimal part
    return numWords(integerPart);
  };

  const handleSendClick = () => {
    navigate("/Sales/SalesMail", {
      state: { isSalesOrder: true, data: salesDetails },
    });
  };

  const downloadPdf = () => {
    const element = pdfContentRef.current;

    // Define margins (in inches)
    const marginTop = 0.5; // Top margin
    const marginBottom = 0.5; // Bottom margin
    const marginLeft = 0.5; // Left margin
    const marginRight = 0.5; // Right margin

    // A4 dimensions in pixels (96 DPI)
    const pageWidth = 8.5 * 96; // Width in pixels
    const pageHeight = 11 * 96; // Height in pixels

    // Calculate the content dimensions
    const contentWidth = element.offsetWidth;
    const contentHeight = element.offsetHeight;

    // Calculate scaling factor to fit content within page dimensions including margins
    const scaleX = (pageWidth - (marginLeft + marginRight) * 96) / contentWidth;
    const scaleY =
      (pageHeight - (marginTop + marginBottom) * 96) / contentHeight;
    const scale = Math.min(scaleX, scaleY);

    // Create a hidden container for the PDF content
    const hiddenContainer = document.createElement("div");
    hiddenContainer.style.position = "absolute";
    hiddenContainer.style.top = "-9999px";
    document.body.appendChild(hiddenContainer);

    // Clone the original element into the hidden container
    const clone = element.cloneNode(true);
    clone.style.transform = `scale(${scale})`;
    clone.style.transformOrigin = "top left";
    clone.style.width = `${contentWidth}px`;
    clone.style.height = `${contentHeight}px`;

    hiddenContainer.appendChild(clone);

    // Define options for html2pdf
    const options = {
      margin: [marginTop, marginLeft, marginBottom, marginRight], // Margins in inches
      filename: "Sales Order.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        unit: "in",
        format: [8.5, 11], // Letter size (8.5x11 inches)
        orientation: "portrait",
      },
    };

    // Convert HTML to PDF
    html2pdf()
      .from(clone)
      .set(options)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        if (totalPages > 1) {
          pdf.deletePage(totalPages); // Remove extra page if exists
        }

        // Save the PDF as "invoice.pdf"
        pdf.save("Sales Order.pdf");

        // Clean up: remove the hidden container and the clone
        document.body.removeChild(hiddenContainer);
      })
      .catch((err) => {
        console.error("Error generating PDF:", err);

        // Clean up in case of error
        document.body.removeChild(hiddenContainer);
      });
  };

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
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "500px",
            padding: "20px",
            position: "fixed",
            top: "65px", // Start the drawer from 65px from the top
          },
          elevation: 3,
        }}
        BackdropProps={{ invisible: true }} // Disables the background dull effect
      >
        <CommentsHistory id={item.id} name="salesorder" onClose={handleClose} />
      </Drawer>
      <Sidebar onLogout={onLogout}>
        <Grid container>
          <Helmet>
            <title>
              {" "}
              {salesDetails[0] ? salesDetails[0].sales_order_no : ""} | Sales
              Orders{" "}
            </title>
          </Helmet>
          <Grid
            item
            container
            xs={12}
            sx={{
              mt: 2,
              width: "100%",
              height: "100%",
              minHeight: 910,
              maxHeight: 910,
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
                minHeight: 910,
                maxHeight: 910,
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
                    All Sales Order
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
                          navigate("/Sales/NewSalesOrder");
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
                  minHeight: 835,
                }}
              >
                <TableContainer
                  sx={{
                    width: "100%",
                    maxHeight: 835,
                  }}
                >
                  <Table stickyHeader>
                    <TableBody>
                      {salesTable &&
                        salesTable.map((salesItem, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              cursor: "pointer",
                              backgroundColor:
                                item && item.id === salesItem.id
                                  ? "#f0f0f5"
                                  : "inherit",
                              "&:hover": {
                                backgroundColor: "#f9f9fb",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                fontSize: "1.3rem",
                                fontFamily: "Helvetica",
                                borderBottom: "0.5px solid #e6e6e6",
                                fontWeight: "bold",
                              }}
                              onClick={() => {
                                navigate("/SalesPage/SalesDetailPage", {
                                  state: { item: salesItem },
                                });
                              }}
                            >
                              {/* Customer Name */}
                              <div>{salesItem.cust_name}</div>

                              {/* Delivery No and Date */}
                              <div
                                style={{
                                  fontSize: "1rem",
                                  color: "#6C7184",
                                  marginTop: 8,
                                }}
                              >
                                {salesItem.sales_order_no} •{" "}
                                {salesItem.sales_order_date}
                              </div>

                              {/* Status */}
                              <div
                                style={{
                                  color:
                                    item.status === "Draft"
                                      ? "red"
                                      : item.status === "Open"
                                      ? "#268DDD"
                                      : item.status === "Delivered"
                                      ? "green"
                                      : item.status === "Returned"
                                      ? "#21263C"
                                      : "",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                  textTransform: "uppercase",
                                  letterSpacing: 1,
                                  marginTop: 8,
                                }}
                              >
                                {salesItem.status}
                              </div>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "1.2rem",
                                fontFamily: "Helvetica",
                                borderBottom: "0.5px solid #e6e6e6",
                                textAlign: "right",
                              }}
                              onClick={() => {
                                navigate("/SalesPage/SalesDetailPage", {
                                  state: { item: salesItem },
                                });
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(salesItem.total).toLocaleString("en-IN")}
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
              sx={{
                borderRight: "1px solid #e6e6e6",
                width: "100%",
                height: "100%",
                minHeight: 910,
                maxHeight: 910,
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
                      fontSize: "1.2rem",
                      fontFamily: "Helvetica",
                      // fontWeight: "bold",
                      alignItems: "center",
                    }}
                  >
                    {item ? item.sales_order_no : ""}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
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
                    <Typography
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        alignItems: "center",
                        "&:hover": {
                          color: "#408DFB",
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => {
                        handleOpen();
                      }}
                    >
                      <Icon
                        icon="mdi-light:message"
                        width="1.2rem"
                        height="1.2rem"
                        style={{ marginTop: 3 }}
                      />
                      Comments & History
                    </Typography>
                  </Grid>
                  <Grid>
                    <Tooltip title="Close" arrow>
                      <CloseIcon
                        onClick={() => {
                          navigate("/Sales/SalesOrder");
                        }}
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={12}
                sx={{
                  width: "100%",
                  height: "100%",
                  minHeight: 70,
                  borderBottom: "1px solid #e6e6e6",
                  backgroundColor: "#F9F9FB",
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={1.3}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRight: "1px solid #e6e6e6",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.3rem",
                      fontFamily: "Ubuntu",
                      display: "flex",
                      cursor: "pointer",
                      gap: 0.5,
                      "&:hover": {
                        color: "#408DFB",
                      },
                    }}
                    onClick={() => {
                      navigate("/Sales/EditSalesOrder", {
                        state: { salesDetails },
                      });
                    }}
                  >
                    <Icon
                      icon="lets-icons:edit-fill"
                      width="1.5rem"
                      height="1.5rem"
                      style={{ marginTop: 5 }}
                    />
                    Edit
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={1.3}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRight: "1px solid #e6e6e6",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.3rem",
                      fontFamily: "Ubuntu",
                      display: "flex",
                      cursor: "pointer",
                      gap: 0.5,
                      "&:hover": {
                        color: "#408DFB",
                      },
                    }}
                    onClick={() => {
                      handleSendClick();
                    }}
                  >
                    <Icon
                      icon="material-symbols:mail-outline"
                      width="1.5rem"
                      height="1.5rem"
                      style={{ marginTop: 5 }}
                    />
                    Send
                  </Typography>
                </Grid>
                {/* <Grid
                  item
                  xs={12}
                  md={1.3}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRight: "1px solid #e6e6e6",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.3rem",
                      fontFamily: "Ubuntu",
                      display: "flex",
                      cursor: "pointer",
                      gap: 0.5,
                      "&:hover": {
                        color: "#408DFB",
                      },
                    }}
                  >
                    <Icon
                      icon="tabler:share-2"
                      width="1.5rem"
                      height="1.5rem"
                      style={{ marginTop: 5 }}
                    />{" "}
                    Share
                  </Typography>
                </Grid> */}
                <Grid
                  item
                  xs={12}
                  md={2.2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRight: "1px solid #e6e6e6",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.3rem",
                      fontFamily: "Ubuntu",
                      display: "flex",
                      cursor: "pointer",
                      gap: 0.5,
                      "&:hover": {
                        color: "#408DFB",
                      },
                    }}
                    onClick={() => {
                      downloadPdf();
                    }}
                  >
                    <Icon
                      icon="mingcute:pdf-line"
                      width="1.5rem"
                      height="1.5rem"
                      style={{ marginTop: 5 }}
                    />{" "}
                    PDF Download
                  </Typography>
                </Grid>
                {salesDetails[0]?.status === "Draft" ? (
                  <Grid
                    item
                    xs={12}
                    md={2.3}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid #e6e6e6",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.3rem",
                        fontFamily: "Ubuntu",
                        display: "flex",
                        cursor: "pointer",
                        gap: 0.7,
                        "&:hover": {
                          color: "#408DFB",
                        },
                      }}
                      //  onClick={handleSureOpen}
                    >
                      <Icon
                        icon="bitcoin-icons:verify-outline"
                        width="2rem"
                        height="2rem"
                        style={{ marginTop: 2 }}
                      />
                      Mark as Confirmed
                    </Typography>
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={12}
                    md={2.3}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid #e6e6e6",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.3rem",
                        fontFamily: "Ubuntu",
                        display: "flex",
                        cursor: "pointer",
                        gap: 0.7,
                        "&:hover": {
                          color: "#408DFB",
                        },
                      }}
                      onClick={() => {
                        navigate("/Sales/NewInvoice", {
                          state: {
                            ids: salesDetails[0]?.id,
                            convert: "convert salesorder",
                          },
                        });
                      }}
                    >
                      <Icon
                        icon="iconamoon:invoice-bold"
                        width="1.5rem"
                        height="1.5rem"
                        style={{ marginTop: 5 }}
                      />
                      Convert to Invoice
                    </Typography>
                  </Grid>
                )}
                {/* <Grid
                  item
                  xs={12}
                  md={0.9}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRight: "1px solid #e6e6e6",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.3rem",
                      fontFamily: "Ubuntu",
                      display: "flex",
                      cursor: "pointer",
                      gap: 0.5,
                      "&:hover": {
                        color: "#408DFB",
                      },
                    }}
                  >
                    <Icon
                      icon="svg-spinners:3-dots-move"
                      width="1.5rem"
                      height="1.5rem"
                    />
                  </Typography>
                </Grid> */}
              </Grid>
              <Grid
                item
                container
                xs={12}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "765px",
                  display: "flex",
                  justifyContent: "center",
                  overflowY: "auto",
                  pb: 3,
                }}
              >
                {loading === true ? (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      width: "100%",
                      height: "100px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <LoadingDots />
                  </Grid>
                ) : (
                  <>
                    <Grid
                      item
                      xs={12}
                      sx={{ width: "100%", height: "auto", minHeight: "100px" }}
                    ></Grid>
                    <Paper
                      elevation={6}
                      sx={{
                        position: "relative",
                        width: "80%",
                        height: "auto",
                        minHeight: "800px",
                        overflow: "hidden",
                        pb: 10,
                      }}
                    >
                      <Grid
                        item
                        container
                        xs={12}
                        sx={{
                          width: "100%",
                          height: "auto",
                          minHeight: "0px",
                        }}
                      >
                        <div
                          className={classes.ribbon}
                          style={{
                            backgroundColor: salesDetails[0]
                              ? salesDetails[0].status_color
                              : "",
                          }}
                        >
                          {" "}
                          {salesDetails[0] ? salesDetails[0].status : ""}{" "}
                        </div>
                      </Grid>
                      <div id="pdf-content" ref={pdfContentRef}>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            minHeight: "180px",
                            mt: 2,
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "start",
                              pl: 8,
                              pt: 7,
                              textAlign: "left",
                              flexDirection: "column",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "20px",
                                fontFamily: "Ubuntu",
                                fontWeight: "bold",
                              }}
                            >
                              {userData[0] ? userData[0].org_name : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                              }}
                            >
                              {userData[0] ? userData[0].state_name : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                              }}
                            >
                              {userData[0] ? userData[0].country_name : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                              }}
                            >
                              {userData[0] ? userData[0].gst_no : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                              }}
                            >
                              {userData[0] ? userData[0].e_mail : ""}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                              width: "100%",
                              textAlign: "right",
                              pr: "40px",
                              alignContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "50px",
                                textTransform: "uppercase",
                                fontFamily: "Ubuntu",
                                fontWeight: 500,
                              }}
                            >
                              Sales Order
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                fontWeight: "bold",
                                color: "#333333",
                              }}
                            >
                              Sales Order #
                              {salesDetails[0]
                                ? salesDetails[0].sales_order_no
                                : ""}{" "}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            pl: 8,
                            mt: 3,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontFamily: "Ubuntu",
                              color: "#333333",
                            }}
                          >
                            Bill To
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            minHeight: "170px",
                            pl: 8,
                            mt: 0.2,
                            textAlign: "left",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontFamily: "Ubuntu",
                              color: "#408DFB",
                              fontWeight: "bold",
                            }}
                          >
                            {address[0] ? address[0].company_name : ""}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontFamily: "Ubuntu",
                              color: "#333333",
                            }}
                          >
                            {address[0] ? address[0].b_address.add1 : ""}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontFamily: "Ubuntu",
                              color: "#333333",
                            }}
                          >
                            {address[0] ? address[0].b_address.add2 : ""}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontFamily: "Ubuntu",
                              color: "#333333",
                            }}
                          >
                            {address[0] ? address[0].b_address.city : ""}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontFamily: "Ubuntu",
                              color: "#333333",
                            }}
                          >
                            {address[0]
                              ? address[0].b_address.state +
                                " - " +
                                address[0].b_address.zip
                              : ""}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontFamily: "Ubuntu",
                              color: "#333333",
                            }}
                          >
                            {address[0] ? address[0].b_address.country : ""}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            minHeight: "170px",
                            pl: 8,
                            textAlign: "left",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                              width: "100%",
                              textAlign: "left",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                              }}
                            >
                              Ship To
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#408DFB",
                                fontWeight: "bold",
                                mt: 0.5,
                              }}
                            >
                              {address[0] ? address[0].company_name : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                              }}
                            >
                              {address[0] ? address[0].s_address.add1 : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                              }}
                            >
                              {address[0] ? address[0].b_address.add2 : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                              }}
                            >
                              {address[0] ? address[0].b_address.city : ""}
                              Mannargudi
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                              }}
                            >
                              {address[0]
                                ? address[0].s_address.state +
                                  " - " +
                                  address[0].s_address.zip
                                : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                              }}
                            >
                              {address[0] ? address[0].b_address.country : ""}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <Grid
                              item
                              container
                              xs={12}
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={5.3}
                                sx={{ textAlign: "right" }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "18px",
                                    fontFamily: "Ubuntu",
                                    color: "#333333",
                                    fontWeight: 500,
                                  }}
                                >
                                  Order Date :
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "18px",
                                    fontFamily: "Ubuntu",
                                    color: "#333333",
                                    mt: 1,
                                    fontWeight: 500,
                                  }}
                                >
                                  Expected Shipment :
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "18px",
                                    fontFamily: "Ubuntu",
                                    color: "#333333",
                                    mt: 1,
                                    fontWeight: 500,
                                  }}
                                >
                                  Ref# :
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "18px",
                                    fontFamily: "Ubuntu",
                                    color: "#333333",
                                    mt: 1,
                                    fontWeight: 500,
                                  }}
                                >
                                  Delivery Method :
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6.7}
                                sx={{ textAlign: "right", pr: 5 }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "18px",
                                    fontFamily: "Ubuntu",
                                    color: "#333333",
                                  }}
                                >
                                  {salesDetails && salesDetails[0]
                                    ? salesDetails[0].sales_order_date
                                    : ""}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "18px",
                                    fontFamily: "Ubuntu",
                                    color: "#333333",
                                    mt: 1,
                                  }}
                                >
                                  {salesDetails && salesDetails[0]
                                    ? salesDetails[0].ex_ship_date
                                    : ""}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "18px",
                                    fontFamily: "Ubuntu",
                                    color: "#333333",
                                    mt: 1,
                                  }}
                                >
                                  {salesDetails && salesDetails[0]
                                    ? salesDetails[0].reference
                                    : ""}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "18px",
                                    fontFamily: "Ubuntu",
                                    color: "#333333",
                                    mt: 1,
                                  }}
                                >
                                  {salesDetails && salesDetails[0]
                                    ? salesDetails[0].delivery_method
                                    : ""}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            pl: 8,
                            mt: 3,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontFamily: "Ubuntu",
                              color: "#333333",
                            }}
                          >
                            Place Of Supply:
                            {salesDetails && salesDetails[0]
                              ? "  " + salesDetails[0].plc_supply
                              : ""}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            minHeight: "100px",
                            pl: 8,
                            pr: 5,
                            mt: 2,
                            textAlign: "left",
                          }}
                        >
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    sx={{
                                      fontSize: "1.2rem",
                                      fontFamily: "Ubuntu",
                                      width: "35%",
                                      p: 1,
                                      color: "white",
                                      borderBottom: "0.5px solid #e6e6e6",
                                      backgroundColor: "#3C3D3A",
                                      width: "8%",
                                    }}
                                  >
                                    #
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: "1.2rem",
                                      fontFamily: "Ubuntu",
                                      width: "35%",
                                      p: 1,
                                      color: "white",
                                      borderBottom: "0.5px solid #e6e6e6",
                                      backgroundColor: "#3C3D3A",
                                      width: "30%",
                                    }}
                                  >
                                    Item & Description
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: "1.2rem",
                                      fontFamily: "Ubuntu",
                                      width: "35%",
                                      p: 1,
                                      color: "white",
                                      borderBottom: "0.5px solid #e6e6e6",
                                      backgroundColor: "#3C3D3A",
                                      width: "20%",
                                    }}
                                  >
                                    HSN/SAC
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      fontSize: "1.2rem",
                                      fontFamily: "Ubuntu",
                                      width: "35%",
                                      p: 1,
                                      color: "white",
                                      borderBottom: "0.5px solid #e6e6e6",
                                      backgroundColor: "#3C3D3A",
                                      width: "10%",
                                    }}
                                  >
                                    Qty
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      fontSize: "1.2rem",
                                      fontFamily: "Ubuntu",
                                      width: "35%",
                                      p: 1,
                                      color: "white",
                                      borderBottom: "0.5px solid #e6e6e6",
                                      backgroundColor: "#3C3D3A",
                                      width: "10%",
                                    }}
                                  >
                                    Rate
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      fontSize: "1.2rem",
                                      fontFamily: "Ubuntu",
                                      width: "35%",
                                      p: 1,
                                      color: "white",
                                      borderBottom: "0.5px solid #e6e6e6",
                                      backgroundColor: "#3C3D3A",
                                      width: "10%",
                                    }}
                                  >
                                    Discount
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    sx={{
                                      fontSize: "1.2rem",
                                      fontFamily: "Ubuntu",
                                      width: "35%",
                                      p: 1,
                                      color: "white",
                                      borderBottom: "0.5px solid #e6e6e6",
                                      backgroundColor: "#3C3D3A",
                                      width: "10%",
                                    }}
                                  >
                                    Amount
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {itemDetails &&
                                  itemDetails.map((item, index) => (
                                    <TableRow>
                                      <TableCell
                                        sx={{
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          p: 1,
                                          borderBottom: "0.5px solid #e6e6e6",
                                        }}
                                      >
                                        {index + 1}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          p: 1,
                                          borderBottom: "0.5px solid #e6e6e6",
                                        }}
                                      >
                                        {item.item}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          p: 1,
                                          borderBottom: "0.5px solid #e6e6e6",
                                        }}
                                      >
                                        {item.hsn_code || item.sac_code}
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        sx={{
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          p: 1,
                                          borderBottom: "0.5px solid #e6e6e6",
                                        }}
                                      >
                                        {item.qty}
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        sx={{
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          p: 1,
                                          borderBottom: "0.5px solid #e6e6e6",
                                        }}
                                      >
                                        {/* Format the amount with currency symbol */}
                                        ₹
                                        {Number(item.rate).toLocaleString(
                                          "en-IN"
                                        )}
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        sx={{
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          p: 1,
                                          borderBottom: "0.5px solid #e6e6e6",
                                        }}
                                      >
                                        {item.discount + item.per_rupee}
                                      </TableCell>
                                      <TableCell
                                        align="right"
                                        sx={{
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          p: 1,
                                          borderBottom: "0.5px solid #e6e6e6",
                                        }}
                                      >
                                        {/* Format the amount with currency symbol */}
                                        ₹
                                        {Number(item.amount).toLocaleString(
                                          "en-IN"
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <Grid item xs={12} md={9} sx={{ textAlign: "right" }}>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                                fontWeight: 500,
                              }}
                            >
                              Sub Total
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                                fontWeight: 500,
                                mt: 2,
                              }}
                            >
                              Shipping Charge
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                                mt: 2,
                                fontWeight: 500,
                              }}
                            >
                              {salesDetails[0]?.tax_id === "0"
                                ? "IGST0 (0%)"
                                : salesDetails[0]?.tax_id === "1"
                                ? "IGST5 (5%)"
                                : salesDetails[0]?.tax_id === "2"
                                ? "IGST12 (12%)"
                                : salesDetails[0]?.tax_id === "3"
                                ? "IGST18 (18%)"
                                : salesDetails[0]?.tax_id === "4"
                                ? "IGST28 (28%)"
                                : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                                fontWeight: 500,
                                mt: 2,
                              }}
                            >
                              Adjustment
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                                fontWeight: 500,
                                mt: 2,
                              }}
                            >
                              {salesDetails[0]?.tds < 0 &&
                              salesDetails[0]?.tcs === "0.00"
                                ? "TDS"
                                : salesDetails[0]?.tds === "0" &&
                                  salesDetails[0]?.tcs < 0
                                ? "TCS"
                                : ""}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={3}
                            sx={{ textAlign: "right", pr: 5 }}
                          >
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(
                                salesDetails && salesDetails[0]
                                  ? salesDetails[0].sub_total
                                  : ""
                              ).toLocaleString("en-IN")}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                                mt: 2,
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(
                                salesDetails && salesDetails[0]
                                  ? salesDetails[0].ship_charge
                                  : ""
                              ).toLocaleString("en-IN")}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                                mt: 2,
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(
                                salesDetails[0]
                                  ? parseFloat(salesDetails[0].ship_sGST) +
                                      parseFloat(salesDetails[0].ship_cGST)
                                  : ""
                              ).toLocaleString("en-IN")}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                                mt: 2,
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(
                                salesDetails && salesDetails[0]
                                  ? salesDetails[0].adjustment
                                  : ""
                              ).toLocaleString("en-IN")}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                                mt: 2,
                              }}
                            >
                              {salesDetails[0]?.tds < 0 &&
                              salesDetails[0]?.tcs === "0.00"
                                ? salesDetails[0]?.tds
                                : salesDetails[0]?.tds === "0" &&
                                  salesDetails[0]?.tcs < 0
                                ? salesDetails[0]?.tcs
                                : ""}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            minHeight: "50px",
                            height: "auto",
                            mt: 1,
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={1.5}
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              backgroundColor: "#f0f0f5",
                              height: "auto",
                              minHeight: "50px",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                                fontWeight: 500,
                              }}
                            >
                              Total
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={2.64}
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              backgroundColor: "#f0f0f5",
                              minHeight: "50px",
                              height: "auto",
                              pr: 0.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(
                                salesDetails && salesDetails[0]
                                  ? salesDetails[0].total
                                  : ""
                              ).toLocaleString("en-IN")}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={0.4} sx={{}}></Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            pl: 8,
                            mt: 3,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "18px",
                              fontFamily: "Ubuntu",
                              color: "#333333",
                            }}
                          >
                            Authorized Signature __________________________
                          </Typography>
                        </Grid>
                      </div>
                    </Paper>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Sidebar>
    </React.Fragment>
  );
};

export default SalesDetailPage;
