import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  Drawer,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  MenuItem,
  Modal,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Select,
  Slide,
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
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Country, State } from "country-state-city";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ModalNetMaster from "../../UsableContent/ModalNetMaster";
import ModalEditableSeries from "../../UsableContent/ModalEditableSeries";
import ModalManageTcs from "../../UsableContent/ModalManageTcs";
import { useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import ModalManageTds from "../../UsableContent/ModalManageTds";
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

const deliveryMethod = ["Customer Transportation"];

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

const EditSalesOrder = ({ onLogout }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState([]);
  const [selectedPlaceOfSupply, setSelectedPlaceOfSupply] = useState(null);
  const [configureOpen, setConfigureOpen] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [from, setFrom] = useState(dayjs());
  const [to, setTo] = useState("");
  const [reference, setReference] = useState("");
  const [orderNo, setOrderNo] = useState("");
  const [salesList, setSalesList] = useState([]);
  const [searchSales, setSearchSales] = useState("");
  const [selectedSales, setSelectedSales] = useState(null);
  const [selectedSalesPersonId, setSelectedSalesPersonId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [salesOpen, setSalesOpen] = useState(false);
  const [searchSalesConfig, setSearchSalesConfig] = useState("");
  const [salesListTable, setSalesListTable] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [addSalesPerson, setAddSalesPerson] = useState(false);
  const [salesName, setSalesName] = useState("");
  const [salesEmail, setSalesEmail] = useState("");
  const [salesMobile, setSalesMobile] = useState("");
  const [addItem, setAddItem] = useState([1]);
  const [itemList, setItemList] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [selectedItem, setSelectedItem] = useState([""]);
  const [selectedItemId, setSelectedItemId] = useState([""]);
  const [selectedItemGST, setSelectedItemGST] = useState([""]);
  const [itemDetails, setItemDetails] = useState("");
  const [quantity, setQuantity] = useState(["1.00"]);
  const [perorRupee, setPerOrRupee] = React.useState(["%"]);
  const [discount, setDiscount] = useState(["0"]);
  const [rate, setRate] = useState(["0"]);
  const [amount, setAmount] = useState("0");
  const [shippingCharges, setShippingCharges] = useState("");
  const [taxOpen, setTaxOpen] = useState(false);
  const [selectedGst, setSelectedGst] = React.useState(null);
  const [gstOptions, setGstOptions] = useState([]);
  const [taxId, setTaxId] = useState(null);
  const [taxView, setTaxView] = useState(false);
  const [savedGST, setSavedGST] = useState("");
  const [adjustment, setAdjustment] = useState("Adjustment");
  const [costAdd, setCostAdd] = useState("");
  const [termsList, setTermsList] = useState("");
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [manageTerms, setManageTerms] = useState(false);
  const [editDetails, setEditDetails] = useState([]);
  const [openPrefix, setOpenPrefix] = useState(false);
  const [manageTds, setManageTds] = useState(false);
  const [manageTcs, setManageTcs] = useState(false);
  const [newTds, setNewTds] = useState(false);
  const [newTcs, setNewTcs] = useState(false);
  const [editTds, setEditTds] = useState(false);
  const [editTcs, setEditTcs] = useState(false);
  const [seriesNo, setSeriesNo] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [total, setTotal] = useState("");
  const [tDSTCSList, setTDSTCSList] = useState([]);
  const [selectedTDSTCS, setSelectedTDSTCS] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [tdsShow, setTdsShow] = useState("");
  const [selectedTaxType, setSelectedTaxType] = useState("TDS");
  const [isSavingDraft, setIsSavingDraft] = useState(false); // Loading state for Save as Draft
  const [isSavingAndSending, setIsSavingAndSending] = useState(false); // Loading state for Save and Send
  const [save, setSave] = useState("");
  const location = useLocation();
  const { salesDetails } = location.state || {};
  const [isModalOpen, setModalOpen] = useState(false);
  const [isBillingOpen, setBillingOpen] = useState(false);
  const [address, SetAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressSelect, setAddressSelect] = useState([]);
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
  const [items, setItems] = useState("");
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
    setSelectedAddress(address);
    setModalOpen(false);
  };

  const handleAddressBillingSelect = (address) => {
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

  const getSalesOrder = () => {
    const params = {
      json_type: "get_sales_orders",
      type: "2",
      sales_ids: [salesDetails[0]?.id],
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
          const itemDetails = JsonData[0].item_details;
          const itemDetailsLength = itemDetails.length;

          const customerDetails = JsonData; // Adjust this path based on your actual response structure
          setItems(itemDetails);
          setAddressSelect(JsonData);
          if (customerDetails) {
            const selectedCustomer = {
              id: customerDetails[0].cust_id,
              display_name: customerDetails[0].display_name,
            };
            setSelectedCustomer(selectedCustomer);
            handleCustomerSelect(selectedCustomer ? selectedCustomer.id : null); // If needed
            console.log(selectedCustomer);
          }

          // Set addItem based on the length of itemDetails
          setAddItem(Array(itemDetailsLength).fill({}));

          const updatedSelectedItem = itemDetails.map((item) => {
            return {
              name: item.item,
              code: item.code,
            };
          });

          const updatedSelectedItemId = itemDetails.map((item) => {
            return {
              id: item.item_id,
            };
          });
          setSelectedItem(updatedSelectedItem);
          setSelectedItemId(updatedSelectedItemId);
          console.log(updatedSelectedItemId);
          console.log(updatedSelectedItem);
          setPrefix(JsonData[0].sales_order_no);
          setReference(JsonData[0].reference);
          setFrom(JsonData[0].sales_order_date);
          setTo(JsonData[0].due_date);
          setSelectedDelivery(JsonData[0].delivery_method);
          handleMenuItemClick(
            JsonData[0].sales_person_id,
            JsonData[0].sales_person
          );
          if (JsonData) {
            const selectedTerm = {
              name: JsonData[0].terms_name,
              no_days: JsonData[0].no_days,
              id: JsonData[0].terms_id,
            };
            setSelectedTerm(selectedTerm);
          }
          setShippingCharges(JsonData[0].ship_charge);
          setQuantity(itemDetails.map((item) => item.qty));
          setRate(itemDetails.map((item) => item.rate));
          setDiscount(itemDetails.map((item) => item.discount));
          setPerOrRupee(itemDetails.map((item) => item.per_rupee));
          if (JsonData[0].tds < 0 && JsonData[0].tcs === "0.00") {
            setSelectedTaxType("TDS");
            const tdsDetails = JsonData; // Adjust this path based on your actual response structure
            if (tdsDetails) {
              const selectedTdsTcs = {
                rate: JsonData[0].rate,
                display_name: JsonData[0].tax,
                id: JsonData[0].tds_tcs_id,
              };
              if (selectedTdsTcs.display_name !== "-") {
                setSelectedTDSTCS(selectedTdsTcs);
                setSelectedRate(selectedTdsTcs.rate); // Check if val is not null
              } else {
                setSelectedTDSTCS(null);
                setSelectedRate(null);
              }
            }
          } else if (JsonData[0].tds === "0.00" && JsonData[0].tcs > 0) {
            setSelectedTaxType("TCS");
            const tdsDetails = JsonData; // Adjust this path based on your actual response structure
            if (tdsDetails) {
              const selectedTdsTcs = {
                rate: JsonData[0].rate,
                display_name: JsonData[0].tax,
                id: JsonData[0].tds_tcs_id,
              };
              if (selectedTdsTcs.display_name !== "-") {
                setSelectedTDSTCS(selectedTdsTcs);
                setSelectedRate(selectedTdsTcs.rate); // Check if val is not null
              } else {
                setSelectedTDSTCS(null);
                setSelectedRate(null);
              }
            } else {
              setSelectedTDSTCS(null);
              setSelectedRate(null);
            }
          }
          setAdjustment(JsonData[0].adjustment_name);
          setCostAdd(JsonData[0].adjustment);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };
  useEffect(() => {
    getSalesOrder();
  }, [salesDetails]);

  useEffect(() => {
    const initialGSTSelection =
      items &&
      items.map((item) => {
        return (
          gstOptions.find((option) => option.label === item.tax_name) || null
        );
      });
    setSelectedItemGST(initialGSTSelection);
    const gstOption = gstOptions.find(
      (option) => option.tax_id === addressSelect[0].tax_id
    );
    if (gstOption) {
      setSelectedGst(gstOption.value);
      setTaxId(gstOption.tax_id);
      handleSaveTax();
    } else {
      setSelectedGst(null);
      setTaxId(null);
    }
  }, [items, gstOptions]);

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

  const handleOpenPrefix = () => {
    setOpenPrefix(true);
  };

  const handleClosePrefix = () => {
    setOpenPrefix(false);
  };

  const handleTermsOpen = () => {
    setManageTerms(true);
  };

  const handleTermsClose = () => {
    setManageTerms(false);
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
    setSelectedSalesPersonId(sales_person_id);
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

  const url1 = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app2";

  const getCustomerList = () => {
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

  const getEditDetails = () => {
    const params = {
      json_type: "get_trans_series",
      type: "2",
      id: "5",
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
          setEditDetails(JsonData);
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
        user_id: userid,
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
    if (id !== null) {
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
    }
  };

  useEffect(() => {
    // When placeOfSupply is updated, and customer details exist, set the state
    if (addressSelect.length > 0) {
      const placeOption = placeOfSupply.find(
        (option) => option.name === addressSelect[0]?.plc_supply
      );
      if (placeOption) {
        setSelectedPlaceOfSupply(placeOption);
        setStateId(placeOption.state_id);
      }
    }
  }, [addressSelect, placeOfSupply]);

  // const handleSetTerms = (val) => {
  //   const fromDate = dayjs(from);
  //   const toDate = fromDate.add(val, "day").toDate(); // Convert to JS Date object
  //   setTo(toDate);
  // };

  const handleEditSaveSalesOrder = (send, setLoading) => {
    setLoading(true);
    const itemsId =
      selectedItemId && selectedItemId.length > 0
        ? selectedItemId.map((item) => ({ id: item.id }))
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
      setTimeout(() => {
        setLoading(false);
      }, 1500);
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
      json_type: "edit_sales_order",
      cust_id: selectedCustomer?.id,
      plc_supply: stateId,
      sales_order_no: prefix,
      reference: reference || "",
      sales_order_date: dayjs(from).format("YYYY-MM-DD"),
      ex_ship_date: dayjs(to).format("YYYY-MM-DD"),
      pay_terms: selectedTerm?.id,
      sales_person_id: selectedSalesPersonId || 0,
      item_details:
        combinedItemArray[0].item_id !== "" ? combinedItemArray : "",
      delivery_method: selectedDelivery,
      sub_total: parsedAmount || 0,
      ship_charge: shippingCharges || 0,
      ship_cgst: savedGST || 0,
      ship_sgst: savedGST || 0,
      tcs: selectedTaxType === "TCS" ? tdsShow || 0 : "0.00",
      tds: selectedTaxType === "TDS" ? `-${tdsShow || 0}` : "0.00",
      adjustment: costAdd || 0,
      adj_name: adjustment || "Adjustment",
      total: parsedTotal || 0,
      quote_no: orderNo || "",
      tax_id: taxId || "0",
      tax_pern_id: selectedTDSTCS?.id || "0",
      org_id: orgid,
      user_id: userid,
      bill_id:
        selectedBillingAddress === null
          ? addressSelect[0]
            ? addressSelect[0].b_address.address_id
            : ""
          : selectedBillingAddress.address_id,
      ship_id:
        selectedAddress === null
          ? addressSelect[0]
            ? addressSelect[0].s_address.address_id
            : ""
          : selectedAddress.address_id,
      user: user,
      sales_order_id: salesDetails[0]?.id,
    };

    // Field messages for missing/invalid values
    const fieldMessages = {
      cust_id: "Customer is not selected.",
      plc_supply: "Place of supply is not selected.",
      sales_order_no: "Sales order number is missing.",
      sales_order_date: "Sales order date is missing or invalid.",
      ex_ship_date: "Expected shipment date is missing or invalid.",
      pay_terms: "Payment terms are not selected.",
      sales_person_id: "Salesperson is missing.",
      item_details: "No items have been added.",
      sub_total: "Subtotal is missing.",
      ship_charge: "Shipping charge is missing.",
      ship_cgst: "Shipping CGST is missing.",
      ship_sgst: "Shipping SGST is missing.",
      tcs: "TCS amount is required.",
      tds: "TDS amount is required.",
      adjustment: "Adjustment amount is required.",
      total: "Total amount is missing.",
      org_id: "Organization ID is missing.",
      user_id: "User ID is missing.",
      bill_id: "Billing address is not selected.",
      ship_id: "Shipping address is not selected.",
      delivery_method: "Delivery method is not selected.",
    };

    // Validate required fields
    for (const key in params) {
      if (
        params[key] === null ||
        params[key] === undefined ||
        params[key] === "" ||
        params[key] === "Invalid Date" ||
        (Array.isArray(params[key]) && params[key].length === 0)
      ) {
        if (key !== "reference" && key !== "quote_no" && key !== "quote_ids") {
          setSnackbarMessage(
            fieldMessages[key] ||
              `Please fill out all the fields. Missing: ${key}`
          );
          setSnackbarSeverity("field missing");
          setSnackbarOpen(true);
          setTimeout(() => {
            setLoading(false);
          }, 1500);
          return; // Stop execution if any field (other than 'subject' and 'reference') is empty
        }
      }
    }

    // Proceed with API call if validation passes
    axios
      .post(url1, params, {
        headers: {
          "Content-Type": "application/text",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data);
        const itemFind = JsonData.data;
        const item = itemFind[0];
        if (JsonData.json_sts === "1" && send) {
          setSave(JsonData);
          navigate("/Sales/SalesMail", {
            state: { isSalesOrder: false, data: item },
          });
        } else if (JsonData.json_sts === "1") {
          navigate("/SalesPage/SalesDetailPage", {
            state: { item, edit: "edit" },
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
        console.error("Error editing sales order:", error);
        setSnackbarMessage("There was an error processing your request.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 1500); // Reset loading state
      });
  };

  const handleSaveDraft = () =>
    handleEditSaveSalesOrder(false, setIsSavingDraft);
  const handleSend = () =>
    handleEditSaveSalesOrder(true, setIsSavingAndSending);

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
                fontFamily: "Helvetica",
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
                  fontFamily: "Helvetica",
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
                  fontFamily: "Helvetica",
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
                      fontFamily: "Helvetica",
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
                      fontFamily: "Helvetica",
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
                      fontFamily: "Helvetica",
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
                          fontFamily: "Helvetica",
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
                      fontFamily: "Helvetica",
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
                      fontFamily: "Helvetica",
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
                          fontFamily: "Helvetica",
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
                      fontFamily: "Helvetica",
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
                      fontFamily: "Helvetica",
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
                          fontFamily: "Helvetica",
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
                        backgroundColor: "#408DFB", // Updated color
                        "&:hover": {
                          backgroundColor: "#3070C0", // Slightly darker hover color
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
                        fontFamily: "Helvetica",
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
                        fontFamily: "Helvetica",
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
                        fontFamily: "Helvetica",
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
                    salesListTable.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell
                          sx={{
                            fontSize: "1rem",
                            width: "35%",
                            fontFamily: "Helvetica",
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
                            fontFamily: "Helvetica",
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
                            fontFamily: "Helvetica",
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
            <title>Edit | Sales Order</title>
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
                maxHeight: 835,
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
                      gap: 2,
                    }}
                  >
                    <ShoppingCartOutlinedIcon
                      sx={{
                        width: 40,
                        height: 40,
                        color: "#408DFB",
                        cursor: "pointer",
                      }}
                    />
                    Edit Sales order
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
                    <Tooltip title="Close" arrow>
                      <CloseIcon
                        sx={{ cursor: "pointer" }}
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
                    fontFamily: "Helvetica",
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
                              {addressSelect
                                ? addressSelect[0].b_address.name
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
                              {addressSelect[0]
                                ? addressSelect[0].b_address.add1 +
                                  ", " +
                                  addressSelect[0].b_address.add2
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
                              {addressSelect[0]
                                ? addressSelect[0].b_address.city
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
                              {addressSelect[0]
                                ? addressSelect[0].b_address.state +
                                  " " +
                                  addressSelect[0].b_address.zip
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
                              {addressSelect[0]
                                ? addressSelect[0].b_address.country
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
                              {addressSelect
                                ? "Phone No:   " +
                                  addressSelect[0].b_address.phn
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
                              {addressSelect
                                ? addressSelect[0].s_address.name
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
                              {addressSelect
                                ? addressSelect[0].s_address.add1 +
                                  ", " +
                                  addressSelect[0].s_address.add2 +
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
                              {addressSelect
                                ? addressSelect[0].s_address.city
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
                              {addressSelect
                                ? addressSelect[0].s_address.state +
                                  " " +
                                  addressSelect[0].s_address.zip
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
                              {addressSelect
                                ? addressSelect[0].s_address.country
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
                              {addressSelect
                                ? "Phone No:   " +
                                  addressSelect[0].s_address.phn
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
                              fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                    minHeight: "100px",
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
                      fontFamily: "Helvetica",
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
                        setStateId(val.state_id);
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
                      fontFamily: "Helvetica",
                      pl: 3,
                    }}
                  >
                    Sales Order#
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={5}
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
                          fontFamily: "Helvetica",
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
                      fontFamily: "Helvetica",
                      pl: 3,
                    }}
                  >
                    Reference#
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
                          fontFamily: "Helvetica",
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
                      fontFamily: "Helvetica",
                      pl: 3,
                    }}
                  >
                    Order Number
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      variant="outlined"
                      autoComplete="off"
                      placeholder="Enter Orderno"
                      style={{
                        width: "100%",
                        fontSize: "1rem",
                        cursor: "pointer",
                        padding: "8px 12px",
                      }}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        style: {
                          fontFamily: "Helvetica",
                          height: 10,
                          fontSize: "1.3rem",
                        },
                      }}
                      value={orderNo}
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
                      fontFamily: "Helvetica",
                      pl: 3,
                      color: "red",
                    }}
                  >
                    Sales Order Date*
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
                                fontFamily: "Helvetica",
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
                      fontFamily: "Helvetica",
                      pl: 3,
                    }}
                  >
                    Expected Shipment Date
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
                                fontFamily: "Helvetica",
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
                        value={dayjs(to)}
                        onChange={setTo}
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
                      fontFamily: "Helvetica",
                      pl: 3,
                    }}
                  >
                    Payment Terms
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={2}
                    sx={{
                      //display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      fontSize: "20px",
                      fontFamily: "Helvetica",
                    }}
                  >
                    <Autocomplete
                      disablePortal
                      options={
                        termsList &&
                        termsList.map((term) => ({
                          name: term.term_name,
                          no_days: term.no_days,
                        }))
                      }
                      value={selectedTerm}
                      onChange={(e, val) => {
                        setSelectedTerm(val);
                        // handleSetTerms(val.no_days);
                      }}
                      getOptionLabel={(option) => option.name}
                      sx={{
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
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={0.5}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      fontSize: "20px",
                      fontFamily: "Helvetica",
                      pl: 3,
                    }}
                  >
                    <SettingsOutlinedIcon
                      sx={{ color: "gray", cursor: "pointer" }}
                      onClick={handleTermsOpen}
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
                      fontSize: "20px",
                      fontFamily: "Helvetica",
                      pl: 3,
                    }}
                  >
                    Delivery Method
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={3}
                    sx={{
                      //display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      fontSize: "20px",
                      fontFamily: "Helvetica",
                    }}
                  >
                    <Autocomplete
                      disablePortal
                      options={deliveryMethod}
                      value={selectedDelivery}
                      onChange={(e, val) => setSelectedDelivery(val)}
                      ListboxProps={{ sx: { fontSize: "1rem" } }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          autoComplete="off"
                          placeholder="Select Method"
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
                      fontFamily: "Helvetica",
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
                            fontFamily: "Helvetica",
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
                                  fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                                        updatedItemId[index] = value;
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
                                <TableCell align="right" sx={{ width: "15%" }}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: "20px",
                                      fontWeight: "bold",
                                      fontFamily: "Helvetica",
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
                                          fontFamily: "Helvetica",
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
                                        fontFamily: "Helvetica",
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
                                          fontFamily: "Helvetica",
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
                                        value={perorRupee[index] || ""}
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
                                <TableCell sx={{ width: "15%" }}>
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
                                    fontFamily: "Helvetica",
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
                    borderBottom: "1px solid #e6e6e6",
                    pl: 2,
                    mt: 1,
                    pb: 2,
                  }}
                >
                  <Grid item xs={12} md={5.1}>
                    <Grid
                      item
                      xs={12}
                      sx={{ width: "100%", height: "auto", minHeight: 60 }}
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
                          handleAddRow();
                        }}
                      >
                        Add Row
                      </Button>
                    </Grid>
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
                          fontFamily: "Helvetica",
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
                          fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
                            }}
                          >
                            Shipping Charges
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                          fontFamily: "Helvetica",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                          pr: 2,
                        }}
                      >
                        {shippingCharges}
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
                              fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                              fontFamily: "Helvetica",
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
                          fontFamily: "Helvetica",
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
                            fontFamily: "Helvetica",
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
                            fontFamily: "Helvetica",
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
                      handleSend();
                    }
                  }}
                  startIcon={
                    isSavingAndSending ? (
                      <CircularProgress size={20} sx={{ color: "inherit" }} />
                    ) : null
                  }
                >
                  {isSavingAndSending ? "Saving..." : "Save and Send"}
                </Button>
              </Grid>
            </Grid>
          </React.Fragment>
        </Grid>
      </Sidebar>
    </React.Fragment>
  );
};

export default EditSalesOrder;
