import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
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
import LoadingDots from "../../Loading Animations/LoadingDots";
import Sidebar from "../../Navbars/Sidebar";
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

const LayoutWrapper = ({ isPopup, children, onLogout, onClose }) => {
  if (isPopup) {
    return (
      <Box sx={{ width: "100%", bgcolor: "white", minHeight: "100vh" }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "flex-end",
            bgcolor: "#f5f5f5",
            borderBottom: "1px solid #e6e6e6",
          }}
        >
          <IconButton onClick={onClose} sx={{ color: "black" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </Box>
    );
  }
  return <Sidebar onLogout={onLogout}>{children}</Sidebar>;
};

const QuoteDetailPage = ({ onLogout, isPopup, quoteItem, onClose }) => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const data = localStorage.getItem("data");
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { item: locationItem, create, sent, edit } = location.state || {};
  const item = quoteItem || locationItem;
  const [quoteTable, setQuoteTable] = useState([]);
  const [quoteDetails, setQuoteDetails] = useState([]);
  const [address, setAddress] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);
  const [userData, setUserData] = useState([]);
  const pdfContentRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [sureOpen, setSureOpen] = useState(false);
  const [sureOpenForSales, setSureOpenForSales] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be 'error', 'warning', 'info', 'success'

  useEffect(() => {
    if (create) {
      setSnackbarMessage("Your quote has been created.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (sent) {
      setSnackbarMessage("Your quote has been sent.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (edit) {
      setSnackbarMessage("Your quote has been updated.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  }, [create, sent, edit]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSureOpen = () => {
    setSureOpen(true);
  };

  const handleSureClose = () => {
    setSureOpen(false);
  };

  const handleSureOpenForSales = () => {
    setSureOpenForSales(true);
  };

  const handleSureCloseForSales = () => {
    setSureOpenForSales(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setUserData(JSON.parse(data));
  }, []);

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getquoteTable = () => {
    const params = {
      json_type: "get_quotes",
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
          setQuoteTable(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getquoteTable();
  }, []);

  const getQuoteDetails = () => {
    setLoading(true);
    const params = {
      json_type: "get_quotes",
      type: "2",
      quote_ids: [item.id],
      user: user,
      org_id: orgid,
      includeFullDetails: "true",
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
          setQuoteDetails(JsonData);
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
    getQuoteDetails();
  }, [item]);

  const convertToWordsWithoutDecimal = (number) => {
    const integerPart = Math.floor(number); // Remove the decimal part
    return numWords(integerPart);
  };

  const handleSendClick = () => {
    navigate("/Sales/QuoteMail", {
      state: { isQuote: true, data: quoteDetails },
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
      filename: "Quotes.pdf",
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
        pdf.save("Quotes.pdf");

        // Clean up: remove the hidden container and the clones
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
        {quoteDetails[0]?.status === "Draft" ? (
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
                    width: "60px",
                    height: "60px",
                    color: "rgb(244, 156, 6)",
                  }}
                />
                You're converting this quote to an invoice. Its status will be
                changed to Invoiced and it will appear to your customer in the
                Customer Portal. Are you sure you want to proceed?
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
                    navigate("/Sales/NewInvoice", {
                      state: {
                        ids: quoteDetails[0]?.id,
                        convert: "convert quote",
                      },
                    });
                  }}
                >
                  Proceed
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
                    handleSureClose();
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ) : (
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
                    width: "60px",
                    height: "60px",
                    color: "rgb(244, 156, 6)",
                  }}
                />
                This quote has already been invoiced. Do you want to invoice it
                again?
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
                    navigate("/Sales/NewInvoice", {
                      state: {
                        ids: quoteDetails[0]?.id,
                        convert: "convert quote",
                      },
                    });
                  }}
                >
                  Yes
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
                    handleSureClose();
                  }}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Drawer>
      <Drawer
        anchor="top"
        open={sureOpenForSales}
        onClose={() => handleSureCloseForSales()}
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
                  width: "60px",
                  height: "60px",
                  color: "rgb(244, 156, 6)",
                }}
              />
              Please note that only an accepted Quote can be converted to a
              Sales Order.
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
                  handleSureCloseForSales();
                }}
              >
                Ok
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseAnchor}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <div style={{ padding: 5 }}>
          <MenuItem
            onClick={() => {
              handleCloseAnchor();
            }}
            sx={{
              "&:hover": {
                bgcolor: "#408dfb",
                color: "white",
              },
              borderRadius: 2,
            }}
          >
            <ListItemText
              primary="Convert to Invoice"
              onClick={() => {
                if (quoteDetails[0]?.status === "Draft") {
                  handleSureOpen();
                } else if (quoteDetails[0]?.status === "Invoiced") {
                  handleSureOpen();
                } else {
                  navigate("/Sales/NewInvoice", {
                    state: {
                      ids: quoteDetails[0]?.id,
                      convert: "convert quote",
                    },
                  });
                }
              }}
            />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseAnchor();
            }}
            sx={{
              "&:hover": {
                bgcolor: "#408dfb",
                color: "white",
              },
              borderRadius: 2,
            }}
          >
            <ListItemText
              primary="Convert to Sales Order"
              onClick={() => {
                if (quoteDetails[0]?.status === "Draft") {
                  handleSureOpenForSales();
                } else {
                  navigate("/Sales/NewSalesOrder", {
                    state: {
                      ids: quoteDetails[0]?.id,
                      convert: "convert quote",
                    },
                  });
                }
              }}
            />
          </MenuItem>
        </div>
      </Menu>
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
        <CommentsHistory id={item.id} name="quote" onClose={handleClose} />
      </Drawer>
      <LayoutWrapper isPopup={isPopup} onLogout={onLogout} onClose={onClose}>
        <Grid container>
          <Helmet>
            <title>
              {quoteDetails[0] ? quoteDetails[0].quote_no : ""} | Quotes
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
                      fontFamily: "Ubuntu",
                      fontWeight: "bold",
                      alignItems: "center",
                    }}
                  >
                    All Quotes
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
                          navigate("/Sales/NewQuotes");
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
                      {quoteTable &&
                        quoteTable.map((quoteItem, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              cursor: "pointer",
                              backgroundColor:
                                item && item.id === quoteItem.id
                                  ? "#f0f0f5"
                                  : "inherit",
                              "&:hover": {
                                backgroundColor: "#f9f9fb",
                              },
                            }}
                            onClick={() => {
                              navigate("/SalesPage/QuoteDetailPage", {
                                state: { item: quoteItem },
                              });
                            }}
                          >
                            <TableCell
                              sx={{
                                fontSize: "1.3rem",
                                fontFamily: "Helvetica",
                                borderBottom: "0.5px solid #e6e6e6",
                                fontWeight: "bold",
                              }}
                            >
                              {/* Customer Name */}
                              <div>{quoteItem.cust_name}</div>

                              {/* Delivery No and Date */}
                              <div
                                style={{
                                  fontSize: "1rem",
                                  color: "#6C7184",
                                  marginTop: 8,
                                }}
                              >
                                {quoteItem.quote_no} • {quoteItem.quote_date}
                              </div>

                              {/* Status */}
                              <div
                                style={{
                                  color:
                                    quoteItem.status === "Draft"
                                      ? "red"
                                      : quoteItem.status === "Open"
                                      ? "#268DDD"
                                      : quoteItem.status === "Delivered"
                                      ? "green"
                                      : quoteItem.status === "Returned"
                                      ? "#21263C"
                                      : "",
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                  textTransform: "uppercase",
                                  letterSpacing: 1,
                                  marginTop: 8,
                                }}
                              >
                                {quoteItem.status}
                              </div>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "1.2rem",
                                fontFamily: "Helvetica",
                                borderBottom: "0.5px solid #e6e6e6",
                                textAlign: "right",
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(quoteItem.total).toLocaleString("en-IN")}
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
                      fontFamily: "Ubuntu",
                      // fontWeight: "bold",
                      alignItems: "center",
                    }}
                  >
                    {item ? item.quote_no : ""}
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
                          navigate("/Sales/Quotes");
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
                      navigate("/Sales/EditQuotes", {
                        state: { quoteDetails },
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
                {quoteDetails[0]?.status === "Expired" ? (
                  ""
                ) : quoteDetails[0]?.status === "Invoiced" ? (
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
                      onClick={handleSureOpen}
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
                ) : (
                  <Grid
                    item
                    xs={12}
                    md={1.5}
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
                      onClick={handleClick}
                    >
                      Convert
                      <Icon
                        icon="teenyicons:down-solid"
                        width="0.8rem"
                        height="0.8rem"
                        style={{ marginTop: 12 }}
                      />{" "}
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
                  pb: 2,
                }}
              >
                {" "}
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
                            backgroundColor: quoteDetails[0]
                              ? quoteDetails[0].status_color
                              : "",
                          }}
                        >
                          {" "}
                          {quoteDetails[0] ? quoteDetails[0].status : ""}{" "}
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
                            QUOTE
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "90%",
                            height: "auto",
                            minHeight: "130px",
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
                                  Quote Date
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
                                  Expiry Date
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
                                  Reference
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
                                  {quoteDetails[0]
                                    ? quoteDetails[0].quote_no
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
                                  {quoteDetails[0]
                                    ? quoteDetails[0].quote_date
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
                                  {quoteDetails[0]
                                    ? quoteDetails[0].exp_date
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
                                  {quoteDetails[0]
                                    ? quoteDetails[0].reference
                                    : ""}
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
                                  {quoteDetails[0]
                                    ? quoteDetails[0].plc_supply
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
                              {quoteDetails[0]
                                ? quoteDetails[0].display_name
                                : ""}
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
                                fontWeight: "bold",
                                pl: 1,
                                color: "#408DFB",
                              }}
                            >
                              {quoteDetails[0]
                                ? quoteDetails[0].display_name
                                : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {address[0] ? address[0].s_address.add1 : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {address[0] ? address[0].s_address.add2 : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {address[0] ? address[0].s_address.city : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {address[0] ? address[0].s_address.zip : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {address[0] ? address[0].s_address.state : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontFamily: "Ubuntu",
                                // fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              {address[0] ? address[0].s_address.country : ""}
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
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "90%",
                            height: "auto",
                            minHeight: "30px",
                            borderLeft: "1px solid #999999",
                            borderRight: "1px solid #999999",
                            ml: 6,
                            mr: 5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "16px",
                              fontFamily: "Ubuntu",
                              //  fontWeight: "bold",
                              pl: 1,
                            }}
                          >
                            Subject :
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "90%",
                            height: "auto",
                            minHeight: "30px",
                            borderBottom: "1px solid #999999",
                            borderLeft: "1px solid #999999",
                            borderRight: "1px solid #999999",
                            ml: 6,
                            mr: 5,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "16px",
                              fontFamily: "Ubuntu",
                              // fontWeight: "bold",
                              pl: 1,
                            }}
                          >
                            {quoteDetails[0] ? quoteDetails[0].subject : ""}
                          </Typography>
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
                                              // fontWeight: "bold",
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
                                              fontWeight: "bold",
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
                                fontFamily: "WebFont-Ubuntu",
                                fontWeight: "bold",
                                pl: 1,
                              }}
                            >
                              Indian Rupee{" "}
                              {quoteDetails[0]
                                ? convertToWordsWithoutDecimal(
                                    quoteDetails[0].total
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
                                minHeight: "170px",
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
                                  {quoteDetails[0]?.tax_id === "0"
                                    ? "IGST0 (0%)"
                                    : quoteDetails[0]?.tax_id === "1"
                                    ? "IGST5 (5%)"
                                    : quoteDetails[0]?.tax_id === "2"
                                    ? "IGST12 (12%)"
                                    : quoteDetails[0]?.tax_id === "3"
                                    ? "IGST18 (18%)"
                                    : quoteDetails[0]?.tax_id === "4"
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
                                  {quoteDetails[0]?.tds < 0 &&
                                  quoteDetails[0]?.tcs === "0.00"
                                    ? "TDS"
                                    : quoteDetails[0]?.tds === "0" &&
                                      quoteDetails[0]?.tcs < 0
                                    ? "TCS"
                                    : ""}
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
                                    quoteDetails[0]
                                      ? quoteDetails[0].sub_total
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
                                    quoteDetails[0]
                                      ? quoteDetails[0].ship_charge
                                      : ""
                                  ).toLocaleString("en-IN")}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(
                                    quoteDetails[0]
                                      ? parseFloat(quoteDetails[0].ship_sGST) +
                                          parseFloat(quoteDetails[0].ship_cGST)
                                      : ""
                                  ).toLocaleString("en-IN")}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(
                                    quoteDetails[0]
                                      ? quoteDetails[0].adjustment
                                      : ""
                                  ).toLocaleString("en-IN")}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontFamily: "Ubuntu",
                                    pr: 1,
                                    mt: 1,
                                  }}
                                >
                                  {quoteDetails[0]?.tds < 0 &&
                                  quoteDetails[0]?.tcs === "0.00"
                                    ? quoteDetails[0]?.tds
                                    : quoteDetails[0]?.tds === "0" &&
                                      quoteDetails[0]?.tcs < 0
                                    ? quoteDetails[0]?.tcs
                                    : ""}
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
                                    quoteDetails[0] ? quoteDetails[0].total : ""
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
      </LayoutWrapper>
    </React.Fragment>
  );
};

export default QuoteDetailPage;
