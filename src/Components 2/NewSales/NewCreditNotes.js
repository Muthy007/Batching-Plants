import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Select,
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
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Country, State } from "country-state-city";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import ModalEditableSeries from "../../UsableContent/ModalEditableSeries";
import ModalManageTds from "../../UsableContent/ModalManageTds";
import ModalManageTcs from "../../UsableContent/ModalManageTcs";
import { useNavigate } from "react-router";
import ModalNetMaster from "../../UsableContent/ModalNetMaster";
import { Helmet } from "react-helmet";
import Sidebar from "../../Navbars/Sidebar";
import { styled as muiStyled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles"; // Import makeStyles from @mui/styles
import SuiSnackbar from "../../Snackbars/SuiSnackbar";

const useStyles = makeStyles((theme) => ({
  disabledGrid: {
    opacity: 0.5, // You can adjust the opacity value to control transparency
    pointerEvents: "none", // Disables pointer events on the grid
  },
}));

const styles = {
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550,
    maxHeight: "90vh", // Set max height to 90% of the viewport height
    overflowY: "auto", // Enable vertical scrolling when content exceeds height
    bgcolor: "background.paper",
    borderRadius: 0,
    boxShadow: 24,
    p: 4,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  },
  fieldGroup: {
    mt: 2,
  },
};

const StyledModal = muiStyled(Box)(({ theme }) => ({
  position: "absolute",
  backgroundColor: "white",
  padding: theme.spacing(2),
  borderRadius: "8px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  width: "400px",
  zIndex: 1300,
  maxHeight: "400px", // Limit height for scrolling
  overflowY: "auto", // Enable scrolling when necessary

  "&::-webkit-scrollbar": {
    width: "1px", // Width of the scrollbar
  },
  "&::-webkit-scrollbar-track": {
    background: "#f9f9fb", // Background of the scrollbar track
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#F9F9FB", // Color of the scrollbar thumb
    borderRadius: "8px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#fff", // Darker shade when hovering
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}));

const style = {
  position: "absolute",
  top: "29%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  height: 550,
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
};

const style1 = {
  position: "absolute",
  top: "21%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "25%",
  height: 260,
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
};

const style2 = {
  position: "absolute",
  top: "42%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "33%",
  height: 820,
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderBottomRightRadius: "10px",
  borderBottomLeftRadius: "10px",
};

const Reasons = [
  "Sales Return",
  "Post Sale Discount",
  "Deficiency in Service",
  "Correction in Invoice",
  "Change in POS",
  "Finalization of Provisional Assesment",
  "Others",
];

const NewCreditNotes = ({ onLogout }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const data = localStorage.getItem("data");
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState("");
  const [selectedReason, setSelectedReason] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [contactPerson, setContactPerson] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState([]);
  const [selectedPlaceOfSupply, setSelectedPlaceOfSupply] = useState(null);
  const [reference, setReference] = useState("");
  const [configureOpen, setConfigureOpen] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [from, setFrom] = useState(dayjs());
  const [salesId, setSalesId] = useState("");
  const [salesList, setSalesList] = useState([]);
  const [searchSales, setSearchSales] = useState("");
  const [selectedSales, setSelectedSales] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [salesOpen, setSalesOpen] = useState(false);
  const [searchSalesConfig, setSearchSalesConfig] = useState("");
  const [salesListTable, setSalesListTable] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [addSalesPerson, setAddSalesPerson] = useState(false);
  const [salesName, setSalesName] = useState("");
  const [salesEmail, setSalesEmail] = useState("");
  const [salesMobile, setSalesMobile] = useState("");
  const [subject, setSubject] = useState("");
  const [addItem, setAddItem] = useState([1]);
  const [itemList, setItemList] = useState([]);
  const [selectedItem, setSelectedItem] = useState([""]);
  const [selectedItemId, setSelectedItemId] = useState([""]);
  const [selectedItemGST, setSelectedItemGST] = useState([""]);
  const [itemDetails, setItemDetails] = useState("");
  const [quantity, setQuantity] = useState(["1.00"]);
  const [perorRupee, setPerOrRupee] = React.useState(["%"]);
  const [discount, setDiscount] = useState(["0"]);
  const [rate, setRate] = useState(["0"]);
  const [amount, setAmount] = useState(0);
  const [shippingCharges, setShippingCharges] = useState("");
  const [taxOpen, setTaxOpen] = useState(false);
  const [selectedGst, setSelectedGst] = React.useState(null);
  const [gstOptions, setGstOptions] = useState([]);
  const [taxId, setTaxId] = useState(null);
  const [taxView, setTaxView] = useState(false);
  const [savedGST, setSavedGST] = useState("");
  const [adjustment, setAdjustment] = useState("Adjustment");
  const [tdsTcs, setTdsTcs] = useState("");
  const [costAdd, setCostAdd] = useState("");
  const [termsList, setTermsList] = useState("");
  const [manageTerms, setManageTerms] = useState(false);
  const [manageTds, setManageTds] = useState(false);
  const [manageTcs, setManageTcs] = useState(false);
  const [newTds, setNewTds] = useState(false);
  const [newTcs, setNewTcs] = useState(false);
  const [editTds, setEditTds] = useState(false);
  const [editTcs, setEditTcs] = useState(false);
  const [openPrefix, setOpenPrefix] = useState(false);
  const [editDetails, setEditDetails] = useState([]);
  const [seriesNo, setSeriesNo] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [total, setTotal] = useState("");
  const [selectedTaxType, setSelectedTaxType] = useState("TDS");
  const [tDSTCSList, setTDSTCSList] = useState([]);
  const [selectedTDSTCS, setSelectedTDSTCS] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [tdsShow, setTdsShow] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState([""]);
  const [invoiceTypeDetails, setInvoiceTypeDetails] = useState("");
  const [selectedInvoiceType, setSelectedInvoiceType] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isBillingOpen, setBillingOpen] = useState(false);
  const [address, SetAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const billingButtonRef = useRef(null);
  const addressButtonRef = useRef(null);
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [attention, setAttention] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [intimate, setIntimate] = useState("");
  const [userData, setUserData] = useState([]);
  const [stateId, setStateId] = useState(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false); // Loading state for Save as Draft
  const [isSavingAndSending, setIsSavingAndSending] = useState(false); // Loading state for Save and Send
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be 'error', 'warning', 'info', 'success'

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Parse and set user data from localStorage on component mount
  useEffect(() => {
    const data = localStorage.getItem("data");
    if (data) {
      const parsedData = JSON.parse(data);
      console.log("Stored data:", parsedData); // Debugging line to verify stored data
      setUserData(parsedData); // Update userData
    }
  }, []); // This effect runs once on mount

  // Define the getStates function
  const getStates1 = () => {
    console.log("UserData in getStates:", userData); // Debugging line to check userData value
    if (userData.length > 0 && userData[0]?.country_id) {
      // Ensure userData has data and country_id exists
      const params = {
        json_type: "get_state",
        country_id: userData[0].country_id, // Safely access country_id
        user_id: userid,
        org_id: orgid,
      };
      axios
        .post(
          "https://erp-api.schwingcloud.com/Service1.svc/ERP_solution",
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
            setPlaceOfSupply(JsonData);
          } else if (JSON.parse(res.data).json_sts === "5") {
            onLogout();
            navigate("/");
          }
        });
    }
  };

  // Call getStates when userData is updated
  useEffect(() => {
    if (userData.length > 0) {
      getStates1();
    }
  }, [userData]); // Dependency array includes userData, ensuring getStates is called after userData is updated

  const countries = Country.getAllCountries();
  const handleCountryChange = (event, newValue) => {
    setSelectedCountry(newValue);
    setSelectedState(null); // Reset state when country changes
  };

  const handleStateChange = (event, newValue) => {
    setSelectedState(newValue);
  };

  const getStates = () => {
    return selectedCountry
      ? State.getStatesOfCountry(selectedCountry.isoCode)
      : [];
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Close modal when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalOpen(false);
        setBillingOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get the button's position and set the modal to open below it
  const getButtonPosition = (ref) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      return {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      };
    }
    return { top: 0, left: 0 };
  };
  const handleButtonClick = () => {
    const position = getButtonPosition(addressButtonRef);
    setPosition(position); // Assuming you have a state variable for modal position
    setModalOpen(true);
  };

  const handleButtonBillingClick = () => {
    const position = getButtonPosition(billingButtonRef);
    setPosition(position); // Assuming you have a state variable for modal position
    setBillingOpen(true);
  };

  const handleAddressSelect = (address) => {
    alert(`Selected Address: ${address.address_id}`);
    setSelectedAddress(address);
    setModalOpen(false);
  };

  const handleAddressBillingSelect = (address) => {
    alert(`Selected Address: ${address.address_id}`);
    setSelectedBillingAddress(address);
    setBillingOpen(false);
  };

  const handleAddNewAddress = (intimate) => {
    setModalOpen(false);
    setOpen(true);
    setIntimate(intimate);
  };

  const handleGetAddress = () => {
    const params = {
      json_type: "get_address",
      cust_id: selectedCustomer.id,
      type: "shipping",
      org_id: orgid,
      user: user,
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
        if (JSON.parse(res.data).json_sts === "1") {
          SetAddress(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  const handleGetBillingAddress = () => {
    const params = {
      json_type: "get_address",
      cust_id: selectedCustomer.id,
      type: "billing",
      org_id: orgid,
      user: user,
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
        if (JSON.parse(res.data).json_sts === "1") {
          setBillingAddress(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  const handleSaveNewAddress = () => {
    alert(intimate);
    const fetchShippningAddressData = [
      {
        name: attention,
        country: selectedCountry.name,
        add1: street1,
        add2: street2,
        city: city,
        state: selectedState.name,
        zip: zip,
        phn: phone,
        fax: fax,
      },
    ];
    const params = {
      json_type: "add_address",
      cust_id: selectedCustomer.id,
      address: fetchShippningAddressData,
      type: intimate === "Shipping" ? "shipping" : "billing",
      org_id: orgid,
      user: user,
    };
    console.log(params);
    axios
      .post("https://erp-api.schwingcloud.com/Service1.svc/ERP_app2", params, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data);
        if (JSON.parse(res.data).json_sts === "1" && intimate === "Shipping") {
          alert(JsonData.error_msg);
          setOpen(false);
          handleGetAddress();
          handleButtonClick();
        } else if (
          JSON.parse(res.data).json_sts === "1" &&
          intimate === "Billing"
        ) {
          alert(JsonData.error_msg);
          setOpen(false);
          handleGetBillingAddress();
          handleButtonBillingClick();
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  const handleOpenPrefix = () => {
    setOpenPrefix(true);
  };

  const handleClosePrefix = () => {
    setOpenPrefix(false);
  };

  const handleTermsClose = () => {
    setManageTerms(false);
  };

  const handleManageTdsOpen = () => {
    setManageTds(true);
    setNewTds(false);
    setEditTds(false);
  };

  const handleManageTdsClose = () => {
    setManageTds(false);
  };

  const handleNewTds = () => {
    setNewTds(true);
  };

  const handleEditTds = () => {
    setEditTds(true);
  };

  const handleManageTcsOpen = () => {
    setManageTcs(true);
    setNewTcs(false);
    setEditTcs(false);
  };

  const handleManageTcsClose = () => {
    setManageTcs(false);
  };

  const handleNewTcs = () => {
    setNewTcs(true);
  };

  const handleEditTcs = () => {
    setEditTcs(true);
  };
  const handleSaveTax = () => {
    setTaxView(true);
    const GST = selectedGst / 2;
    const percentage = (GST / 100) * shippingCharges;
    setSavedGST(percentage);
    setTaxOpen(false);
  };

  useEffect(() => {
    if (shippingCharges >= 0 && taxView === true) {
      const GST = selectedGst / 2;
      const percentage = (GST / 100) * shippingCharges;
      setSavedGST(percentage);
    }
  }, [shippingCharges, taxView]);

  const handleTaxTypeChange = (event) => {
    setSelectedTDSTCS(null);
    setSelectedRate(null);
    setSelectedTaxType(event.target.value);
    const params = {
      json_type: "get_tax_pern",
      type: event.target.value,
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
          setTDSTCSList(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    const params = {
      json_type: "get_tax_pern",
      type: "TDS",
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
          setTDSTCSList(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  }, []);

  const getAccountDetails = () => {
    const params = {
      json_type: "get_accounts",
      user: user,
      org_id: orgid,
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
          // Group accounts by account_type and ledger_name to create hierarchy
          const groupedData = JsonData.reduce((acc, curr) => {
            const { account_type, account_name, ledger_name, account_id } =
              curr;

            // Check if the account type exists in the accumulator, if not, initialize it
            if (!acc[account_type]) {
              acc[account_type] = [];
            }

            // If ledger_name exists, it's a sub-account; otherwise, it's a main account
            if (!ledger_name) {
              acc[account_type].push({
                account_name,
                account_id,
                subAccounts: [],
              });
            } else {
              // Find the main account under which this ledger_name should go as a sub-account
              const parentAccount = acc[account_type].find(
                (account) => account.account_name === ledger_name
              );

              if (parentAccount) {
                parentAccount.subAccounts.push({ account_name, account_id });
              }
            }

            return acc;
          }, {});

          // Flatten the grouped data for the Autocomplete
          const flattenedOptions = Object.entries(groupedData).flatMap(
            ([accountType, accounts]) => {
              return accounts.flatMap((account) => {
                // Flatten the main account and its sub-accounts into one array
                const mainAccount = {
                  account_type: accountType,
                  account_name: account.account_name,
                  account_id: account.account_id,
                  level: 0,
                }; // Level 0 for main account
                const subAccounts = account.subAccounts.map((subAccount) => ({
                  account_type: accountType,
                  account_name: subAccount.account_name,
                  account_id: subAccount.account_id,
                  level: 1, // Level 1 for sub-accounts
                }));
                return [mainAccount, ...subAccounts]; // Include the main account and its sub-accounts
              });
            }
          );

          setOptions(flattenedOptions);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getAccountDetails();
  }, []);

  const handleOnChangeGst = (event, selectedOption) => {
    setSelectedGst(selectedOption ? selectedOption.value : null);
    setTaxId(selectedOption ? selectedOption.tax_id : null);
  };

  const getGstOptions = () => {
    if (stateId !== null) {
      const params = {
        json_type: "get_tax",
        user: user,
        org_id: orgid,
        cust_id: selectedCustomer.id,
        plc_supply: stateId,
      };
      axios
        .post(
          "https://erp-api.schwingcloud.com/Service1.svc/ERP_app2",
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
            setGstOptions(JsonData);
          } else if (JSON.parse(res.data).json_sts === "5") {
            onLogout();
            navigate("/");
          }
        });
    }
  };

  useEffect(() => {
    if (selectedCustomer !== null) {
      getGstOptions();
    }
  }, [selectedCustomer, stateId]);

  const handleTaxModal = () => {
    setTaxOpen(true);
  };

  const handleTaxClose = () => {
    setTaxOpen(false);
  };

  const handleChange = (index, value) => {
    const updatedRupee = [...perorRupee];
    updatedRupee[index] = value;
    setPerOrRupee(updatedRupee);
  };

  const handleAddRow = () => {
    setAddItem([...addItem, {}]);
    setQuantity([...quantity, "1.00"]);
    setDiscount([...discount, "0"]);
    setRate([...rate, "0"]);
    setPerOrRupee([...perorRupee, "%"]);
  };

  const handleAddSalesPerson = () => {
    setAddSalesPerson(true);
  };

  const handleConfigSalesOpen = () => {
    setSalesOpen(true);
  };

  const handleConfigSalesClose = () => {
    setSalesOpen(false);
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPop = Boolean(anchorEl);

  const handleConfigureOpen = () => {
    setConfigureOpen(true);
  };

  const handleConfigureClose = () => {
    setConfigureOpen(false);
  };

  const handleMenuItemClick = (sales_person_id, name) => {
    setSelectedSales(name);
    setSalesId(sales_person_id);
    setAnchorEl(null);
  };

  const handleChangeQuantity = (index, value) => {
    const updatedQuantity = [...quantity];
    updatedQuantity[index] = value;
    setQuantity(updatedQuantity);
  };

  const handleChangeDiscount = (index, value) => {
    const updatedDiscounted = [...discount];
    updatedDiscounted[index] = value;
    setDiscount(updatedDiscounted);
  };

  const handleChangeRate = (index, value) => {
    const updatedRate = [...rate];
    updatedRate[index] = value;
    setRate(updatedRate);
  };

  const handleClearFields = (index) => {
    const updatedSelectedItem = [...selectedItem];
    const updatedSelectedItemId = [...selectedItemId];
    const updatedSelectedItemGST = [...selectedItemGST];
    const updatedQuantity = [...quantity];
    const updatedRate = [...rate];
    const updatedDiscount = [...discount];
    const updatedPerOrRupee = [...perorRupee];

    // Clear the specific index fields
    updatedSelectedItem[index] = "";
    updatedSelectedItemId[index] = "";
    updatedSelectedItemGST[index] = "";
    updatedQuantity[index] = "1.00";
    updatedRate[index] = "0";
    updatedDiscount[index] = "0";
    updatedPerOrRupee[index] = "";

    // If addItem has more than one item, remove the index from the arrays
    if (addItem.length > 1) {
      updatedSelectedItem.splice(index, 1);
      updatedSelectedItemId.splice(index, 1);
      updatedSelectedItemGST.splice(index, 1);
      updatedQuantity.splice(index, 1);
      updatedRate.splice(index, 1);
      updatedDiscount.splice(index, 1);
      updatedPerOrRupee.splice(index, 1);
      setAddItem(addItem.filter((_, i) => i !== index));
    } else {
      // Just reset the fields for the single item case
      setAddItem([...addItem]);
    }

    setSelectedItem(updatedSelectedItem);
    setSelectedItemId(updatedSelectedItemId);
    setSelectedItemGST(updatedSelectedItemGST);
    setQuantity(updatedQuantity);
    setRate(updatedRate);
    setDiscount(updatedDiscount);
    setPerOrRupee(updatedPerOrRupee);
  };

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getCustomerList = () => {
    const params = {
      json_type: "get_customer_erp_details",
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
          setCustomerList(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getCustomerList();
  }, []);

  const getInvoiceDetails = (id) => {
    const params = {
      json_type: "get_invoice",
      type: "3",
      cust_id: id,
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
          setInvoiceDetails(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  const getInvoiceType = () => {
    const params = {
      json_type: "get_invoice_type",
      org_id: orgid,
      user: user,
    };
    axios
      .post(
        "https://erp-api.schwingcloud.com/Service1.svc/ERP_solution",
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
          setInvoiceTypeDetails(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getInvoiceType();
  }, []);

  const getTermsList = () => {
    const params = { json_type: "get_terms", org_id: orgid, user: user };
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

  const getEditDetails = () => {
    const params = {
      json_type: "get_trans_series",
      type: "2",
      id: "2",
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
          setEditDetails(JsonData);
          setPrefix(JsonData[0].preview);
          setSeriesId(JsonData[0].id);
          setSeriesNo(JsonData[0].starting_number);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getEditDetails();
  }, []);

  const getItemList = () => {
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
          setItemList(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getItemList();
  }, []);

  const handleItemSelect = (id, index) => {
    const params = {
      json_type: "get_item_details",
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
          setItemDetails((prevItemDetails) => {
            const updatedItemDetails = [...prevItemDetails];
            updatedItemDetails[index] = JsonData;
            return updatedItemDetails;
          });
          if (JsonData && JsonData[0] && JsonData[0].sales_s_price) {
            const newRate = [...rate];
            newRate[index] = JsonData[0].sales_s_price;
            setRate(newRate);
          }
          if (JsonData && JsonData[0] && JsonData[0].GST_intra) {
            const gstMatch = gstOptions.find(
              (option) => option.value === JsonData[0].GST_intra
            );
            setSelectedItemGST((prevSelectedItemGST) => {
              const updatedItemListGST = [...prevSelectedItemGST];
              updatedItemListGST[index] = gstMatch || null;
              return updatedItemListGST;
            });
          }
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error fetching item details:", error);
      });
  };

  const handleSetAmount = (index) => {
    let calculatedAmount = quantity[index] * rate[index];

    // Apply discount based on percentage or rupee amount
    if (perorRupee[index] === "%") {
      calculatedAmount -= (discount[index] / 100) * calculatedAmount;
    } else if (perorRupee[index] === "₹") {
      calculatedAmount -= parseFloat(discount[index]);
    }

    // Apply GST percentage if selectedItemGST exists and has a value
    if (selectedItemGST[index] && selectedItemGST[index].value) {
      const gstPercentage = selectedItemGST[index].value;
      calculatedAmount += (gstPercentage / 100) * calculatedAmount;
    }

    return formatNumber(calculatedAmount.toFixed(2));
  };

  // Function to format number with comma separation
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  useEffect(() => {
    // Calculate total amount
    let totalAmount = 0;
    addItem.forEach((item, index) => {
      totalAmount += parseFloat(handleSetAmount(index).replace(/,/g, ""));
    });

    // Set total amount
    setAmount(formatNumber(totalAmount.toFixed(2)));
    setTotal(formatNumber(totalAmount.toFixed(2)));
  }, [addItem, quantity, discount, rate, perorRupee, selectedItemGST]);

  useEffect(() => {
    const allRatesGreaterThanZero = rate.every((r) => r > 0);

    if (!allRatesGreaterThanZero) return;

    // Parse amount if it's a string
    const parsedAmount =
      typeof amount === "string"
        ? parseFloat(amount.replace(/,/g, ""))
        : amount;

    const shippingCost = parseFloat(shippingCharges || 0);
    const gstCost = parseFloat(savedGST || 0) * 2;
    const additionalCost = parseFloat(costAdd || 0);
    const selectedRateValue = selectedRate ? parseFloat(selectedRate) : 0;
    let taxTotal = 0;

    // TDS or TCS specific calculations
    if (selectedRate !== null) {
      taxTotal = (selectedRateValue / 100) * parsedAmount;
      setTdsShow(taxTotal);
    } else {
      setTdsShow("");
    }

    // Calculate total based on selected tax type
    let total;
    if (selectedTaxType === "TDS") {
      total = parsedAmount - taxTotal + shippingCost + gstCost + additionalCost;
    } else if (selectedTaxType === "TCS") {
      total = parsedAmount + taxTotal + shippingCost + gstCost + additionalCost;
    } else {
      total = parsedAmount + shippingCost + gstCost + additionalCost;
    }

    setTotal(formatNumber(total.toFixed(2)));
  }, [
    addItem,
    quantity,
    discount,
    rate,
    perorRupee,
    shippingCharges,
    selectedTaxType,
    selectedRate,
    savedGST,
    costAdd,
    amount,
    selectedItemGST,
  ]);

  const handleSaveSalesperson = () => {
    if (salesName !== "" && salesEmail !== "" && salesMobile !== "") {
      const params = {
        json_type: "config_sales_person",
        name: salesName,
        e_mail: salesEmail,
        mob_no: salesMobile,
        org_id: orgid,
        user: user,
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
            alert(JsonData.error_msg);
            getSalesList();
          } else if (JsonData.json_sts === "2") {
            alert(JsonData.error_msg);
          } else if (JSON.parse(res.data).json_sts === "5") {
            onLogout();
            navigate("/");
          } else {
            alert(JsonData.error_msg);
          }
        });
    } else {
      alert("Please fill in all the required fields.");
    }
  };

  const getSalesList = () => {
    const params = {
      json_type: "get_sales_person",
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
          setSalesList(JsonData);
          setSalesListTable(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getSalesList();
  }, []);

  const handleCustomerSelect = (id) => {
    const params = {
      json_type: "get_customer_erp_details",
      type: "2",
      id: id,
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
          setCustomerDetails(JsonData);
          setContactPerson(JsonData[0].contact_id);
          const placeOption = placeOfSupply.find(
            (option) => option.name === JsonData[0]?.plc_supply
          );
          if (placeOption) {
            setSelectedPlaceOfSupply(placeOption);
            setStateId(placeOption ? placeOption.state_id : null);
          }
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  const handleSaveCreditNotes = (stage, setLoading) => {
    setLoading(true);
    const itemsId =
      selectedItemId && selectedItemId.length > 0
        ? selectedItemId.map((item) => ({ id: item }))
        : [];

    const quantities =
      quantity && quantity.length > 0
        ? quantity.map((item) => ({ qty: item }))
        : [];

    const rates =
      rate && rate.length > 0 ? rate.map((item) => ({ rate: item })) : [];

    const tax =
      selectedItemGST && selectedItemGST.length > 0
        ? selectedItemGST.map((item) => ({ tax_id: item.tax_id }))
        : [];

    const discounts =
      discount && discount.length > 0
        ? discount.map((item) => ({ discount: item }))
        : [];

    const combinedItemArray = itemsId
      .filter((item) => item?.id) // Ensure we have valid IDs
      .map((item, index) => ({
        item_id: item.id,
        //  account_id: accounts[index]?.account_id || 0,
        qty: quantities[index]?.qty,
        rate: rates[index]?.rate,
        discount: discounts[index]?.discount,
        per_rupee:
          perorRupee[index] === "₹" || perorRupee[index] === "%"
            ? perorRupee[index]
            : "",
        tax_id: tax[index]?.tax_id,
        amount: parseFloat(handleSetAmount(index).replace(/,/g, "")),
      }));

    // Validate if combinedItemArray has items
    if (combinedItemArray.length === 0) {
      setTimeout(() => setLoading(false), 1500);
      setSnackbarMessage(
        "No items selected. Please select items before saving."
      );
      setSnackbarSeverity("field missing");
      setSnackbarOpen(true);
      return; // Prevent further execution
    }

    const parsedAmount = parseFloat(amount?.replace(/,/g, "")) || 0;
    const parsedTotal = parseFloat(total?.replace(/,/g, "")) || 0;

    const params = {
      json_type: "save_credit_note",
      cust_id: selectedCustomer?.id,
      plc_supply: stateId,
      invoice_id: selectedInvoice?.invoice_id,
      invoice_type_id: selectedInvoiceType?.id,
      reason: selectedReason || "",
      credit_no: prefix || "",
      reference: reference || "",
      credit_date: dayjs(from).format("YYYY-MM-DD"),
      sales_person_id: salesId,
      subject: subject || "",
      item_details:
        combinedItemArray[0].item_id !== "" ? combinedItemArray : "",
      subtotal: parsedAmount || 0,
      ship_charge: shippingCharges || 0,
      ship_cgst: savedGST || 0,
      ship_sgst: savedGST || 0,
      tcs: selectedTaxType === "TCS" ? tdsShow || 0 : "0.00",
      tds: selectedTaxType === "TDS" ? `-${tdsShow || 0}` : "0.00",
      adj: costAdd || 0,
      adj_name: adjustment || "Adjustment",
      total: parsedTotal || 0,
      series_id: seriesId,
      series_no: seriesNo,
      org_id: orgid,
      user: user,
      user_id: userid,
      tax_id: taxId || "0",
      tax_pern_id: selectedTDSTCS !== null ? selectedTDSTCS.id : "0",
      bill_id: selectedBillingAddress?.address_id || 0,
      ship_id: selectedAddress?.address_id || 0,
      gst_treatment_id: customerDetails?.[0]?.gst_treatment_id || "",
      stage: stage,
    };

    // Mapping technical keys to user-friendly messages
    const fieldMessages = {
      cust_id: "Customer is not selected.",
      plc_supply: "Place of supply is not selected.",
      invoice_id: "Invoice is missing.",
      invoice_type_id: "Invoice type is not selected.",
      reason: "Reason for the credit note is required.",
      credit_no: "Credit note number is missing.",
      credit_date: "Credit date is missing or invalid.",
      sales_person_id: "Sales person is not selected.",
      subject: "Subject is required.",
      item_details: "No items have been added.",
      subtotal: "Subtotal is missing.",
      ship_charge: "Shipping charges are missing.",
      ship_cgst: "Shipping CGST is missing.",
      ship_sgst: "Shipping SGST is missing.",
      tcs: "TCS amount is required.",
      tds: "TDS amount is required.",
      adj: "Adjustment amount is required.",
      total: "Total amount is missing.",
      series_id: "Series ID is missing.",
      series_no: "Series number is missing.",
      org_id: "Organization ID is missing.",
      user_id: "User ID is missing.",
      tax_id: "Tax ID is missing.",
      bill_id: "Billing address is not selected.",
      ship_id: "Shipping address is not selected.",
      gst_treatment_id: "GST treatment is missing.",
      stage: "Stage is required.",
    };

    for (const key in params) {
      if (
        params[key] === null ||
        params[key] === undefined ||
        params[key] === "" ||
        params[key] === "Invalid Date" ||
        (Array.isArray(params[key]) && params[key].length === 0)
      ) {
        if (key !== "subject" && key !== "reference") {
          // Skip validation for 'subject' and 'reference'
          setSnackbarMessage(
            fieldMessages[key] ||
              `Please fill out all the fields. Missing: ${key}`
          );
          setSnackbarSeverity("field missing");
          setSnackbarOpen(true);
          setTimeout(() => setLoading(false), 1500);
          return; // Stop execution if any field (other than 'subject' and 'reference') is empty
        }
      }
    }

    axios
      .post("https://erp-api.schwingcloud.com/Service1.svc/ERP_app2", params, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data);
        const itemFind = JsonData.data;
        const item = itemFind[0];
        if (JsonData.json_sts === "1") {
          navigate("/SalesPage/CreditNoteDetailPage", {
            state: { item, create: "create" },
          });
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        } else {
          setSnackbarMessage(JsonData.error_msg);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
        getEditDetails();
      })
      .catch((error) => {
        console.error("Error saving credit note:", error);
        setSnackbarMessage("There was an error processing your request.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 1500); // Reset loading state
      });
  };

  const handleSaveDraft = () => handleSaveCreditNotes("1", setIsSavingDraft);
  const handleSaveAsOpen = () =>
    handleSaveCreditNotes("2", setIsSavingAndSending);

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
      <Modal open={open} onClose={handleClose}>
        <Box sx={styles.modal}>
          {/* Modal Header */}
          <Box sx={styles.header}>
            <Typography variant="h6" fontWeight="bold">
              Additional Address
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form Fields with Headings */}
          <Box sx={styles.fieldGroup}>
            <Typography fontWeight="bold">Attention</Typography>
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              value={attention}
              onChange={(e) => setAttention(e.target.value)}
            />
          </Box>

          <Box sx={styles.fieldGroup}>
            <Typography fontWeight="bold">Country / Region</Typography>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option.name}
              onChange={handleCountryChange}
              autoComplete="off"
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
              options={getStates()}
              getOptionLabel={(option) => option.name}
              onChange={handleStateChange}
              autoComplete="off"
              renderInput={(params) => (
                <TextField {...params} margin="dense" autoComplete="off" />
              )}
              disabled={!selectedCountry}
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
              onChange={(e) => setFax(e.target.value)}
            />
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Note: Changes made here will be updated to this contact.
          </Typography>

          {/* Buttons */}
          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button
              variant="contained"
              color="primary"
              sx={{ bgcolor: "#408DFB" }}
              onClick={() => {
                handleSaveNewAddress();
              }}
            >
              Save
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      {isModalOpen && (
        <StyledModal
          ref={modalRef}
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {address &&
            address.map((address) => {
              const addressDetails = Array.isArray(address.address_details)
                ? address.address_details[0] // Use the first element if it's an array
                : address.address_details;

              return (
                <div
                  key={address.address_id}
                  style={{
                    padding: "20px",
                    marginBottom: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#408dfb"; // Change background
                    e.currentTarget.style.color = "#fff"; // Change text color to white
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff"; // Revert background
                    e.currentTarget.style.color = "#000"; // Revert text color to black
                  }}
                  onClick={() => handleAddressSelect(address)}
                >
                  <div>
                    <strong>{addressDetails.name}</strong>
                    <p style={{ margin: 0 }}>
                      {addressDetails.add1 + " " + addressDetails.add2}
                    </p>
                    <p style={{ margin: 0 }}>{addressDetails.city}</p>
                    <p style={{ margin: 0 }}>
                      {addressDetails.state + "-" + addressDetails.zip}
                    </p>
                    <p style={{ margin: 0 }}>{addressDetails.country}</p>
                    <p style={{ margin: 0 }}>Phone No: {addressDetails.phn}</p>
                  </div>
                  <div style={{ cursor: "pointer" }}>
                    <span role="img" aria-label="edit">
                      ✏️
                    </span>
                  </div>
                </div>
              );
            })}

          <div
            style={{
              textAlign: "center",
              marginTop: "12px",
              cursor: "pointer",
              color: "#408dfb",
              fontWeight: "bold",
            }}
            onClick={() => {
              handleAddNewAddress("Shipping");
            }}
          >
            + Add new address
          </div>
        </StyledModal>
      )}
      {isBillingOpen && (
        <StyledModal
          ref={modalRef}
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {billingAddress &&
            billingAddress.map((address) => {
              const addressDetails = Array.isArray(address.address_details)
                ? address.address_details[0] // Use the first element if it's an array
                : address.address_details;

              return (
                <div
                  key={address.address_id}
                  style={{
                    padding: "20px",
                    marginBottom: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#408dfb"; // Change background
                    e.currentTarget.style.color = "#fff"; // Change text color to white
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff"; // Revert background
                    e.currentTarget.style.color = "#000"; // Revert text color to black
                  }}
                  onClick={() => handleAddressBillingSelect(address)}
                >
                  <div>
                    <strong>{addressDetails.name}</strong>
                    <p style={{ margin: 0 }}>
                      {addressDetails.add1 + " " + addressDetails.add2}
                    </p>
                    <p style={{ margin: 0 }}>{addressDetails.city}</p>
                    <p style={{ margin: 0 }}>
                      {addressDetails.state + "-" + addressDetails.zip}
                    </p>
                    <p style={{ margin: 0 }}>{addressDetails.country}</p>
                    <p style={{ margin: 0 }}>Phone No: {addressDetails.phn}</p>
                  </div>
                  <div style={{ cursor: "pointer" }}>
                    <span role="img" aria-label="edit">
                      ✏️
                    </span>
                  </div>
                </div>
              );
            })}

          <div
            style={{
              textAlign: "center",
              marginTop: "12px",
              cursor: "pointer",
              color: "#408dfb",
              fontWeight: "bold",
            }}
            onClick={() => {
              handleAddNewAddress("Billing");
            }}
          >
            + Add new address
          </div>
        </StyledModal>
      )}
      <Dialog
        fullScreen
        open={openPrefix}
        onClose={handleClosePrefix}
        TransitionComponent={Transition}
      >
        <Grid item container xs={12} mt={1}>
          <ModalEditableSeries
            handleClosePrefix={handleClosePrefix}
            handleConfigureClose={handleConfigureClose}
            getEditDetails={getEditDetails}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
          />
        </Grid>
      </Dialog>
      <Modal
        open={manageTerms}
        onClose={handleTermsClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2}>
          <ModalNetMaster
            handleTermsClose={handleTermsClose}
            getTermsList={getTermsList}
          />
        </Box>
      </Modal>
      <Modal
        open={manageTds}
        onClose={handleManageTdsClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: newTds === true || editTds === true ? "33%" : "42%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: newTds === true || editTds === true ? "45%" : "48%",
            height: newTds === true || editTds === true ? 650 : 820,
            //  overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderBottomRightRadius: "10px",
            borderBottomLeftRadius: "10px",
          }}
        >
          <ModalManageTds
            handleManageTdsClose={handleManageTdsClose}
            handleNewTds={handleNewTds}
            newTds={newTds}
            handleEditTds={handleEditTds}
            editTds={editTds}
            handleTaxTypeChange={handleTaxTypeChange}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
          />
        </Box>
      </Modal>
      <Modal
        open={manageTcs}
        onClose={handleManageTcsClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: newTcs === true || editTcs === true ? "33%" : "42%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: newTcs === true || editTcs === true ? "45%" : "48%",
            height: newTcs === true || editTcs === true ? 650 : 820,
            //  overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderBottomRightRadius: "10px",
            borderBottomLeftRadius: "10px",
          }}
        >
          <ModalManageTcs
            handleManageTcsClose={handleManageTcsClose}
            handleTaxTypeChange={handleTaxTypeChange}
            handleNewTcs={handleNewTcs}
            newTcs={newTcs}
            handleEditTcs={handleEditTcs}
            editTcs={editTcs}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
          />
        </Box>
      </Modal>
      <Modal
        open={taxOpen}
        onClose={handleTaxClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style1}>
          <Grid
            item
            container
            xs={12}
            sx={{
              width: "100%",
              height: "auto",
              minHeight: "50px",
              borderBottom: "1px solid #e6e6e6",
              backgroundColor: "#F9F9FB",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                fontSize: "20px",
                fontFamily: "Times New Roman",
                pl: 2,
              }}
            >
              Tax on shipping charge
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                pr: 2,
                display: "flex",
                justifyContent: "end",
              }}
            >
              <CloseIcon
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  handleTaxClose();
                }}
              />
            </Grid>
          </Grid>
          <Grid
            item
            container
            xs={12}
            sx={{
              mt: 2,
              width: "100%",
              height: "auto",
              minHeight: "70px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Autocomplete
              fullWidth
              value={
                gstOptions.find((option) => option.value === selectedGst) ||
                null
              }
              onChange={handleOnChangeGst}
              options={gstOptions}
              getOptionLabel={(option) => option.label}
              ListboxProps={{ sx: { fontSize: "1rem" } }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  autoComplete="off"
                  style={{
                    width: "95%",
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
          </Grid>
          <Grid
            item
            container
            xs={12}
            sx={{
              width: "100%",
              height: "auto",
              minHeight: "50px",
              display: "flex",
              alignItems: "center",
              mt: 4,
              pl: 2,
            }}
          >
            <Grid item xs={12} md={3}>
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
                onClick={() => {
                  handleSaveTax();
                }}
              >
                Save
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                sx={{
                  width: "100px",
                  borderRadius: 2,
                  display: "flex",
                  backgroundColor: "#408DFB", // Updated color
                  "&:hover": {
                    backgroundColor: "#3070C0", // Slightly darker hover color
                  },
                }}
                onClick={handleTaxClose}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal
        open={configureOpen}
        onClose={handleConfigureClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid
            item
            container
            xs={12}
            sx={{
              width: "100%",
              height: "auto",
              minHeight: "70px",
              borderBottom: "1px solid #e6e6e6",
              backgroundColor: "#F9F9FB",
            }}
          >
            <Grid
              item
              xs={12}
              md={8}
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
                  fontSize: "1.7rem",
                  fontFamily: "Times New Roman",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                Configure Invoice Number Preferences
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                width: "100%",
                height: "auto",
                minHeight: "70px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                pr: 2,
                gap: 2,
              }}
            >
              <Grid>
                <Tooltip title="Close" arrow>
                  <CloseIcon onClick={handleConfigureClose} />
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          <Grid p={2}>
            <Grid
              item
              container
              xs={12}
              sx={{
                width: "100%",
                height: "auto",
                minHeight: "70px",
                display: "flex",
                justifyContent: "start",
                // alignItems: "center",
              }}
            >
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  pl: 2,
                  borderBottom: "1px solid #e6e6e6",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      fontFamily: "Helvetica",
                    }}
                  >
                    Associated Series
                  </div>
                  <div
                    style={{
                      fontSize: "17px",
                      fontFamily: "Helvetica",
                      color: "#212529",
                    }}
                  >
                    Default Transaction Series
                  </div>
                </div>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  borderBottom: "1px solid #e6e6e6",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  pr: 5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "17px",
                    fontFamily: "Helvetica",
                    color: "#408DFB",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleOpenPrefix();
                  }}
                >
                  Configure
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid p={2}>
            <Grid
              item
              container
              xs={12}
              sx={{
                width: "100%",
                height: "auto",
                minHeight: "70px",
                display: "flex",
                justifyContent: "start",
                // alignItems: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sx={{
                  pl: 2,
                  borderBottom: "1px solid #e6e6e6",
                  fontSize: "17px",
                  fontFamily: "Helvetica",
                  color: "#212529",
                }}
              >
                Your invoice numbers are set on auto-generate mode to save your
                time. Are you sure about changing this setting?
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <Modal
        open={salesOpen}
        onClose={handleConfigSalesClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid
            item
            container
            xs={12}
            sx={{
              width: "100%",
              height: "auto",
              minHeight: "70px",
              borderBottom: "1px solid #e6e6e6",
              backgroundColor: "#F9F9FB",
            }}
          >
            <Grid
              item
              xs={12}
              md={8}
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
                  fontSize: "1.7rem",
                  fontFamily: "Times New Roman",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                Manage Salesperon
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                width: "100%",
                height: "auto",
                minHeight: "70px",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                pr: 2,
                gap: 2,
              }}
            >
              <Grid>
                <Tooltip title="Close" arrow>
                  <CloseIcon onClick={handleConfigSalesClose} />
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
          {addSalesPerson === false ? (
            <Grid
              item
              container
              xs={12}
              sx={{
                mt: 2,
                width: "100%",
                height: "auto",
                minHeight: "70px",
                borderBottom: "1px solid #e6e6e6",
                backgroundColor: "#F9F9FB",
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
                <TextField
                  variant="outlined"
                  autoComplete="off"
                  placeholder="Search"
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
                    },
                  }}
                  value={searchSalesConfig}
                  onChange={(e) => setSearchSalesConfig(e.target.value)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  width: "100%",
                  height: "auto",
                  minHeight: "70px",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  pr: 2,
                }}
              >
                <Button
                  sx={{
                    width: "200px",
                    borderRadius: 2,
                    display: "flex",
                    backgroundColor: "#408DFB", // Updated color
                    "&:hover": {
                      backgroundColor: "#3070C0", // Slightly darker hover color
                    },
                  }}
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    handleAddSalesPerson();
                  }}
                >
                  Salesperson
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid
              item
              container
              xs={12}
              sx={{
                width: "100%",
                height: "auto",
                minHeight: "180px",
                p: 2,
              }}
            >
              <Grid
                item
                container
                xs={12}
                sx={{
                  width: "100%",
                  height: "auto",
                  border: "1px solid #e6e6e6",
                  backgroundColor: "#F5F5F5",
                  borderBottom: "none",
                }}
              >
                <Grid item xs={12} md={4}>
                  <Grid
                    sx={{
                      width: "100%",
                      height: "auto",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      color: "red",
                      pl: 2,
                    }}
                  >
                    Name*
                  </Grid>
                  <Grid
                    sx={{
                      width: "100%",
                      height: "auto",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      color: "red",
                    }}
                  >
                    <TextField
                      variant="outlined"
                      autoComplete="off"
                      placeholder="Enter Name"
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
                        },
                      }}
                      value={salesName}
                      onChange={(e) => setSalesName(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Grid
                    sx={{
                      width: "100%",
                      height: "auto",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      color: "red",
                      pl: 2,
                    }}
                  >
                    Email*
                  </Grid>
                  <Grid
                    sx={{
                      width: "100%",
                      height: "auto",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      color: "red",
                    }}
                  >
                    <TextField
                      variant="outlined"
                      autoComplete="off"
                      placeholder="Enter E-mail"
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
                        },
                      }}
                      value={salesEmail}
                      onChange={(e) => setSalesEmail(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Grid
                    sx={{
                      width: "100%",
                      height: "auto",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      color: "red",
                      pl: 2,
                    }}
                  >
                    Mobileno*
                  </Grid>
                  <Grid
                    sx={{
                      width: "100%",
                      height: "auto",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      color: "red",
                    }}
                  >
                    <TextField
                      variant="outlined"
                      autoComplete="off"
                      placeholder="Enter Mobile"
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
                        },
                      }}
                      value={salesMobile}
                      onChange={(e) => setSalesMobile(e.target.value)}
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
                    pl: 2,
                  }}
                >
                  <Grid item xs={12} md={1.3}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        display: "flex",
                        backgroundColor: "#408DFB", // Updated color
                        "&:hover": {
                          backgroundColor: "#3070C0", // Slightly darker hover color
                        },
                      }}
                      onClick={() => {
                        handleSaveSalesperson();
                      }}
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        display: "flex",
                        backgroundColor: "#408DFB",
                        "&:hover": {
                          backgroundColor: "#008064",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid
            item
            container
            xs={12}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "300px",
              borderBottom: "1px solid #e6e6e6",
              backgroundColor: "#F9F9FB",
              mt: 2,
            }}
          >
            <TableContainer
              sx={{
                width: "100%",
                maxHeight: 300,
                pl: 2,
                pr: 2,
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontSize: "0.9rem",
                        fontFamily: "Times New Roman",
                        // fontWeight: "bold",
                        textTransform: "uppercase",
                        width: "35%",
                        p: 1,
                        color: "#6C7184",
                        borderBottom: "0.5px solid #e6e6e6",
                        pl: 2,
                      }}
                    >
                      Salesperson Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.9rem",
                        fontFamily: "Times New Roman",
                        //fontWeight: "bold",
                        textTransform: "uppercase",
                        width: "35%",
                        p: 1,
                        color: "#6C7184",
                        borderBottom: "0.5px solid #e6e6e6",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.9rem",
                        fontFamily: "Times New Roman",
                        //fontWeight: "bold",
                        textTransform: "uppercase",
                        width: "30%",
                        p: 1,
                        color: "#6C7184",
                        borderBottom: "0.5px solid #e6e6e6",
                      }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salesListTable &&
                    salesListTable
                      .filter((data) =>
                        Object.values(data).some((item) =>
                          item
                            .toString()
                            .toLowerCase()
                            .includes(searchSalesConfig.toLowerCase())
                        )
                      )
                      .map((item, index) => (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              fontSize: "1rem",
                              width: "35%",
                              fontFamily: "Times New Roman",
                              // fontWeight: "bold",
                              p: 1,
                              borderBottom: "0.5px solid #e6e6e6",
                              pl: 2,
                            }}
                          >
                            {item.name}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1rem",
                              fontFamily: "Times New Roman",
                              width: "35%",
                              // fontWeight: "bold",
                              p: 1,
                              borderBottom: "0.5px solid #e6e6e6",
                            }}
                          >
                            {item.e_mail}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1rem",
                              fontFamily: "Times New Roman",
                              width: "30%",
                              // fontWeight: "bold",
                              p: 1,
                              borderBottom: "0.5px solid #e6e6e6",
                              cursor: "pointer",
                            }}
                            onMouseEnter={() => setHoveredCell(index)}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            {hoveredCell === index && (
                              <EditOutlinedIcon
                                sx={{ height: 20, width: 20 }}
                                onClick={() => console.log("Edit clicked")}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Box>
      </Modal>
      <Sidebar onLogout={onLogout}>
        <Grid container>
          <Helmet>
            <title>Add New | Credit Notes</title>
          </Helmet>
          <React.Fragment>
            <Grid
              item
              container
              xs={12}
              sx={{
                mt: 2,
                width: "100%",
                height: "100%",
                maxHeight: 820,
                overflowY: "auto",
              }}
            >
              <Grid
                item
                container
                xs={12}
                sx={{
                  mt: 2,
                  width: "100%",
                  height: "auto",
                  minHeight: "70px",
                  borderBottom: "1px solid #e6e6e6",
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
                    pl: 3,
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      fontSize: "1.7rem",
                      fontFamily: "Times New Roman",
                      fontWeight: "bold",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    New Credit Note
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    width: "100%",
                    height: "auto",
                    minHeight: "70px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    pr: 2,
                    gap: 2,
                  }}
                >
                  <Grid>
                    <Tooltip title="Close Invoice" arrow>
                      <CloseIcon
                        onClick={() => {
                          navigate(-1);
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
                  height: "auto",
                  minHeight: "100px",
                  backgroundColor: "#F9F9FB",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: selectedCustomer === null ? "center" : "",
                  pt: selectedCustomer === null ? "" : 2.2,
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={2}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: selectedCustomer === null ? "center" : "",
                    color: "red",
                    fontSize: "20px",
                    fontFamily: "Times New Roman",
                    pl: 3,
                    pt: selectedCustomer === null ? "" : 2,
                  }}
                >
                  Customer Name*
                </Grid>
                <Grid item xs={12} md={5}>
                  <Autocomplete
                    disablePortal
                    options={customerList.map((customer) => ({
                      id: customer.id,
                      display_name: customer.display_name,
                    }))}
                    value={selectedCustomer}
                    onChange={(e, val) => {
                      setSelectedCustomer(val);
                      handleCustomerSelect(val ? val.id : null);
                      getInvoiceDetails(val ? val.id : null);
                    }}
                    getOptionLabel={(option) => option.display_name}
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
                        placeholder="Select Customer"
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
                  {selectedCustomer !== null ? (
                    <Grid>
                      <Grid
                        item
                        container
                        xs={12}
                        sx={{ width: "100%", height: "auto", pl: 2, mt: 2 }}
                      >
                        <Grid item xs={12} md={6}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "bold",
                              color: "gray",
                              fontFamily: "Helvetica",
                              textTransform: "uppercase",
                              display: "flex",
                            }}
                          >
                            Billing Address
                            <EditOutlinedIcon
                              ref={billingButtonRef}
                              onClick={() => {
                                handleGetBillingAddress();
                                handleButtonBillingClick();
                              }}
                              sx={{ color: "#408DFB" }}
                            />
                          </Typography>
                          {selectedBillingAddress === null ? (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {customerDetails
                                ? customerDetails[0].b_address.name
                                : ""}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {selectedBillingAddress
                                ? Array.isArray(
                                    selectedBillingAddress.address_details
                                  )
                                  ? selectedBillingAddress.address_details[0]
                                      ?.name // If it's an array, show the first element's name
                                  : selectedBillingAddress.address_details?.name // If it's an object, show the name directly
                                : ""}
                            </Typography>
                          )}
                          {selectedBillingAddress === null ? (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {customerDetails
                                ? customerDetails[0].b_address.add1 +
                                  "," +
                                  customerDetails[0].b_address.add2 +
                                  ","
                                : ""}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {selectedBillingAddress
                                ? Array.isArray(
                                    selectedBillingAddress.address_details
                                  )
                                  ? selectedBillingAddress.address_details[0]
                                      ?.add1 +
                                      " " +
                                      selectedBillingAddress.address_details[0]
                                        ?.add2 || ""
                                  : selectedBillingAddress.address_details
                                      ?.add1 +
                                      " " +
                                      selectedBillingAddress.address_details
                                        ?.add2 || ""
                                : ""}
                            </Typography>
                          )}
                          {selectedBillingAddress === null ? (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {customerDetails
                                ? customerDetails[0].b_address.city
                                : ""}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {selectedBillingAddress
                                ? Array.isArray(
                                    selectedBillingAddress.address_details
                                  )
                                  ? selectedBillingAddress.address_details[0]
                                      ?.city // If it's an array, show the first element's name
                                  : selectedBillingAddress.address_details?.city // If it's an object, show the name directly
                                : ""}
                            </Typography>
                          )}
                          {selectedBillingAddress === null ? (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {customerDetails
                                ? customerDetails[0].b_address.state +
                                  " " +
                                  customerDetails[0].b_address.zip
                                : ""}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {selectedBillingAddress
                                ? Array.isArray(
                                    selectedBillingAddress.address_details
                                  )
                                  ? selectedBillingAddress.address_details[0]
                                      ?.state +
                                      " - " +
                                      selectedBillingAddress.address_details[0]
                                        ?.zip || ""
                                  : selectedBillingAddress.address_details
                                      ?.state +
                                      " - " +
                                      selectedBillingAddress.address_details
                                        ?.zip || ""
                                : ""}
                            </Typography>
                          )}
                          {selectedBillingAddress === null ? (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {customerDetails
                                ? customerDetails[0].b_address.country
                                : ""}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {selectedBillingAddress
                                ? Array.isArray(
                                    selectedBillingAddress.address_details
                                  )
                                  ? selectedBillingAddress.address_details[0]
                                      ?.country // If it's an array, show the first element's name
                                  : selectedBillingAddress.address_details
                                      ?.country // If it's an object, show the name directly
                                : ""}
                            </Typography>
                          )}
                          {selectedBillingAddress === null ? (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {customerDetails
                                ? "Phone No:   " +
                                  customerDetails[0].b_address.phn
                                : ""}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {selectedBillingAddress
                                ? Array.isArray(
                                    selectedBillingAddress.address_details
                                  )
                                  ? "Phone No:   " +
                                    selectedBillingAddress.address_details[0]
                                      ?.phn // If it's an array, show the first element's name
                                  : "Phone No:   " +
                                    selectedBillingAddress.address_details?.phn // If it's an object, show the name directly
                                : ""}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "bold",
                              color: "gray",
                              fontFamily: "Helvetica",
                              textTransform: "uppercase",
                              display: "flex",
                            }}
                          >
                            Shipping Address
                            <EditOutlinedIcon
                              ref={addressButtonRef}
                              onClick={() => {
                                handleGetAddress();
                                handleButtonClick();
                              }}
                              sx={{ color: "#408DFB" }}
                            />
                          </Typography>
                          {selectedAddress === null ? (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {customerDetails
                                ? customerDetails[0].s_address.name
                                : ""}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {selectedAddress
                                ? Array.isArray(selectedAddress.address_details)
                                  ? selectedAddress.address_details[0]?.name // If it's an array, show the first element's name
                                  : selectedAddress.address_details?.name // If it's an object, show the name directly
                                : ""}
                            </Typography>
                          )}
                          {selectedAddress === null ? (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {customerDetails
                                ? customerDetails[0].s_address.add1 +
                                  customerDetails[0].s_address.add2 +
                                  ","
                                : ""}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {selectedAddress
                                ? Array.isArray(selectedAddress.address_details)
                                  ? selectedAddress.address_details[0]?.add1 +
                                      " " +
                                      selectedAddress.address_details[0]
                                        ?.add2 || ""
                                  : selectedAddress.address_details?.add1 +
                                      " " +
                                      selectedAddress.address_details?.add2 ||
                                    ""
                                : ""}
                            </Typography>
                          )}
                          {selectedAddress === null ? (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {customerDetails
                                ? customerDetails[0].s_address.city
                                : ""}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {selectedAddress
                                ? Array.isArray(selectedAddress.address_details)
                                  ? selectedAddress.address_details[0]?.city // If it's an array, show the first element's name
                                  : selectedAddress.address_details?.city // If it's an object, show the name directly
                                : ""}
                            </Typography>
                          )}
                          {selectedAddress === null ? (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {customerDetails
                                ? customerDetails[0].s_address.state +
                                  " " +
                                  customerDetails[0].s_address.zip
                                : ""}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {selectedAddress
                                ? Array.isArray(selectedAddress.address_details)
                                  ? selectedAddress.address_details[0]?.state +
                                      " - " +
                                      selectedAddress.address_details[0]?.zip ||
                                    ""
                                  : selectedAddress.address_details?.state +
                                      " - " +
                                      selectedAddress.address_details?.zip || ""
                                : ""}
                            </Typography>
                          )}
                          {selectedAddress === null ? (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {customerDetails
                                ? customerDetails[0].s_address.country
                                : ""}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {selectedAddress
                                ? Array.isArray(selectedAddress.address_details)
                                  ? selectedAddress.address_details[0]?.country // If it's an array, show the first element's name
                                  : selectedAddress.address_details?.country // If it's an object, show the name directly
                                : ""}
                            </Typography>
                          )}
                          {selectedAddress === null ? (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {customerDetails
                                ? "Phone No:   " +
                                  customerDetails[0].s_address.phn
                                : ""}
                            </Typography>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: "18px",
                                color: "black",
                                fontFamily: "Helvetica",
                                display: "flex",
                              }}
                            >
                              {selectedAddress
                                ? Array.isArray(selectedAddress.address_details)
                                  ? "Phone No:   " +
                                    selectedAddress.address_details[0]?.phn // If it's an array, show the first element's name
                                  : "Phone No:   " +
                                    selectedAddress.address_details?.phn // If it's an object, show the name directly
                                : ""}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        xs={12}
                        sx={{
                          width: "100%",
                          height: "auto",
                          pl: 2,
                          mt: 5,
                          display: "flex",
                          gap: 3,
                        }}
                      >
                        <Grid>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              fontWeight: "bold",
                              color: "gray",
                              fontFamily: "Times New Roman",
                              //textTransform: "uppercase",
                            }}
                          >
                            GST Treatment :
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography
                            sx={{
                              fontSize: "20px",
                              //fontWeight: "bold",
                              fontFamily: "Times New Roman",
                              //textTransform: "uppercase",
                            }}
                          >
                            {customerDetails
                              ? customerDetails[0].gst_treatment
                              : ""}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>
              {selectedCustomer === null ? (
                ""
              ) : (
                <Grid
                  item
                  container
                  xs={12}
                  sx={{
                    width: "100%",
                    height: "auto",
                    minHeight: "80px",
                    backgroundColor: "#F9F9FB",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      color: "red",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      pl: 3,
                    }}
                  >
                    Place Of Supply*
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Autocomplete
                      disablePortal
                      options={placeOfSupply}
                      value={selectedPlaceOfSupply}
                      getOptionLabel={(option) => option.name}
                      onChange={(e, val) => {
                        setSelectedPlaceOfSupply(val);
                        setStateId(val ? val.state_id : null);
                      }}
                      ListboxProps={{ sx: { fontSize: "1rem" } }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          autoComplete="off"
                          placeholder="Place"
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
                            },
                          }}
                          inputProps={{
                            style: {
                              fontFamily: "Times New Roman",
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
                  </Grid>
                </Grid>
              )}
              {selectedCustomer === null ? (
                ""
              ) : (
                <Grid
                  item
                  container
                  xs={12}
                  sx={{
                    width: "100%",
                    height: "auto",
                    minHeight: "60px",
                    backgroundColor: "#F9F9FB",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      pl: 3,
                    }}
                  >
                    Invoice#
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Autocomplete
                      disablePortal
                      options={
                        invoiceDetails
                          ? invoiceDetails &&
                            invoiceDetails.map((item) => ({
                              invoice_no: item.invoice_no,
                              invoice_id: item.id,
                            }))
                          : []
                      }
                      value={selectedInvoice}
                      onChange={(e, val) => {
                        setSelectedInvoice(val);
                      }}
                      getOptionLabel={(option) => option.invoice_no}
                      ListboxProps={{ sx: { fontSize: "1rem" } }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          autoComplete="off"
                          placeholder="Select Invoice Number"
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
                  </Grid>
                </Grid>
              )}
              {selectedCustomer === null ? (
                ""
              ) : (
                <Grid
                  item
                  container
                  xs={12}
                  sx={{
                    width: "100%",
                    height: "auto",
                    minHeight: "80px",
                    backgroundColor: "#F9F9FB",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      pl: 3,
                    }}
                  >
                    Invoice Type
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Autocomplete
                      disablePortal
                      options={invoiceTypeDetails}
                      getOptionLabel={(option) => option.name || ""}
                      getOptionSelected={(option) =>
                        option.name === selectedInvoiceType
                      }
                      value={selectedInvoiceType}
                      onChange={(e, val) => {
                        setSelectedInvoiceType(val);
                      }}
                      sx={{
                        "& + .MuiAutocomplete-popper .MuiAutocomplete-option:hover":
                          {
                            backgroundColor: "#cccccc",
                          },
                      }}
                      ListboxProps={{
                        sx: {
                          fontSize: "1rem",
                        },
                      }}
                      renderOption={(props, option) => (
                        <li
                          {...props}
                          style={{
                            marginBottom: "10px", // Adjust the spacing as needed
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <span>{option.name}</span>
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "gray",
                              }}
                            >
                              {option.desc}
                            </span>
                          </div>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          autoComplete="off"
                          placeholder="Search or select Invoice Type"
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
                            },
                          }}
                          inputProps={{
                            style: {
                              fontFamily: "Times New Roman",
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
                  </Grid>
                </Grid>
              )}
              <Grid
                container
                className={
                  selectedCustomer === null ? classes.disabledGrid : ""
                }
              >
                <Grid
                  item
                  container
                  xs={12}
                  sx={{
                    width: "100%",
                    height: "auto",
                    minHeight: "60px",
                    backgroundColor: "#F9F9FB",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      pl: 3,
                    }}
                  >
                    Reason
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Autocomplete
                      disablePortal
                      options={Reasons}
                      getOptionLabel={(option) => option}
                      value={
                        Reasons.find((option) => option === selectedReason) ||
                        selectedReason
                      }
                      onChange={(e, val) => {
                        setSelectedReason(val);
                      }}
                      sx={{
                        "& + .MuiAutocomplete-popper .MuiAutocomplete-option:hover":
                          {
                            backgroundColor: "#cccccc",
                          },
                      }}
                      ListboxProps={{
                        sx: { fontSize: "1.1rem" },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          autoComplete="off"
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
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  xs={12}
                  sx={{
                    width: "100%",
                    height: "auto",
                    minHeight: "70px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      color: "red",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      pl: 3,
                    }}
                  >
                    Credit Note#*
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={5.17}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
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
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <SettingsOutlinedIcon
                              sx={{ color: "gray", cursor: "pointer" }}
                              onClick={handleConfigureOpen}
                            />
                          </InputAdornment>
                        ),
                      }}
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value)}
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
                    minHeight: "70px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      pl: 3,
                    }}
                  >
                    Reference
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      variant="outlined"
                      autoComplete="off"
                      placeholder="Enter Reference"
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
                        },
                      }}
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
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
                    minHeight: "70px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    borderBottom: "1px solid #e6e6e6",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      pl: 3,
                      color: "red",
                    }}
                  >
                    Credit Note Date*
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      pl: 1.5,
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
                </Grid>
                <Grid
                  item
                  container
                  xs={12}
                  sx={{
                    width: "100%",
                    height: "auto",
                    minHeight: "120px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    borderBottom: "1px solid #e6e6e6",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      pl: 3,
                    }}
                  >
                    Sales Person
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <>
                      <TextField
                        variant="outlined"
                        autoComplete="off"
                        placeholder="Select or Search Salesperson"
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
                          },
                        }}
                        value={selectedSales}
                        onClick={handlePopoverOpen}
                      />
                      <Popover
                        style={{
                          marginLeft: 12,
                          width: "100%",
                          height: "100%",
                          maxHeight: "300px",
                          display: "flex",
                          flexDirection: "column",
                        }}
                        open={openPop}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <Paper
                          elevation={3}
                          style={{
                            width: "485px",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              height: "auto",
                              maxHeight: "200px",
                              overflowY: "auto",
                              overflowX: "hidden",
                              borderBottom: "1px solid #eee",
                            }}
                          >
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              placeholder="Search"
                              style={{
                                width: "95%",
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
                                },
                              }}
                              value={searchSales}
                              onChange={(e) => setSearchSales(e.target.value)}
                            />
                            {salesList
                              .filter((item) =>
                                item.name
                                  .toString()
                                  .toLowerCase()
                                  .includes(searchSales.toLowerCase())
                              )
                              .map((option, index) => (
                                <MenuItem
                                  key={index}
                                  sx={{ fontSize: "1.2rem" }}
                                  onClick={() =>
                                    handleMenuItemClick(
                                      option.sales_person_id,
                                      option.name
                                    )
                                  }
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <div>{option.name}</div>
                                    {/* Display email */}
                                    <div
                                      style={{
                                        fontSize: "0.8rem",
                                        color: "#666",
                                      }}
                                    >
                                      {option.e_mail}
                                    </div>
                                  </div>
                                </MenuItem>
                              ))}
                          </div>
                          <div
                            style={{
                              height: "auto",
                              minHeight: 50,
                              paddingLeft: 15,
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={handleConfigSalesOpen}
                          >
                            <Typography
                              sx={{ fontSize: "20px", display: "flex", gap: 2 }}
                            >
                              <SettingsOutlinedIcon /> Manage Sales Person
                            </Typography>
                          </div>
                        </Paper>
                      </Popover>
                    </>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  xs={12}
                  sx={{
                    width: "100%",
                    height: "auto",
                    minHeight: "120px",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    borderBottom: "1px solid #e6e6e6",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      fontSize: "20px",
                      fontFamily: "Times New Roman",
                      pl: 3,
                    }}
                  >
                    Subject
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      variant="outlined"
                      autoComplete="off"
                      multiline
                      rows={2}
                      placeholder="Let your customer know what this Credit Note is for."
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
                        },
                      }}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    ></TextField>
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  xs={10}
                  sx={{
                    width: "100%",
                    height: "auto",
                    minHeight: "200px",
                    display: "flex",
                    justifyContent: "flex-start",
                    //alignItems: "center",
                    mt: 3,
                    pl: 2,
                  }}
                >
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#F9F9FB" }}>
                          <TableCell
                            colSpan={6}
                            sx={{
                              fontSize: "20px",
                              fontFamily: "Times New Roman",
                              fontWeight: "bold",
                            }}
                          >
                            Item Table
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Times New Roman",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              p: 1,
                              color: "#6C7184",
                              borderBottom: "0.5px solid #e6e6e6",
                              pl: 2,
                            }}
                          >
                            Item Details
                          </TableCell>
                          {/* <TableCell
                          sx={{
                            fontSize: "1.2rem",
                            fontFamily: "Times New Roman",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            p: 1,
                            color: "#6C7184",
                            borderBottom: "0.5px solid #e6e6e6",
                            pl: 2,
                          }}
                        >
                          Account
                        </TableCell> */}
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Times New Roman",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              p: 1,
                              color: "#6C7184",
                              borderBottom: "0.5px solid #e6e6e6",
                              pl: 2,
                            }}
                          >
                            Quantity
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Times New Roman",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              p: 1,
                              color: "#6C7184",
                              borderBottom: "0.5px solid #e6e6e6",
                              pl: 2,
                            }}
                          >
                            Rate
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Times New Roman",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              p: 1,
                              color: "#6C7184",
                              borderBottom: "0.5px solid #e6e6e6",
                              pl: 2,
                            }}
                          >
                            Discount
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Times New Roman",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              p: 1,
                              color: "#6C7184",
                              borderBottom: "0.5px solid #e6e6e6",
                              pl: 2,
                            }}
                          >
                            Tax
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Times New Roman",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                              p: 1,
                              color: "#6C7184",
                              borderBottom: "0.5px solid #e6e6e6",
                              textAlign: "right",
                            }}
                          >
                            Amount
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {addItem &&
                          addItem.map((item, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell sx={{ width: "25%" }}>
                                  <Autocomplete
                                    disablePortal
                                    options={itemList}
                                    getOptionLabel={(option) =>
                                      option.name || ""
                                    }
                                    getOptionSelected={(option) =>
                                      option.name === selectedItem
                                    }
                                    value={selectedItem[index]}
                                    onChange={(event, value) => {
                                      const updatedItemList = [...selectedItem];
                                      const updatedItemId = [...selectedItemId];

                                      if (value) {
                                        // Update the selected item and item ID when value is provided
                                        updatedItemList[index] = value;
                                        updatedItemId[index] = value.id;
                                        setSelectedItem(updatedItemList);
                                        setSelectedItemId(updatedItemId);
                                        handleItemSelect(value.id, index);
                                      } else {
                                        // Clear the selected item and item ID when value is empty
                                        updatedItemList[index] = "";
                                        updatedItemId[index] = "";
                                        setSelectedItem(updatedItemList);
                                        setSelectedItemId(updatedItemId);
                                        handleClearFields(index);
                                      }
                                    }}
                                    sx={{
                                      "& + .MuiAutocomplete-popper .MuiAutocomplete-option:hover":
                                        {
                                          backgroundColor: "#cccccc",
                                        },
                                    }}
                                    ListboxProps={{
                                      sx: {
                                        fontSize: "1rem",
                                      },
                                    }}
                                    renderOption={(props, option) => (
                                      <li
                                        {...props}
                                        style={{
                                          marginBottom: "10px", // Adjust the spacing as needed
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                          }}
                                        >
                                          <span>{option.name}</span>
                                          <span
                                            style={{
                                              fontSize: "0.8rem",
                                              color: "gray",
                                            }}
                                          >
                                            rate : {option.sales_s_price}
                                          </span>
                                        </div>
                                      </li>
                                    )}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="outlined"
                                        autoComplete="off"
                                        placeholder="Search or select Item"
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
                                          },
                                        }}
                                        inputProps={{
                                          style: {
                                            fontFamily: "Times New Roman",
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
                                </TableCell>
                                {/* <TableCell sx={{ width: "25%" }}>
                                <Autocomplete
                                  options={options}
                                  groupBy={(option) => option.account_type}
                                  getOptionLabel={(option) =>
                                    option.account_name || ""
                                  }
                                  value={selectedAccount[index]}
                                  onChange={(event, value) => {
                                    const updatedAccount = [...selectedAccount];
                                    updatedAccount[index] = value;
                                    setSelectedAccount(updatedAccount);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="outlined" autoComplete="off"
                                      placeholder="Search or select Account"
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
                                        },
                                      }}
                                      inputProps={{
                                        style: {
                                          fontFamily: "Times New Roman",
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
                                  renderOption={(props, option) => (
                                    <div>
                                      <ListItem {...props}>
                                        <ListItemText
                                          primary={
                                            <>
                                            
                                              {option.level === 1 && (
                                                <span
                                                  style={{
                                                    paddingLeft: "20px",
                                                    color: "#888",
                                                  }}
                                                >
                                                  •{" "}
                                                </span>
                                              )}
                                              {option.account_name}
                                            </>
                                          }
                                          style={{
                                            paddingLeft:
                                              option.level === 0
                                                ? "0px"
                                                : "20px", // Indent sub-accounts
                                          }}
                                        />
                                      </ListItem>
                                    </div>
                                  )}
                                />
                              </TableCell> */}
                                <TableCell align="right" sx={{ width: "10%" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: "20px",
                                      fontWeight: "bold",
                                      fontFamily: "Times New Roman",
                                    }}
                                  >
                                    <TextField
                                      variant="outlined"
                                      autoComplete="off"
                                      placeholder="Enter Name"
                                      style={{
                                        width: "100%",
                                        fontSize: "1rem",
                                        cursor: "pointer",
                                        padding: "8px 12px",
                                        border: "none", // This might not work in some cases
                                        borderWidth: 0,
                                      }}
                                      InputLabelProps={{ shrink: true }}
                                      inputProps={{
                                        style: {
                                          fontFamily: "Times New Roman",
                                          height: 10,
                                          fontSize: "1.3rem",
                                          textAlign: "right",
                                        },
                                      }}
                                      value={quantity[index]}
                                      onChange={(e) =>
                                        handleChangeQuantity(
                                          index,
                                          e.target.value
                                        )
                                      }
                                    />
                                    {selectedItem[index] !== "" &&
                                      itemDetails &&
                                      itemDetails[index] &&
                                      itemDetails[index][0] &&
                                      itemDetails[index][0].unit}
                                  </div>
                                </TableCell>
                                <TableCell sx={{ width: "15%" }}>
                                  <TextField
                                    variant="outlined"
                                    autoComplete="off"
                                    placeholder="Enter Name"
                                    style={{
                                      width: "100%",
                                      fontSize: "1rem",
                                      cursor: "pointer",
                                      padding: "8px 12px",
                                      border: "none", // This might not work in some cases
                                      borderWidth: 0,
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{
                                      style: {
                                        fontFamily: "Times New Roman",
                                        height: 10,
                                        fontSize: "1.3rem",
                                        textAlign: "right",
                                      },
                                    }}
                                    value={rate[index]}
                                    onChange={(e) => {
                                      handleChangeRate(index, e.target.value);
                                    }}
                                  />
                                </TableCell>
                                <TableCell sx={{ width: "15%" }} align="right">
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <TextField
                                      variant="outlined"
                                      autoComplete="off"
                                      placeholder="Enter Name"
                                      style={{
                                        flex: 1,
                                        marginRight: "8px",
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
                                          textAlign: "right",
                                        },
                                      }}
                                      value={discount[index]}
                                      onChange={(e) =>
                                        handleChangeDiscount(
                                          index,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <FormControl
                                      sx={{ Width: "20px" }}
                                      variant="standard"
                                    >
                                      <Select
                                        labelId="demo-customized-select-label"
                                        id="demo-customized-select"
                                        value={perorRupee[index]}
                                        onChange={(e) =>
                                          handleChange(index, e.target.value)
                                        }
                                        input={<BootstrapInput />}
                                      >
                                        <MenuItem value="">
                                          <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={"%"}>%</MenuItem>
                                        <MenuItem value={"₹"}>₹</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                </TableCell>

                                <TableCell
                                  sx={{ width: "15%", cursor: "not-allowed" }}
                                >
                                  <Autocomplete
                                    fullWidth
                                    disabled
                                    value={
                                      selectedItemGST[index]
                                        ? gstOptions.find(
                                            (option) =>
                                              option.value ===
                                              selectedItemGST[index].value
                                          )
                                        : null
                                    }
                                    onChange={(event, value) => {
                                      // Create a copy of the selectedItemGST array
                                      const updatedItemListGST = [
                                        ...selectedItemGST,
                                      ];
                                      // Update the specific index with the selected value
                                      updatedItemListGST[index] = value || null;
                                      // Update the state
                                      setSelectedItemGST(updatedItemListGST);
                                    }}
                                    options={gstOptions}
                                    getOptionLabel={(option) => option.label}
                                    ListboxProps={{ sx: { fontSize: "1rem" } }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="outlined"
                                        autoComplete="off"
                                        style={{
                                          width: "95%",
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
                                </TableCell>
                                <TableCell
                                  sx={{
                                    width: "15%",
                                    fontSize: "20px",
                                    fontWeight: "bold",
                                    fontFamily: "Times New Roman",
                                    textAlign: "right",
                                  }}
                                >
                                  {handleSetAmount(index)}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ width: "15%", border: "none" }}
                                >
                                  <CloseIcon
                                    onClick={() => handleClearFields(index)}
                                    sx={{ cursor: "pointer", color: "red" }} // Adjust styling as needed
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
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
                    minHeight: "300px",
                    display: "flex",
                    justifyContent: "flex-start",
                    //alignItems: "center",
                    pl: 2,
                    mt: 1,
                    pb: 2,
                  }}
                >
                  <Grid item xs={12} md={5.1}>
                    <Button
                      sx={{
                        width: "200px",
                        borderRadius: 2,
                        display: "flex",
                        backgroundColor: "#408DFB",
                        "&:hover": {
                          backgroundColor: "#008064",
                        },
                      }}
                      variant="contained"
                      size="large"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        handleAddRow();
                      }}
                    >
                      Add Row
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={4.5}
                    sx={{
                      backgroundColor: "#F9F9FB",
                      height: "auto",
                      minHeight: "400px",
                      borderRadius: "10px",
                    }}
                  >
                    <Grid
                      item
                      container
                      xs={12}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: "50px",
                        mt: 1,
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                          fontSize: "20px",
                          //fontWeight: "bold",
                          fontFamily: "Times New Roman",
                          pl: 2,
                        }}
                      >
                        Sub Total
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                          fontSize: "20px",
                          //fontWeight: "bold",
                          fontFamily: "Times New Roman",
                          display: "flex",
                          justifyContent: "end",
                          pr: 2,
                        }}
                      >
                        {amount}
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      container
                      xs={12}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: "70px",
                        mt: 1,
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          pl: 2,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "20px",
                              //fontWeight: "bold",
                              fontFamily: "Times New Roman",
                            }}
                          >
                            Shipping Charges
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontFamily: "Times New Roman",
                              color: "#408DFB",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleTaxModal();
                            }}
                          >
                            Apply Tax on shipping
                            <br /> charges
                          </div>
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          pr: 2,
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
                              height: 5,
                              fontSize: "1.3rem",
                              textAlign: "right",
                              backgroundColor: "#FFF",
                            },
                          }}
                          value={shippingCharges}
                          onChange={(e) => {
                            setShippingCharges(e.target.value);
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                          fontSize: "20px",
                          //fontWeight: "bold",
                          fontFamily: "Times New Roman",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                          pr: 2,
                        }}
                      >
                        {shippingCharges}.00
                      </Grid>
                    </Grid>
                    {taxView === true ? (
                      <React.Fragment>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            minHeight: "70px",
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                              fontSize: "20px",
                              //fontWeight: "bold",
                              fontFamily: "Times New Roman",
                              pl: 2,
                            }}
                          >
                            CGST[%]
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                              fontSize: "20px",
                              //fontWeight: "bold",
                              fontFamily: "Times New Roman",
                              display: "flex",
                              justifyContent: "end",
                              pr: 2,
                            }}
                          >
                            {savedGST}
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{
                            width: "100%",
                            height: "auto",
                            minHeight: "70px",
                            mt: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                              fontSize: "20px",
                              //fontWeight: "bold",
                              fontFamily: "Times New Roman",
                              pl: 2,
                            }}
                          >
                            SGST[%]
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                              fontSize: "20px",
                              //fontWeight: "bold",
                              fontFamily: "Times New Roman",
                              display: "flex",
                              justifyContent: "end",
                              pr: 2,
                            }}
                          >
                            {savedGST}
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    ) : (
                      ""
                    )}
                    <Grid
                      item
                      container
                      xs={12}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: "70px",
                        mt: 1,
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                          pl: 2,
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
                        }}
                      >
                        <RadioGroup
                          row
                          aria-label="member-type"
                          name="memberType"
                          value={selectedTaxType}
                          onChange={handleTaxTypeChange}
                        >
                          <FormControlLabel
                            value="TDS"
                            control={<Radio style={{ color: "#408DFB" }} />}
                            label={
                              <Typography
                                sx={{ fontSize: "1.2rem", color: "#000000" }}
                              >
                                TDS
                              </Typography>
                            }
                          />
                          <FormControlLabel
                            value="TCS"
                            control={<Radio style={{ color: "#408DFB" }} />}
                            label={
                              <Typography
                                sx={{ fontSize: "1.2rem", color: "#000000" }}
                              >
                                TCS
                              </Typography>
                            }
                          />
                        </RadioGroup>
                      </Grid>
                      <Grid item xs={12} md={3.7}>
                        <Autocomplete
                          disablePortal
                          options={
                            tDSTCSList
                              ? tDSTCSList.map((item) => ({
                                  rate: item.rate,
                                  display_name: item.tax,
                                  id: item.id,
                                }))
                              : []
                          }
                          value={selectedTDSTCS}
                          onChange={(e, val) => {
                            setSelectedTDSTCS(val);
                            setSelectedRate(val ? val.rate : null); // Check if val is not null
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
                              placeholder="Select Type"
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
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={1}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          pb: 1,
                          pl: 3,
                        }}
                      >
                        <SettingsOutlinedIcon
                          sx={{ color: "gray", cursor: "pointer" }}
                          onClick={() => {
                            selectedTaxType === "TDS"
                              ? handleManageTdsOpen()
                              : handleManageTcsOpen();
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={3.3}
                        sx={{
                          display: "flex",
                          justifyContent: "end",
                          alignItems: "center",
                          fontSize: "20px",
                          fontFamily: "Times New Roman",
                          pr: 2,
                        }}
                      >
                        {selectedTaxType === "TDS" && tdsShow > 0
                          ? "-" + tdsShow
                          : selectedTaxType === "TCS" && tdsShow > 0
                          ? tdsShow
                          : "0.00"}
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      container
                      xs={12}
                      sx={{
                        width: "100%",
                        height: "auto",
                        minHeight: "50px",
                        mt: 1,
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        md={4}
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          alignItems: "center",
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
                          value={adjustment}
                          onChange={(e) => setAdjustment(e.target.value)}
                        ></TextField>
                      </Grid>
                      <Grid item xs={12} md={3.7}>
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
                              textAlign: "right",
                            },
                          }}
                          value={costAdd}
                          onChange={(e) => setCostAdd(e.target.value)}
                        ></TextField>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4.3}
                        sx={{
                          display: "flex",
                          justifyContent: "end",
                          alignItems: "center",
                          fontSize: "20px",
                          fontFamily: "Times New Roman",
                          pr: 2,
                        }}
                      >
                        {costAdd}
                      </Grid>
                    </Grid>
                    <Grid p={2}>
                      <Grid
                        item
                        container
                        xs={12}
                        sx={{
                          width: "100%",
                          height: "auto",
                          minHeight: "40px",
                          borderTop: "1px solid #b3b3b3",
                        }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={6}
                          sx={{
                            pl: 2,
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                            fontSize: "25px",
                            fontFamily: "Times New Roman",
                          }}
                        >
                          Total(₹)
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={6}
                          sx={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                            fontSize: "20px",
                            fontFamily: "Times New Roman",
                            pr: 2,
                          }}
                        >
                          {total ? total : "0.00"}
                        </Grid>
                      </Grid>
                    </Grid>
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
                position: "fixed", // Fixes the grid at the bottom
                bottom: 0, // Positions it at the bottom
                left: 241, // Ensures it stretches from the left edge
                //  zIndex: 1300, // Keeps it above other content
                backgroundColor: "white", // Optional: ensures background color
              }}
              component={Paper}
              elevation={3}
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
                    navigate(-1);
                  }}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#408DFB",
                    "&:hover": {
                      backgroundColor: isSavingDraft ? "#408DFB" : "#3070C0",
                    },
                    color: "white",
                  }}
                  size="medium"
                  onClick={() => {
                    if (!isSavingDraft) {
                      handleSaveDraft();
                    }
                  }}
                  startIcon={
                    isSavingDraft ? (
                      <CircularProgress size={20} sx={{ color: "inherit" }} />
                    ) : null
                  }
                >
                  {isSavingDraft ? "Saving..." : "Save as Draft"}
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#408DFB",
                    "&:hover": {
                      backgroundColor: isSavingAndSending
                        ? "#408DFB"
                        : "#3070C0",
                    },
                    color: "white",
                  }}
                  size="medium"
                  onClick={() => {
                    if (!isSavingAndSending) {
                      handleSaveAsOpen();
                    }
                  }}
                  startIcon={
                    isSavingAndSending ? (
                      <CircularProgress size={20} sx={{ color: "inherit" }} />
                    ) : null
                  }
                >
                  {isSavingAndSending ? "Saving..." : "Save As Open"}
                </Button>
              </Grid>
            </Grid>
          </React.Fragment>
        </Grid>
      </Sidebar>
    </React.Fragment>
  );
};

export default NewCreditNotes;
