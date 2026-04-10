import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Drawer,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import axios from "axios";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { State } from "country-state-city";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { makeStyles } from "@mui/styles"; // Import makeStyles from @mui/styles
import ModalPaymentMode from "../../UsableContent/ModalPaymentMode";
import ModalEditableSeries from "../../UsableContent/ModalEditableSeries";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import { Icon } from "@iconify/react/dist/iconify.js";
import Sidebar from "../../Navbars/Sidebar";
import SuiSnackbar from "../../Snackbars/SuiSnackbar";

const useStyles = makeStyles((theme) => ({
  disabledGrid: {
    opacity: 0.5, // You can adjust the opacity value to control transparency
    pointerEvents: "none", // Disables pointer events on the grid
  },
}));

const style1 = {
  position: "absolute",
  top: "37.8%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "33%",
  height: 735,
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderBottomRightRadius: "10px",
  borderBottomLeftRadius: "10px",
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TDSTaxAccount = [
  "Advance Tax",
  "Employee Advance",
  "Input Tax Credits",
  "TDS Receivable",
  "Input CGST",
  "Input IGST",
  "Input SGST",
  "Prepaid Expenses",
  "Reverse Charge Tax Input but not due",
  "TCS Receivable",
  "TDS Receivable",
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

const NewPaymentsReceived = ({ onLogout }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState([]);
  const [selectedPlaceOfSupply, setSelectedPlaceOfSupply] = useState(null);
  const [configureOpen, setConfigureOpen] = useState(false);
  const [configurePayment, setConfigurePayment] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [bankCharges, setBankCharges] = useState("");
  const [from, setFrom] = useState(dayjs());
  const [reference, setReference] = useState("");
  const [selectedType, setSelectedType] = useState("No Tax deducted");
  const [openPrefix, setOpenPrefix] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);
  const [editDetails, setEditDetails] = useState([]);
  const [seriesNo, setSeriesNo] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [payment, setPayment] = useState([]);
  const [invoicepayment, setInvoicePayment] = useState(false);
  const [customerPayment, setCustomerPayment] = useState(false);
  const [totalPayment, setTotalPayment] = useState("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGst, setSelectedGst] = React.useState(null);
  const [gstOptions, setGstOptions] = useState([]);
  const [taxId, setTaxId] = useState(null);
  const [amountChecked, setAmountChecked] = useState(false);
  const [selectedTaxAccount, setSelectedTaxAccount] = useState("Advance Tax");
  const [holdingTax, setHoldingTax] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [amountExcess, setAmountExcess] = useState("0.00"); // state for excess amount
  const [userData, setUserData] = useState([]);
  const [stateId, setStateId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be 'error', 'warning', 'info', 'success'
  const [openExcessAmount, setOpenExcessAmount] = useState(false);
  const [excessDetect, setExcessDetect] = useState("");

  const handleOpenExcessAmount = (ok) => {
    setOpenExcessAmount(true);
    setExcessDetect(ok);
  };

  const handleCloseExcessAmount = () => {
    setOpenExcessAmount(false);
    setExcessDetect("");
  };

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

  const handleChange = (event) => {
    const isChecked = event.target.checked;
    setAmountChecked(isChecked);

    if (isChecked) {
      // Set amount and payment when checked
      setAmountReceived(customerDetails[0].out_receive);
      const paymentAmounts = invoiceDetails.map((item) => item.due_amount);
      setPayment(paymentAmounts);
      console.log("Payment Set:", paymentAmounts); // Debug log
    } else {
      // Clear amount and payment when unchecked
      setAmountReceived("");
      setPayment([]); // Clear the array
      console.log("Payment Cleared"); // Debug log
    }
  };
  const handleOnChangeGst = (event, selectedOption) => {
    setSelectedGst(selectedOption ? selectedOption.value : null);
    setTaxId(selectedOption ? selectedOption.tax_id : null);
  };

  const getGstOptions = () => {
    const params = {
      json_type: "get_tax",
      user: user,
      org_id: orgid,
      cust_id: selectedCustomer.id,
      plc_supply: "",
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
          setGstOptions(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    if (selectedCustomer !== null) {
      getGstOptions();
    }
  }, [selectedCustomer, stateId]);

  const distributePayment = () => {
    let remainingAmount = parseFloat(amountReceived) || 0;
    const updatedPayment = {};

    invoiceDetails.forEach((item, index) => {
      if (remainingAmount >= item.due_amount) {
        updatedPayment[index] = item.due_amount;
        remainingAmount -= item.due_amount;
      } else {
        updatedPayment[index] = remainingAmount;
        remainingAmount = 0; // No more amount left to distribute
      }
    });

    setPayment(updatedPayment);
    calculateTotalPayment(updatedPayment);
  };

  // Calculate total applied payment
  const calculateTotalPayment = (payment) => {
    let total = 0;
    Object.values(payment).forEach((value) => {
      if (value) {
        total += parseFloat(value);
      }
    });
    setTotalPayment(total);

    if (amountReceived > total || total > amountReceived) {
      const excess = amountReceived - total;
      setAmountExcess(excess); // Set the excess amount if there's more received than total payment
      setAmountChecked(false);
    } else {
      setAmountExcess("0.00"); // No excess amount
    }
  };

  useEffect(() => {
    distributePayment();
  }, [amountReceived]);

  const totalHoldingTax = holdingTax.reduce(
    (total, value) => total + (parseFloat(value) || 0),
    0
  );

  const handleChangePayment = (index, value) => {
    const updatedPayment = { ...payment, [index]: value };
    setPayment(updatedPayment);
    calculateTotalPayment(updatedPayment);
  };

  const handlePayInFull = (index, dueAmount) => {
    const updatedPayment = { ...payment, [index]: dueAmount };
    setPayment(updatedPayment);
    calculateTotalPayment(updatedPayment);
  };

  const handleChangeHoldingTax = (index, value) => {
    const updatedTax = [...holdingTax];
    updatedTax[index] = value;
    setHoldingTax(updatedTax);
  };

  const handleAmountReceivedChange = (e) => {
    setAmountReceived(e.target.value);
  };

  const handleInvoicePayment = () => {
    setInvoicePayment(true);
    setCustomerPayment(false);
  };

  const handleCustomerPayment = () => {
    setCustomerPayment(true);
    setInvoicePayment(false);
  };

  useEffect(() => {
    handleInvoicePayment();
  }, []);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleOpenPrefix = () => {
    setOpenPrefix(true);
  };

  const handleClosePrefix = () => {
    setOpenPrefix(false);
  };

  const handleConfigureOpen = () => {
    setConfigureOpen(true);
  };

  const handleConfigureClose = () => {
    setConfigureOpen(false);
  };

  const handleConfigureOpenPayment = () => {
    setConfigurePayment(true);
  };

  const handleConfigureClosePayment = () => {
    setConfigurePayment(false);
  };

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

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

  const getPaymentMethod = () => {
    const params = { json_type: "get_pay_method", user: user, org_id: orgid };
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
  }, []);

  const getInvoiceDetails = (id) => {
    const params = {
      json_type: "get_invoice",
      type: "3",
      cust_id: id,
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
          setInvoiceDetails(JsonData);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  const getEditDetails = () => {
    const params = {
      json_type: "get_trans_series",
      type: "2",
      id: "3",
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

  const handleCustomerSelect = (id) => {
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
  };

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

  const handleSavePayment = () => {
    setLoading(true);
    // Safely handle payment, ensuring it is an array before mapping
    const payments =
      payment &&
      Object.keys(payment).map((key) => ({
        payment: payment[key], // Access value through key
      }));

    console.log("Payments:", payments);

    const holdingTaxes =
      holdingTax &&
      holdingTax.map((holdingTax, index) => ({
        holding_tax: holdingTax,
      }));

    console.log("Holding Taxes:", holdingTaxes);

    const combinedEditArray =
      invoiceDetails &&
      invoiceDetails
        .map((item, index) => ({
          invoice_date: item.invoice_date,
          due_date: item.due_date,
          invoice_no: item.invoice_no,
          total: item.total,
          due_amount: item.due_amount,
          invoice_id: item.id,
          holding_tax: holdingTaxes[index]
            ? holdingTaxes[index].holding_tax
            : 0,
          payment: payments[index] ? payments[index].payment : "",
        }))
        .filter((item) => parseFloat(item.payment) > 0); // Filter out items where payment is 0

    console.log("Combined Edit Array:", combinedEditArray);

    // Proceed with API calls if needed
    if (invoicepayment === true) {
      if (totalPayment > amountReceived) {
        setSnackbarMessage(
          "The amount entered for individual invoice(s) exceeds the total payment the customer has made. Please check and retry."
        );
        setSnackbarSeverity("Overpayment Detected");
        setSnackbarOpen(true);
        setLoading(false);
      } else if (amountReceived > totalPayment && excessDetect === "") {
        setLoading(false);
        handleOpenExcessAmount("ok");
      } else if (amountReceived > totalPayment && excessDetect !== "") {
        if (combinedEditArray.length > 0) {
          const params = {
            json_type: "pay_received",
            cust_id: selectedCustomer.id,
            type: "1",
            amt_received: amountReceived ? amountReceived : "0.00",
            bank_charges: bankCharges ? bankCharges : "0.00",
            payment_date: dayjs(from).format("YYYY-MM-DD"),
            payment_no: prefix,
            payment_mode: selectedPaymentMethod.display_name,
            deposit_to: selectedOption.name,
            deposit_id: selectedOption.id,
            deposit_type: selectedOption.group,
            deposit_type_id: selectedOption.type_id,
            reference: reference,
            tax_deducted: selectedType,
            tds_tax_account:
              selectedType === "Yes, TDS (Income Tax)"
                ? selectedTaxAccount
                : "",
            payment_array: combinedEditArray,
            total_payment: amountReceived ? amountReceived : "0.00",
            amt_used_payments: totalPayment ? totalPayment : "0.00",
            amt_refund: "0.00",
            amt_excess: amountExcess,
            series_id: seriesId,
            series_no: seriesNo,
            notes: notes !== "" ? notes : "-",
            user: user,
            org_id: orgid,
            user_id: userid,
          };
          console.log(params);
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
              const itemFind = JsonData.data;
              const item = itemFind[0];
              if (JsonData.json_sts === "1") {
                handleCloseExcessAmount();
                navigate("/SalesPage/PaymentDetailPage", {
                  state: { item, create: "create" },
                });
              } else if (JSON.parse(res.data).json_sts === "5") {
                onLogout();
                navigate("/");
              } else {
                setSnackbarMessage("An error occurred");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
              }
            })
            .finally(() => {
              setTimeout(() => setLoading(false), 1500); // Reset loading state
            });
        } else {
          setSnackbarMessage("Make payment for the invoices to save.");
          setSnackbarSeverity("field missing");
          setSnackbarOpen(true);
          setLoading(false);
        }
      } else {
        if (combinedEditArray.length > 0) {
          const params = {
            json_type: "pay_received",
            cust_id: selectedCustomer.id,
            type: "1",
            amt_received: amountReceived ? amountReceived : "0.00",
            bank_charges: bankCharges ? bankCharges : "0.00",
            payment_date: dayjs(from).format("YYYY-MM-DD"),
            payment_no: prefix,
            payment_mode: selectedPaymentMethod.display_name,
            deposit_to: selectedOption.name,
            deposit_id: selectedOption.id,
            deposit_type: selectedOption.group,
            deposit_type_id: selectedOption.type_id,
            reference: reference,
            tax_deducted: selectedType,
            tds_tax_account:
              selectedType === "Yes, TDS (Income Tax)"
                ? selectedTaxAccount
                : "",
            payment_array: combinedEditArray,
            total_payment: amountReceived ? amountReceived : "0.00",
            amt_used_payments: totalPayment ? totalPayment : "0.00",
            amt_refund: "0.00",
            amt_excess: amountExcess,
            series_id: seriesId,
            series_no: seriesNo,
            notes: notes !== "" ? notes : "-",
            user: user,
            org_id: orgid,
            user_id: userid,
          };
          console.log(params);
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
              const itemFind = JsonData.data;
              const item = itemFind[0];
              if (JsonData.json_sts === "1") {
                navigate("/SalesPage/PaymentDetailPage", {
                  state: { item, create: "create" },
                });
              } else if (JSON.parse(res.data).json_sts === "5") {
                onLogout();
                navigate("/");
              } else {
                setSnackbarMessage("An error occurred");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
              }
            })
            .finally(() => {
              setTimeout(() => setLoading(false), 1500); // Reset loading state
            });
        } else {
          setSnackbarMessage("Make payment for the invoices to save.");
          setSnackbarSeverity("field missing");
          setSnackbarOpen(true);
          setLoading(false);
        }
      }
    } else {
      if (amountReceived !== "" && amountReceived > 0) {
        const params = {
          json_type: "pay_received",
          type: "2",
          cust_id: selectedCustomer.id,
          payment_no: prefix,
          payment_mode: selectedPaymentMethod.display_name,
          amt_received: amountReceived ? amountReceived : "0.00",
          payment_date: dayjs(from).format("YYYY-MM-DD"),
          bank_charges: bankCharges ? bankCharges : "0.00",
          plc_supply: stateId,
          reference: reference,
          descrip: description,
          series_id: seriesId,
          series_no: seriesNo,
          tax_id: taxId === null ? "0" : taxId,
          deposit_to: selectedOption.name,
          deposit_id: selectedOption.id,
          deposit_type: selectedOption.group,
          deposit_type_id: selectedOption.type_id,
          notes: notes !== "" ? notes : "-",
          user: user,
          org_id: orgid,
          user_id: userid,
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
            const itemFind = JsonData.data;
            const item = itemFind[0];
            if (JsonData.json_sts === "1") {
              navigate("/SalesPage/PaymentDetailPage", {
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
          })
          .finally(() => {
            setTimeout(() => setLoading(false), 1500); // Reset loading state
          });
      } else {
        setSnackbarMessage("Enter the Amount to save");
        setSnackbarSeverity("field missing");
        setSnackbarOpen(true);
        setLoading(false);
      }
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
        open={openExcessAmount}
        onClose={() => handleCloseExcessAmount()}
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
                  width: "48px",
                  height: "48px",
                  color: "rgb(244, 156, 6)",
                }}
              />
              Would you like to store the excess amount of ₹{amountExcess}.00 as
              over payment from this customer?
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
                  handleCloseExcessAmount();
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
                    backgroundColor: loading ? "#408DFB" : "#3070C0",
                  },
                  color: "white",
                }}
                size="medium"
                onClick={() => {
                  if (!loading) {
                    handleSavePayment();
                  }
                }}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} sx={{ color: "inherit" }} />
                  ) : null
                }
              >
                {loading ? "Saving..." : "Continue to save"}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
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
        open={configurePayment}
        onClose={handleConfigureClosePayment}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style1}>
          <ModalPaymentMode
            handleConfigureClosePayment={handleConfigureClosePayment}
            getPaymentMethod={getPaymentMethod}
          />
        </Box>
      </Modal>
      <Sidebar onLogout={onLogout}>
        <Grid container>
          <Helmet>
            <title>Add New | Payments Received</title>
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
                    pl: 2,
                    gap: 2,
                  }}
                >
                  <Button
                    sx={{
                      width: 250,
                      height: 55,
                      color: "black",
                      borderBottom:
                        invoicepayment === true ? "5px solid #408DFB" : "",
                      cursor: "pointer",
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      fontFamily: `Times New Roman`,
                      textTransform: "capitalize",
                      p: 3,
                    }}
                    onClick={(e) => {
                      handleInvoicePayment();
                    }}
                  >
                    Invoice Payment
                  </Button>
                  <Button
                    sx={{
                      width: 260,
                      height: 55,
                      color: "black",
                      borderBottom:
                        customerPayment === true ? "5px solid #408DFB" : "",
                      cursor: "pointer",
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      fontFamily: `Times New Roman`,
                      textTransform: "capitalize",
                      p: 3,
                    }}
                    onClick={(e) => {
                      handleCustomerPayment();
                    }}
                  >
                    Customer Advance
                  </Button>
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
              {invoicepayment === true ? (
                <React.Fragment>
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
                          if (val) {
                            handleCustomerSelect(val ? val.id : null);
                            getInvoiceDetails(val ? val.id : null);
                            handleGetDepositTo();
                          } else {
                            // Handle the case when the Autocomplete is cleared
                            // For example, reset any state or perform other actions
                          }
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
                            placeholder="Select Customer"
                            helperText={
                              selectedCustomer !== null &&
                              invoiceDetails.length > 0
                                ? ""
                                : selectedCustomer === null
                                ? ""
                                : "No invoice available for the customer"
                            }
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
                            FormHelperTextProps={{
                              sx: {
                                fontSize: "1rem", // Set the desired font size here
                                color: "red", // Optional: Customize the color of the helper text
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    className={
                      selectedCustomer === null || invoiceDetails.length === 0
                        ? classes.disabledGrid
                        : ""
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
                          fontFamily: "Times New Roman",
                          pl: 3,
                        }}
                      >
                        Amount Received*
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={5}
                        sx={{
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Grid>
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
                              startAdornment: (
                                <InputAdornment position="start">
                                  INR
                                </InputAdornment>
                              ),
                            }}
                            value={amountReceived}
                            onChange={handleAmountReceivedChange}
                          ></TextField>
                        </Grid>
                        <Grid sx={{ pl: 2 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={amountChecked}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                inputProps={{ "aria-label": "controlled" }}
                                size="medium"
                              />
                            }
                            label={
                              <Typography
                                sx={{
                                  fontSize: "18px",
                                  //fontWeight: "bold",
                                  fontFamily: "Helvetica",
                                }}
                              >
                                {customerDetails
                                  ? "Received full amount" +
                                    " (" +
                                    "₹" +
                                    customerDetails[0].out_receive +
                                    ")"
                                  : "Received full amount"}
                              </Typography>
                            }
                          />
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
                        Bank Charges (if any)
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
                              fontFamily: "Times New Roman",
                              height: 10,
                              fontSize: "1.3rem",
                            },
                          }}
                          value={bankCharges}
                          onChange={(e) => setBankCharges(e.target.value)}
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
                          color: "red",
                          fontFamily: "Times New Roman",
                          pl: 3,
                        }}
                      >
                        Payment Date*
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={5}
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
                                    width: "100%",
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
                        Payment#*
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
                        Payment Mode
                      </Grid>
                      <Grid item xs={12} md={5}>
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
                        sx={{ alignItems: "center", pt: 0.5, pl: 3 }}
                      >
                        <SettingsOutlinedIcon
                          sx={{ color: "gray" }}
                          onClick={() => {
                            handleConfigureOpenPayment();
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
                          color: "red",
                          fontFamily: "Times New Roman",
                          pl: 3,
                        }}
                      >
                        Deposit To*
                      </Grid>
                      <Grid item xs={12} md={5}>
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
                        Reference #
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
                      <Grid
                        item
                        container
                        xs={12}
                        sx={{
                          width: "100%",
                          height: "auto",
                          minHeight: 60,
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
                            fontSize: "1.2rem",
                            fontFamily: "Times New Roman",
                            gap: 1,
                            pl: 3,
                          }}
                        >
                          Tax Deducted?
                        </Grid>
                        <Grid item xs={12} md={10} pl={1.3}>
                          <RadioGroup
                            row
                            value={selectedType}
                            onChange={handleTypeChange}
                          >
                            <FormControlLabel
                              value="No Tax deducted"
                              control={<Radio style={{ color: "#408DFB" }} />}
                              label={
                                <Typography
                                  sx={{ fontSize: "1.2rem", color: "#000000" }}
                                >
                                  No Tax deducted
                                </Typography>
                              }
                            />
                            <FormControlLabel
                              value="Yes, TDS (Income Tax)"
                              control={<Radio style={{ color: "#408DFB" }} />}
                              label={
                                <Typography
                                  sx={{ fontSize: "1.2rem", color: "#000000" }}
                                >
                                  Yes, TDS (Income Tax)
                                </Typography>
                              }
                            />
                          </RadioGroup>
                        </Grid>
                      </Grid>
                      {selectedType === "Yes, TDS (Income Tax)" ? (
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
                              color: "red",
                              fontFamily: "Times New Roman",
                              pl: 3,
                            }}
                          >
                            Tds Tax Account*
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <Autocomplete
                              disablePortal
                              options={TDSTaxAccount}
                              getOptionLabel={(option) => option}
                              value={
                                TDSTaxAccount.find(
                                  (option) => option === selectedTaxAccount
                                ) || selectedTaxAccount
                              }
                              onChange={(e, val) => {
                                setSelectedTaxAccount(val);
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
                      ) : (
                        ""
                      )}
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
                      <TableContainer sx={{ overflowX: "hidden" }}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#F9F9FB" }}>
                              <TableCell
                                sx={{
                                  fontSize: "20px",
                                  fontFamily: "Times New Roman",
                                  fontWeight: "bold",
                                  width: "15%",
                                }}
                              >
                                Unpaid Invoices
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: "18px",
                                  fontFamily: "Helvetica",
                                  color: "gray",
                                  pt: 2.5,
                                }}
                              >
                                Filter by Date Range
                              </TableCell>
                              <TableCell
                                align="right"
                                colSpan={
                                  selectedType === "Yes, TDS (Income Tax)"
                                    ? 4
                                    : 3
                                }
                                sx={{
                                  fontSize: "18px",
                                  fontFamily: "Helvetica",
                                  color: "#408DFB",
                                  pt: 2.5,
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setPayment([]);
                                }}
                              >
                                Clear Applied Amount
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
                                Date
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
                                }}
                              >
                                Invoice Number
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
                                }}
                              >
                                Invoice Amount
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
                                }}
                              >
                                Amount Due
                              </TableCell>
                              {selectedType === "Yes, TDS (Income Tax)" ? (
                                <TableCell
                                  sx={{
                                    fontSize: "1.2rem",
                                    fontFamily: "Times New Roman",
                                    fontWeight: "bold",
                                    textTransform: "uppercase",
                                    p: 1,
                                    color: "#6C7184",
                                    borderBottom: "0.5px solid #e6e6e6",
                                  }}
                                >
                                  Withholding tax
                                </TableCell>
                              ) : (
                                ""
                              )}
                              <TableCell
                                sx={{
                                  fontSize: "1.2rem",
                                  fontFamily: "Times New Roman",
                                  fontWeight: "bold",
                                  textTransform: "uppercase",
                                  p: 1,
                                  color: "#6C7184",
                                  borderBottom: "0.5px solid #e6e6e6",
                                }}
                              >
                                Payment
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          {invoiceDetails.length > 0 ? (
                            <TableBody>
                              {invoiceDetails &&
                                invoiceDetails.map((item, index) => {
                                  return (
                                    <TableRow key={index}>
                                      <TableCell
                                        sx={{
                                          fontSize: "1.2rem",
                                          fontFamily: "Times New Roman",
                                          p: 1,
                                          borderBottom: "0.5px solid #e6e6e6",
                                        }}
                                      >
                                        <div>{item.invoice_date}</div>
                                        <div>
                                          <span
                                            style={{
                                              color: "#6C7184",
                                              fontSize: "1rem",
                                            }}
                                          >
                                            Due Date:
                                          </span>
                                          <span
                                            style={{
                                              fontSize: "1rem",
                                            }}
                                          >
                                            {item.due_date}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontSize: "1.2rem",
                                          fontFamily: "Times New Roman",
                                          p: 1,
                                          borderBottom: "0.5px solid #e6e6e6",
                                        }}
                                      >
                                        {item.invoice_no}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontSize: "1.2rem",
                                          fontFamily: "Times New Roman",
                                          p: 1,
                                          borderBottom: "0.5px solid #e6e6e6",
                                        }}
                                      >
                                        {item.total}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontSize: "1.2rem",
                                          fontFamily: "Times New Roman",
                                          p: 1,
                                          borderBottom: "0.5px solid #e6e6e6",
                                        }}
                                      >
                                        {item.due_amount}
                                      </TableCell>
                                      {selectedType ===
                                      "Yes, TDS (Income Tax)" ? (
                                        <TableCell>
                                          <TextField
                                            variant="outlined"
                                            autoComplete="off"
                                            placeholder="Enter Tax Amount"
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
                                                textAlign: "right",
                                              },
                                            }}
                                            value={holdingTax[index]}
                                            onChange={(e) =>
                                              handleChangeHoldingTax(
                                                index,
                                                e.target.value
                                              )
                                            }
                                          ></TextField>
                                          <div
                                            style={{
                                              textAlign: "right",
                                              paddingRight: "10px",
                                              fontFamily: "Helvetica",
                                              color: "#408DFB",
                                              height: "20px",
                                            }}
                                          ></div>
                                        </TableCell>
                                      ) : (
                                        ""
                                      )}
                                      <TableCell>
                                        <div>
                                          <TextField
                                            variant="outlined"
                                            autoComplete="off"
                                            placeholder="Enter Amount"
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
                                                textAlign: "right",
                                              },
                                            }}
                                            value={payment[index] || ""}
                                            onChange={(e) =>
                                              handleChangePayment(
                                                index,
                                                e.target.value
                                              )
                                            }
                                          ></TextField>
                                        </div>
                                        <div
                                          style={{
                                            textAlign: "right",
                                            paddingRight: "10px",
                                            fontFamily: "Helvetica",
                                            color: "#408DFB",
                                          }}
                                          onClick={() => {
                                            handlePayInFull(
                                              index,
                                              item.due_amount
                                            );
                                          }}
                                        >
                                          pay in full
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          ) : (
                            <TableBody>
                              <TableCell
                                colSpan={5}
                                align="center"
                                sx={{ fontSize: "20px" }}
                              >
                                There are no unpaid invoices associated with
                                this customer.
                              </TableCell>
                            </TableBody>
                          )}
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
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        pl: 2,
                        mt: 1,
                        pb: 2,
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ fontFamily: "Helvetica" }}
                      >
                        **List contains only SENT invoices
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={4}
                        spacing={3}
                        sx={{
                          fontFamily: "Helvetica",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={3}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            fontFamily: "Helvetica",
                          }}
                        >
                          Total
                        </Grid>
                        {totalHoldingTax > 0 ? (
                          <Grid
                            item
                            xs={12}
                            md={3}
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              fontFamily: "Helvetica",
                              pr: 2,
                            }}
                          >
                            {totalHoldingTax}
                          </Grid>
                        ) : (
                          ""
                        )}

                        <Grid
                          item
                          xs={12}
                          md={3}
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            fontFamily: "Helvetica",
                            pr: 2,
                          }}
                        >
                          {totalPayment}
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
                        minHeight: "200px",
                        display: "flex",
                        justifyContent: "flex-start",
                        //alignItems: "center",
                        pl: 2,
                        mt: 1,
                        pb: 2,
                      }}
                    >
                      <Grid item xs={12} md={6.5}></Grid>
                      <Grid
                        item
                        xs={12}
                        md={3.5}
                        sx={{
                          backgroundColor: "#F9F9FB",
                          height: "auto",
                          minHeight: "200px",
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
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                              fontSize: "20px",
                              //fontWeight: "bold",
                              fontFamily: "Times New Roman",
                              pl: 2,
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            Amount Received :
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
                              justifyContent: "end",
                              display: "flex",
                              justifyContent: "flex-end",
                              pr: 2,
                            }}
                          >
                            {amountReceived ? amountReceived : "0.00"}
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
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                              fontSize: "20px",
                              //fontWeight: "bold",
                              fontFamily: "Times New Roman",
                              pl: 2,
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            Amount used for Payments :
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
                              justifyContent: "end",
                              display: "flex",
                              justifyContent: "flex-end",
                              pr: 2,
                            }}
                          >
                            {totalPayment ? totalPayment : "0.00"}
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
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                              fontSize: "20px",
                              //fontWeight: "bold",
                              fontFamily: "Times New Roman",
                              pl: 2,
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            Amount Refunded :
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
                              justifyContent: "end",
                              display: "flex",
                              justifyContent: "flex-end",
                              pr: 2,
                            }}
                          >
                            0.00
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
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            md={8}
                            sx={{
                              fontSize: "20px",
                              //fontWeight: "bold",
                              fontFamily: "Times New Roman",
                              pl: 2,
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Icon
                              icon="mingcute:alert-fill"
                              width="1.5rem"
                              height="1.5rem"
                              style={{ margin: 4, color: "red" }}
                            />{" "}
                            Amount in Excess:
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
                              justifyContent: "end",
                              display: "flex",
                              justifyContent: "flex-end",
                              pr: 2,
                            }}
                          >
                            {"₹  " + amountExcess}
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
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        pl: 2,
                        mt: 1,
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ fontFamily: "Helvetica", fontSize: "18px" }}
                      >
                        Notes (Internal use. Not visible to customer)
                      </Grid>
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
                        alignItems: "center",
                        pl: 1,
                        pb: 2,
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        md={10}
                        sx={{ fontFamily: "Helvetica", fontSize: "18px" }}
                      >
                        <TextField
                          multiline
                          rows={2}
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
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        ></TextField>
                      </Grid>
                    </Grid>
                  </Grid>
                </React.Fragment>
              ) : (
                <React.Fragment>
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
                          if (val) {
                            handleCustomerSelect(val.id);
                            handleGetDepositTo();
                          } else {
                            // Handle the case when the Autocomplete is cleared
                            // For example, reset any state or perform other actions
                          }
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
                  </Grid>
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
                        // alignItems: "center",
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        md={2}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          //alignItems: "center",
                          fontSize: "20px",
                          fontFamily: "Times New Roman",
                          pl: 3,
                        }}
                      >
                        Description of Supply
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={5}
                        sx={{
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <TextField
                          variant="outlined"
                          autoComplete="off"
                          multiline
                          rows={2}
                          helperText="Will be displayed on the Payment Receipt"
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
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
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
                          color: "red",
                          fontSize: "20px",
                          fontFamily: "Times New Roman",
                          pl: 3,
                        }}
                      >
                        Amount Received*
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={5}
                        sx={{
                          alignItems: "center",
                          flexDirection: "column",
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
                            startAdornment: (
                              <InputAdornment position="start">
                                INR
                              </InputAdornment>
                            ),
                          }}
                          value={amountReceived}
                          onChange={(e) => setAmountReceived(e.target.value)}
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
                        Bank Charges (if any)
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
                              fontFamily: "Times New Roman",
                              height: 10,
                              fontSize: "1.3rem",
                            },
                          }}
                          value={bankCharges}
                          onChange={(e) => setBankCharges(e.target.value)}
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
                        Tax
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
                        <Autocomplete
                          fullWidth
                          value={
                            gstOptions.find(
                              (option) => option.value === selectedGst
                            ) || null
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
                          color: "red",
                          fontFamily: "Times New Roman",
                          pl: 3,
                        }}
                      >
                        Payment Date*
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={5}
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
                                    width: "100%",
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
                            openTo="year"
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
                          color: "red",
                          fontSize: "20px",
                          fontFamily: "Times New Roman",
                          pl: 3,
                        }}
                      >
                        Payment#*
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
                        Payment Mode
                      </Grid>
                      <Grid item xs={12} md={5}>
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
                          color: "red",
                          fontFamily: "Times New Roman",
                          pl: 3,
                        }}
                      >
                        Deposit To*
                      </Grid>
                      <Grid item xs={12} md={5}>
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
                        Reference #
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
                      <Grid
                        item
                        container
                        xs={12}
                        sx={{
                          width: "100%",
                          height: "auto",
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          pl: 3,
                          mt: 1,
                        }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={6}
                          sx={{ fontFamily: "Helvetica", fontSize: "18px" }}
                        >
                          Notes (Internal use. Not visible to customer)
                        </Grid>
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
                          alignItems: "center",
                          pl: 1,
                          pb: 2,
                        }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={8.1}
                          sx={{ fontFamily: "Helvetica", fontSize: "18px" }}
                        >
                          <TextField
                            multiline
                            rows={2}
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
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          ></TextField>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </React.Fragment>
              )}
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
                      backgroundColor: loading ? "#408DFB" : "#3070C0",
                    },
                    color: "white",
                  }}
                  size="medium"
                  onClick={() => {
                    if (!loading) {
                      handleSavePayment();
                    }
                  }}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} sx={{ color: "inherit" }} />
                    ) : null
                  }
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </Grid>
            </Grid>
          </React.Fragment>
        </Grid>
      </Sidebar>
    </React.Fragment>
  );
};

export default NewPaymentsReceived;
