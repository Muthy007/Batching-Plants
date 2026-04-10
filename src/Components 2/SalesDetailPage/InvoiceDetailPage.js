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
import html2pdf from "html2pdf.js";
import Sidebar from "../../Navbars/Sidebar";
import CommentsHistory from "../../UsableContent/CommentsHistory";
import LoadingDots from "../../Loading Animations/LoadingDots";
import SuiSnackbar from "../../Snackbars/SuiSnackbar";
import { Helmet } from "react-helmet";

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
const InvoiceDetailPage = ({ onLogout }) => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const data = localStorage.getItem("data");
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { item, create, sent, edit } = location.state || {};
  const [invoiceTable, setInvoiceTable] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [address, setAddress] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);
  const [userData, setUserData] = useState([]);
  const pdfContentRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be 'error', 'warning', 'info', 'success'

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (create) {
      setSnackbarMessage("Your Invoice has been created.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (sent) {
      setSnackbarMessage("Your Invoice has been sent.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (edit) {
      setSnackbarMessage("Your Invoice has been updated.");
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

  const getInvoiceTable = () => {
    const params = {
      json_type: "get_invoice",
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
          setInvoiceTable(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getInvoiceTable();
  }, []);

  const getInvoiceDetails = () => {
    setLoading(true);
    const params = {
      json_type: "get_invoice",
      Invoice_ids: [item.id],
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
          setInvoiceDetails(JsonData);
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
    getInvoiceDetails();
  }, [item]);

  const convertToWordsWithoutDecimal = (number) => {
    const integerPart = Math.floor(number); // Remove the decimal part
    return numWords(integerPart);
  };

  const handleSendClick = () => {
    navigate("/Sales/InvoiceMail", {
      state: { isInvoice: true, data: invoiceDetails },
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
      filename: "invoice.pdf", // Change filename to "invoice.pdf"
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
        pdf.save("invoice.pdf");

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
        <CommentsHistory id={item.id} name="invoice" onClose={handleClose} />
      </Drawer>
      <Sidebar onLogout={onLogout}>
        <Grid container>
          <Helmet>
            <title>
              {" "}
              {invoiceDetails[0] ? invoiceDetails[0].invoice_no : ""} | Invoice
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
                    }}
                  >
                    All Invoices
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
                    <Tooltip title="Create Invoice" arrow>
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
                          navigate("/Sales/NewInvoice");
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
                      {invoiceTable &&
                        invoiceTable.map((invoiceItem, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              cursor: "pointer",
                              backgroundColor:
                                item && item.id === invoiceItem.id
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
                                navigate("/SalesPage/InvoiceDetailsPage", {
                                  state: { item: invoiceItem },
                                });
                              }}
                            >
                              {/* Customer Name */}
                              <div>{invoiceItem.cust_name}</div>

                              {/* Delivery No and Date */}
                              <div
                                style={{
                                  fontSize: "1rem",
                                  color: "#6C7184",
                                  marginTop: 8,
                                }}
                              >
                                {invoiceItem.invoice_no} •{" "}
                                {invoiceItem.invoice_date}
                              </div>

                              {/* Status */}
                              <div
                                style={{
                                  color: invoiceItem.status_color,
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                  textTransform: "uppercase",
                                  letterSpacing: 1,
                                  marginTop: 8,
                                }}
                              >
                                {invoiceItem.status}
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
                                navigate("/SalesPage/InvoiceDetailsPage", {
                                  state: { item: invoiceItem },
                                });
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(invoiceItem.total).toLocaleString(
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
                    {item ? item.invoice_no : ""}
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
                          navigate("/Sales/Invoice");
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
                      navigate("/Sales/EditInvoice", {
                        state: { invoiceDetails },
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
                  pb: 2,
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
                          minHeight: "100px",
                        }}
                      >
                        <div
                          className={classes.ribbon}
                          style={{
                            backgroundColor: invoiceDetails[0]
                              ? invoiceDetails[0].status_color
                              : "",
                          }}
                        >
                          {invoiceDetails[0] ? invoiceDetails[0].status : ""}
                        </div>
                      </Grid>
                      <div id="pdf-content" ref={pdfContentRef}>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "90%",
                            height: "auto",
                            minHeight: "130px",
                            border: "1px solid #999999",
                            ml: 6,
                            mr: 5,
                          }}
                        >
                          <Grid item xs={12} md={6}>
                            <Typography
                              sx={{
                                fontSize: "20px",
                                fontFamily: "Ubuntu",
                                fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {userData[0] ? userData[0].org_name : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {userData[0] ? userData[0].state_name : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {userData[0] ? userData[0].country_name : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {userData[0] ? userData[0].gst_no : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
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
                              textAlign: "right",
                              alignContent: "end",
                              fontSize: "40px",
                              fontFamily: "Ubuntu",
                              //      fontWeight: "bold",
                              pr: 1,
                            }}
                          >
                            TAX INVOICE
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "90%",
                            height: "auto",
                            minHeight: "150px",
                            borderBottom: "1px solid #999999",
                            borderLeft: "1px solid #999999",
                            borderRight: "1px solid #999999",
                            ml: 6,
                            mr: 5,
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{ borderRight: "1px solid #999999" }}
                          >
                            <Grid item container xs={12}>
                              <Grid item xs={12} md={6}>
                                {" "}
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pl: 1,
                                  }}
                                >
                                  #
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pl: 1,
                                    mt: 1,
                                  }}
                                >
                                  Invoice Date
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pl: 1,
                                    mt: 1,
                                  }}
                                >
                                  Terms
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pl: 1,
                                    mt: 1,
                                  }}
                                >
                                  Due Date
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pl: 1,
                                    mt: 1,
                                  }}
                                >
                                  P.O #
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    fontWeight: "bold",
                                    pl: 1,
                                  }}
                                >
                                  :{" "}
                                  {invoiceDetails[0]
                                    ? invoiceDetails[0].invoice_no
                                    : ""}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    fontWeight: "bold",
                                    pl: 1,
                                    mt: 1,
                                  }}
                                >
                                  :{" "}
                                  {invoiceDetails[0]
                                    ? invoiceDetails[0].invoice_date
                                    : ""}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    fontWeight: "bold",
                                    pl: 1,
                                    mt: 1,
                                  }}
                                >
                                  :{" "}
                                  {invoiceDetails[0]
                                    ? invoiceDetails[0].terms_name
                                    : ""}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    fontWeight: "bold",
                                    pl: 1,
                                    mt: 1,
                                  }}
                                >
                                  :{" "}
                                  {invoiceDetails[0]
                                    ? invoiceDetails[0].due_date
                                    : ""}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    fontWeight: "bold",
                                    pl: 1,
                                    mt: 1,
                                  }}
                                >
                                  : 45381234
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Grid item container xs={12}>
                              <Grid item xs={12} md={6}>
                                {" "}
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pl: 1,
                                  }}
                                >
                                  Place Of Supply
                                </Typography>{" "}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    fontWeight: "bold",
                                    pl: 1,
                                  }}
                                >
                                  :{" "}
                                  {invoiceDetails[0]
                                    ? invoiceDetails[0].plc_supply
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
                            width: "90%",
                            height: "auto",
                            minHeight: "20px",
                            borderBottom: "1px solid #999999",
                            borderLeft: "1px solid #999999",
                            borderRight: "1px solid #999999",
                            ml: 6,
                            mr: 5,
                            backgroundColor: "#F2F3F4",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{ borderRight: "1px solid #999999" }}
                          >
                            {" "}
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              Bill To
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              Ship To
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "90%",
                            height: "auto",
                            minHeight: "150px",
                            borderBottom: "1px solid #999999",
                            borderLeft: "1px solid #999999",
                            borderRight: "1px solid #999999",
                            ml: 6,
                            mr: 5,
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{ borderRight: "1px solid #999999" }}
                          >
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                fontWeight: "bold",
                                pl: 1,
                                color: "#408DFB",
                              }}
                            >
                              {address[0] ? address[0].customer_name : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {address[0] ? address[0].b_address.add1 : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {address[0] ? address[0].b_address.add2 : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {address[0] ? address[0].b_address.city : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {address[0] ? address[0].b_address.zip : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {address[0] ? address[0].b_address.state : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {address[0] ? address[0].b_address.country : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              GSTIN 33AADCS5069D1ZJ
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              GSTIN 33AADCS5069D1ZJ
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "90%",
                            height: "auto",
                            minHeight: "100px",
                            borderLeft: "1px solid #999999",
                            borderRight: "1px solid #999999",
                            ml: 6,
                            mr: 5,
                          }}
                        >
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow sx={{ backgroundColor: "#F2F3F4" }}>
                                  <TableCell
                                    sx={{
                                      borderBottom: "0.1px solid #999999",
                                      borderRight: "0.1px solid #999999",
                                      fontSize: "16px",
                                      fontFamily: "Ubuntu",
                                      fontWeight: "bold",
                                      padding: 0,
                                      pl: 1,
                                    }}
                                  >
                                    #
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderBottom: "0.1px solid #999999",
                                      borderRight: "0.1px solid #999999",
                                      fontSize: "16px",
                                      fontFamily: "Ubuntu",
                                      fontWeight: "bold",
                                      padding: 0,
                                      pl: 1,
                                    }}
                                  >
                                    {" "}
                                    Item & Description
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderBottom: "0.1px solid #999999",
                                      borderRight: "0.1px solid #999999",
                                      fontSize: "16px",
                                      fontFamily: "Ubuntu",
                                      fontWeight: "bold",
                                      padding: 0,
                                      pl: 1,
                                    }}
                                  >
                                    HSN/SAC
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderBottom: "0.1px solid #999999",
                                      borderRight: "0.1px solid #999999",
                                      fontSize: "16px",
                                      fontFamily: "Ubuntu",
                                      fontWeight: "bold",
                                      padding: 0,
                                      pr: 1,
                                      textAlign: "right",
                                    }}
                                  >
                                    Qty
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderBottom: "0.1px solid #999999",
                                      borderRight: "0.1px solid #999999",
                                      fontSize: "16px",
                                      fontFamily: "Ubuntu",
                                      fontWeight: "bold",
                                      padding: 0,
                                      pr: 1,
                                      textAlign: "right",
                                    }}
                                  >
                                    Rate
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderBottom: "0.1px solid #999999",
                                      borderRight: "0.1px solid #999999",
                                      fontSize: "16px",
                                      fontFamily: "Ubuntu",
                                      fontWeight: "bold",
                                      padding: 0,
                                      textAlign: "center",
                                    }}
                                  >
                                    IGST
                                    <TableCell
                                      sx={{
                                        borderTop: "0.1px solid #999999",
                                        borderRight: "0.1px solid #999999",
                                        fontSize: "16px",
                                        fontFamily: "Ubuntu",
                                        fontWeight: "bold",
                                        padding: 0, // Remove padding for full attachment
                                      }}
                                      width="18%"
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "row",
                                          width: "100%", // Ensure the box takes full width of the cell
                                          padding: 0,
                                          margin: 0,
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            flex: 1, // Ensure the box takes equal width
                                            padding: 0, // Remove padding for full attachment
                                            margin: 0, // Remove margin for full attachment
                                            fontSize: "16px",
                                            fontFamily: "Ubuntu",
                                            fontWeight: "bold",
                                            borderRight: "0.1px solid #999999",
                                            pl: 1,
                                            display: "flex",
                                            alignItems: "center", // Align items vertically center
                                          }}
                                        >
                                          %
                                        </Box>
                                        <Box
                                          sx={{
                                            flex: 1, // Ensure the box takes equal width
                                            padding: 0, // Remove padding for full attachment
                                            margin: 0, // Remove margin for full attachment
                                            fontSize: "16px",
                                            fontFamily: "Ubuntu",
                                            fontWeight: "bold",
                                            textAlign: "right",
                                            pr: 0.5,
                                            display: "flex",
                                            alignItems: "center", // Align items vertically center
                                            justifyContent: "flex-end", // Align items to the right
                                          }}
                                        >
                                          Amt
                                        </Box>
                                      </Box>
                                    </TableCell>
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderBottom: "0.1px solid #999999",
                                      borderRight: "0.1px solid #999999",
                                      fontSize: "16px",
                                      fontFamily: "Ubuntu",
                                      fontWeight: "bold",
                                      padding: 0,
                                      pr: 1,
                                      textAlign: "right",
                                    }}
                                  >
                                    Amount
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {itemDetails &&
                                  itemDetails.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell
                                        sx={{
                                          borderRight: "1px solid #999999",
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          borderBottom: "1px solid #999999",
                                          pl: 1,
                                        }}
                                      >
                                        {index + 1}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          borderRight: "1px solid #999999",
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          borderBottom: "1px solid #999999",
                                          pl: 1,
                                        }}
                                      >
                                        {item.item}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          borderRight: "1px solid #999999",
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          borderBottom: "1px solid #999999",
                                          pl: 1,
                                        }}
                                      >
                                        {item.hsn_code || item.sac_code}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          borderRight: "1px solid #999999",
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          borderBottom: "1px solid #999999",
                                          textAlign: "right",
                                          pr: 1,
                                        }}
                                      >
                                        {item.qty}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          borderRight: "1px solid #999999",
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          borderBottom: "1px solid #999999",
                                          textAlign: "right",
                                          pr: 1,
                                        }}
                                      >
                                        {/* Format the amount with currency symbol */}
                                        ₹
                                        {Number(item.rate).toLocaleString(
                                          "en-IN"
                                        )}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          borderRight: "1px solid #999999",
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          borderBottom: "1px solid #999999",
                                          padding: 0, // Remove padding for full attachment
                                          margin: 0, // Remove margin for full attachment
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            width: "100%",
                                            padding: 0, // Ensure no padding
                                            margin: 0, // Ensure no margin
                                            height: 55,
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              flex: 1,
                                              padding: 0, // Ensure no padding
                                              margin: 0, // Ensure no margin
                                              fontSize: "16px",
                                              fontFamily: "Ubuntu",
                                              //fontWeight: "bold",
                                              borderRight:
                                                "0.1px solid #999999",
                                              pl: 1, // Padding left for spacing inside the box
                                              display: "flex",
                                              alignItems: "center",
                                            }}
                                          >
                                            {item.tax_name}
                                          </Box>
                                          <Box
                                            sx={{
                                              flex: 1,
                                              padding: 0, // Ensure no padding
                                              margin: 0, // Ensure no margin
                                              fontSize: "16px",
                                              fontFamily: "Ubuntu",
                                              // fontWeight: "bold",
                                              textAlign: "right",
                                              pr: 0.5, // Padding right for spacing inside the box
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "flex-end",
                                            }}
                                          >
                                            {/* Format the amount with currency symbol */}
                                            ₹
                                            {Number(
                                              item.gst_amount
                                            ).toLocaleString("en-IN")}
                                          </Box>
                                        </Box>
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          borderRight: "1px solid #999999",
                                          fontSize: "1rem",
                                          fontFamily: "Ubuntu",
                                          borderBottom: "1px solid #999999",
                                          textAlign: "right",
                                          pr: 1,
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
                          sx={{
                            width: "90%",
                            height: "auto",
                            minHeight: "400px",
                            borderBottom: "1px solid #999999",
                            borderLeft: "1px solid #999999",
                            borderRight: "1px solid #999999",
                            ml: 6,
                            mr: 5,
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={7}
                            sx={{ borderRight: "1px solid #999999" }}
                          >
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                                mt: 2,
                              }}
                            >
                              Total in Words
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              Indian Rupee{" "}
                              {invoiceDetails[0]
                                ? convertToWordsWithoutDecimal(
                                    invoiceDetails[0].total
                                  )
                                : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                                mt: 2,
                              }}
                            >
                              Notes
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              Thanks for your business.
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <Grid
                              item
                              container
                              xs={12}
                              sx={{
                                width: "100%",
                                height: "auto",
                                minHeight: "200px",
                                borderBottom: "1px solid #999999",
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={7}
                                sx={{ textAlign: "right" }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  Sub Total
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  Shipping charge
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  {invoiceDetails[0]?.tax_id === "0"
                                    ? "IGST0 (0%)"
                                    : invoiceDetails[0]?.tax_id === "1"
                                    ? "IGST5 (5%)"
                                    : invoiceDetails[0]?.tax_id === "2"
                                    ? "IGST12 (12%)"
                                    : invoiceDetails[0]?.tax_id === "3"
                                    ? "IGST18 (18%)"
                                    : invoiceDetails[0]?.tax_id === "4"
                                    ? "IGST28 (28%)"
                                    : ""}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  Adjustment
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  {invoiceDetails[0]?.TDS < 0 &&
                                  invoiceDetails[0]?.TCS === "0.00"
                                    ? "TDS"
                                    : invoiceDetails[0]?.TDS === "0" &&
                                      invoiceDetails[0]?.TCS < 0
                                    ? "TCS"
                                    : ""}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  Amount Withheld
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  Payment Made
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  Total
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  Balance Due
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={5}
                                sx={{ textAlign: "right" }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(
                                    invoiceDetails[0]
                                      ? invoiceDetails[0].sub_total
                                      : ""
                                  ).toLocaleString("en-IN")}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(
                                    invoiceDetails[0]
                                      ? invoiceDetails[0].ship_charge
                                      : ""
                                  ).toLocaleString("en-IN")}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(
                                    invoiceDetails[0]
                                      ? parseFloat(
                                          invoiceDetails[0].ship_sGST
                                        ) +
                                          parseFloat(
                                            invoiceDetails[0].ship_cGST
                                          )
                                      : ""
                                  ).toLocaleString("en-IN")}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    //  fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(
                                    invoiceDetails[0]
                                      ? invoiceDetails[0].adjustment
                                      : ""
                                  ).toLocaleString("en-IN")}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    // fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  {invoiceDetails[0]?.TDS < 0 &&
                                  invoiceDetails[0]?.TCS === "0.00"
                                    ? invoiceDetails[0]?.TDS
                                    : invoiceDetails[0]?.TDS === "0" &&
                                      invoiceDetails[0]?.TCS < 0
                                    ? invoiceDetails[0]?.TCS
                                    : ""}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    //  fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                    color: "red",
                                  }}
                                >
                                  (-){" "}
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(
                                    invoiceDetails[0]
                                      ? invoiceDetails[0].with_held
                                      : ""
                                  ).toLocaleString("en-IN")}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    //  fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                    color: "red",
                                  }}
                                >
                                  (-){" "}
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(
                                    invoiceDetails[0]
                                      ? invoiceDetails[0].payment_made
                                      : ""
                                  ).toLocaleString("en-IN")}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(
                                    invoiceDetails[0]
                                      ? invoiceDetails[0].total
                                      : ""
                                  ).toLocaleString("en-IN")}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    fontWeight: "bold",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(
                                    invoiceDetails[0]
                                      ? invoiceDetails[0].due_amount
                                      : ""
                                  ).toLocaleString("en-IN")}
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
                                minHeight: "170px",
                                alignItems: "end",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "16px",
                                  fontFamily: "Ubuntu",
                                  // fontWeight: "bold",
                                }}
                              >
                                Authorized Signature
                              </Typography>
                            </Grid>
                          </Grid>
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

export default InvoiceDetailPage;
