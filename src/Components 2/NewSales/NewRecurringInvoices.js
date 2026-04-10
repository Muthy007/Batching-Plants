import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  MenuItem,
  Modal,
  Paper,
  Popover,
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
import React, { useEffect, useState } from "react";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { State } from "country-state-city";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Slide from "@mui/material/Slide";
import ModalEditableSeries from "../../UsableContent/ModalEditableSeries";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import ModalNetMaster from "../../UsableContent/ModalNetMaster";
import Sidebar from "../../Navbars/Sidebar";

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

const gstOptions = [
  { label: "GST0 [0%]", value: 0 },
  { label: "GST5 [5%]", value: 5 },
  { label: "GST12 [12%]", value: 12 },
  { label: "GST18 [18%]", value: 18 },
  { label: "GST28 [28%]", value: 28 },
];

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

const repeatEvery = [
  "Week",
  "2 Weeks",
  "Month",
  "2 Months",
  "3 Months",
  "6 Months",
  "Year",
  "2 Years",
  "3 Years",
  "Custom",
];

const NewRecurringInvoices = ({ onLogout }) => {
  const navigate = useNavigate();
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState([]);
  const [selectedPlaceOfSupply, setSelectedPlaceOfSupply] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [orderNO, setOrderNO] = useState("");
  const [selectedEvery, setSelectedEvery] = useState(null);
  const [from, setFrom] = useState(dayjs());
  const [to, setTo] = useState(dayjs());
  const [termsList, setTermsList] = useState("");
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [manageTerms, setManageTerms] = useState(false);
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
  const [itemDetails, setItemDetails] = useState("");
  const [quantity, setQuantity] = useState(["1.00"]);
  const [perorRupee, setPerOrRupee] = React.useState(["%"]);
  const [discount, setDiscount] = useState(["0"]);
  const [rate, setRate] = useState(["0"]);
  const [amount, setAmount] = useState(0);
  const [shippingCharges, setShippingCharges] = useState("");
  const [taxOpen, setTaxOpen] = useState(false);
  const [selectedGst, setSelectedGst] = React.useState(null);
  const [taxView, setTaxView] = useState(false);
  const [savedGST, setSavedGST] = useState("");
  const [adjustment, setAdjustment] = useState("Adjustment");
  const [costAdd, setCostAdd] = useState("");
  const [total, setTotal] = useState("");

  const handleTermsOpen = () => {
    setManageTerms(true);
  };

  const handleTermsClose = () => {
    setManageTerms(false);
  };

  const handleSaveTax = () => {
    setTaxView(true);
    const GST = selectedGst / 2;
    const percentage = (GST / 100) * shippingCharges;
    setSavedGST(percentage);
    setTaxOpen(false);
  };

  const handleOnChangeGst = (event, selectedOption) => {
    setSelectedGst(selectedOption ? selectedOption.value : null);
  };

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

  const handleMenuItemClick = (name) => {
    setSelectedSales(name);
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

  const fetchIndiaStates = () => {
    const indiaStates = State.getStatesOfCountry("IN"); // "IN" is the country code for India
    console.log(indiaStates);
    setPlaceOfSupply(indiaStates);
  };

  useEffect(() => {
    fetchIndiaStates();
  }, []);

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getTermsList = () => {
    const params = { json_type: "get_terms" };
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/text",
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        setTermsList(JsonData);
      });
  };

  useEffect(() => {
    getTermsList();
  }, []);

  const getCustomerList = () => {
    const params = {
      json_type: "get_customer_erp_details",
      type: "1",
      id: "",
    };
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/text",
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        setCustomerList(JsonData);
      });
  };

  useEffect(() => {
    getCustomerList();
  }, []);

  const getItemList = () => {
    const params = {
      json_type: "get_item_details",
      type: "1",
      id: "",
    };
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/text",
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        setItemList(JsonData);
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
    };
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/text",
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
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
      })
      .catch((error) => {
        console.error("Error fetching item details:", error);
      });
  };

  const handleSetAmount = (index) => {
    let calculatedAmount = quantity[index] * rate[index];
    if (perorRupee[index] === "%") {
      calculatedAmount -= (discount[index] / 100) * calculatedAmount;
    } else if (perorRupee[index] === "₹") {
      calculatedAmount -= parseFloat(discount[index]);
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
  }, [addItem, quantity, discount, rate, perorRupee]);

  useEffect(() => {
    const allRatesGreaterThanZero = rate.every((r) => r > 0);

    if (allRatesGreaterThanZero) {
      const parsedAmount =
        typeof amount === "string"
          ? parseFloat(amount.replace(/,/g, ""))
          : amount;

      if (
        shippingCharges === "" &&
        selectedGst === null &&
        savedGST === "" &&
        costAdd === ""
      ) {
        setTotal(amount);
      } else if (shippingCharges !== "" && savedGST === "" && costAdd === "") {
        const total = parsedAmount + parseFloat(shippingCharges);
        setTotal(formatNumber(total.toFixed(2)));
      } else if (
        shippingCharges !== "" &&
        selectedGst !== null &&
        savedGST !== "" &&
        costAdd === ""
      ) {
        const total =
          parsedAmount + parseFloat(shippingCharges) + parseFloat(savedGST * 2);
        setTotal(formatNumber(total.toFixed(2)));
      } else if (
        shippingCharges !== "" &&
        selectedGst !== null &&
        savedGST !== "" &&
        costAdd !== ""
      ) {
        const total =
          parsedAmount +
          parseFloat(shippingCharges) +
          parseFloat(savedGST * 2) +
          parseFloat(costAdd);
        setTotal(formatNumber(total.toFixed(2)));
      }
    }
  }, [
    addItem,
    quantity,
    discount,
    rate,
    perorRupee,
    shippingCharges,
    savedGST,
    costAdd,
    amount,
  ]);
  const handleSaveSalesperson = () => {
    if (salesName !== "" && salesEmail !== "" && salesMobile !== "") {
      const params = {
        json_type: "config_sales_person",
        name: salesName,
        e_mail: salesEmail,
        mob_no: salesMobile,
      };
      axios
        .post(url, params, {
          headers: {
            "Content-Type": "application/text",
          },
        })
        .then((res) => {
          const JsonData = JSON.parse(res.data);
          if (JsonData.json_sts === "1") {
            alert(JsonData.error_msg);
            getSalesList();
          } else if (JsonData.json_sts === "2") {
            alert(JsonData.error_msg);
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
    };
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/text",
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        setSalesList(JsonData);
        setSalesListTable(JsonData);
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
    };
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/text",
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        setCustomerDetails(JsonData);
        setContactPerson(JsonData[0].contact_id);
        setSelectedPlaceOfSupply(JsonData[0].plc_supply);
      });
  };

  const handleSaveRecurringInvoice = () => {
    const items =
      selectedItem &&
      selectedItem.map((item, index) => ({
        item: item.name,
      }));
    console.log(items);

    const quantities =
      quantity &&
      quantity.map((item, index) => ({
        qty: item,
      }));
    console.log(quantities);

    const rates =
      rate &&
      rate.map((item, index) => ({
        rate: item,
      }));
    console.log(rates);

    const discounts =
      discount &&
      discount.map((item, index) => ({
        discount: item,
      }));
    console.log(discounts);

    const combinedItemArray = items.map((item, index) => ({
      item: item.item,
      qty: quantities[index].qty,
      rate: rates[index].rate,
      discount: discounts[index].discount,
      per_rupee:
        perorRupee[index] === "₹" || perorRupee[index] === "%"
          ? perorRupee[index]
          : "",
      amount: parseFloat(handleSetAmount(index).replace(/,/g, "")),
    }));
    console.log(combinedItemArray);
    const parsedAmount =
      typeof amount === "string"
        ? parseFloat(amount.replace(/,/g, ""))
        : amount;
    const parsedTotal =
      typeof total === "string" ? parseFloat(total.replace(/,/g, "")) : total;

    const params = {
      json_type: "save_recurring_invoice",
      cust_name: selectedCustomer.display_name,
      cust_id: selectedCustomer.id,
      profile_name: profileName,
      order_no: orderNO,
      plc_supply: selectedPlaceOfSupply,
      repeat: selectedEvery,
      start_date: dayjs(from).format("YYYY-MM-DD"),
      end_date: dayjs(to).format("YYYY-MM-DD"),
      terms: selectedTerm.name,
      sales_person: selectedSales,
      subject: subject,
      subtotal: parsedAmount,
      ship_charge: shippingCharges,
      adj: costAdd !== "" ? costAdd : 0,
      total: parsedTotal,
      ship_cgst: savedGST,
      ship_sgst: savedGST,
      upd_by: "2837",
      upd_by_name: "Gowtham.G",
      item_details: combinedItemArray,
    };
    console.log(params);

    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/text",
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data);
        if (JsonData.json_sts === "1" || JsonData.json_sts === "2") {
          alert(JsonData.error_msg);
        } else {
          alert(JsonData.error_msg);
        }
      });
  };

  return (
    <React.Fragment>
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
                  backgroundColor: "#006852",
                  "&:hover": {
                    backgroundColor: "#008064",
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
                  backgroundColor: "#006852",
                  "&:hover": {
                    backgroundColor: "#008064",
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
                    backgroundColor: "#006852",
                    "&:hover": {
                      backgroundColor: "#008064",
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
                        backgroundColor: "#006852",
                        "&:hover": {
                          backgroundColor: "#008064",
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
                        backgroundColor: "#006852",
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
            <title>Add New | Recurring Invoices</title>
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
                      fontFamily: "Helvetica",
                      fontWeight: "bold",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    New Recurring Invoices
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
                          navigate("/Sales/RecurringInvoice");
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
                      handleCustomerSelect(val.id);
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
                        sx={{ width: "100%", height: "auto", pl: 2 }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={3.3}
                          sx={{
                            display: "flex",
                            fontSize: "1rem",
                            color: "blueviolet",
                            borderRight: "1px solid black",
                            gap: 1,
                          }}
                        >
                          <WarningAmberOutlinedIcon sx={{ color: "red" }} />
                          Unpaid Invoices
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={8.7}
                          sx={{
                            pl: 1,
                            display: "flex",
                            fontSize: "1rem",
                            color: "blueviolet",
                            gap: 1,
                          }}
                        >
                          <AccountCircleOutlinedIcon sx={{ color: "red" }} />
                          View Customer Details
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        container
                        xs={12}
                        sx={{ width: "100%", height: "auto", pl: 2, mt: 5 }}
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
                            <EditOutlinedIcon sx={{ color: "#006852" }} />
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              color: "black",
                              fontFamily: "Helvetica",
                              display: "flex",
                            }}
                          >
                            {customerDetails
                              ? customerDetails[0].f_name +
                                "." +
                                customerDetails[0].l_name
                              : ""}
                          </Typography>
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
                            <EditOutlinedIcon sx={{ color: "#006852" }} />
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "18px",
                              color: "black",
                              fontFamily: "Helvetica",
                              display: "flex",
                            }}
                          >
                            {customerDetails
                              ? customerDetails[0].f_name +
                                "." +
                                customerDetails[0].l_name
                              : ""}
                          </Typography>
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
                                "," +
                                customerDetails[0].s_address.add2 +
                                ","
                              : ""}
                          </Typography>
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
                      options={placeOfSupply.map((state) => state.name)}
                      value={selectedPlaceOfSupply}
                      onChange={(e, val) => setSelectedPlaceOfSupply(val)}
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
                </Grid>
              )}
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
                  Profile Name*
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
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
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
                    value={orderNO}
                    onChange={(e) => setOrderNO(e.target.value)}
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
                  Repeat Every*
                </Grid>
                <Grid item xs={12} md={5}>
                  <Autocomplete
                    disablePortal
                    options={repeatEvery}
                    value={selectedEvery}
                    onChange={(e, val) => setSelectedEvery(val)}
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
                    fontSize: "20px",
                    fontFamily: "Helvetica",
                    pl: 3,
                  }}
                >
                  Starts On
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
                              // fontWeight: "bold",
                              "& .MuiPickersYear-yearButton": {
                                fontSize: "1.2rem",
                              },
                            },
                          },
                        },
                      }}
                      format="YYYY-MM-DD"
                      openTo="year"
                      views={["year", "month", "day"]}
                      value={dayjs(from)}
                      onChange={setFrom}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={1.05}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    fontSize: "20px",
                    fontFamily: "Helvetica",
                    pl: 3,
                  }}
                >
                  Ends On{" "}
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
                      openTo="year"
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
                    fontFamily: "Times New Roman",
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
                    fontFamily: "Times New Roman",
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
                  md={0.5}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    fontSize: "20px",
                    fontFamily: "Times New Roman",
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
                  minHeight: "100px",
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
                                onClick={() => handleMenuItemClick(option.name)}
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
                  Subject
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    variant="outlined"
                    autoComplete="off"
                    placeholder="Enter Subject"
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
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  ></TextField>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={8}
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
                            pl: 2,
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
                                  getOptionLabel={(option) => option.name || ""}
                                  getOptionSelected={(option) =>
                                    option.name === selectedItem
                                  }
                                  value={selectedItem[index]}
                                  onChange={(event, value) => {
                                    const updatedItemList = [...selectedItem];
                                    updatedItemList[index] = value;
                                    setSelectedItem(updatedItemList);
                                    if (value) {
                                      handleItemSelect(value.id, index);
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

                                  {itemDetails &&
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

                              <TableCell sx={{ width: "15%" }}></TableCell>
                              <TableCell
                                sx={{
                                  width: "15%",
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                  fontFamily: "Helvetica",
                                }}
                              >
                                {handleSetAmount(index)}
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
                <Grid item xs={12} md={3.5}>
                  <Button
                    sx={{
                      width: "200px",
                      borderRadius: 2,
                      display: "flex",
                      backgroundColor: "#006852",
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
                    backgroundColor: "#006852",
                    "&:hover": {
                      backgroundColor: "#008064",
                    },
                  }}
                  size="medium"
                >
                  Cancel
                </Button>
              </Grid>
              <Grid>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#006852",
                    "&:hover": {
                      backgroundColor: "#008064",
                    },
                  }}
                  size="medium"
                  onClick={() => {
                    handleSaveRecurringInvoice();
                  }}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </React.Fragment>
        </Grid>
      </Sidebar>
    </React.Fragment>
  );
};

export default NewRecurringInvoices;
