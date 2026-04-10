import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  TextField,
  Box,
  Divider,
  InputAdornment,
  Button,
  Paper,
  Autocomplete,
  Stack,
  Avatar,
  Slide,
  Snackbar,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Chip from "@mui/material/Chip";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Modal from "@mui/material/Modal";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Link,
} from "@mui/icons-material";
import SuiSnackbar from "../../Snackbars/SuiSnackbar";
import html2pdf from "html2pdf.js";
import Sidebar from "../../Navbars/Sidebar";

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiAutocomplete-option": {
            display: "flex",
            alignItems: "center",
            "& .MuiAvatar-root": {
              marginRight: 8,
              backgroundColor: "#E9EBF3",
              color: "#9391A2",
            },
            "&:hover": {
              backgroundColor: "#408dfb",
              color: "#ffffff",
            },
            fontSize: "18px", // Set the font size for options
          },
          "& .MuiChip-root": {
            backgroundColor: "#E9EBF3",
            color: "#212529",
            fontSize: "18px", // Set the font size for selected chips
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            paddingRight: 0,
            fontSize: "18px", // Set the font size for input text
            "& fieldset": {
              border: "none",
            },
            "& .MuiInputBase-input": {
              fontSize: "18px", // Set the font size for input text
            },
            "& .MuiInputAdornment-root": {
              fontSize: "18px", // Set the font size for adornments (e.g., Bcc)
            },
          },
          "& .MuiInputLabel-root": {
            fontSize: "18px", // Set the font size for the label
          },
        },
      },
    },
  },
});

const SalesOrderEmailSent = ({ onLogout }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const data1 = localStorage.getItem("data");
  const [subject, setSubject] = useState("");
  const [BccOpen, setBccOpen] = useState(false);
  const [emailDetails, setEmailDetails] = useState([]);
  const location = useLocation();
  const { isSalesOrder, data } = location.state || {};
  const [sendTo, setSendTo] = useState([]);
  const [selectedSendMail, setSelectedSendMail] = useState([]);
  const [from, setFrom] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState([]);
  const [Cc, setCc] = useState([]);
  const [selectedCc, setSelectedCc] = useState([]);
  const [selectedBcc, setSelectedBcc] = useState([]);
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState("16px");
  const [alignment, setAlignment] = useState("left");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [userData, setUserData] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be 'error', 'warning', 'info', 'success'
  const [salesDetails, setSalesDetails] = useState([]);
  const [address, setAddress] = useState([]);
  const [itemDetails, setItemDetails] = useState([]);

  useEffect(() => {
    if (isSalesOrder === false) {
      setSnackbarMessage("Your salesorder has been created.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  }, [isSalesOrder]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    setUserData(JSON.parse(data1));
  }, []);

  const handleBold = () => {
    document.execCommand("bold");
    setIsBold(!isBold);
  };

  const handleItalic = () => {
    document.execCommand("italic");
    setIsItalic(!isItalic);
  };

  const handleUnderline = () => {
    document.execCommand("underline");
    setIsUnderline(!isUnderline);
  };

  const handleStrikethrough = () => {
    document.execCommand("strikethrough");
    setIsStrikethrough(!isStrikethrough);
  };

  const handleFontSizeChange = (event) => {
    const newSize = event.target.value;
    setFontSize(newSize);
    document.execCommand("fontSize", false, "7");
    const fontElements = document.getElementsByTagName("font");
    for (let i = 0; i < fontElements.length; i++) {
      fontElements[i].removeAttribute("size");
      fontElements[i].style.fontSize = newSize;
    }
  };

  const handleAlign = (align) => {
    setAlignment(align);
    document.execCommand("justify" + align);
  };

  const handleLink = () => {
    const url = prompt("Enter the URL");
    if (url) {
      document.execCommand("createLink", false, url);
    }
  };

  // Inline styles for the toolbar and editor
  const toolbarStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    backgroundColor: "#f1f1f1",
    borderBottom: "1px solid #ddd",
    width: "100%",
  };

  const buttonStyle = {
    padding: "8px",
    cursor: "pointer",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.3s ease",
  };

  const selectStyle = {
    padding: "12px 8px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontSize: "14px",
  };

  const editorStyle = {
    border: "1px solid #ddd",
    minHeight: "100px",
    padding: "10px",
    width: "100%",
    fontSize: "16px", // Default size
  };

  const handleChangeTo = (event, newValue) => {
    if (newValue && newValue.length > 0) {
      const lastSelected = newValue[newValue.length - 1];
      if (lastSelected.isAddContact) {
        setOpen(true);
        newValue.pop(); // Remove the "Add Contact Person" from selected values
      }
    }
    setSelectedSendMail(newValue);
  };

  const filterOptionsTo = (options, { inputValue }) => {
    const filtered = options.filter((option) => {
      return (
        !selectedSendMail.includes(option) &&
        option.Email.toLowerCase().includes(inputValue.toLowerCase())
      );
    });
    return [...filtered, { Email: "Add Contact Person", isAddContact: true }];
  };

  const handleChangeFrom = (event, newValue) => {
    if (newValue && newValue.length > 0) {
      const lastSelected = newValue[newValue.length - 1];
      if (lastSelected.isAddContact) {
        setOpen(true);
        newValue.pop(); // Remove the "Add Contact Person" from selected values
      }
    }
    setSelectedFrom(newValue);
  };

  const filterOptionsFrom = (options, { inputValue }) => {
    const filtered = options.filter((option) => {
      return (
        !selectedFrom.includes(option) &&
        option.Email.toLowerCase().includes(inputValue.toLowerCase())
      );
    });
    return [...filtered, { Email: "Add Contact Person", isAddContact: true }];
  };

  const handleChangeCc = (event, newValue) => {
    if (newValue && newValue.length > 0) {
      const lastSelected = newValue[newValue.length - 1];
      if (lastSelected.isAddContact) {
        setOpen(true);
        newValue.pop(); // Remove the "Add Contact Person" from selected values
      }
    }
    setSelectedCc(newValue);
  };

  const filterOptionsCc = (options, { inputValue }) => {
    const filtered = options.filter((option) => {
      return (
        !selectedCc.includes(option) &&
        option.Email.toLowerCase().includes(inputValue.toLowerCase())
      );
    });
    return [...filtered, { Email: "Add Contact Person", isAddContact: true }];
  };

  const handleChangeBcc = (event, newValue) => {
    if (newValue && newValue.length > 0) {
      const lastSelected = newValue[newValue.length - 1];
      if (lastSelected.isAddContact) {
        setOpen(true);
        newValue.pop(); // Remove the "Add Contact Person" from selected values
      }
    }
    setSelectedBcc(newValue);
  };

  const filterOptionsBcc = (options, { inputValue }) => {
    const filtered = options.filter((option) => {
      return (
        !selectedBcc.includes(option) &&
        option.Email.toLowerCase().includes(inputValue.toLowerCase())
      );
    });
    return [...filtered, { Email: "Add Contact Person", isAddContact: true }];
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (isSalesOrder) {
      console.log("Sales Details:", data);
      // Handle the `salesDetails`
    } else {
      console.log("Json Data:", data);
      // Handle the `JsonData`
    }
  }, [isSalesOrder]);

  const handleBccOpen = () => {
    setBccOpen(true);
  };

  const url = `https://erp-api.schwingcloud.com/Service1.svc/getEmailDetails?organization_id=${orgid}&type=salesorder&user=${user}`;

  const emailSent = () => {
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
          id: isSalesOrder === true ? data[0].id : data.id,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).Data;
        if (JSON.parse(res.data).Code === 1) {
          setEmailDetails(JsonData);
          setSendTo(JsonData[0].To);
          setFrom(JsonData[0].From);
          setCc(JsonData[0].CC);

          const orgContact = JsonData[0].From.find(
            (contact) => contact.Type === "org"
          );
          if (orgContact) {
            setSelectedFrom([orgContact]); // Initialize with matching email
          }

          const Customer = JsonData[0].To.find(
            (contact) => contact.Type === "customer"
          );
          if (Customer) {
            setSelectedSendMail([Customer]); // Initialize with matching email
          }

          const CC = JsonData[0].CC.find((contact) => contact.Type === "org");
          if (CC) {
            setSelectedCc([CC]); // Initialize with matching email
          }
          setSubject(
            `Sales order from ${
              userData[0] ? userData[0].org_name : ""
            } (Sales order#: ${
              JsonData[0] ? JsonData[0].sales_order_no : ""
            }) is ready to view`
          );
        } else if (JSON.parse(res.data).Code === 5) {
          onLogout();
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error fetching email details:", error);
      });
  };

  useEffect(() => {
    emailSent();
  }, []);

  const getSalesDetails = () => {
    const params = {
      json_type: "get_sales_orders",
      sales_ids: [isSalesOrder === true ? data[0].id : data.id],
      org_id: orgid,
      type: "2",
      includeFullDetails: "true",
      user: user,
    };

    axios
      .post(url1, params, {
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
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getSalesDetails();
  }, [isSalesOrder, data]);

  const url1 = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const handleSendEmail = () => {
    const boxHtml = document.getElementById("emailContentBox").outerHTML;
    const actualcontent = document.getElementById("actualcontent").outerHTML;

    // Prepare the JSON data
    const params = {
      json_type: "send_document",
      from: selectedFrom[0].Email,
      CC_mail: selectedCc?.map((item) => ({ Email: item.Email })) || [],
      To_mail: selectedSendMail?.map((item) => ({ Email: item.Email })) || [],
      BCC_mail: selectedBcc?.map((item) => ({ Email: item.Email })) || [],
      subject: subject || "",
      id: emailDetails[0]?.sales_order_id || "",
      body: boxHtml + actualcontent,
      type: "salesorder",
      org_id: orgid || "",
      user: user || "",
      user_id: userid || "",
      pdf_attachment: "", // Will be added later
    };

    // Generate the PDF and convert it to base64
    const element = document.getElementById("pdfcontent");
    html2pdf()
      .from(element)
      .toPdf()
      .output("blob")
      .then((pdfBlob) => {
        // Convert Blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = function () {
          const base64data = reader.result.split(",")[1]; // Remove the prefix, only keep base64 data
          params.pdf_attachment = base64data;

          // Convert params to a raw JSON string
          const rawJson = JSON.stringify(params);

          // Send the email with the raw JSON string
          axios
            .post(url1, rawJson, {
              headers: {
                "Content-Type": "text/plain", // Change to plain text
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              const JsonData = JSON.parse(res.data);
              const itemFind = JsonData.data;
              const item = itemFind[0];
              if (JsonData.json_sts === "1") {
                navigate("/SalesPage/SalesDetailPage", {
                  state: { item, sent: "sent" },
                });
              } else if (JSON.parse(res.data).json_sts === "5") {
                onLogout();
                navigate("/");
              }
            })
            .catch((error) => {
              setSnackbarMessage("An error occurred while sending the email.");
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
            });
        };
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
      <Sidebar onLogout={onLogout}>
        <Grid pb={2}>
          <Helmet>
            <title>Email | Sales Order</title>
          </Helmet>
          <div style={{ position: "absolute", left: "-9999px" }}>
            <div
              id="pdfcontent"
              style={{
                width: "100%",
                height: "100%",
                padding: "10px",
                boxSizing: "border-box",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Outer Container with Border */}
              <div
                style={{
                  width: "800px", // Fixed width for outer container
                  border: "2px solid #e6e6e6", // Border for the outer box
                  paddingBottom: "20px", // Inner padding for content spacing
                  backgroundColor: "#fff", // White background for the content area
                }}
              >
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
                      pl: 4,
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
                      pr: "35px",
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
                      {salesDetails[0] ? salesDetails[0].sales_order_no : ""}{" "}
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
                    pl: 4,
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
                    pl: 4,
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
                    pl: 4,
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
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Grid item xs={12} md={5.3} sx={{ textAlign: "right" }}>
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
                        sx={{ textAlign: "right", pr: 4 }}
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
                    pl: 4,
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
                    minHeight: "170px",
                    pl: 4,
                    pr: 4,
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
                                {/* Format the amount with currency symbol */}₹
                                {Number(item.rate).toLocaleString("en-IN")}
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
                                {/* Format the amount with currency symbol */}₹
                                {Number(item.amount).toLocaleString("en-IN")}
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
                  <Grid item xs={12} md={3} sx={{ textAlign: "right", pr: 4 }}>
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
                      {salesDetails && salesDetails[0]
                        ? "₹" + salesDetails[0].total
                        : ""}
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
                    pl: 4,
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
            </div>
          </div>
          <Grid
            item
            container
            xs={12}
            sx={{
              width: "100%",
              height: "auto",
              minHeight: 80,
              borderBottom: "0.5px solid #d9d9d9",
              mt: 4,
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
                Email To {emailDetails[0] ? emailDetails[0].customer_name : ""}
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
                  navigate("/Sales/SalesOrder");
                }}
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="start"
            style={{
              minHeight: "100vh",
              paddingLeft: 20,
            }} // Center vertically
          >
            <Grid
              item
              container
              direction="column"
              style={{
                width: "90%", // 70% width for responsiveness
                paddingLeft: "20px",
                paddingRight: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                //  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e6e6e6",
              }}
            >
              {/* Header (From, To, Cc, Subject) */}
              <Grid
                item
                container
                direction="column"
                spacing={2}
                style={{ marginBottom: "20px" }}
              >
                <Grid
                  item
                  xs={12}
                  container
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{ fontSize: "22px", fontFamily: "Times New Roman" }}
                  >
                    From
                  </Grid>
                  <Grid item xs={12} md={10}>
                    <ThemeProvider theme={theme}>
                      <Autocomplete
                        multiple
                        value={selectedFrom}
                        onChange={handleChangeFrom}
                        options={from} // Dynamic data is used here
                        getOptionLabel={(option) => option.Email || ""}
                        filterOptions={filterOptionsFrom}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            autoComplete="off"
                            placeholder="Search"
                            InputProps={{
                              ...params.InputProps,
                            }}
                          />
                        )}
                        renderTags={(tagValue, getTagProps) =>
                          tagValue.map((option, index) => (
                            <Chip
                              key={option.Email}
                              avatar={<Avatar>{option.Email.charAt(0)}</Avatar>}
                              label={option.Email}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderOption={(props, option) => (
                          <li
                            {...props}
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {option.isAddContact ? (
                              <Stack direction="row" alignItems="center">
                                <AddCircleOutlineIcon
                                  style={{ marginRight: 8 }}
                                />
                                <div>{option.Email}</div>
                              </Stack>
                            ) : (
                              <Stack direction="row" alignItems="center">
                                <Avatar>{option.Email.charAt(0)}</Avatar>
                                <div style={{ marginLeft: 8 }}>
                                  {option.Email}
                                </div>
                              </Stack>
                            )}
                          </li>
                        )}
                        fullWidth
                      />
                      {/* Modal for adding a contact person */}
                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            border: "2px solid #000",
                            boxShadow: 24,
                            p: 4,
                          }}
                        >
                          <h2 id="modal-modal-title">Add Contact Person</h2>
                          <p id="modal-modal-description">
                            Form to add a new contact person.
                          </p>
                          {/* Add form fields here */}
                          <button onClick={handleClose}>Close</button>
                        </Box>
                      </Modal>
                    </ThemeProvider>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{ fontSize: "22px", fontFamily: "Times New Roman" }}
                  >
                    Send To
                  </Grid>
                  <Grid item xs={12} md={10}>
                    <ThemeProvider theme={theme}>
                      <Autocomplete
                        multiple
                        value={selectedSendMail}
                        onChange={handleChangeTo}
                        options={sendTo} // Dynamic data is used here
                        getOptionLabel={(option) => option.Email || ""}
                        filterOptions={filterOptionsTo}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            autoComplete="off"
                            placeholder="Search"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  onClick={() => {
                                    handleBccOpen();
                                  }}
                                >
                                  <Typography
                                    sx={{ cursor: "pointer", color: "#408DFB" }}
                                  >
                                    {BccOpen === true ? "" : "Bcc"}
                                  </Typography>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                        renderTags={(tagValue, getTagProps) =>
                          tagValue.map((option, index) => (
                            <Chip
                              key={option.Email}
                              avatar={<Avatar>{option.Email.charAt(0)}</Avatar>}
                              label={option.Email}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderOption={(props, option) => (
                          <li
                            {...props}
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {option.isAddContact ? (
                              <Stack direction="row" alignItems="center">
                                <AddCircleOutlineIcon
                                  style={{ marginRight: 8 }}
                                />
                                <div>{option.Email}</div>
                              </Stack>
                            ) : (
                              <Stack direction="row" alignItems="center">
                                <Avatar>{option.Email.charAt(0)}</Avatar>
                                <div style={{ marginLeft: 8 }}>
                                  {option.Email}
                                </div>
                              </Stack>
                            )}
                          </li>
                        )}
                        fullWidth
                      />
                      {/* Modal for adding a contact person */}
                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            border: "2px solid #000",
                            boxShadow: 24,
                            p: 4,
                          }}
                        >
                          <h2 id="modal-modal-title">Add Contact Person</h2>
                          <p id="modal-modal-description">
                            Form to add a new contact person.
                          </p>
                          {/* Add form fields here */}
                          <button onClick={handleClose}>Close</button>
                        </Box>
                      </Modal>
                    </ThemeProvider>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{ fontSize: "22px", fontFamily: "Times New Roman" }}
                  >
                    Cc
                  </Grid>
                  <Grid item xs={12} md={10}>
                    <ThemeProvider theme={theme}>
                      <Autocomplete
                        multiple
                        value={selectedCc}
                        onChange={handleChangeCc}
                        options={Cc} // Dynamic data is used here
                        getOptionLabel={(option) => option.Email || ""}
                        filterOptions={filterOptionsCc}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            autoComplete="off"
                            placeholder="Search"
                            InputProps={{
                              ...params.InputProps,
                            }}
                          />
                        )}
                        renderTags={(tagValue, getTagProps) =>
                          tagValue.map((option, index) => (
                            <Chip
                              key={option.Email}
                              avatar={<Avatar>{option.Email.charAt(0)}</Avatar>}
                              label={option.Email}
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderOption={(props, option) => (
                          <li
                            {...props}
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {option.isAddContact ? (
                              <Stack direction="row" alignItems="center">
                                <AddCircleOutlineIcon
                                  style={{ marginRight: 8 }}
                                />
                                <div>{option.Email}</div>
                              </Stack>
                            ) : (
                              <Stack direction="row" alignItems="center">
                                <Avatar>{option.Email.charAt(0)}</Avatar>
                                <div style={{ marginLeft: 8 }}>
                                  {option.Email}
                                </div>
                              </Stack>
                            )}
                          </li>
                        )}
                        fullWidth
                      />
                      {/* Modal for adding a contact person */}
                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            border: "2px solid #000",
                            boxShadow: 24,
                            p: 4,
                          }}
                        >
                          <h2 id="modal-modal-title">Add Contact Person</h2>
                          <p id="modal-modal-description">
                            Form to add a new contact person.
                          </p>
                          {/* Add form fields here */}
                          <button onClick={handleClose}>Close</button>
                        </Box>
                      </Modal>
                    </ThemeProvider>
                  </Grid>
                </Grid>
                {BccOpen === true ? (
                  <Grid
                    item
                    xs={12}
                    container
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={2}
                      sx={{ fontSize: "22px", fontFamily: "Times New Roman" }}
                    >
                      Bcc
                    </Grid>
                    <Grid item xs={12} md={10}>
                      <ThemeProvider theme={theme}>
                        <Autocomplete
                          multiple
                          value={selectedBcc}
                          onChange={handleChangeBcc}
                          options={Cc} // Dynamic data is used here
                          getOptionLabel={(option) => option.Email || ""}
                          filterOptions={filterOptionsBcc}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              autoComplete="off"
                              placeholder="Search"
                              InputProps={{
                                ...params.InputProps,
                              }}
                            />
                          )}
                          renderTags={(tagValue, getTagProps) =>
                            tagValue.map((option, index) => (
                              <Chip
                                key={option.Email}
                                avatar={
                                  <Avatar>{option.Email.charAt(0)}</Avatar>
                                }
                                label={option.Email}
                                {...getTagProps({ index })}
                              />
                            ))
                          }
                          renderOption={(props, option) => (
                            <li
                              {...props}
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {option.isAddContact ? (
                                <Stack direction="row" alignItems="center">
                                  <AddCircleOutlineIcon
                                    style={{ marginRight: 8 }}
                                  />
                                  <div>{option.Email}</div>
                                </Stack>
                              ) : (
                                <Stack direction="row" alignItems="center">
                                  <Avatar>{option.Email.charAt(0)}</Avatar>
                                  <div style={{ marginLeft: 8 }}>
                                    {option.Email}
                                  </div>
                                </Stack>
                              )}
                            </li>
                          )}
                          fullWidth
                        />
                        {/* Modal for adding a contact person */}
                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: 400,
                              bgcolor: "background.paper",
                              border: "2px solid #000",
                              boxShadow: 24,
                              p: 4,
                            }}
                          >
                            <h2 id="modal-modal-title">Add Contact Person</h2>
                            <p id="modal-modal-description">
                              Form to add a new contact person.
                            </p>
                            {/* Add form fields here */}
                            <button onClick={handleClose}>Close</button>
                          </Box>
                        </Modal>
                      </ThemeProvider>
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
                <Grid
                  item
                  xs={12}
                  container
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{ fontSize: "22px", fontFamily: "Times New Roman" }}
                  >
                    Subject
                  </Grid>
                  <Grid item xs={12} md={10}>
                    <TextField
                      value={subject}
                      placeholder="Enter subject"
                      onChange={(e) => setSubject(e.target.value)} // Handle the change as needed
                      fullWidth
                      variant="outlined"
                      autoComplete="off"
                      InputProps={{
                        style: {
                          backgroundColor: "#f7f7f7",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                        }, // Background and border radius
                      }}
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none", // Remove the outline border
                        },
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  container
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <div style={toolbarStyle}>
                    <button style={buttonStyle} onClick={handleBold}>
                      <FormatBold />
                    </button>
                    <button style={buttonStyle} onClick={handleItalic}>
                      <FormatItalic />
                    </button>
                    <button style={buttonStyle} onClick={handleUnderline}>
                      <FormatUnderlined />
                    </button>
                    <button style={buttonStyle} onClick={handleStrikethrough}>
                      <StrikethroughS />
                    </button>
                    <button
                      style={buttonStyle}
                      onClick={() => handleAlign("Left")}
                    >
                      <FormatAlignLeft />
                    </button>
                    <button
                      style={buttonStyle}
                      onClick={() => handleAlign("Center")}
                    >
                      <FormatAlignCenter />
                    </button>
                    <button
                      style={buttonStyle}
                      onClick={() => handleAlign("Right")}
                    >
                      <FormatAlignRight />
                    </button>
                    <button
                      style={buttonStyle}
                      onClick={() => handleAlign("Justify")}
                    >
                      <FormatAlignJustify />
                    </button>
                    <button style={buttonStyle} onClick={handleLink}>
                      <Link />
                    </button>
                    <select
                      style={selectStyle}
                      onChange={handleFontSizeChange}
                      value={fontSize}
                    >
                      <option value="12px">12px</option>
                      <option value="14px">14px</option>
                      <option value="16px">16px</option>
                      <option value="18px">18px</option>
                      <option value="24px">24px</option>
                    </select>
                  </div>
                </Grid>
              </Grid>

              <Divider style={{ marginBottom: "20px" }} />

              <Grid
                item
                sx={{
                  height: "100%",
                  width: "100%",
                  maxHeight: "530px",
                  overflowY: "auto",
                  pb: 2,
                  overflowX: "hidden",
                }}
              >
                <div style={{ background: "#fbfbfb" }}>
                  <div
                    id="emailContentBox"
                    style={{
                      ...editorStyle,
                      textAlign: alignment,
                      fontWeight: isBold ? "bold" : "normal",
                      fontStyle: isItalic ? "italic" : "normal",
                      textDecoration:
                        (isUnderline ? "underline " : "") +
                        (isStrikethrough ? "line-through" : ""),
                    }}
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                  ></div>
                  <div id="actualcontent">
                    <div
                      style={{
                        fontSize: "24px",
                        marginTop: 10,
                        fontFamily: "Times New Roman",
                      }}
                    >
                      Dear{" "}
                      {emailDetails[0] ? emailDetails[0].customer_name : ""},
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        marginTop: 20,
                        fontFamily: "Times New Roman",
                      }}
                    >
                      Thanks for your interest in our services. Please find our
                      sales order attached with this mail.
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        marginTop: 20,
                        fontFamily: "Times New Roman",
                      }}
                    >
                      An overview of the sales order is available below for your
                      reference:
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        marginTop: 20,
                        fontFamily: "Times New Roman",
                      }}
                    >
                      ----------------------------------------------------------------------------------------------
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                        marginTop: 20,
                        fontFamily: "Times New Roman",
                        fontWeight: "bold",
                      }}
                    >
                      Sales Order#:{" "}
                      {emailDetails[0] ? emailDetails[0].sales_order_no : ""}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        marginTop: 20,
                        fontFamily: "Times New Roman",
                      }}
                    >
                      ----------------------------------------------------------------------------------------------
                    </div>
                    <div
                      style={{
                        fontSize: "22px",
                        marginTop: 0,
                        fontFamily: "Times New Roman",
                        fontWeight: "bold",
                      }}
                    >
                      Order Date :
                      {emailDetails[0]
                        ? " " + emailDetails[0].sales_order_date
                        : ""}
                    </div>
                    <div
                      style={{
                        fontSize: "22px",
                        marginTop: 0,
                        fontFamily: "Times New Roman",
                        fontWeight: "bold",
                      }}
                    >
                      Amount : {/* Format the amount with currency symbol */}₹
                      {Number(
                        emailDetails[0] ? emailDetails[0].amount : ""
                      ).toLocaleString("en-IN")}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        marginTop: 0,
                        fontFamily: "Times New Roman",
                      }}
                    >
                      ----------------------------------------------------------------------------------------------
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        marginTop: 20,
                        fontFamily: "Times New Roman",
                      }}
                    >
                      Assuring you of our best services at all times.
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        marginTop: 40,
                        fontFamily: "Times New Roman",
                      }}
                    >
                      Regards,
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        marginTop: 15,
                        fontFamily: "Times New Roman",
                      }}
                    >
                      {userData[0] ? userData[0].e_mail_username : ""}
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        marginTop: 0,
                        fontFamily: "Times New Roman",
                      }}
                    >
                      {userData[0] ? userData[0].org_name : ""}
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            pl={2.5}
            sx={{ display: "flex", justifyContent: "start", gap: 2 }}
          >
            <Button
              variant="contained"
              sx={{
                width: {
                  xs: "100%",
                  sm: "100px",
                },
                maxWidth: "100px", // Ensures the button doesn't exceed 200px on larger screens
                height: "30px",
                backgroundColor: "#408DFB", // Sets the background color to #4DCF59
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#5097fb", // Darker shade for hover effect
                },
                fontFamily: "Times New Roman",
                fontSize: "20px",
              }}
              onClick={() => {
                handleSendEmail();
              }}
            >
              Send
            </Button>
            <Button
              variant="contained"
              sx={{
                width: {
                  xs: "100%",
                  sm: "100px",
                },
                maxWidth: "100px", // Ensures the button doesn't exceed 200px on larger screens
                height: "30px",
                backgroundColor: "#408DFB", // Sets the background color to #4DCF59
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#5097fb", // Darker shade for hover effect
                },
                fontFamily: "Times New Roman",
                fontSize: "20px",
              }}
              onClick={() => {
                navigate("/Sales/SalesOrder");
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Sidebar>
    </React.Fragment>
  );
};

export default SalesOrderEmailSent;
