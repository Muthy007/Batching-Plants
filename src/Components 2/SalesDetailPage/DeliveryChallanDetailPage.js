import {
  Button,
  Drawer,
  Grid,
  IconButton,
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
import { Helmet } from "react-helmet";
import html2pdf from "html2pdf.js";
import Sidebar from "../../Navbars/Sidebar";
import CommentsHistory from "../../UsableContent/CommentsHistory";
import LoadingDots from "../../Loading Animations/LoadingDots";
import SuiSnackbar from "../../Snackbars/SuiSnackbar";

const useStyles = makeStyles(() => ({
  ribbon: {
    position: "absolute",
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
const DeliveryChallanDetailPage = ({ onLogout }) => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const data = localStorage.getItem("data");
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { item, create, edit } = location.state || {};
  const [deliveryTable, setDeliveryTable] = useState([]);
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [address, setAddress] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);
  const [userData, setUserData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const pdfContentRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be 'error', 'warning', 'info', 'success'

  useEffect(() => {
    if (create) {
      setSnackbarMessage("Your delivery challan has been created.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (edit) {
      setSnackbarMessage("Your delivery challan has been updated.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  }, [create, edit]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleCloseComment = () => {
    setIsOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setUserData(JSON.parse(data));
  }, []);

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getdeliveryTable = () => {
    const params = {
      json_type: "get_delivery_chellan",
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
          setDeliveryTable(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getdeliveryTable();
  }, []);

  const getDeliveryDetails = () => {
    setLoading(true);
    const params = {
      json_type: "get_delivery_chellan",
      delivery_ids: [item.id],
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
          setDeliveryDetails(JsonData);
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
    getDeliveryDetails();
  }, [item]);

  const handleConvert = (action) => {
    const params = {
      json_type: "convert_delivery_challan_stage",
      id: deliveryDetails[0] ? deliveryDetails[0].id : "",
      current_stage: deliveryDetails[0] ? deliveryDetails[0].status : "",
      action: action,
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
        const JsonData = JSON.parse(res.data);
        if (JsonData.json_sts === "1") {
          getDeliveryDetails();
          getdeliveryTable();
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
        if (action === "returned") {
          setAnchorEl(null);
        }
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
      filename: "Delivery Challan.pdf",
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
        pdf.save("Delivery Challan.pdf");

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
    <>
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
        onClose={handleCloseComment}
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
        <CommentsHistory
          id={item.id}
          name="deliverychallan"
          onClose={handleCloseComment}
        />
      </Drawer>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <div style={{ padding: 5 }}>
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/Sales/NewInvoice", {
                state: {
                  ids: deliveryDetails[0]?.id,
                  convert: "convert deliverychallan",
                },
              });
            }}
            sx={{
              "&:hover": {
                bgcolor: "#408dfb",
                color: "white",
              },
              borderRadius: 2,
            }}
          >
            <ListItemText primary="Convert to Invoice" />
          </MenuItem>
          {deliveryDetails[0]?.status === "Open" ? (
            <MenuItem
              sx={{
                "&:hover": {
                  bgcolor: "#408dfb",
                  color: "white",
                },
                borderRadius: 2,
              }}
              onClick={() => {
                handleConvert("returned");
              }}
            >
              <ListItemText primary="Mark as Returned" />
            </MenuItem>
          ) : (
            ""
          )}
        </div>
      </Menu>
      <Sidebar onLogout={onLogout}>
        <Grid container>
          <Helmet>
            <title>
              {" "}
              {deliveryDetails[0] ? deliveryDetails[0].delivery_no : ""} |
              Delivery Challans{" "}
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
                    overflowX: "hidden",
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      fontSize: "1.7rem",
                      fontFamily: "Helvetica",
                      fontWeight: "bold",
                      alignItems: "center",
                      textWrap: "nowrap",
                    }}
                  >
                    All Delivery Challan
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
                          navigate("/Sales/NewDeliveryChallan");
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
                      {deliveryTable &&
                        deliveryTable.map((deliveryItem, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              cursor: "pointer",
                              backgroundColor:
                                item && item.id === deliveryItem.id
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
                                navigate(
                                  "/SalesPage/DeliveryChallanDetailPage",
                                  {
                                    state: { item: deliveryItem },
                                  }
                                );
                              }}
                            >
                              {/* Customer Name */}
                              <div>{deliveryItem.cust_name}</div>

                              {/* Delivery No and Date */}
                              <div
                                style={{
                                  fontSize: "1rem",
                                  color: "#6C7184",
                                  marginTop: 8,
                                }}
                              >
                                {deliveryItem.delivery_no} •{" "}
                                {deliveryItem.delivery_date}
                              </div>

                              {/* Status */}
                              <div
                                style={{
                                  color: deliveryItem.status_color,
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                  textTransform: "uppercase",
                                  letterSpacing: 1,
                                  marginTop: 8,
                                }}
                              >
                                {deliveryItem.status}
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
                                navigate(
                                  "/SalesPage/DeliveryChallanDetailPage",
                                  {
                                    state: { item: deliveryItem },
                                  }
                                );
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(deliveryItem.total).toLocaleString(
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
                    {item.delivery_no}
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
                          navigate("/Sales/DeliveryChallan");
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
                      navigate("/Sales/EditDeliveryChallan", {
                        state: { deliveryDetails },
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
                {deliveryDetails[0]?.status === "Open" ? (
                  <Grid
                    item
                    xs={12}
                    md={2}
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
                        handleConvert("Convert");
                      }}
                    >
                      Mark as Delivered
                    </Typography>
                  </Grid>
                ) : (
                  ""
                )}
                {deliveryDetails[0]?.status === "Draft" ? (
                  <Grid
                    item
                    xs={12}
                    md={2}
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
                        handleConvert("Convert");
                      }}
                    >
                      Convert to Open
                    </Typography>
                  </Grid>
                ) : (
                  ""
                )}
                <Grid
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
                    onClick={handleClick}
                  >
                    <Icon
                      icon="svg-spinners:3-dots-move"
                      width="1.5rem"
                      height="1.5rem"
                    />
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
                            backgroundColor: deliveryDetails[0]
                              ? deliveryDetails[0].status_color
                              : "",
                          }}
                        >
                          {" "}
                          {deliveryDetails[0]
                            ? deliveryDetails[0].status
                            : ""}{" "}
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
                            mt: 5,
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                              width: "100%",
                            }}
                          ></Grid>
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
                              Delivery Challan
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                fontWeight: "bold",
                                color: "#333333",
                              }}
                            >
                              Delivery Challan #
                              {deliveryDetails && deliveryDetails[0]
                                ? deliveryDetails[0].delivery_no
                                : ""}
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
                              {address && address[0]
                                ? address[0].s_address.add1 +
                                  "," +
                                  address[0].s_address.add2 +
                                  ","
                                : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                              }}
                            >
                              {address && address[0]
                                ? address[0].s_address.add1 +
                                  "," +
                                  address[0].s_address.add2 +
                                  ","
                                : ""}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                              }}
                            >
                              {address && address[0]
                                ? address[0].s_address.city
                                : ""}{" "}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                              }}
                            >
                              {address && address[0]
                                ? address[0].s_address.state +
                                  " " +
                                  address[0].s_address.zip
                                : ""}{" "}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                              }}
                            >
                              {address && address[0]
                                ? address[0].s_address.country
                                : ""}{" "}
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
                                alignItems: "end",
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={5.3}
                                sx={{ textAlign: "right", pt: 10 }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "18px",
                                    fontFamily: "Ubuntu",
                                    color: "#333333",
                                    fontWeight: 500,
                                  }}
                                >
                                  Challan Date :
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
                                  Challan Type :
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
                                  {deliveryDetails[0]
                                    ? deliveryDetails[0].delivery_date
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
                                  {deliveryDetails && deliveryDetails[0]
                                    ? deliveryDetails[0].challan_type
                                    : ""}{" "}
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
                            {address && address[0] ? address[0].plc_supply : ""}
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
                                    <TableRow key={index}>
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
                                mt: 3,
                                fontWeight: 500,
                              }}
                            >
                              Adjustment
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
                                deliveryDetails && deliveryDetails[0]
                                  ? deliveryDetails[0].sub_total
                                  : ""
                              ).toLocaleString("en-IN")}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "18px",
                                fontFamily: "Ubuntu",
                                color: "#333333",
                                mt: 3,
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(
                                deliveryDetails && deliveryDetails[0]
                                  ? deliveryDetails[0].adj
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
                                fontWeight: "bold",
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
                                fontWeight: "bold",
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(
                                deliveryDetails && deliveryDetails[0]
                                  ? deliveryDetails[0].total
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
    </>
  );
};

export default DeliveryChallanDetailPage;
