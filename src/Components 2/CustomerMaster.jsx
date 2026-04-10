import {
  Autocomplete,
  Avatar,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Popover,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ModalCustomerMaster from "../UsableContent/ModalCustomerMaster";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { styled } from "@mui/material/styles";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { Helmet } from "react-helmet";
import Sidebar from "../Navbars/Sidebar";
import EditCustomerMaster from "../UsableContent/EditCustomerMaster";
import { Icon } from "@iconify/react/dist/iconify.js";
import { styled as muiStyled } from "@mui/material/styles";
import { Country, State } from "country-state-city";
import MessageIcon from "@mui/icons-material/Message"; // Messenger icon
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import { TimelineOppositeContent } from "@mui/lab";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import SuiSnackbar from "../Snackbars/SuiSnackbar";
import LoadingOverlay from "../Loading Animations/LoadingOverlay";
import nodata from "../Images/truck.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 1,
  },
  fieldGroup: {
    mt: 2,
  },
};

const addressDetailStyle = {
  fontSize: "17px",
  fontFamily: "Helvetica, Arial, sans-serif",
  color: "#333", // Darker gray for readability
  paddingLeft: "24px", // Consistent padding for indentation
  paddingTop: "4px", // Subtle spacing between lines
};

const Accordion = styled((props) => (
  <MuiAccordion
    disableGutters
    sx={{ width: "80%" }}
    elevation={0}
    square
    {...props}
  />
))(({ theme }) => ({
  //border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ExpandMoreRounded sx={{ fontSize: "2rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#f2f2f2" : "#f2f2f2",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(180deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

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

const style1 = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: 950,
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: "5px",
  border: "none",
  boxShadow: 24,
};

const StyledModalBox = muiStyled(Box)(({ theme }) => ({
  backgroundColor: "white",
  padding: theme.spacing(2),
  borderRadius: "8px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  width: "500px",
  maxHeight: "450px",
  overflowY: "auto",

  "&::-webkit-scrollbar": {
    width: "1px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#f9f9fb",
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#F9F9FB",
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#fff",
  },
}));

const CustomerMaster = ({ onLogout }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const userid = localStorage.getItem("userid");
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [CustomerTable, setCustomerTable] = useState([]);
  const [customerTrue, setCustomerTrue] = useState(false);
  const [customerDetails, setCustomerDetails] = useState("");
  const [expanded, setExpanded] = React.useState("panel1");
  const [contactPerson, setContactPerson] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [id, setID] = useState("");
  const [additionalAddress, setAdditionalAddress] = useState([]);
  const [editPaymentTerm, setEditPaymentTerm] = useState(false);
  const [termsList, setTermsList] = useState("");
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [isBillingOpen, setBillingOpen] = useState(false);
  const [isShippingOpen, setShippingOpen] = useState(false);
  const [isAdditionalOpen, setAdditionalOpen] = useState(false);
  const billingButtonRef = useRef(null);
  const shippingButtonRef = useRef(null);
  const additionalButtonRef = useRef(null);
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [billingAttention, setBillingAttention] = useState("");
  const [billingCountries, setBillingCountries] = useState([]);
  const [billingStates, setBillingStates] = useState([]);
  const [selectedBillingCountry, setSelectedBillingCountry] = useState(null);
  const [selectedBillingState, setSelectedBillingState] = useState(null);
  const [billingAddress1, setBillingAddress1] = useState("");
  const [billingAddress2, setBillingAddress2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingFax, setBillingFax] = useState("");
  const [shippingAttention, setShippingAttention] = useState("");
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingStates, setShippingStates] = useState([]);
  const [selectedShippingCountry, setSelectedShippingCountry] = useState(null);
  const [selectedShippingState, setSelectedShippingState] = useState(null);
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingZip, setShippingZip] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingFax, setShippingFax] = useState("");
  const [additionalCountries, setAdditionalCountries] = useState([]);
  const [additionalStates, setAdditionalStates] = useState([]);
  const [selectedAdditionalCountry, setSelectedAdditionalCountry] =
    useState(null);
  const [selectedAdditionalState, setSelectedAdditionalState] = useState(null);
  const [attention, SetAttention] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, SetFax] = useState("");
  const [additionalId, setAdditionalId] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be 'error', 'warning', 'info', 'success'
  const [loading, setLoading] = useState(false);
  const [moreInfo, setMoreInfo] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [historyDetails, setHistoryDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [outOpen, setOutOpen] = useState(false);
  const [invoiceTable, setInvoiceTable] = useState([]);
  const [unusedOpen, setUnusedOpen] = useState(false);
  const [unusedDetails, setUnusedDetails] = useState([]);
  const [applyOpen, setApplyOpen] = useState(false);
  const [credits, setCredits] = useState([]); // Initialize credits state
  const [totalCredits, setTotalCredits] = useState(0); // State for total credits
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [creditId, setCreditId] = useState("");
  const [creditNo, setCreditNo] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditInfo, setCreditInfo] = useState("");

  const handleOutReceiveOpen = (id) => {
    setOutOpen(true);
    const idsArray = id.split(",").map((item) => item.trim());
    const params = {
      json_type: "get_invoice",
      Invoice_ids: idsArray,
      org_id: orgid,
      type: "5",
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
          setInvoiceTable(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  const handleOutReceiveClose = () => {
    setOutOpen(false);
  };

  const handleUnsedCreditsOpen = () => {
    setUnusedOpen(true);
    const params = {
      json_type: "get_unused_credits",
      cust_id: id,
      org_id: orgid,
      user: user,
    };
    axios
      .post("https://erp-api.schwingcloud.com/Service1.svc/ERP_app3", params, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        if (JSON.parse(res.data).json_sts === "1") {
          setUnusedDetails(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  const handleUnusedCreditsClose = () => {
    setUnusedOpen(false);
  };

  const handleApplyOpen = (creditid, creditno, amount, info) => {
    handleUnusedCreditsClose();
    setApplyOpen(true);
    setCreditId(creditid);
    setCreditNo(creditno);
    setCreditAmount(amount);
    setCreditInfo(info);
    getInvoiceDetails();
  };

  const handleApplyClose = () => {
    setApplyOpen(false);
  };

  const handleCreditChange = (index, event) => {
    const newCredits = [...credits];
    let enteredCredit = parseFloat(event.target.innerText) || 0; // Ensure it's a number

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

  const getInvoiceDetails = () => {
    const params = {
      json_type: "get_invoice",
      type: "3",
      cust_id: id,
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

  useEffect(() => {
    calculateTotalCredits(); // Recalculate the total when credits change
  }, [credits]);

  const handleSavePayment = () => {
    const combinedEditArray =
      invoiceDetails &&
      invoiceDetails
        .map((item, index) => ({
          invoice_id: item.id,
          due_amount: item.due_amount,
          amount_paid: parseFloat(credits[index]), // Convert to number to ensure proper comparison
        }))
        .filter((item) => item.amount_paid > 0); // Only include rows with credit greater than 0

    console.log("Filtered Edit Array:", combinedEditArray);

    if (totalCredits > creditAmount) {
      alert("Overpayment detected");
      return; // Prevent further execution
    }
    const params = {
      json_type: "save_payment",
      type:
        creditInfo === "Excess payment" ? "customer_payment" : "credit_payment",
      id: creditId,
      cust_id: id,
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
          handleApplyClose();
          handleCustomerClick(id);
          getCustomerTable();
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleMoreInfoOpen = () => {
    setMoreInfo(true);
    GetTransactionDetails();
  };

  const handleMoreInfoClose = () => {
    setMoreInfo(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const openAnchor = Boolean(anchorEl);
  const id1 = open ? "date-range-popover" : undefined;

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const selected = CustomerTable.map((item) => item.id); // Assuming each item has a unique identifier like `id`
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
    setSelectAll(newSelected.length === CustomerTable.length);
  };

  const fetchCountries = () => {
    const countryData = Country.getAllCountries();
    setBillingCountries(countryData);
    setShippingCountries(countryData);
    setAdditionalCountries(countryData);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleCountrySelection = (selectedCountryName) => {
    const selectedCountry = billingCountries.find(
      (country) => country.name === selectedCountryName
    );
    if (selectedCountry) {
      const countryCode = selectedCountry.isoCode;
      const states = State.getStatesOfCountry(countryCode);
      setBillingStates(states);
      const billingState = states.find(
        (option) => option.name === customerDetails[0]?.b_address.state
      );
      if (billingState) {
        setSelectedBillingState(billingState.name);
      } else {
        setSelectedBillingState(null);
      }
    }
  };

  const handleCountryShippingSelection = (selectedCountryName) => {
    const selectedCountry = billingCountries.find(
      (country) => country.name === selectedCountryName
    );
    if (selectedCountry) {
      const countryCode = selectedCountry.isoCode;
      const states = State.getStatesOfCountry(countryCode);
      setShippingStates(states);
      const shippingState = states.find(
        (option) => option.name === customerDetails[0]?.s_address.state
      );
      if (shippingState) {
        setSelectedShippingState(shippingState.name);
      } else {
        setSelectedShippingState(null);
      }
    }
  };

  const handleAdditionalCountrySelection = (selectedCountryName) => {
    const selectedCountry = additionalCountries.find(
      (country) => country.name === selectedCountryName
    );
    if (selectedCountry) {
      const countryCode = selectedCountry.isoCode;
      const states = State.getStatesOfCountry(countryCode);
      setAdditionalStates(states);
    }
    setSelectedAdditionalState(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Make sure the click was outside the modal and not on any input
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setBillingOpen(false); // Close modal
        setShippingOpen(false);
        setAdditionalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getButtonPosition = (ref, y, x) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      return {
        top: rect.bottom + y + window.scrollY,
        left: rect.left + x + window.scrollX,
      };
    }
    return { top: 0, left: 0 };
  };

  const handleButtonBillingClick = () => {
    const position = getButtonPosition(billingButtonRef, 0, 360);
    setPosition(position);
    setBillingOpen(true);
  };

  const handleButtonShippingClick = () => {
    const position = getButtonPosition(shippingButtonRef, -200, 335);
    setPosition(position);
    setShippingOpen(true);
  };

  const handleButtonAdditionalClick = (item) => {
    setPosition(position);
    setAdditionalOpen(true);
    SetAttention(item.address_details.name);
    const addCountry = additionalCountries.find(
      (option) => option.name === item.address_details.country
    );
    if (addCountry) {
      setSelectedAdditionalCountry(addCountry.name);
      handleAdditionalCountrySelection(addCountry.name);
    }
    const addState = additionalStates.find(
      (option) => option.name === item.address_details.state
    );
    if (addState) {
      setSelectedAdditionalState(addState.name);
    } else {
      setSelectedAdditionalState(null);
    }
    setStreet1(item.address_details.add1);
    setStreet2(item.address_details.add2);
    setCity(item.address_details.city);
    setZip(item.address_details.zip);
    setPhone(item.address_details.phn);
    SetFax(item.address_details.fax);
    setAdditionalId(item.address_id);
  };

  const getTermsList = () => {
    const params = { json_type: "get_terms", user: user, org_id: orgid };
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
          setTermsList(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getTermsList();
  }, []);

  const handlePaymentOpen = () => {
    setEditPaymentTerm(true);
  };

  const handlePaymentClose = () => {
    setEditPaymentTerm(false);
  };

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleCustomerClose = () => {
    setCustomerOpen(false);
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getCustomerTable = () => {
    setLoading(true);
    const params = {
      json_type: "get_customer_erp_details",
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
          setCustomerTable(JsonData);
          setLoading(false);
        } else if (JSON.parse(res.data).json_sts === "2") {
          setCustomerTable([]);
          setLoading(false);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getCustomerTable();
  }, []);

  const handleCustomerClick = (id) => {
    //setCustomerTrue(true);
    setCustomerOpen(true);
    setID(id);
    getComments(id);
    const params = {
      json_type: "get_customer_erp_details",
      type: "2",
      id: id,
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
          setCustomerDetails(JsonData);
          setContactPerson(JsonData[0].contacts_id);
          setAdditionalAddress(JsonData[0].additional_address);
          if (JsonData) {
            const selectedTerm = {
              name: JsonData[0].term_name,
              no_days: JsonData[0].no_days,
              id: JsonData[0].payment_term_id,
            };
            setSelectedTerm(selectedTerm);
          }
          setBillingAttention(JsonData[0].b_address.name);
          setBillingAddress1(JsonData[0].b_address.add1);
          setBillingAddress2(JsonData[0].b_address.add2);
          setBillingCity(JsonData[0].b_address.city);
          setBillingZip(JsonData[0].b_address.zip);
          setBillingPhone(JsonData[0].b_address.phn);
          setBillingFax(JsonData[0].b_address.fax);
          setShippingAttention(JsonData[0].s_address.name);
          setShippingAddress1(JsonData[0].s_address.add1);
          setShippingAddress2(JsonData[0].s_address.add2);
          setShippingCity(JsonData[0].s_address.city);
          setShippingZip(JsonData[0].s_address.zip);
          setShippingPhone(JsonData[0].s_address.phn);
          setShippingFax(JsonData[0].s_address.fax);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  const getComments = (id) => {
    setLoadingDetails(true);
    axios
      .get(
        `https://erp-api.schwingcloud.com/Service1.svc/GetCommentsHistory?organization_id=${orgid}&cust_id=${id}&entity_id=&entity_type=&user=${user}`,
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
          setTimelineData(JsonData);
          setLoadingDetails(false);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        } else {
          setTimelineData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching email details:", error);
      });
  };

  useEffect(() => {
    const billingCountry = billingCountries.find(
      (option) => option.name === customerDetails[0]?.b_address.country
    );
    if (billingCountry) {
      setSelectedBillingCountry(billingCountry.name);
      handleCountrySelection(billingCountry.name);
    }
    const shippingCountry = shippingCountries.find(
      (option) => option.name === customerDetails[0]?.s_address.country
    );
    if (shippingCountry) {
      setSelectedShippingCountry(shippingCountry.name);
      handleCountryShippingSelection(shippingCountry.name);
    }
  }, [customerDetails]);

  const handleSavePaymentTerm = () => {
    const params = {
      cust_id: id,
      user: user,
      org_id: orgid,
      fields_to_update: {
        payment_term_id: selectedTerm.id,
      },
      contact_details: [],
    };
    axios
      .post("https://erp-api.schwingcloud.com/Service1.svc/customers", params, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data);
        if (JsonData.json_sts === "1") {
          setSnackbarMessage(JsonData.error_msg);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          handlePaymentClose();
          handleCustomerClick(id);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        } else {
          setSnackbarMessage(JsonData.error_msg);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      });
  };

  const handleEditAddress = () => {
    const fetchBillingAddressData = {
      name: billingAttention,
      country: selectedBillingCountry,
      add1: billingAddress1,
      add2: billingAddress2,
      city: billingCity,
      state: selectedBillingState,
      zip: billingZip,
      phn: billingPhone,
      fax: billingFax,
    };
    console.log(fetchBillingAddressData);
    const fetchShippningAddressData = {
      name: shippingAttention,
      country: selectedShippingCountry,
      add1: shippingAddress1,
      add2: shippingAddress2,
      city: shippingCity,
      state: selectedShippingState,
      zip: shippingZip,
      phn: shippingPhone,
      fax: shippingFax,
    };
    console.log(fetchShippningAddressData);
    const fetchAdditionalAddressData = [
      {
        address_id: additionalId,
        name: attention,
        country: selectedAdditionalCountry,
        add1: street1,
        add2: street2,
        city: city,
        state: selectedAdditionalState,
        zip: zip,
        phn: phone,
        fax: fax,
      },
    ];
    console.log(fetchAdditionalAddressData);
    if (isBillingOpen === true) {
      const params = {
        cust_id: id,
        user: user,
        org_id: orgid,
        fields_to_update: {
          b_address: fetchBillingAddressData,
        },
        contact_details: [],
      };
      axios
        .post(
          "https://erp-api.schwingcloud.com/Service1.svc/customers",
          params,
          {
            headers: {
              "Content-Type": "application/text",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          const JsonData = JSON.parse(res.data);
          if (JsonData.json_sts === "1") {
            setBillingOpen(false);
            handleCustomerClick(id);
            setSnackbarMessage(JsonData.error_msg);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          } else if (JSON.parse(res.data).json_sts === "5") {
            onLogout();
            navigate("/");
          } else {
            setSnackbarMessage(JsonData.error_msg);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        });
    } else if (isShippingOpen === true) {
      const params = {
        cust_id: id,
        user: user,
        org_id: orgid,
        fields_to_update: {
          s_address: fetchShippningAddressData,
        },
        contact_details: [],
      };
      axios
        .post(
          "https://erp-api.schwingcloud.com/Service1.svc/customers",
          params,
          {
            headers: {
              "Content-Type": "application/text",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          const JsonData = JSON.parse(res.data);
          if (JsonData.json_sts === "1") {
            setShippingOpen(false);
            handleCustomerClick(id);
            setSnackbarMessage(JsonData.error_msg);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          } else if (JSON.parse(res.data).json_sts === "5") {
            onLogout();
            navigate("/");
          } else {
            setSnackbarMessage(JsonData.error_msg);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        });
    } else {
      const params = {
        cust_id: id,
        user: user,
        org_id: orgid,
        fields_to_update: {},
        address_details: fetchAdditionalAddressData,
        contact_details: [],
      };
      axios
        .post(
          "https://erp-api.schwingcloud.com/Service1.svc/customers",
          params,
          {
            headers: {
              "Content-Type": "application/text",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          const JsonData = JSON.parse(res.data);
          if (JsonData.json_sts === "1") {
            setAdditionalOpen(false);
            handleCustomerClick(id);
            setSnackbarMessage(JsonData.error_msg);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          } else if (JSON.parse(res.data).json_sts === "5") {
            onLogout();
            navigate("/");
          } else {
            setSnackbarMessage(JsonData.error_msg);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        });
    }
  };

  const handleDelete = () => {
    const selectedIds = selectedItems;
    // Filter out items that are selected and map to only the required keys
    const filteredTable = CustomerTable.filter((item) =>
      selectedIds.includes(item.id)
    ) // Adjust this condition as per your data structure
      .map((item) => item.id); // Store only the id as an array
    const params = {
      json_type: "delete_customers",
      customer_ids: filteredTable,
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
          setSnackbarMessage(JsonData.error_msg);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          window.location.reload();
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        } else {
          setSnackbarMessage(JsonData.error_msg);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          window.location.reload();
        }
      });
  };

  const url2 = `https://erp-api.schwingcloud.com/Service1.svc/GetCustomerData?organization_id=${orgid}&cust_id=${id}&user=${user}`;

  const GetTransactionDetails = () => {
    axios
      .get(url2, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).Data;
        if (JSON.parse(res.data).Code === 1) {
          setCustomerData(JsonData[0]);
        } else if (JSON.parse(res.data).Code === 5) {
          onLogout();
          navigate("/");
        } else {
          setCustomerData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching email details:", error);
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
        open={outOpen}
        onClose={() => handleOutReceiveClose()}
        sx={{
          zIndex: 1300,
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
                Invoices
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
                  handleOutReceiveClose();
                }}
              />
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceTable &&
                    invoiceTable.map((item, index) => (
                      <TableRow
                        key={index}
                        onClick={() => {
                          navigate("/SalesPage/InvoiceDetailsPage", {
                            state: { item },
                          });
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell
                          sx={{
                            fontSize: "1.1rem",
                            fontFamily: "Helvetica",
                            p: 1,
                            border: "0.5px solid #e6e6e6",
                            color: "#408DFB",
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
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Drawer>
      <Drawer
        anchor="top"
        open={unusedOpen}
        onClose={() => handleUnusedCreditsClose()}
        sx={{
          zIndex: 1300,
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
                Credit details for{" "}
                {customerDetails ? customerDetails[0].company_name : ""}
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
                  handleUnusedCreditsClose();
                }}
              />
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
                      Credit Info
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
                      Date Credited
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
                      Amount
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
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {unusedDetails &&
                    unusedDetails.map((item, index) => (
                      <TableRow key={index} sx={{ cursor: "pointer" }}>
                        <TableCell
                          sx={{
                            fontSize: "1.1rem",
                            fontFamily: "Helvetica",
                            p: 1,
                            border: "0.5px solid #e6e6e6",
                            color: "#408DFB",
                          }}
                        >
                          {item.credit_info}
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
                          {item.date}
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
                          ₹{item.amount}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "1rem",
                            fontFamily: "Helvetica",
                            p: 1,
                            color: "#000",
                            border: "0.5px solid #e6e6e6",
                            textAlign: "center",
                          }}
                        >
                          <button
                            aria-label="Close"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              border: "1px solid #e6e6e6",
                              backgroundColor: "#F5F5F5",
                              height: "30px",
                              width: "150px",
                              borderRadius: "5px",
                            }}
                            onClick={() => {
                              handleApplyOpen(
                                item.id,
                                item.number,
                                item.amount,
                                item.credit_info
                              );
                            }}
                          >
                            Apply to invoices
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Drawer>
      <Drawer
        anchor="top"
        open={applyOpen}
        onClose={() => handleApplyClose()}
        sx={{
          zIndex: 1300,
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
                {creditInfo === "Excess payment"
                  ? "Apply Credits from Advance Payment"
                  : "Apply Credits to invoices"}
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
                  handleApplyClose();
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
                  {creditInfo === "Excess payment"
                    ? "Advance Payment#"
                    : "Credit Note#"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontFamily: "Helvetica",
                    fontWeight: 600,
                  }}
                >
                  {creditNo}
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
                  {"₹" + creditAmount}
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
                          ₹{item.due_amount}
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
                  {Number(creditAmount - totalCredits).toLocaleString("en-IN")}
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
                  handleApplyClose();
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
                  handleSavePayment();
                }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
      <Modal
        open={isBillingOpen}
        onClose={() => setBillingOpen(false)}
        BackdropProps={{ style: { backgroundColor: "transparent" } }} // No background dimming
      >
        <StyledModalBox
          ref={modalRef}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
          }}
        >
          <Box>
            {/* Modal Header */}
            <Box sx={styles.header}>
              <Typography variant="h6" fontWeight="bold">
                Billing Address
              </Typography>
              <IconButton
                onClick={() => {
                  setBillingOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
            {/* Form Fields with Headings */}
            <Box
              sx={{
                maxHeight: "300px",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "1px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f9f9fb",
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#F9F9FB",
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#fff",
                },
              }}
            >
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Attention</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={billingAttention}
                  onFocus={() => console.log("Attention field focused!")}
                  onChange={(e) => setBillingAttention(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Country / Region</Typography>
                <Autocomplete
                  options={billingCountries.map((country) => country.name)}
                  value={selectedBillingCountry}
                  onChange={(e, val) => {
                    setSelectedBillingCountry(val);
                    handleCountrySelection(val);
                  }}
                  ListboxProps={{ sx: { fontSize: "1rem" } }}
                  autoComplete="off"
                  disablePortal
                  // disableCloseOnSelect // This keeps the dropdown open on select
                  renderInput={(params) => (
                    <TextField {...params} margin="dense" autoComplete="off" />
                  )}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Street 1</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={billingAddress1}
                  onChange={(e) => setBillingAddress1(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Street 2</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={billingAddress2}
                  onChange={(e) => setBillingAddress2(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">City</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={billingCity}
                  onChange={(e) => setBillingCity(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">State</Typography>
                <Autocomplete
                  disablePortal
                  autoComplete="off"
                  options={billingStates.map((state) => state.name)}
                  value={selectedBillingState}
                  onChange={(e, val) => {
                    setSelectedBillingState(val);
                  }}
                  ListboxProps={{ sx: { fontSize: "1rem" } }}
                  renderInput={(params) => (
                    <TextField {...params} margin="dense" autoComplete="off" />
                  )}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Pin Code</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={billingZip}
                  onChange={(e) => setBillingZip(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Phone</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={billingPhone}
                  onChange={(e) => setBillingPhone(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Fax Number</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={billingFax}
                  onChange={(e) => setBillingFax(e.target.value)}
                />
              </Box>
            </Box>
            <Divider sx={{ mt: 1 }} />
            <Box display="flex" justifyContent="flex-start" gap={2} mt={3}>
              <Button
                variant="contained"
                color="primary"
                sx={{ bgcolor: "#408DFB" }}
                onClick={() => {
                  handleEditAddress();
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setBillingOpen(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </StyledModalBox>
      </Modal>
      <Modal
        open={isShippingOpen}
        onClose={() => setShippingOpen(false)}
        BackdropProps={{ style: { backgroundColor: "transparent" } }} // No background dimming
      >
        <StyledModalBox
          ref={modalRef}
          style={{
            position: "absolute",
            top: position.top,
            left: position.left,
          }}
        >
          <Box>
            {/* Modal Header */}
            <Box sx={styles.header}>
              <Typography variant="h6" fontWeight="bold">
                Shipping Address
              </Typography>
              <IconButton
                onClick={() => {
                  setShippingOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
            <Box
              sx={{
                maxHeight: "300px",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "1px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f9f9fb",
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#F9F9FB",
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#fff",
                },
              }}
            >
              {/* Form Fields with Headings */}
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Attention</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={shippingAttention}
                  onFocus={() => console.log("Attention field focused!")}
                  onChange={(e) => setShippingAttention(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Country / Region</Typography>
                <Autocomplete
                  options={shippingCountries.map((country) => country.name)}
                  value={selectedShippingCountry}
                  onChange={(e, val) => {
                    setSelectedShippingCountry(val);
                    handleCountryShippingSelection(val);
                  }}
                  ListboxProps={{ sx: { fontSize: "1rem" } }}
                  autoComplete="off"
                  disablePortal
                  // disableCloseOnSelect // This keeps the dropdown open on select
                  renderInput={(params) => (
                    <TextField {...params} margin="dense" autoComplete="off" />
                  )}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Street 1</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={shippingAddress1}
                  onChange={(e) => setShippingAddress1(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Street 2</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={shippingAddress2}
                  onChange={(e) => setShippingAddress2(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">City</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">State</Typography>
                <Autocomplete
                  disablePortal
                  autoComplete="off"
                  options={shippingStates.map((state) => state.name)}
                  value={selectedShippingState}
                  onChange={(e, val) => {
                    setSelectedShippingState(val);
                  }}
                  ListboxProps={{ sx: { fontSize: "1rem" } }}
                  renderInput={(params) => (
                    <TextField {...params} margin="dense" autoComplete="off" />
                  )}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Pin Code</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={shippingZip}
                  onChange={(e) => setShippingZip(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Phone</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Fax Number</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={shippingFax}
                  onChange={(e) => setShippingFax(e.target.value)}
                />
              </Box>
            </Box>
            <Divider sx={{ mt: 1 }} />
            <Box display="flex" justifyContent="flex-start" gap={2} mt={3}>
              <Button
                variant="contained"
                color="primary"
                sx={{ bgcolor: "#408DFB" }}
                onClick={() => {
                  handleEditAddress();
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setShippingOpen(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </StyledModalBox>
      </Modal>
      <Modal
        open={isAdditionalOpen}
        onClose={() => setAdditionalOpen(false)}
        BackdropProps={{ style: { backgroundColor: "transparent" } }} // No background dimming
      >
        <StyledModalBox
          ref={modalRef}
          style={{
            position: "fixed", // Use fixed to position in the center
            top: "68.5%",
            left: "68.5%",
            transform: "translate(-50%, -50%)", // Center modal
          }}
        >
          <Box>
            {/* Modal Header */}
            <Box sx={styles.header}>
              <Typography variant="h6" fontWeight="bold">
                Additional Address
              </Typography>
              <IconButton
                onClick={() => {
                  setAdditionalOpen(false);
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider />
            <Box
              sx={{
                maxHeight: "300px",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "1px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f9f9fb",
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#F9F9FB",
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#fff",
                },
              }}
            >
              {/* Form Fields with Headings */}
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Attention</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={attention}
                  onChange={(e) => SetAttention(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Country / Region</Typography>
                <Autocomplete
                  options={additionalCountries.map((country) => country.name)}
                  value={selectedAdditionalCountry}
                  onChange={(e, val) => {
                    setSelectedAdditionalCountry(val);
                    handleAdditionalCountrySelection(val);
                  }}
                  ListboxProps={{ sx: { fontSize: "1rem" } }}
                  autoComplete="off"
                  disablePortal
                  // disableCloseOnSelect // This keeps the dropdown open on select
                  renderInput={(params) => (
                    <TextField {...params} margin="dense" autoComplete="off" />
                  )}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Street 1</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={street1}
                  onChange={(e) => setStreet1(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Street 2</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={street2}
                  onChange={(e) => setStreet2(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">City</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">State</Typography>
                <Autocomplete
                  disablePortal
                  autoComplete="off"
                  options={additionalStates.map((state) => state.name)}
                  value={selectedAdditionalState}
                  onChange={(e, val) => {
                    setSelectedAdditionalState(val);
                  }}
                  ListboxProps={{ sx: { fontSize: "1rem" } }}
                  renderInput={(params) => (
                    <TextField {...params} margin="dense" autoComplete="off" />
                  )}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Pin Code</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Phone</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Box>
              <Box sx={styles.fieldGroup}>
                <Typography fontWeight="bold">Fax Number</Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  value={fax}
                  onChange={(e) => SetFax(e.target.value)}
                />
              </Box>
            </Box>
            <Divider sx={{ mt: 3 }} />
            <Box display="flex" justifyContent="flex-start" gap={2} mt={3}>
              <Button
                variant="contained"
                color="primary"
                sx={{ bgcolor: "#408DFB" }}
                onClick={() => {
                  handleEditAddress();
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setAdditionalOpen(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </StyledModalBox>
      </Modal>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ModalCustomerMaster
            handleClose={handleClose}
            getCustomerTable={getCustomerTable}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
          />
        </Box>
      </Modal>
      <Modal
        open={editOpen}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <EditCustomerMaster
            handleEditClose={handleEditClose}
            getCustomerTable={getCustomerTable}
            id={id}
            handleCustomerClick={handleCustomerClick}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
          />
        </Box>
      </Modal>
      <Modal
        open={customerOpen}
        onClose={() => {
          handleCustomerClose();
          handleMoreInfoClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style1}>
          {loadingDetails === true ? (
            <LoadingOverlay />
          ) : (
            <Grid
              item
              container
              xs={12}
              sx={{
                p: 2,
                width: "100%",
                height: "100%",
                maxHeight: 920,
              }}
            >
              <Grid
                item
                xs={12}
                md={3}
                sx={{
                  //p: 2,
                  width: "100%",
                  height: "100%",
                  maxHeight: 900,
                  borderRight: "2px solid #eee",
                }}
              >
                <Grid
                  item
                  container
                  xs={12}
                  sx={{
                    width: "100%",
                    height: "auto",
                    minHeight: "70px",
                    borderBottom: "1px solid #e6e6e6",
                    //backgroundColor: "#f2f2f2",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                      width: "100%",
                      height: "auto",
                      minHeight: "70px",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      pl: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        fontSize: "1.4rem",
                        fontFamily: "Helvetica",
                        fontWeight: "bold",
                        alignItems: "center",
                      }}
                    >
                      All Customers
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
                      minHeight: "70px",
                      height: "auto",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      pr: 2,
                      gap: 2,
                    }}
                  >
                    <Grid>
                      <Tooltip title="Create Customer" arrow>
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
                          onClick={handleOpen}
                        >
                          new
                        </Button>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Grid>
                <TableContainer
                  sx={{
                    width: "100%",
                    maxHeight: 800,
                  }}
                >
                  <Table stickyHeader>
                    <TableBody>
                      {CustomerTable &&
                        CustomerTable.map((item, index) => (
                          <TableRow
                            sx={{ cursor: "pointer" }}
                            key={index}
                            onClick={() => {
                              handleCustomerClick(item.id);
                              handleMoreInfoClose();
                            }}
                          >
                            <TableCell
                              sx={{
                                fontSize: "1.2rem",
                                fontFamily: "Helvetica",
                                // fontWeight: "bold",
                                textTransform: "uppercase",
                                p: 1,
                                borderBottom: "0.5px solid #e6e6e6",
                                pl: 2,
                              }}
                            >
                              {item.company_name}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              {moreInfo === true ? (
                <Grid
                  item
                  xs={12}
                  md={9}
                  sx={{
                    //p: 2,
                    width: "100%",
                    height: "100%",
                    minHeight: 870,
                  }}
                >
                  <Grid
                    item
                    container
                    xs={12}
                    sx={{
                      width: "100%",
                      height: "auto",
                      borderBottom: "1px solid #e6e6e6",
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={6}
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
                          fontSize: "1.4rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          alignItems: "center",
                        }}
                      >
                        More Info
                        {/* <InfoOutlinedIcon
                          sx={{
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
                        <button
                          aria-label="Close"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            border: "1px solid #e6e6e6",
                            backgroundColor: "#fff",
                            height: "30px",
                            width: "100px",
                            borderRadius: "5px",
                          }}
                          onClick={handleMoreInfoClose}
                        >
                          Basic Info
                        </button>
                      </Grid>
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
                          onClick={handleEditOpen}
                        >
                          Edit
                        </button>
                      </Grid>
                      <Grid>
                        <Tooltip title="Close" arrow>
                          <button
                            onClick={() => {
                              handleCustomerClose();
                              handleMoreInfoClose();
                            }}
                            aria-label="Close"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            ❌
                          </button>
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
                      height: "auto",
                      maxHeight: 850,
                      //  backgroundColor: "#f2f2f2",
                      borderTop: "1px solid #f2f2f2",
                    }}
                  >
                    <Tabs
                      value={selectedTab}
                      onChange={handleTabChange}
                      aria-label="Item detail tabs"
                      sx={{ pl: 1 }}
                    >
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
                    <Box
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxHeight: 800,
                        overflowY: "auto",
                      }}
                    >
                      {selectedTab === 0 && (
                        <Box p={2}>
                          {/* Invoices Section */}
                          <Accordion
                            sx={{
                              width: "100%",
                              marginBottom: 4,
                              border: "1px solid #e6e6e6",
                              borderRadius: "10px",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMoreIcon sx={{ color: "#408DFB" }} />
                              }
                              aria-controls="invoices-content"
                              id="invoices-header"
                              sx={{
                                backgroundColor: "#F9F9FB",
                                borderBottom: "1px solid #e6e6e6",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                  }}
                                >
                                  Invoices
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={() => {
                                    navigate("/Sales/NewInvoice");
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "1.2rem",
                                      marginRight: "4px",
                                      color: "#408DFB",
                                    }}
                                  >
                                    +
                                  </span>{" "}
                                  New
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                padding: 0,
                              }}
                            >
                              {customerData?.Invoices?.length > 0 ? (
                                <>
                                  <TableContainer>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          {[
                                            "Date",
                                            "Invoice Number",
                                            "Order Number",
                                            "Amount",
                                            "Balance Due",
                                            "Status",
                                          ].map((header) => (
                                            <TableCell
                                              key={header}
                                              sx={{
                                                fontSize: "0.9rem",
                                                fontWeight: "bold",
                                                textTransform: "uppercase",
                                                color: "#6C7184",
                                                backgroundColor: "#F9F9FB",
                                                borderBottom:
                                                  "1px solid #e6e6e6",
                                                padding: "10px 16px",
                                              }}
                                            >
                                              {header}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {customerData?.Invoices?.map((item) => (
                                          <TableRow
                                            key={item.id}
                                            onClick={() => {
                                              navigate(
                                                "/SalesPage/InvoiceDetailsPage",
                                                {
                                                  state: { item },
                                                }
                                              );
                                            }}
                                            sx={{ cursor: "pointer" }}
                                          >
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {item.invoice_date}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {item.invoice_no}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {item.order_numbers || "-"}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {/* Format the amount with currency symbol */}
                                              ₹
                                              {Number(
                                                item.total
                                              ).toLocaleString("en-IN")}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {/* Format the amount with currency symbol */}
                                              ₹
                                              {Number(
                                                item.due_amount
                                              ).toLocaleString("en-IN")}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color:
                                                  item.status_color || "#444",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {item.status}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <Typography
                                    sx={{
                                      textAlign: "right",
                                      padding: "10px 16px",
                                      color: "#6C7184",
                                      //  backgroundColor: "#F5F5F5",
                                      borderBottom: "1px solid #e6e6e6",
                                      fontSize: "1rem",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total Count:{" "}
                                    {customerData?.Invoices?.length || 0}
                                  </Typography>
                                </>
                              ) : (
                                <Typography
                                  sx={{
                                    textAlign: "center",
                                    color: "#6C7184",
                                    padding: "20px",
                                  }}
                                >
                                  No Invoices Available
                                </Typography>
                              )}
                            </AccordionDetails>
                          </Accordion>

                          {/* Payments Section */}
                          <Accordion
                            sx={{
                              width: "100%",
                              marginBottom: 4,
                              border: "1px solid #e6e6e6",
                              borderRadius: "10px",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMoreIcon sx={{ color: "#408DFB" }} />
                              }
                              aria-controls="invoices-content"
                              id="invoices-header"
                              sx={{
                                backgroundColor: "#F9F9FB",
                                borderBottom: "1px solid #e6e6e6",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                  }}
                                >
                                  Payments
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={() => {
                                    navigate("/Sales/NewPaymentsReceived");
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "1.2rem",
                                      marginRight: "4px",
                                      color: "#408DFB",
                                    }}
                                  >
                                    +
                                  </span>{" "}
                                  New
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                padding: 0,
                              }}
                            >
                              {customerData?.Payments?.length > 0 ? (
                                <>
                                  <TableContainer>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          {[
                                            "Date",
                                            "Payment Number",
                                            "Reference Number",
                                            "Payment Mode",
                                            "Amount Received",
                                            "Unused Amount",
                                          ].map((header) => (
                                            <TableCell
                                              key={header}
                                              sx={{
                                                fontSize: "0.9rem",
                                                fontWeight: "bold",
                                                textTransform: "uppercase",
                                                color: "#6C7184",
                                                backgroundColor: "#F9F9FB",
                                                borderBottom:
                                                  "1px solid #e6e6e6",
                                                padding: "10px 16px",
                                              }}
                                            >
                                              {header}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {customerData?.Payments?.map((item) => (
                                          <TableRow
                                            key={item.payment_id}
                                            onClick={() => {
                                              navigate(
                                                "/SalesPage/PaymentDetailPage",
                                                {
                                                  state: { item },
                                                }
                                              );
                                            }}
                                            sx={{ cursor: "pointer" }}
                                          >
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {item.payment_date}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {item.payment_no}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {item.refernce || "-"}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {item.mode}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {/* Format the amount with currency symbol */}
                                              ₹
                                              {Number(
                                                item.total
                                              ).toLocaleString("en-IN")}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {/* Format the amount with currency symbol */}
                                              ₹
                                              {Number(
                                                item.unused_credits
                                              ).toLocaleString("en-IN")}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <Typography
                                    sx={{
                                      textAlign: "right",
                                      padding: "10px 16px",
                                      color: "#6C7184",
                                      //  backgroundColor: "#F5F5F5",
                                      borderBottom: "1px solid #e6e6e6",
                                      fontSize: "1rem",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total Count:{" "}
                                    {customerData?.Payments?.length || 0}
                                  </Typography>
                                </>
                              ) : (
                                <Typography
                                  sx={{
                                    textAlign: "center",
                                    color: "#6C7184",
                                    padding: "20px",
                                  }}
                                >
                                  No Payments Available
                                </Typography>
                              )}
                            </AccordionDetails>
                          </Accordion>

                          {/* Quotes Section */}
                          <Accordion
                            sx={{
                              width: "100%",
                              marginBottom: 4,
                              border: "1px solid #e6e6e6",
                              borderRadius: "10px",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMoreIcon sx={{ color: "#408DFB" }} />
                              }
                              aria-controls="invoices-content"
                              id="invoices-header"
                              sx={{
                                backgroundColor: "#F9F9FB",
                                borderBottom: "1px solid #e6e6e6",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                  }}
                                >
                                  Quotes
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={() => {
                                    navigate("/Sales/NewQuotes");
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "1.2rem",
                                      marginRight: "4px",
                                      color: "#408DFB",
                                    }}
                                  >
                                    +
                                  </span>{" "}
                                  New
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                padding: 0,
                              }}
                            >
                              {customerData?.Quotes?.length > 0 ? (
                                <>
                                  <TableContainer>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          {[
                                            "Date",
                                            "Quote#",
                                            "Reference Number",
                                            "Amount",
                                            "Status",
                                          ].map((header) => (
                                            <TableCell
                                              key={header}
                                              sx={{
                                                fontSize: "0.9rem",
                                                fontWeight: "bold",
                                                textTransform: "uppercase",
                                                color: "#6C7184",
                                                backgroundColor: "#F9F9FB",
                                                borderBottom:
                                                  "1px solid #e6e6e6",
                                                padding: "10px 16px",
                                              }}
                                            >
                                              {header}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {customerData?.Quotes?.map((item) => (
                                          <TableRow
                                            key={item.id}
                                            onClick={() => {
                                              navigate(
                                                "/SalesPage/QuoteDetailPage",
                                                {
                                                  state: { item },
                                                }
                                              );
                                            }}
                                            sx={{ cursor: "pointer" }}
                                          >
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {item.quote_date}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {item.quote_no}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {item.reference || "-"}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color: "#444",
                                              }}
                                            >
                                              {/* Format the amount with currency symbol */}
                                              ₹
                                              {Number(
                                                item.total
                                              ).toLocaleString("en-IN")}
                                            </TableCell>
                                            <TableCell
                                              sx={{
                                                fontSize: "0.9rem",
                                                color:
                                                  item.status_color || "#444",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {item.status}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <Typography
                                    sx={{
                                      textAlign: "right",
                                      padding: "10px 16px",
                                      color: "#6C7184",
                                      //  backgroundColor: "#F5F5F5",
                                      borderBottom: "1px solid #e6e6e6",
                                      fontSize: "1rem",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total Count:{" "}
                                    {customerData?.Quotes?.length || 0}
                                  </Typography>
                                </>
                              ) : (
                                <Typography
                                  sx={{
                                    textAlign: "center",
                                    color: "#6C7184",
                                    padding: "20px",
                                  }}
                                >
                                  No Quotes Available
                                </Typography>
                              )}
                            </AccordionDetails>
                          </Accordion>

                          {/* Sales Orders */}
                          <Accordion
                            sx={{
                              width: "100%",
                              marginBottom: 4,
                              border: "1px solid #e6e6e6",
                              borderRadius: "10px",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMoreIcon sx={{ color: "#408DFB" }} />
                              }
                              aria-controls="invoices-content"
                              id="invoices-header"
                              sx={{
                                backgroundColor: "#F9F9FB",
                                borderBottom: "1px solid #e6e6e6",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                  }}
                                >
                                  Sales Orders
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={() => {
                                    navigate("/Sales/NewSalesOrder");
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "1.2rem",
                                      marginRight: "4px",
                                      color: "#408DFB",
                                    }}
                                  >
                                    +
                                  </span>{" "}
                                  New
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                padding: 0,
                              }}
                            >
                              {customerData?.SalesOrders?.length > 0 ? (
                                <>
                                  <TableContainer>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          {[
                                            "Sales Order#",
                                            "Reference Number",
                                            "Date",
                                            "Shipment Date",
                                            "Amount",
                                            "Status",
                                          ].map((header) => (
                                            <TableCell
                                              key={header}
                                              sx={{
                                                fontSize: "0.9rem",
                                                fontWeight: "bold",
                                                textTransform: "uppercase",
                                                color: "#6C7184",
                                                backgroundColor: "#F9F9FB",
                                                borderBottom:
                                                  "1px solid #e6e6e6",
                                                padding: "10px 16px",
                                              }}
                                            >
                                              {header}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {customerData?.SalesOrders?.map(
                                          (item) => (
                                            <TableRow
                                              key={item.credit_note_id}
                                              onClick={() => {
                                                navigate(
                                                  "/SalesPage/SalesDetailPage",
                                                  {
                                                    state: { item },
                                                  }
                                                );
                                              }}
                                              sx={{ cursor: "pointer" }}
                                            >
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {item.sales_order_no}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {item.reference || "-"}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {item.sales_order_date}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {item.ex_ship_date}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {/* Format the amount with currency symbol */}
                                                ₹
                                                {Number(
                                                  item.total
                                                ).toLocaleString("en-IN")}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color:
                                                    item.status_color || "#444",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                {item.status}
                                              </TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <Typography
                                    sx={{
                                      textAlign: "right",
                                      padding: "10px 16px",
                                      color: "#6C7184",
                                      //  backgroundColor: "#F5F5F5",
                                      borderBottom: "1px solid #e6e6e6",
                                      fontSize: "1rem",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total Count:{" "}
                                    {customerData?.SalesOrders?.length || 0}
                                  </Typography>
                                </>
                              ) : (
                                <Typography
                                  sx={{
                                    textAlign: "center",
                                    color: "#6C7184",
                                    padding: "20px",
                                  }}
                                >
                                  No Sales Orders Available
                                </Typography>
                              )}
                            </AccordionDetails>
                          </Accordion>

                          {/* Credit Notes */}
                          <Accordion
                            sx={{
                              width: "100%",
                              marginBottom: 4,
                              border: "1px solid #e6e6e6",
                              borderRadius: "10px",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMoreIcon sx={{ color: "#408DFB" }} />
                              }
                              aria-controls="invoices-content"
                              id="invoices-header"
                              sx={{
                                backgroundColor: "#F9F9FB",
                                borderBottom: "1px solid #e6e6e6",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                  }}
                                >
                                  Credit Notes
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={() => {
                                    navigate("/Sales/NewCreditNotes");
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "1.2rem",
                                      marginRight: "4px",
                                      color: "#408DFB",
                                    }}
                                  >
                                    +
                                  </span>{" "}
                                  New
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                padding: 0,
                              }}
                            >
                              {customerData?.CreditNotes?.length > 0 ? (
                                <>
                                  <TableContainer>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          {[
                                            "Credit Date",
                                            "Credit Note Number",
                                            "Reference Number",
                                            "BAlance",
                                            "Amount",
                                            "Status",
                                          ].map((header) => (
                                            <TableCell
                                              key={header}
                                              sx={{
                                                fontSize: "0.9rem",
                                                fontWeight: "bold",
                                                textTransform: "uppercase",
                                                color: "#6C7184",
                                                backgroundColor: "#F9F9FB",
                                                borderBottom:
                                                  "1px solid #e6e6e6",
                                                padding: "10px 16px",
                                              }}
                                            >
                                              {header}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {customerData?.CreditNotes?.map(
                                          (item) => (
                                            <TableRow
                                              key={item.credit_note_id}
                                              onClick={() => {
                                                navigate(
                                                  "/SalesPage/CreditNoteDetailPage",
                                                  {
                                                    state: { item },
                                                  }
                                                );
                                              }}
                                              sx={{ cursor: "pointer" }}
                                            >
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {item.credit_date}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {item.credit_no}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {item.reference || "-"}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {/* Format the amount with currency symbol */}
                                                ₹
                                                {Number(
                                                  item.unused_credits
                                                ).toLocaleString("en-IN")}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {/* Format the amount with currency symbol */}
                                                ₹
                                                {Number(
                                                  item.total
                                                ).toLocaleString("en-IN")}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color:
                                                    item.status_color || "#444",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                {item.status}
                                              </TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <Typography
                                    sx={{
                                      textAlign: "right",
                                      padding: "10px 16px",
                                      color: "#6C7184",
                                      //  backgroundColor: "#F5F5F5",
                                      borderBottom: "1px solid #e6e6e6",
                                      fontSize: "1rem",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total Count:{" "}
                                    {customerData?.CreditNotes?.length || 0}
                                  </Typography>
                                </>
                              ) : (
                                <Typography
                                  sx={{
                                    textAlign: "center",
                                    color: "#6C7184",
                                    padding: "20px",
                                  }}
                                >
                                  No Credit Notes Available
                                </Typography>
                              )}
                            </AccordionDetails>
                          </Accordion>

                          {/* Delivery Challan */}
                          <Accordion
                            sx={{
                              width: "100%",
                              marginBottom: 4,
                              border: "1px solid #e6e6e6",
                              borderRadius: "10px",
                            }}
                          >
                            <AccordionSummary
                              expandIcon={
                                <ExpandMoreIcon sx={{ color: "#408DFB" }} />
                              }
                              aria-controls="invoices-content"
                              id="invoices-header"
                              sx={{
                                backgroundColor: "#F9F9FB",
                                borderBottom: "1px solid #e6e6e6",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                  }}
                                >
                                  Delivery Challans
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "1.2rem",
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  onClick={() => {
                                    navigate("/Sales/NewDeliveryChallan");
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "1.2rem",
                                      marginRight: "4px",
                                      color: "#408DFB",
                                    }}
                                  >
                                    +
                                  </span>{" "}
                                  New
                                </Typography>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails
                              sx={{
                                padding: 0,
                              }}
                            >
                              {customerData?.DeliveryChallans?.length > 0 ? (
                                <>
                                  <TableContainer>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          {[
                                            "Delivery Challan#",
                                            "Reference Number",
                                            "Date",
                                            "Amount",
                                            "Status",
                                          ].map((header) => (
                                            <TableCell
                                              key={header}
                                              sx={{
                                                fontSize: "0.9rem",
                                                fontWeight: "bold",
                                                textTransform: "uppercase",
                                                color: "#6C7184",
                                                backgroundColor: "#F9F9FB",
                                                borderBottom:
                                                  "1px solid #e6e6e6",
                                                padding: "10px 16px",
                                              }}
                                            >
                                              {header}
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {customerData?.DeliveryChallans?.map(
                                          (item) => (
                                            <TableRow
                                              key={item.id}
                                              onClick={() => {
                                                navigate(
                                                  "/SalesPage/DeliveryChallanDetailPage",
                                                  {
                                                    state: { item },
                                                  }
                                                );
                                              }}
                                              sx={{ cursor: "pointer" }}
                                            >
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {item.delivery_no}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {item.refernce || "-"}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {item.delivery_date}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color: "#444",
                                                }}
                                              >
                                                {/* Format the amount with currency symbol */}
                                                ₹
                                                {Number(
                                                  item.total
                                                ).toLocaleString("en-IN")}
                                              </TableCell>
                                              <TableCell
                                                sx={{
                                                  fontSize: "0.9rem",
                                                  color:
                                                    item.status_color || "#444",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                {item.status}
                                              </TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                  <Typography
                                    sx={{
                                      textAlign: "right",
                                      padding: "10px 16px",
                                      color: "#6C7184",
                                      //  backgroundColor: "#F5F5F5",
                                      borderBottom: "1px solid #e6e6e6",
                                      fontSize: "1rem",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    Total Count:{" "}
                                    {customerData?.DeliveryChallans?.length ||
                                      0}
                                  </Typography>
                                </>
                              ) : (
                                <Typography
                                  sx={{
                                    textAlign: "center",
                                    color: "#6C7184",
                                    padding: "20px",
                                  }}
                                >
                                  No Delivery Challan Available
                                </Typography>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      )}
                      {selectedTab === 1 && (
                        <>
                          {historyDetails.length > 0 ? (
                            <Grid
                              item
                              container
                              xs={12}
                              sx={{
                                width: "100%",
                                height: "auto",
                                minHeight: 810,
                                mt: 3,
                              }}
                            >
                              <TableContainer
                                sx={{
                                  width: "100%",
                                  maxHeight: 810,
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
                                minHeight: 810,
                                alignItems: "start",
                                display: "flex",
                                justifyContent: "center",
                                fontFamily: "Helvetica",
                                fontSize: "25px",
                                fontWeight: "bold",
                                pt: 10,
                              }}
                            >
                              No History Available
                            </Grid>
                          )}
                        </>
                      )}
                    </Box>
                    {/* </Grid> */}
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={12}
                  md={9}
                  sx={{
                    //p: 2,
                    width: "100%",
                    height: "100%",
                    minHeight: 870,
                  }}
                >
                  <Grid
                    item
                    container
                    xs={12}
                    sx={{
                      width: "100%",
                      height: "auto",
                      borderBottom: "1px solid #e6e6e6",
                      backgroundColor: "#f2f2f2",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={6}
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
                          fontSize: "1.4rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          alignItems: "center",
                        }}
                      >
                        Basic Info
                        {/* <InfoOutlinedIcon
                          sx={{
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
                        <button
                          aria-label="Close"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            border: "1px solid #e6e6e6",
                            backgroundColor: "#fff",
                            height: "30px",
                            width: "100px",
                            borderRadius: "5px",
                          }}
                          onClick={handleMoreInfoOpen}
                        >
                          More Info
                        </button>
                      </Grid>
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
                          onClick={handleEditOpen}
                        >
                          Edit
                        </button>
                      </Grid>
                      <Grid>
                        <Tooltip title="Close" arrow>
                          <button
                            onClick={() => {
                              handleCustomerClose();
                              handleMoreInfoClose();
                            }}
                            aria-label="Close"
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            ❌
                          </button>
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
                      maxHeight: 850,
                      //backgroundColor: "#000",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{
                        backgroundColor: "#f2f2f2",
                        borderTop: "1px solid #f2f2f2",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sx={{
                          width: "100%",
                          height: "auto",
                          fontSize: "1.3rem",
                          p: 2,
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {customerDetails ? customerDetails[0].company_name : ""}
                      </Grid>
                      <Grid
                        item
                        container
                        xs={12}
                        sx={{
                          width: "100%",
                          height: "auto",
                          display: "flex",
                          justifyContent: "flex-start",
                          // alignItems: "center",
                          pl: 2,
                          pt: 2,
                          gap: 2,
                        }}
                      >
                        <div>
                          <AccountCircleIcon
                            sx={{
                              color: "#408DFB",
                              width: "80px",
                              height: "auto",
                            }}
                          />
                        </div>
                        <div style={{ marginTop: 5 }}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "bold",
                              fontFamily: "Helvetica",
                              display: "flex",
                            }}
                          >
                            {customerDetails
                              ? customerDetails[0].salutation +
                                " " +
                                customerDetails[0].f_name +
                                " " +
                                customerDetails[0].l_name
                              : ""}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "17px",
                              fontFamily: "Helvetica",
                              fontWeight: 600,
                            }}
                          >
                            {customerDetails ? customerDetails[0].e_mail : ""}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "17px",
                              fontFamily: "Helvetica",
                              fontWeight: 600,
                              display: "flex",
                              gap: 1,
                            }}
                          >
                            <LocalPhoneIcon
                              sx={{ color: "gray", width: 20, height: 20 }}
                            />

                            {customerDetails ? customerDetails[0].phone : ""}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "17px",
                              fontFamily: "Helvetica",
                              fontWeight: 600,
                              display: "flex",
                              gap: 1,
                            }}
                          >
                            <PhoneAndroidIcon
                              sx={{ color: "gray", width: 20, height: 20 }}
                            />
                            {customerDetails ? customerDetails[0].mobile : ""}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          width: "100%",
                          height: "auto",
                          pl: 3,
                          mt: 3,
                        }}
                      >
                        <Accordion
                          expanded={expanded === "panel1"}
                          onChange={handleChange("panel1")}
                        >
                          <AccordionSummary
                            aria-controls="panel1d-content"
                            id="panel1d-header"
                          >
                            <Typography
                              sx={{
                                fontFamily: "Helvetica, Arial, sans-serif",
                                fontSize: "22px", // Slightly smaller for a clean header look
                                fontWeight: 600, // Semi-bold for prominence
                                color: "#333", // A more subtle dark color
                                letterSpacing: "0.5px", // Slight spacing for readability
                              }}
                            >
                              Address
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{
                              backgroundColor: "#f8f8f8",
                              padding: "16px",
                              minHeight: "380px",
                              maxHeight: "380px",
                              overflowY: "auto",
                              "&::-webkit-scrollbar": {
                                width: "8px", // Width of the scrollbar
                              },
                              "&::-webkit-scrollbar-track": {
                                background: "#f9f9fb", // Background of the scrollbar track
                                borderRadius: "8px",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                background: "gray", // Color of the scrollbar thumb
                                borderRadius: "8px",
                              },
                              "&::-webkit-scrollbar-thumb:hover": {
                                background: "gray", // Darker shade when hovering
                              },
                            }}
                          >
                            <Grid container spacing={1}>
                              {/* Billing Address Header */}
                              <Grid item xs={12}>
                                <Typography
                                  sx={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    color: "#408DFB", // Distinct green color for section titles
                                    fontFamily: "Helvetica, Arial, sans-serif",
                                    display: "flex",
                                    gap: 1,
                                  }}
                                >
                                  Billing Address{" "}
                                  <Icon
                                    icon="lets-icons:edit-light"
                                    width="1.4rem"
                                    height="1.4rem"
                                    style={{
                                      cursor: "pointer",
                                      marginTop: 2.5,
                                    }}
                                    ref={billingButtonRef}
                                    onClick={() => {
                                      handleButtonBillingClick();
                                    }}
                                  />
                                </Typography>
                              </Grid>

                              {/* Billing Address Details */}
                              <Grid item xs={12}>
                                <Typography sx={addressDetailStyle}>
                                  {customerDetails
                                    ? `${customerDetails[0].b_address.add1}, ${customerDetails[0].b_address.add2}`
                                    : ""}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography sx={addressDetailStyle}>
                                  {customerDetails
                                    ? `${customerDetails[0].b_address.city},`
                                    : ""}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography sx={addressDetailStyle}>
                                  {customerDetails
                                    ? `${customerDetails[0].b_address.state} - ${customerDetails[0].b_address.zip}.`
                                    : ""}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography sx={addressDetailStyle}>
                                  {customerDetails
                                    ? `Phone No: ${customerDetails[0].b_address.phn}`
                                    : ""}
                                </Typography>
                              </Grid>

                              {/* Shipping Address Header */}
                              <Grid item xs={12}>
                                <Typography
                                  sx={{
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    color: "#408DFB",
                                    fontFamily: "Helvetica, Arial, sans-serif",
                                    paddingTop: "16px", // Spacing between sections
                                    display: "flex",
                                    gap: 1,
                                  }}
                                >
                                  Shipping Address
                                  <Icon
                                    icon="lets-icons:edit-light"
                                    width="1.4rem"
                                    height="1.4rem"
                                    style={{
                                      cursor: "pointer",
                                      marginTop: 2.5,
                                    }}
                                    ref={shippingButtonRef}
                                    onClick={() => {
                                      handleButtonShippingClick();
                                    }}
                                  />
                                </Typography>
                              </Grid>

                              {/* Shipping Address Details */}
                              <Grid item xs={12}>
                                <Typography sx={addressDetailStyle}>
                                  {customerDetails
                                    ? `${customerDetails[0].s_address.add1}, ${customerDetails[0].s_address.add2}`
                                    : ""}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography sx={addressDetailStyle}>
                                  {customerDetails
                                    ? `${customerDetails[0].s_address.city},`
                                    : ""}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography sx={addressDetailStyle}>
                                  {customerDetails
                                    ? `${customerDetails[0].s_address.state} - ${customerDetails[0].s_address.zip}.`
                                    : ""}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography sx={addressDetailStyle}>
                                  {customerDetails
                                    ? `Phone No: ${customerDetails[0].s_address.phn}`
                                    : ""}
                                </Typography>
                              </Grid>

                              {/* Additional Address Header */}
                              {additionalAddress.length > 0 ? (
                                <Grid item xs={12}>
                                  <Typography
                                    sx={{
                                      fontSize: "20px",
                                      fontWeight: "bold",
                                      color: "#408DFB",
                                      fontFamily:
                                        "Helvetica, Arial, sans-serif",
                                      paddingTop: "16px",
                                    }}
                                  >
                                    Additional Address
                                  </Typography>
                                </Grid>
                              ) : (
                                ""
                              )}
                              {additionalAddress &&
                                additionalAddress.map((item, index) => (
                                  <>
                                    <Grid item xs={12}>
                                      <Typography
                                        sx={{
                                          fontSize: "16px",
                                          fontWeight: "bold",
                                          color: "#408DFB",
                                          fontFamily:
                                            "Helvetica, Arial, sans-serif",
                                          paddingTop: "4px",
                                          display: "flex",
                                          gap: 1,
                                        }}
                                      >
                                        {item.address_type}
                                        <Icon
                                          icon="lets-icons:edit-light"
                                          width="1.4rem"
                                          height="1.4rem"
                                          style={{
                                            cursor: "pointer",
                                            marginTop: 1,
                                          }}
                                          onClick={() => {
                                            handleButtonAdditionalClick(item);
                                          }}
                                        />
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Typography sx={addressDetailStyle}>
                                        {item.address_details.add1 +
                                          ", " +
                                          item.address_details.add2}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Typography sx={addressDetailStyle}>
                                        {item.address_details.city},
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Typography sx={addressDetailStyle}>
                                        {item.address_details.state +
                                          " - " +
                                          item.address_details.zip}
                                        ,
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Typography sx={addressDetailStyle}>
                                        {"Phone No: " +
                                          item.address_details.phn}
                                        ,
                                      </Typography>
                                    </Grid>
                                  </>
                                ))}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>

                        <Accordion
                          expanded={expanded === "panel2"}
                          onChange={handleChange("panel2")}
                        >
                          <AccordionSummary
                            aria-controls="panel2d-content"
                            id="panel2d-header"
                          >
                            <Typography
                              sx={{
                                fontFamily: "Helvetica, Arial, sans-serif",
                                fontSize: "22px", // Slightly smaller for a clean header look
                                fontWeight: 600, // Semi-bold for prominence
                                color: "#333", // A more subtle dark color
                                letterSpacing: "0.5px", // Slight spacing for readability
                              }}
                            >
                              Contact Person
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{
                              backgroundColor: "#f8f8f8",
                              padding: "10px",
                              minHeight: "100px",
                              maxHeight: "360px",
                              overflowY: "auto",
                              "&::-webkit-scrollbar": {
                                width: "8px", // Width of the scrollbar
                              },
                              "&::-webkit-scrollbar-track": {
                                background: "#f9f9fb", // Background of the scrollbar track
                                borderRadius: "8px",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                background: "gray", // Color of the scrollbar thumb
                                borderRadius: "8px",
                              },
                              "&::-webkit-scrollbar-thumb:hover": {
                                background: "#fff", // Darker shade when hovering
                              },
                            }}
                          >
                            {contactPerson &&
                              contactPerson.map((item, index) => (
                                <Grid
                                  container
                                  key={index}
                                  sx={{
                                    width: "100%",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    alignItems: "center",
                                  }}
                                >
                                  {/* Icon Section */}
                                  <Grid item sx={{ marginRight: "13px" }}>
                                    <Avatar
                                      sx={{
                                        color: "#fff",
                                        width: "50px",
                                        height: "50px",
                                        backgroundColor: "#BDBDBD",
                                        padding: "6px",
                                      }}
                                    />
                                  </Grid>

                                  {/* Details Section */}
                                  <Grid item xs>
                                    <Typography
                                      sx={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        fontFamily: "Helvetica, Arial",
                                        color: "#333",
                                      }}
                                    >
                                      {item.ct_sal +
                                        " " +
                                        item.ct_fname +
                                        " " +
                                        item.ct_lname}
                                    </Typography>

                                    <Typography
                                      sx={{
                                        fontSize: "16px",
                                        fontFamily: "Helvetica, Arial",
                                        color: "#555",
                                        marginBottom: "8px",
                                        mt: 0.5,
                                      }}
                                    >
                                      {item.ct_email}
                                    </Typography>

                                    <Grid container spacing={1}>
                                      <Grid
                                        item
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <LocalPhoneIcon
                                          sx={{
                                            color: "#888",
                                            width: 20,
                                            height: 20,
                                          }}
                                        />
                                        <Typography
                                          sx={{
                                            marginLeft: "8px",
                                            fontSize: "16px",
                                            fontFamily: "Helvetica, Arial",
                                            color: "#333",
                                          }}
                                        >
                                          {item.ct_wkphn}
                                        </Typography>
                                      </Grid>

                                      <Grid
                                        item
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <PhoneAndroidIcon
                                          sx={{
                                            color: "#888",
                                            width: 20,
                                            height: 20,
                                          }}
                                        />
                                        <Typography
                                          sx={{
                                            marginLeft: "8px",
                                            fontSize: "16px",
                                            fontFamily: "Helvetica, Arial",
                                            color: "#333",
                                          }}
                                        >
                                          {item.ct_mob}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              ))}
                          </AccordionDetails>
                        </Accordion>
                        <Accordion
                          expanded={expanded === "panel3"}
                          onChange={handleChange("panel3")}
                        >
                          <AccordionSummary
                            aria-controls="panel2d-content"
                            id="panel2d-header"
                          >
                            <Typography
                              sx={{
                                fontFamily: "Helvetica, Arial, sans-serif",
                                fontSize: "22px", // Slightly smaller for a clean header look
                                fontWeight: 600, // Semi-bold for prominence
                                color: "#333", // A more subtle dark color
                                letterSpacing: "0.5px", // Slight spacing for readability
                              }}
                            >
                              Other Details
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails
                            sx={{
                              backgroundColor: "#f8f8f8",
                              padding: "10px",
                              minHeight: "100px",
                              maxHeight: "360px",
                              overflowY: "auto",
                              "&::-webkit-scrollbar": {
                                width: "8px", // Width of the scrollbar
                              },
                              "&::-webkit-scrollbar-track": {
                                background: "#f9f9fb", // Background of the scrollbar track
                                borderRadius: "8px",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                background: "gray", // Color of the scrollbar thumb
                                borderRadius: "8px",
                              },
                              "&::-webkit-scrollbar-thumb:hover": {
                                background: "#fff", // Darker shade when hovering
                              },
                            }}
                          >
                            <Grid
                              container
                              item
                              xs={12}
                              sx={{
                                width: "100%",
                                height: "auto",
                                pl: 2,
                                mt: 1,
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  fontWeight: "bold",
                                }}
                              >
                                Customer Type
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  //fontWeight: "bold",
                                  color: "#666666",
                                }}
                              >
                                {customerDetails
                                  ? customerDetails[0].mem_type
                                  : ""}
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              item
                              xs={12}
                              sx={{
                                width: "100%",
                                height: "auto",
                                pl: 2,
                                mt: 2,
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  fontWeight: "bold",
                                }}
                              >
                                Default Currency
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  //fontWeight: "bold",
                                  color: "#666666",
                                }}
                              >
                                INR
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              item
                              xs={12}
                              sx={{
                                width: "100%",
                                height: "auto",
                                pl: 2,
                                mt: 2,
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  fontWeight: "bold",
                                }}
                              >
                                Payment Terms
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  //fontWeight: "bold",
                                  color: "#666666",
                                }}
                              >
                                {customerDetails
                                  ? customerDetails[0].term_name
                                  : ""}
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              item
                              xs={12}
                              sx={{
                                width: "100%",
                                height: "auto",
                                pl: 2,
                                mt: 2,
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  fontWeight: "bold",
                                }}
                              >
                                Business Legal Name
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  //fontWeight: "bold",
                                  color: "#666666",
                                }}
                              >
                                {customerDetails
                                  ? customerDetails[0].company_name
                                  : ""}
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              item
                              xs={12}
                              sx={{
                                width: "100%",
                                height: "auto",
                                pl: 2,
                                mt: 2,
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  fontWeight: "bold",
                                }}
                              >
                                GST Treatment
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  //fontWeight: "bold",
                                  color: "#666666",
                                }}
                              >
                                {customerDetails
                                  ? customerDetails[0].gst_treatment
                                  : ""}
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              item
                              xs={12}
                              sx={{
                                width: "100%",
                                height: "auto",
                                pl: 2,
                                mt: 2,
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  fontWeight: "bold",
                                }}
                              >
                                GSTIN
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  //fontWeight: "bold",
                                  color: "#666666",
                                }}
                              >
                                {customerDetails
                                  ? customerDetails[0].gst_no
                                  : ""}
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              item
                              xs={12}
                              sx={{
                                width: "100%",
                                height: "auto",
                                pl: 2,
                                mt: 2,
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  fontWeight: "bold",
                                }}
                              >
                                Place Of Supply
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  //fontWeight: "bold",
                                  color: "#666666",
                                }}
                              >
                                {customerDetails
                                  ? customerDetails[0].plc_supply
                                  : ""}
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              item
                              xs={12}
                              sx={{
                                width: "100%",
                                height: "auto",
                                pl: 2,
                                mt: 2,
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  fontWeight: "bold",
                                }}
                              >
                                PAN NO
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  //fontWeight: "bold",
                                  color: "#666666",
                                }}
                              >
                                {customerDetails ? customerDetails[0].pan : ""}
                              </Grid>
                            </Grid>
                            <Grid
                              container
                              item
                              xs={12}
                              sx={{
                                width: "100%",
                                height: "auto",
                                pl: 2,
                                mt: 2,
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  fontWeight: "bold",
                                }}
                              >
                                Tax Preference
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={6}
                                sx={{
                                  width: "100%",
                                  height: "auto",
                                  fontSize: "20px",
                                  fontFamily: "Helvetica",
                                  //fontWeight: "bold",
                                  color: "#666666",
                                }}
                              >
                                {customerDetails
                                  ? customerDetails[0].tax_pre
                                  : ""}
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      sx={{
                        backgroundColor: "#f2f2f2",
                        borderTop: "1px solid #f2f2f2",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sx={{
                          width: "100%",
                          height: "auto",
                          fontSize: "1.3rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          pt: 2,
                          textTransform: "uppercase",
                        }}
                      >
                        Payment due period
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          width: editPaymentTerm === false ? "35%" : "40%",
                          minHeight: "40px",
                          height: "auto",
                          fontSize: "1.2rem",
                          fontFamily: "Helvetica",
                          mt: 2,
                          backgroundColor: editPaymentTerm === false ? "" : "",
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          pl: editPaymentTerm === false ? 1 : "",
                          position: "relative",
                          "&:hover": {
                            backgroundColor:
                              editPaymentTerm === false ? "#fff" : "", // change background color on hover
                            color: "#408DFB",
                          },
                        }}
                      >
                        {editPaymentTerm === false ? (
                          <>
                            {" "}
                            {customerDetails
                              ? customerDetails[0].term_name
                              : ""}
                            <Icon
                              icon="lets-icons:edit-light"
                              width="1.4rem"
                              height="1.4rem"
                              style={{
                                position: "absolute",
                                top: "25%",
                                right: "2%",
                                transition: "opacity 0.3s ease", // smooth transition for visibility
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                handlePaymentOpen();
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <Autocomplete
                              disablePortal
                              options={
                                termsList &&
                                termsList.map((term) => ({
                                  name: term.term_name,
                                  no_days: term.no_days,
                                  id: term.id,
                                }))
                              }
                              value={selectedTerm}
                              onChange={(e, val) => {
                                setSelectedTerm(val);
                                // handleSetTerms(val.no_days);
                              }}
                              getOptionLabel={(option) => option.name}
                              sx={{
                                width: "62%",
                                "& + .MuiAutocomplete-popper .MuiAutocomplete-option:hover":
                                  {
                                    backgroundColor: "#cccccc",
                                  },
                              }}
                              ListboxProps={{
                                sx: { fontSize: "1.2rem" },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  autoComplete="off"
                                  placeholder="Due on Receipt"
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
                                      fontFamily: "Helvetica",
                                      height: 10,
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
                            <Box
                              sx={{
                                display: "flex",
                                position: "absolute",
                                right: "0px",
                              }}
                            >
                              {/* Tick button */}
                              <IconButton
                                color="success"
                                onClick={() => {
                                  handleSavePaymentTerm();
                                }} // Add your save logic here
                                sx={{
                                  backgroundColor: "#4CAF50", // Tick button color (green)
                                  color: "#fff",
                                  borderRadius: 1,
                                  "&:hover": {
                                    backgroundColor: "#43A047",
                                  },
                                  marginRight: "8px",
                                }}
                              >
                                <Icon
                                  icon="mdi:check"
                                  width="1.2rem"
                                  height="1.2rem"
                                />
                              </IconButton>
                              {/* Cross button */}
                              <IconButton
                                color="error"
                                onClick={() => {
                                  handlePaymentClose();
                                }} // Add your cancel logic here
                                sx={{
                                  backgroundColor: "#F44336", // Cross button color (red)
                                  color: "#fff",
                                  borderRadius: 1,
                                  "&:hover": {
                                    backgroundColor: "#E53935",
                                  },
                                }}
                              >
                                <Icon
                                  icon="mdi:close"
                                  width="1.2rem"
                                  height="1.2rem"
                                />
                              </IconButton>
                            </Box>
                          </>
                        )}
                      </Grid>

                      <Divider sx={{ mt: 4 }} />
                      <Grid
                        item
                        xs={12}
                        sx={{
                          width: "100%",
                          height: "auto",
                          fontSize: "1.3rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          pt: 2,
                          textTransform: "uppercase",
                        }}
                      >
                        Receivables
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          width: "100%",
                          height: "auto",
                          fontSize: "1.3rem",
                          fontFamily: "Helvetica",
                          fontWeight: "bold",
                          p: 2,
                          textTransform: "uppercase",
                        }}
                      >
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  sx={{
                                    fontSize: "1rem",
                                    fontFamily: "Helvetica",
                                    textTransform: "uppercase",
                                    padding: "10px 16px",
                                    color: "#6C7184",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    backgroundColor: "#fff", // Soft background for headers
                                  }}
                                >
                                  Currency
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontSize: "1rem",
                                    fontFamily: "Helvetica",
                                    textTransform: "uppercase",
                                    padding: "10px 16px",
                                    color: "#6C7184",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    backgroundColor: "#fff", // Soft background for headers
                                  }}
                                >
                                  Outstanding receivables
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    fontSize: "1rem",
                                    fontFamily: "Helvetica",
                                    textTransform: "uppercase",
                                    padding: "10px 16px",
                                    color: "#6C7184",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    backgroundColor: "#fff", // Soft background for headers
                                  }}
                                >
                                  Unused credits
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell
                                  sx={{
                                    padding: "10px 16px",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    fontSize: "1rem", // Adjusted size
                                    fontWeight: 500, // Added weight for emphasisss
                                    textTransform: "none",
                                  }}
                                >
                                  INR - Indian Rupee
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    padding: "10px 16px",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    fontSize: "1rem", // Adjusted size
                                    fontWeight: 500, // Added weight for emphasis
                                    color: "#408DFB",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleOutReceiveOpen(
                                      customerDetails
                                        ? customerDetails[0].receive_id
                                        : ""
                                    )
                                  }
                                >
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(
                                    customerDetails
                                      ? customerDetails[0].out_receive
                                      : ""
                                  ).toLocaleString("en-IN")}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{
                                    padding: "10px 16px",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    fontSize: "1rem", // Adjusted size
                                    fontWeight: 500, // Added weight for emphasis
                                    color: "#408DFB",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    handleUnsedCreditsOpen();
                                  }}
                                >
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(
                                    customerDetails
                                      ? customerDetails[0].unused_credits
                                      : ""
                                  ).toLocaleString("en-IN")}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid
                          container
                          alignItems="center"
                          sx={{
                            padding: "16px",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* Heading on the left */}
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: "1.3rem",
                              textTransform: "uppercase",
                            }}
                          >
                            History
                          </Typography>

                          {/* Filter by Date Range on the right */}
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <IconButton onClick={handleClick}>
                              <CalendarTodayIcon />
                            </IconButton>
                            <Typography
                              onClick={handleClick}
                              sx={{ cursor: "pointer", fontWeight: "bold" }}
                            >
                              Filter by Date Range
                            </Typography>
                          </Stack>

                          {/* Popover for Date Range Picker */}
                          <Popover
                            id={id1}
                            open={openAnchor}
                            anchorEl={anchorEl}
                            onClose={handleCloseAnchor}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "right",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            sx={{
                              mt: 2,
                              "& .MuiPaper-root": {
                                padding: "20px",
                                maxWidth: "450px", // Adjusted width for better alignment
                                borderRadius: "8px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                              },
                              "&::before": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 24,
                                width: 0,
                                height: 0,
                                borderLeft: "8px solid transparent",
                                borderRight: "8px solid transparent",
                                borderBottom: "8px solid white",
                                transform: "translateY(-50%)",
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold", mb: 1 }}
                            >
                              Date Range
                            </Typography>
                            <Stack direction="row" spacing={2} mb={2}>
                              <DatePicker
                                slotProps={{
                                  textField: {
                                    sx: {
                                      "& .MuiSvgIcon-root": {
                                        width: "1em",
                                        height: "1em",
                                      },
                                    },
                                    InputProps: {
                                      sx: {
                                        height: 30,
                                        fontSize: "1rem",
                                        fontFamily: "Times New Roman",
                                        // fontWeight: "bold",
                                        "& .MuiPickersYear-yearButton": {
                                          fontSize: "1rem",
                                        },
                                      },
                                    },
                                  },
                                }}
                                value={fromDate}
                                openTo="day"
                                views={["year", "month", "day"]}
                                onChange={(newValue) => setFromDate(newValue)}
                              />
                              <Grid pt={0.5}> To </Grid>
                              <DatePicker
                                slotProps={{
                                  textField: {
                                    sx: {
                                      "& .MuiSvgIcon-root": {
                                        width: "1em",
                                        height: "1em",
                                      },
                                    },
                                    InputProps: {
                                      sx: {
                                        height: 30,
                                        fontSize: "1rem",
                                        fontFamily: "Times New Roman",
                                        // fontWeight: "bold",
                                        "& .MuiPickersYear-yearButton": {
                                          fontSize: "1rem",
                                        },
                                      },
                                    },
                                  },
                                }}
                                value={toDate}
                                openTo="day"
                                views={["year", "month", "day"]}
                                onChange={(newValue) => setToDate(newValue)}
                              />
                            </Stack>
                            {/* <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mb: 2 }}
                        >
                          Note: If you've entered a Payment amount for any
                          unpaid invoices, they will still be shown at the top.
                        </Typography> */}
                            <Grid
                              item
                              xs={12}
                              container
                              sx={{
                                width: "100%",
                                height: "auto",
                                minHeight: 50,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Grid
                                item
                                xs={12}
                                md={7}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  alignContent: "center",
                                }}
                                gap={2}
                              >
                                <Grid>
                                  <Button
                                    sx={{
                                      backgroundColor: "#22B378",
                                      color: "#fff",
                                      "&:hover": {
                                        backgroundColor: "#25c182",
                                      },
                                    }}
                                  >
                                    Apply Filter
                                  </Button>
                                </Grid>
                                <Grid>
                                  <Button
                                    sx={{
                                      backgroundColor: "#fff",
                                      color: "black",
                                      border: "1px solid #e6e6e6",
                                      "&:hover": {
                                        backgroundColor: "#fff",
                                      },
                                    }}
                                    onClick={() => {}}
                                  >
                                    Cancel
                                  </Button>
                                </Grid>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                md={5}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Grid>
                                  <Button
                                    sx={{
                                      backgroundColor: "#fff",
                                      color: "#408DFB",
                                      "&:hover": {
                                        backgroundColor: "#fff",
                                      },
                                    }}
                                    onClick={() => {}}
                                  >
                                    Clear Selection
                                  </Button>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Popover>
                        </Grid>
                      </LocalizationProvider>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          width: "100%",
                          minHeight: "465px",
                          maxHeight: "465px",
                          overflowY: "auto",
                          "&::-webkit-scrollbar": {
                            width: "8px", // Width of the scrollbar
                          },
                          "&::-webkit-scrollbar-track": {
                            background: "#f9f9fb", // Background of the scrollbar track
                            borderRadius: "8px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "gray", // Color of the scrollbar thumb
                            borderRadius: "8px",
                          },
                          "&::-webkit-scrollbar-thumb:hover": {
                            background: "#fff", // Darker shade when hovering
                          },
                        }}
                      >
                        <Timeline>
                          {timelineData.map((item, index) => (
                            <TimelineItem key={index}>
                              {/* Left Side: Date and Time */}
                              <TimelineOppositeContent
                                sx={{
                                  flex: 0.3,
                                  textAlign: "right",
                                  pr: 2,
                                  textWrap: "nowrap",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                >
                                  {item.date}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="textSecondary"
                                  display="block"
                                >
                                  {item.time}
                                </Typography>
                              </TimelineOppositeContent>

                              {/* Right Side: Icon and Event Details */}
                              <TimelineSeparator>
                                <div
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "50%", // Change to 50% for a circle
                                    backgroundColor: "#fff",
                                  }}
                                >
                                  <Icon
                                    icon="eva:message-circle-outline"
                                    style={{
                                      color: "#408DFB",
                                      width: "30px",
                                      height: "auto",
                                    }}
                                  />
                                </div>
                                {index < timelineData.length - 1 && (
                                  <TimelineConnector
                                    sx={{ bgcolor: "#408DFB" }}
                                  />
                                )}
                              </TimelineSeparator>

                              <TimelineContent sx={{ flex: 3 }}>
                                <Box
                                  p={2}
                                  border={1}
                                  borderColor="grey.300"
                                  borderRadius={2}
                                  sx={{ bgcolor: "#fff" }}
                                >
                                  <Typography variant="body1" fontWeight="bold">
                                    {item.head}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={{ mt: 2 }}
                                  >
                                    {item.comment_text}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="primary"
                                    sx={{ mt: 0.5, display: "flex", gap: 0.5 }}
                                  >
                                    by {item.created_by}
                                    {item.comment_type === "deleted" ||
                                    item.id === "" ||
                                    item.payment_id === "" ||
                                    item.credit_note_id === ""
                                      ? " "
                                      : " - "}
                                    {item.comment_type === "deleted" ||
                                    item.id === "" ||
                                    item.payment_id === "" ||
                                    item.credit_note_id === "" ? (
                                      " "
                                    ) : (
                                      <Typography
                                        variant="caption"
                                        color="primary"
                                        sx={{
                                          color: "#408DFB",
                                          textDecoration: "underline",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          if (item.route_type === "2") {
                                            navigate(
                                              "/SalesPage/QuoteDetailPage",
                                              {
                                                state: { item },
                                              }
                                            );
                                          } else if (item.route_type === "3") {
                                            navigate(
                                              "/SalesPage/SalesDetailPage",
                                              {
                                                state: { item },
                                              }
                                            );
                                          } else if (item.route_type === "5") {
                                            navigate(
                                              "/SalesPage/InvoiceDetailsPage",
                                              {
                                                state: { item },
                                              }
                                            );
                                          } else if (item.route_type === "4") {
                                            navigate(
                                              "/SalesPage/DeliveryChallanDetailPage",
                                              {
                                                state: { item },
                                              }
                                            );
                                          } else if (item.route_type === "6") {
                                            navigate(
                                              "/SalesPage/CreditNoteDetailPage",
                                              {
                                                state: { item },
                                              }
                                            );
                                          } else if (item.route_type === "7") {
                                            navigate(
                                              "/SalesPage/PaymentDetailPage",
                                              {
                                                state: { item },
                                              }
                                            );
                                          }
                                        }}
                                      >
                                        View Details
                                      </Typography>
                                    )}
                                  </Typography>
                                </Box>
                              </TimelineContent>
                            </TimelineItem>
                          ))}
                        </Timeline>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </Modal>
      <Grid>
        <Helmet>
          <title>Customer</title>
        </Helmet>
        {loading === true ? (
          <LoadingOverlay />
        ) : (
          <Sidebar onLogout={onLogout}>
            <Grid>
              {customerTrue === false ? (
                <Grid
                  item
                  container
                  xs={12}
                  sx={{
                    width: "100%",
                    height: "100%",
                    minHeight: 905,
                    mt: 4.5,
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      width: "100%",
                      height: "100%",
                      minHeight: 905,
                      backgroundColor: "#fff",
                    }}
                  >
                    <Grid
                      item
                      container
                      xs={12}
                      sx={{
                        width: "100%",
                        height: "100%",
                        minHeight: 70,
                        borderBottom: "0.5px solid #e6e6e6",
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
                            fontSize: "1.5rem",
                            fontFamily: "Helvetica",
                            fontWeight: "bold",
                            alignItems: "center",
                          }}
                        >
                          All Customers
                          {/* <ExpandMoreRounded
                            sx={{
                              width: 40,
                              height: 40,
                              color: "#408DFB",
                              // mt: 1,
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
                        <Grid>
                          <Tooltip title="Create Customer" arrow>
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
                              onClick={handleOpen}
                            >
                              new
                            </Button>
                          </Tooltip>
                        </Grid>
                        {/* <Grid>
                          <IconButton
                            aria-label="menu"
                            sx={{ border: "1px solid black" }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Grid> */}
                      </Grid>
                    </Grid>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
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
                                      "aria-label": "select all Customer",
                                    }}
                                    size="medium"
                                  />
                                }
                              />
                            </TableCell>
                            <TableCell
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
                              Name
                            </TableCell>
                            <TableCell
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
                              Company Name
                            </TableCell>
                            <TableCell
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
                              E-Mail
                            </TableCell>
                            <TableCell
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
                              Phone
                            </TableCell>
                            <TableCell
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
                              Gst Treatment
                            </TableCell>
                            <TableCell
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
                              Place Of Supply
                            </TableCell>
                            <TableCell
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
                              Receivables
                            </TableCell>
                            <TableCell
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
                              GST Registration Number
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {CustomerTable &&
                            CustomerTable.map((item, index) => (
                              <TableRow
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: "#f0f4ff", // Highlight row on hover
                                  },
                                }}
                                key={index}
                              >
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
                                    handleCustomerClick(item.id);
                                  }}
                                >
                                  {item.company_name}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "10px 16px",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    fontSize: "1.1rem", // Adjusted size
                                    fontWeight: 500, // Added weight for emphasis
                                  }}
                                  onClick={() => {
                                    handleCustomerClick(item.id);
                                  }}
                                >
                                  {item.display_name}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "10px 16px",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    fontSize: "1.1rem", // Adjusted size
                                    fontWeight: 500, // Added weight for emphasis
                                  }}
                                  onClick={() => {
                                    handleCustomerClick(item.id);
                                  }}
                                >
                                  {item.e_mail}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "10px 16px",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    fontSize: "1.1rem", // Adjusted size
                                    fontWeight: 500, // Added weight for emphasis
                                  }}
                                  onClick={() => {
                                    handleCustomerClick(item.id);
                                  }}
                                >
                                  {item.phone}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "10px 16px",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    fontSize: "1.1rem", // Adjusted size
                                    fontWeight: 500, // Added weight for emphasis
                                  }}
                                  onClick={() => {
                                    handleCustomerClick(item.id);
                                  }}
                                >
                                  {item.gst_treatment}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "10px 16px",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    fontSize: "1.1rem", // Adjusted size
                                    fontWeight: 500, // Added weight for emphasis
                                  }}
                                  onClick={() => {
                                    handleCustomerClick(item.id);
                                  }}
                                >
                                  {item.plc_supply}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "10px 16px",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    fontSize: "1.1rem", // Adjusted size
                                    fontWeight: 500, // Added weight for emphasis
                                  }}
                                  onClick={() => {
                                    handleCustomerClick(item.id);
                                  }}
                                >
                                  {/* Format the amount with currency symbol */}
                                  ₹
                                  {Number(item.out_receive).toLocaleString(
                                    "en-IN"
                                  )}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: "10px 16px",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    fontSize: "1.1rem", // Adjusted size
                                    fontWeight: 500, // Added weight for emphasis
                                  }}
                                  onClick={() => {
                                    handleCustomerClick(item.id);
                                  }}
                                >
                                  {item.gst_no}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                      {!CustomerTable.length && (
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
                            Currently, no customers are available. Select
                            'Create New' to add a new one.
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
                                <AddIcon
                                  sx={{ width: "30px", height: "30px" }}
                                />
                              }
                              onClick={handleOpen}
                            >
                              Create New
                            </Button>
                          </Tooltip>
                        </Box>
                      )}
                    </TableContainer>
                  </Paper>
                </Grid>
              ) : (
                <Grid
                  item
                  container
                  xs={12}
                  sx={{
                    mt: 2,
                    //p: 2,
                    width: "100%",
                    height: "100%",
                    maxHeight: 890,
                    border: "1px solid black",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={3}
                    sx={{
                      mt: 2,
                      //p: 2,
                      width: "100%",
                      height: "100%",
                      minHeight: 870,
                      borderRight: "2px solid #eee",
                    }}
                  >
                    <Grid
                      item
                      container
                      xs={12}
                      sx={{
                        width: "100%",
                        height: "100%",
                        minHeight: 70,
                        borderBottom: "1px solid #e6e6e6",
                        backgroundColor: "#f2f2f2",
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
                            fontSize: "1.4rem",
                            fontFamily: "Helvetica",
                            fontWeight: "bold",
                            alignItems: "center",
                          }}
                        >
                          All Customers
                          <ExpandMoreRounded
                            sx={{
                              width: 40,
                              height: 40,
                              color: "#408DFB",
                              cursor: "pointer",
                            }}
                          />
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
                          <Tooltip title="Create Item" arrow>
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
                              onClick={handleOpen}
                            >
                              new
                            </Button>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                    <TableContainer
                      sx={{
                        width: "100%",
                        maxHeight: 800,
                      }}
                    >
                      <Table stickyHeader>
                        <TableBody>
                          {CustomerTable &&
                            CustomerTable.map((item, index) => (
                              <TableRow
                                sx={{ cursor: "pointer" }}
                                key={index}
                                onClick={() => {
                                  handleCustomerClick(item.id);
                                }}
                              >
                                <TableCell
                                  sx={{
                                    fontSize: "1.2rem",
                                    fontFamily: "Helvetica",
                                    // fontWeight: "bold",
                                    textTransform: "uppercase",
                                    p: 1,
                                    color: "#6C7184",
                                    borderBottom: "0.5px solid #e6e6e6",
                                    pl: 2,
                                  }}
                                >
                                  {item.salutation +
                                    item.f_name +
                                    " " +
                                    item.l_name}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={9}
                    sx={{
                      mt: 2,
                      //p: 2,
                      width: "100%",
                      height: "100%",
                      minHeight: 870,
                    }}
                  >
                    <Grid
                      item
                      container
                      xs={12}
                      sx={{
                        width: "100%",
                        height: "100%",
                        minHeight: 70,
                        borderBottom: "1px solid #e6e6e6",
                        backgroundColor: "#f2f2f2",
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
                            fontSize: "1.4rem",
                            fontFamily: "Helvetica",
                            fontWeight: "bold",
                            alignItems: "center",
                          }}
                        >
                          Basic Info
                          <InfoOutlinedIcon
                            sx={{
                              color: "#408DFB",
                              cursor: "pointer",
                            }}
                          />
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
                            <CloseIcon
                              onClick={() => {
                                setCustomerTrue(false);
                              }}
                            />
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Sidebar>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default CustomerMaster;
