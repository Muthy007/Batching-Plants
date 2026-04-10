import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Drawer,
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
import Sidebar from "../../Navbars/Sidebar";
import { Helmet } from "react-helmet";
import html2pdf from "html2pdf.js";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CommentsHistory from "../../UsableContent/CommentsHistory";
import numWords from "num-words";
import LoadingDots from "../../Loading Animations/LoadingDots";
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
const CreditNoteDetailPage = ({ onLogout }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const data = localStorage.getItem("data");
  const { item, create, edit } = location.state || {};
  const [creditTable, setCreditTable] = useState([]);
  const [CreditDetails, setCreditDetails] = useState([]);
  const [address, setAddress] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);
  const [userData, setUserData] = useState([]);
  const [open, setOpen] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState("");
  const [credits, setCredits] = useState([]); // Initialize credits state
  const [totalCredits, setTotalCredits] = useState(0); // State for total credits
  const pdfContentRef = useRef(null);
  const [refundOpen, setRefundOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openRefund = Boolean(anchorEl);
  const [from, setFrom] = useState(dayjs());
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [INR, setINR] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [desc, setDesc] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sureOpen, setSureOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be 'error', 'warning', 'info', 'success'

  useEffect(() => {
    if (create) {
      setSnackbarMessage("Your credit note has been created.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else if (edit) {
      setSnackbarMessage("Your credit note has been updated.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  }, [create, edit]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSureOpen = () => {
    setSureOpen(true);
  };

  const handleSureClose = () => {
    setSureOpen(false);
  };

  const handleOpenComment = () => {
    setIsOpen(true);
  };

  const handleCloseComment = () => {
    setIsOpen(false);
  };

  const handleRefundOpen = () => {
    setRefundOpen(true);
  };

  const handleRefundClose = () => {
    setRefundOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const convertToWordsWithoutDecimal = (number) => {
    const integerPart = Math.floor(number); // Remove the decimal part
    return numWords(integerPart);
  };

  const handleCloseRefund = () => {
    setAnchorEl(null);
  };

  const handleCreditChange = (index, event, unusedCredits) => {
    const newCredits = [...credits];
    let enteredCredit = parseFloat(event.target.innerText) || 0; // Ensure it's a number

    // Compare with unused_credits and restrict to the max allowed value
    if (enteredCredit > unusedCredits) {
      enteredCredit = unusedCredits; // If entered credit is more than unused credits, set to unused credits
    }

    newCredits[index] = enteredCredit.toFixed(2); // Format to 2 decimal places
    setCredits(newCredits);
  };

  // Function to calculate the sum of credits
  const calculateTotalCredits = () => {
    const total = credits.reduce(
      (acc, credit) => acc + parseFloat(credit || 0),
      0
    ); // Sum all credits
    setTotalCredits(total.toFixed(2)); // Update total, formatted to 2 decimals
  };

  // Fetch invoice details and initialize credits when 'item' changes
  const getInvoiceDetails = () => {
    const params = {
      json_type: "get_invoice",
      type: "3",
      cust_id: item.cust_id,
      org_id: orgid,
      user: user,
    };

    axios
      .post("https://erp-api.schwingcloud.com/Service1.svc/ERP_app", params, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        if (JSON.parse(res.data).json_sts === "1") {
          setInvoiceDetails(JsonData);

          // Set credits to "0.00" for each invoice item
          const initialCredits = JsonData.map(() => "0.00");
          setCredits(initialCredits);

          // Calculate initial total after setting credits
          calculateTotalCredits();
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  // Use useEffect to calculate total credits whenever credits array changes
  useEffect(() => {
    calculateTotalCredits(); // Recalculate the total when credits change
  }, [credits]);

  // Fetch invoice details when 'item' changes
  useEffect(() => {
    if (item) {
      getInvoiceDetails();
    }
  }, [item]);

  const handleSaveCredits = () => {
    const combinedEditArray =
      invoiceDetails &&
      invoiceDetails
        .map((item, index) => ({
          invoice_id: item.id,
          amount_paid: parseFloat(credits[index]), // Convert to number to ensure proper comparison
        }))
        .filter((item) => item.amount_paid > 0); // Only include rows with credit greater than 0

    console.log("Filtered Edit Array:", combinedEditArray);
    const params = {
      json_type: "save_payment",
      type: "credit_payment",
      id: item.credit_note_id,
      cust_id: item.cust_id,
      invoice_payment: combinedEditArray,
      user: user,
      org_id: orgid,
    };
    axios
      .post("https://erp-api.schwingcloud.com/Service1.svc/ERP_app3", params, {
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
        }
      });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app2";

  useEffect(() => {
    setUserData(JSON.parse(data));
  }, []);

  const getcreditTable = () => {
    const params = {
      json_type: "get_credit_note",
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
          setCreditTable(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getcreditTable();
  }, []);

  const getCreditDetails = () => {
    setLoading(true);
    const params = {
      json_type: "get_credit_note",
      id: item.credit_note_id,
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
          setCreditDetails(JsonData);
          setAddress(JSON.parse(res.data).data);
          setItemDetails(JsonData[0].Item_details);
          setINR(JsonData[0].balance);
          setLoading(false);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getCreditDetails();
  }, [item]);

  const getPaymentMethod = () => {
    const params = { json_type: "get_pay_method", user: user, org_id: orgid };
    axios
      .post("https://erp-api.schwingcloud.com/Service1.svc/ERP_app", params, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        if (JSON.parse(res.data).json_sts === "1") {
          setPaymentMethod(JsonData);

          // Set initial selection to "Cash" if it exists
          const cashOption = JsonData.find((item) => item.pay_name === "Cash");
          if (cashOption) {
            setSelectedPaymentMethod({
              id: cashOption.id,
              display_name: cashOption.pay_name,
            });
          }
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getPaymentMethod();
  }, [item]);

  const handleGetDepositTo = () => {
    const params = {
      json_type: "get_bank_accounts",
      org_id: orgid,
      user: user,
    };

    axios
      .post(
        "https://erp-api.schwingcloud.com/Service1.svc/bankmodule",
        params,
        {
          headers: {
            "Content-Type": "application/text",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;

        if (JSON.parse(res.data).json_sts === "1") {
          const bankOptions =
            JsonData[0]?.bank?.map((item) => ({
              group: "Bank",
              name: item.name,
              id: item.id,
              type_id: "0",
            })) || [];
          const cashOptions =
            JsonData[1]?.cash?.map((item) => ({
              group: "Cash",
              name: item.name,
              id: "", // Add appropriate id if available
              type_id: item.id,
            })) || [];
          const liabilitiesOptions =
            JsonData[2]?.liabilities?.map((item) => ({
              group: "Liabilities",
              name: item.name,
              id: "", // Add appropriate id if available
              type_id: item.id,
            })) || [];

          const combinedOptions = [
            ...bankOptions,
            ...cashOptions,
            ...liabilitiesOptions,
          ];
          setOptions(combinedOptions);

          // Set "Petty Cash" as the initial selected option if it exists
          const pettyCashOption = combinedOptions.find(
            (option) => option.name === "Petty Cash"
          );
          if (pettyCashOption) {
            setSelectedOption(pettyCashOption);
          }
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };

  useEffect(() => {
    handleGetDepositTo();
  }, [item]);

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
      filename: "Credit Notes.pdf",
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
        pdf.save("Credit Notes.pdf");

        // Clean up: remove the hidden container and the clone
        document.body.removeChild(hiddenContainer);
      })
      .catch((err) => {
        console.error("Error generating PDF:", err);

        // Clean up in case of error
        document.body.removeChild(hiddenContainer);
      });
  };

  const handleSaveRefund = () => {
    if (CreditDetails[0]?.balance < INR && INR !== "") {
      alert("The Amount is Comparitively Higher than Balance Amount");
    } else {
      const params = {
        json_type: "save_refund",
        payment_id: item.credit_note_id.toString(),
        date: dayjs(from).format("YYYY-MM-DD"),
        balance_amount: CreditDetails[0]?.balance,
        refund_amount: INR,
        payment_mode: selectedPaymentMethod.display_name,
        deposit_to: selectedOption.name,
        deposit_id: selectedOption.id,
        deposit_type: selectedOption.group,
        deposit_type_id: selectedOption.type_id,
        reference: reference,
        descrip: desc,
        descrip_supply: "",
        is_customer_advance: "0",
        org_id: orgid,
        user: user,
      };
      axios
        .post(
          "https://erp-api.schwingcloud.com/Service1.svc/ERP_app3",
          params,
          {
            headers: {
              "Content-Type": "application/text",
              Authorization: `Bearer ${token}`,
            },
          }
        )
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
          }
        });
    }
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
              Credit Note will be automatically marked as Open once you apply it
              to invoices.
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
                  handleOpen();
                }}
              >
                Ok
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
      </Drawer>
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
          id={item.credit_note_id}
          name="creditnote"
          onClose={handleCloseComment}
        />
      </Drawer>
      <Menu
        open={openRefund}
        anchorEl={anchorEl}
        onClose={handleCloseRefund}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <div style={{ padding: 5 }}>
          <MenuItem
            onClick={() => {
              handleCloseRefund();
              handleRefundOpen();
            }}
            sx={{
              "&:hover": {
                bgcolor: "#408dfb",
                color: "white",
              },
              borderRadius: 2,
            }}
          >
            <ListItemText primary="Refund" />
          </MenuItem>
          {/* <MenuItem
            onClick={() => {
              handleCloseRefund();
            }}
            sx={{
              "&:hover": {
                bgcolor: "#408dfb",
                color: "white",
              },
              borderRadius: 2,
            }}
          >
            <ListItemText primary="Delete" />
          </MenuItem> */}
        </div>
      </Menu>
      <Drawer
        anchor="top"
        open={open}
        onClose={() => handleClose()}
        sx={{
          "& .MuiDrawer-paper": {
            width: "60%",
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
                Apply Credits to invoices
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
                  handleClose();
                }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            sx={{
              width: "100%",
              height: "auto",
              minHeight: 120,
              backgroundColor: "#F9F9FB",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              pl: 4,
            }}
          >
            <Grid item xs={12} md={3} style={{ display: "flex" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "30px",
                  backgroundColor: "#FC8F31",
                }}
              >
                <Icon
                  icon="el:upload"
                  style={{
                    color: "#fff",
                    width: "30px",
                    height: "auto",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignContent: "center",
                  padding: 10,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    // fontWeight: "bold",
                    fontFamily: "Helvetica",
                    display: "flex",
                    color: "#6C7184",
                  }}
                >
                  Credit Note#
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontFamily: "Helvetica",
                    fontWeight: 600,
                  }}
                >
                  {item.credit_no}
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={3} style={{ display: "flex" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "30px",
                  backgroundColor: "#6A8AAF",
                }}
              >
                <Icon
                  icon="material-symbols:credit-card-outline"
                  style={{
                    color: "#fff",
                    width: "30px",
                    height: "auto",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignContent: "center",
                  padding: 10,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    // fontWeight: "bold",
                    fontFamily: "Helvetica",
                    display: "flex",
                    color: "#6C7184",
                  }}
                >
                  Available Credits
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontFamily: "Helvetica",
                    fontWeight: 600,
                  }}
                >
                  {/* Format the amount with currency symbol */}₹
                  {Number(CreditDetails[0]?.balance).toLocaleString("en-IN")}
                </Typography>
              </div>
            </Grid>
          </Grid>
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
                      INVOICE DATE
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
                        borderTopRightRadius: "8px", // Adding border radius to the top-right corner
                        textAlign: "right",
                      }}
                    >
                      CREDITS TO APPLY
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceDetails &&
                    invoiceDetails.map((item, index) => (
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
                          {item.invoice_date}
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
                          {/* Format the amount with currency symbol */}₹
                          {Number(item.total).toLocaleString("en-IN")}
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
                          {/* Format the amount with currency symbol */}₹
                          {Number(item.due_amount).toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell
                          contentEditable
                          onBlur={(event) => handleCreditChange(index, event)}
                          sx={{
                            fontSize: "1rem",
                            fontFamily: "Helvetica",
                            fontWeight: "bold",
                            p: 1,
                            color: "#000",
                            border: "0.5px solid #e6e6e6",
                            textAlign: "right",
                          }}
                        >
                          {credits[index]}
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
              width: "100%",
              height: "auto",
              minHeight: 80,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              pr: 3,
            }}
          >
            <Grid
              item
              container
              xs={12}
              md={4}
              p={1}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#F9F9FB",
                minHeight: "80px",
                height: "auto",
                borderRadius: 10,
              }}
            >
              <Grid item container xs={12}>
                <Grid
                  item
                  xs={6}
                  sx={{
                    fontSize: "18px",
                    fontFamily: "Helvetica",
                  }}
                >
                  Amount to Credit:
                </Grid>
                <Grid
                  item
                  xs={6}
                  display="flex"
                  justifyContent="end"
                  sx={{
                    fontSize: "18px",
                    fontFamily: "Helvetica",
                  }}
                >
                  {/* Format the amount with currency symbol */}₹
                  {Number(totalCredits).toLocaleString("en-IN")}
                </Grid>
              </Grid>
              <Grid item container xs={12} mt={2}>
                <Grid
                  item
                  xs={6}
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    fontFamily: "Helvetica",
                  }}
                >
                  Remaining Credits:
                </Grid>
                <Grid
                  item
                  xs={6}
                  display="flex"
                  justifyContent="end"
                  sx={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    fontFamily: "Helvetica",
                  }}
                >
                  {/* Format the amount with currency symbol */}₹
                  {Number(
                    CreditDetails[0]?.balance - totalCredits
                  ).toLocaleString("en-IN")}
                </Grid>
              </Grid>
            </Grid>
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
              mt: 2,
              borderTop: "0.5px solid #d9d9d9",
            }}
            component={Paper}
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
                  handleClose();
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
                  handleSaveCredits();
                }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
      <Sidebar onLogout={onLogout}>
        <Grid container>
          <Helmet>
            <title>
              {" "}
              {CreditDetails[0] ? CreditDetails[0].credit_no : ""} | Credit Note{" "}
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
                    All Credit Notes
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
                          navigate("/Sales/NewCreditNotes");
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
                      {creditTable &&
                        creditTable.map((creditItem, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              cursor: "pointer",
                              backgroundColor:
                                item &&
                                item.credit_note_id ===
                                  creditItem.credit_note_id
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
                                  "/SalesPage/CreditNoteDetailPage",
                                  {
                                    state: { item: creditItem },
                                  },
                                  setRefundOpen(false)
                                );
                              }}
                            >
                              {/* Customer Name */}
                              <div>{creditItem.cust_name}</div>

                              {/* Delivery No and Date */}
                              <div
                                style={{
                                  fontSize: "1rem",
                                  color: "#6C7184",
                                  marginTop: 8,
                                }}
                              >
                                {creditItem.credit_no} •{" "}
                                {creditItem.credit_date}
                              </div>

                              {/* Status */}
                              <div
                                style={{
                                  color: creditItem.status_color,
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                  textTransform: "uppercase",
                                  letterSpacing: 1,
                                  marginTop: 8,
                                }}
                              >
                                {creditItem.status}
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
                                  "/SalesPage/CreditNoteDetailPage",
                                  {
                                    state: { item: creditItem },
                                  },
                                  setRefundOpen(false)
                                );
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(creditItem.total).toLocaleString("en-IN")}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            {refundOpen === true ? (
              <Grid
                item
                xs={12}
                md={9}
                sx={{
                  borderRight: "1px solid #e6e6e6",
                  width: "100%",
                  height: "100%",
                  minHeight: 890,
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
                        fontSize: "1.2rem",
                        fontFamily: "Helvetica",
                        // fontWeight: "bold",
                        alignItems: "center",
                      }}
                    >
                      Refund {item.credit_no}
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
                      <Tooltip title="Close" arrow>
                        <CloseIcon
                          onClick={() => {
                            handleRefundClose();
                          }}
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container xs={12} p={4}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                          alt="Customer Icon"
                          sx={{ width: 60, height: 60, mr: 1 }}
                        />
                        <Grid display="flex" flexDirection="column">
                          <Typography
                            sx={{
                              color: "#6C7184",
                              fontSize: "0.9rem",
                              fontFamily: "Helvetica",
                            }}
                          >
                            Customer Name
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "1rem",
                              fontWeight: "bold",
                              fontFamily: "Helvetica",
                            }}
                          >
                            Schwing Stetter
                          </Typography>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    xs={12}
                    sx={{
                      width: "100%",
                      height: "auto",
                      minHeight: 100,
                      bgcolor: "#F9F9FB",
                      borderRadius: "10px",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={2.5}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        alignContent: "center",
                        color: "red",
                        fontSize: "1.1rem",
                        fontFamily: "Helvetica",
                        pl: 4,
                      }}
                    >
                      Amount*
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        alignContent: "center",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        style={{
                          width: "100%",
                          fontSize: "1rem",
                          cursor: "pointer",
                          padding: "8px 12px",
                        }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          style: {
                            fontFamily: "Times New Roman",
                            height: 10,
                            fontSize: "1.3rem",
                            backgroundColor: "#fff",
                            paddingLeft: 10,
                          },
                        }}
                        InputProps={{
                          style: { border: "1px solid #e6e6e6" },
                          startAdornment: (
                            <InputAdornment position="start">
                              INR
                            </InputAdornment>
                          ),
                        }}
                        value={INR}
                        onChange={(e) => setINR(e.target.value)}
                      ></TextField>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#6C7184",
                          fontSize: "1.1rem",
                          fontFamily: "Helvetica",
                        }}
                      >
                        Balance:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1.1rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                        }}
                      >
                        {" "}
                        ₹{CreditDetails[0]?.balance}
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
                      minHeight: 100,
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={2.5}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        alignContent: "center",
                        color: "red",
                        fontSize: "1.1rem",
                        fontFamily: "Helvetica",
                        pl: 4,
                      }}
                    >
                      Refunded On*
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        alignContent: "center",
                        pl: 1.8,
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          slotProps={{
                            textField: {
                              sx: {
                                "& .MuiSvgIcon-root": {
                                  width: "1.3em",
                                  height: "1.3em",
                                },
                              },
                              InputProps: {
                                sx: {
                                  height: 40,
                                  width: "320px",
                                  fontSize: "1.2rem",
                                  fontFamily: "Times New Roman",
                                  // fontWeight: "bold",
                                  "& .MuiPickersYear-yearButton": {
                                    fontSize: "1.2rem",
                                  },
                                },
                              },
                            },
                          }}
                          format="YYYY-MM-DD"
                          openTo="day"
                          views={["year", "month", "day"]}
                          value={dayjs(from)}
                          onChange={setFrom}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={2.5}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "1.1rem",
                        fontFamily: "Helvetica",
                        pl: 6,
                      }}
                    >
                      Payment Mode
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        alignContent: "center",
                        pl: 2.8,
                      }}
                    >
                      <Autocomplete
                        disablePortal
                        options={paymentMethod.map((item) => ({
                          id: item.id,
                          display_name: item.pay_name,
                        }))}
                        value={selectedPaymentMethod}
                        onChange={(e, val) => {
                          setSelectedPaymentMethod(val);
                        }}
                        getOptionLabel={(option) => option.display_name || ""}
                        sx={{
                          "& + .MuiAutocomplete-popper .MuiAutocomplete-option:hover":
                            {
                              backgroundColor: "#cccccc",
                            },
                        }}
                        ListboxProps={{
                          sx: { fontSize: "1rem" },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            autoComplete="off"
                            placeholder="Choose the payment term or type to add"
                            style={{
                              width: "100%",
                              fontSize: "1rem",
                              cursor: "pointer",
                              padding: "8px 12px",
                            }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              ...params.InputProps,
                              disableUnderline: true,
                              sx: {
                                "& .MuiSvgIcon-root": {
                                  width: "1em",
                                  height: "1em",
                                },
                                backgroundColor: "#fff",
                              },
                            }}
                            inputProps={{
                              style: {
                                fontFamily: "Times New Roman",
                                height: 8,
                                fontSize: "1.3rem",
                                "& .MuiSvgIcon-root": {
                                  width: "1em",
                                  height: "1em",
                                },
                              },
                              ...params.inputProps,
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    xs={12}
                    sx={{
                      width: "100%",
                      height: "auto",
                      minHeight: 100,
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={2.5}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        alignContent: "center",
                        fontSize: "1.1rem",
                        fontFamily: "Helvetica",
                        pl: 4,
                      }}
                    >
                      Reference#
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        alignContent: "center",
                      }}
                    >
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        style={{
                          width: "100%",
                          fontSize: "1rem",
                          cursor: "pointer",
                          padding: "8px 12px",
                        }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          style: {
                            fontFamily: "Times New Roman",
                            height: 10,
                            fontSize: "1.3rem",
                            backgroundColor: "#fff",
                          },
                        }}
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                      ></TextField>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={2.5}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "1.1rem",
                        fontFamily: "Helvetica",
                        pl: 2.5,
                      }}
                    >
                      Description
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        alignContent: "center",
                        pl: 2.8,
                      }}
                    >
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        style={{
                          width: "100%",
                          fontSize: "1rem",
                          cursor: "pointer",
                          padding: "8px 12px",
                        }}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                          style: {
                            fontFamily: "Times New Roman",
                            height: 10,
                            fontSize: "1.3rem",
                            backgroundColor: "#fff",
                          },
                        }}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                      ></TextField>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    xs={12}
                    sx={{
                      width: "100%",
                      height: "auto",
                      minHeight: 100,
                      borderBottom: "1px solid #e6e6e6",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={2.5}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        alignContent: "center",
                        fontSize: "1.1rem",
                        fontFamily: "Helvetica",
                        pl: 4,
                        color: "red",
                      }}
                    >
                      From Account*
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: 100,
                        alignContent: "center",
                      }}
                    >
                      <Autocomplete
                        options={options}
                        groupBy={(option) => option.group}
                        getOptionLabel={(option) => option.name}
                        value={selectedOption}
                        onChange={(event, newValue) => {
                          setSelectedOption(newValue); // Update the state with the selected option
                        }}
                        renderGroup={(params) => (
                          <div key={params.key}>
                            <div
                              style={{
                                fontWeight: "bold",
                                padding: "13px 12px",
                                color: "#000",
                                fontSize: "1rem",
                              }}
                            >
                              {params.group}
                            </div>
                            {params.children}
                          </div>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            autoComplete="off"
                            placeholder="Select an account"
                            style={{
                              width: "100%",
                              fontSize: "1rem",
                              cursor: "pointer",
                              padding: "8px 12px",
                            }}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              ...params.InputProps,
                              disableUnderline: true,
                              sx: {
                                "& .MuiSvgIcon-root": {
                                  width: "1em",
                                  height: "1em",
                                },
                                backgroundColor: "#fff",
                              },
                            }}
                            inputProps={{
                              style: {
                                fontFamily: "Times New Roman",
                                height: 12,
                                fontSize: "1.3rem",
                                "& .MuiSvgIcon-root": {
                                  width: "1em",
                                  height: "1em",
                                },
                              },
                              ...params.inputProps,
                            }}
                          />
                        )}
                      />
                    </Grid>
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
                      mt: 2,
                    }}
                  >
                    <Grid>
                      <Button
                        sx={{
                          backgroundColor: "#408DFB", // Updated color
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#3070C0", // Slightly darker hover color
                          },
                        }}
                        size="medium"
                        onClick={() => {
                          handleSaveRefund();
                        }}
                      >
                        Save
                      </Button>
                    </Grid>
                    <Grid>
                      <Button
                        sx={{
                          backgroundColor: "#F5F5F5", // Updated color
                          color: "#000",
                          border: "1px solid #e6e6e6",
                          "&:hover": {
                            backgroundColor: "#f2f2f2", // Slightly darker hover color
                          },
                        }}
                        size="medium"
                        onClick={() => {
                          handleRefundClose();
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
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
                      {item.credit_no}
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
                          handleOpenComment();
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
                            navigate("/Sales/CreditNotes");
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
                        navigate("/Sales/EditCreditNotes", {
                          state: { CreditDetails },
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
                        icon="material-symbols:mail-outline"
                        width="1.5rem"
                        height="1.5rem"
                        style={{ marginTop: 5 }}
                      />
                      Send
                    </Typography>
                  </Grid> */}
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
                  {CreditDetails[0]?.status === "Draft" ? (
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
                          handleSureOpen();
                        }}
                      >
                        <Icon
                          icon="iconamoon:invoice-bold"
                          width="1.5rem"
                          height="1.5rem"
                          style={{ marginTop: 5 }}
                        />
                        Apply to invoices
                      </Typography>
                    </Grid>
                  ) : (
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
                          handleOpen();
                        }}
                      >
                        <Icon
                          icon="mingcute:pdf-line"
                          width="1.5rem"
                          height="1.5rem"
                          style={{ marginTop: 5 }}
                        />{" "}
                        Apply to invoices
                      </Typography>
                    </Grid>
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
                        sx={{
                          width: "100%",
                          height: "auto",
                          minHeight: "100px",
                        }}
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
                              backgroundColor: CreditDetails[0]
                                ? CreditDetails[0].status_color
                                : "",
                            }}
                          >
                            {CreditDetails[0] ? CreditDetails[0].status : ""}
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
                              CREDIT NOTE
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
                                    Credit Date
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
                                    Invoice#
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
                                    {CreditDetails[0]
                                      ? CreditDetails[0].credit_no
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
                                    {CreditDetails[0]
                                      ? CreditDetails[0].credit_date
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
                                    {CreditDetails[0]
                                      ? CreditDetails[0].invoice_no
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
                                    {CreditDetails[0]
                                      ? CreditDetails[0].invoice_date
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
                                    {CreditDetails[0]
                                      ? CreditDetails[0].plc_supply
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
                              flexDirection: "column",
                            }}
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
                              {CreditDetails[0]
                                ? CreditDetails[0].customer_name
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
                          </Grid>
                          <Grid
                            item
                            container
                            xs={12}
                            sx={{
                              width: "90%",
                              height: "auto",
                              minHeight: "80px",
                              borderBottom: "1px solid #999999",
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
                              minHeight: "370px",
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
                                {CreditDetails[0]
                                  ? convertToWordsWithoutDecimal(
                                      CreditDetails[0].total
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
                                    Shipping Charge
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
                                    {CreditDetails[0]?.tax_id === "0"
                                      ? "IGST0 (0%)"
                                      : CreditDetails[0]?.tax_id === "1"
                                      ? "IGST5 (5%)"
                                      : CreditDetails[0]?.tax_id === "2"
                                      ? "IGST12 (12%)"
                                      : CreditDetails[0]?.tax_id === "3"
                                      ? "IGST18 (18%)"
                                      : CreditDetails[0]?.tax_id === "4"
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
                                    {CreditDetails[0]?.tds < 0 &&
                                    CreditDetails[0]?.tcs === "0.00"
                                      ? "TDS"
                                      : CreditDetails[0]?.tds === "0" &&
                                        CreditDetails[0]?.tcs < 0
                                      ? "TCS"
                                      : ""}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: "16px",
                                      fontFamily: "Ubuntu",
                                      /// fontWeight: "bold",
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
                                    Credits Remaining
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
                                      CreditDetails[0]
                                        ? CreditDetails[0].sub_total
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
                                      CreditDetails[0]
                                        ? CreditDetails[0].ship_charge
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
                                      CreditDetails[0]
                                        ? parseFloat(
                                            CreditDetails[0].ship_sgst
                                          ) +
                                            parseFloat(
                                              CreditDetails[0].ship_cgst
                                            )
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
                                    {CreditDetails[0]?.tds < 0 &&
                                    CreditDetails[0]?.tcs === "0.00"
                                      ? CreditDetails[0]?.tds
                                      : CreditDetails[0]?.tds === "0" &&
                                        CreditDetails[0]?.tcs < 0
                                      ? CreditDetails[0]?.tcs
                                      : ""}
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
                                      CreditDetails[0]
                                        ? CreditDetails[0].adj
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
                                      CreditDetails[0]
                                        ? CreditDetails[0].total
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
                                      CreditDetails[0]
                                        ? CreditDetails[0].balance
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
            )}
          </Grid>
        </Grid>
      </Sidebar>
    </React.Fragment>
  );
};

export default CreditNoteDetailPage;
