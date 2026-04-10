import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Country, State } from "country-state-city";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import Sidebar from "../../Navbars/Sidebar";
import SuiSnackbar from "../../Snackbars/SuiSnackbar";

const EditCustomerPayment = ({ onLogout }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const location = useLocation();
  const { paymentDetails } = location.state || {};
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
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState([]);
  const [editDetails, setEditDetails] = useState([]);
  const [seriesNo, setSeriesNo] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGst, setSelectedGst] = React.useState(null);
  const [gstOptions, setGstOptions] = useState([]);
  const [taxId, setTaxId] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userData, setUserData] = useState([]);
  const [stateId, setStateId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addressSelect, setAddressSelect] = useState([]);
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
          const gst = JsonData.find(
            (option) => option.label === paymentDetails[0]?.tax_code
          );
          if (gst) {
            setSelectedGst(gst ? gst.value : null);
            setTaxId(gst ? gst.tax_id : null);
          }
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    if (stateId) {
      getGstOptions();
    }
  }, [stateId]);

  const handleConfigureOpen = () => {
    setConfigureOpen(true);
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
          const cashOption = JsonData.find(
            (item) => item.pay_name === paymentDetails[0]?.mode
          );
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
            (option) => option.name === paymentDetails[0]?.deposit_to
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

  const getPaymentDetails = () => {
    const params = {
      json_type: "get_payment",
      payment_id: paymentDetails[0]?.payment_id,
      type: paymentDetails[0]?.type.toString(),
      request_type: "2",
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
          setAddressSelect(JsonData);
          const customerDetails = JsonData; // Adjust this path based on your actual response structure
          if (customerDetails) {
            const selectedCustomer = {
              id: customerDetails[0].cust_id,
              display_name: customerDetails[0].display_name,
            };
            setSelectedCustomer(selectedCustomer);
            handleCustomerSelect(selectedCustomer ? selectedCustomer.id : null); // If needed
            handleGetDepositTo();
            console.log(selectedCustomer);
            setAmountReceived(JsonData[0].amount_received);
            setBankCharges(JsonData[0].bank_charges);
            setDescription(JsonData[0].descrip);
            setReference(JsonData[0].reference);
            setNotes(JsonData[0].notes);
            setFrom(JsonData[0].payment_date);
            setPrefix(JsonData[0].payment_no);
          }
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getPaymentDetails();
  }, [paymentDetails]);

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

  const handleEditSave = () => {
    setLoading(true);
    const params = {
      json_type: "edit_payment",
      type: "2",
      payment_id: paymentDetails[0]?.payment_id,
      payment_mode: selectedPaymentMethod.display_name,
      payment_date: dayjs(from).format("YYYY-MM-DD"),
      bank_charges: bankCharges ? bankCharges : "0.00",
      reference: reference,
      descrip: description,
      deposit_to: selectedOption.name,
      deposit_id: selectedOption.id,
      deposit_type: selectedOption.group,
      deposit_type_id: selectedOption.type_id,
      notes: notes !== "" ? notes : "-",
      user: user,
      org_id: orgid,
      user_id: userid,
    };

    console.log(params);
    axios
      .post("https://erp-api.schwingcloud.com/Service1.svc/ERP_app3", params, {
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
          navigate("/SalesPage/PaymentDetailPage", {
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
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 1500); // Reset loading state
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
        <Grid container>
          <Helmet>
            <title>Edit | customer | Payment</title>
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
                    Edit Payment
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
                    disabled
                    options={customerList.map((customer) => ({
                      id: customer.id,
                      display_name: customer.display_name,
                    }))}
                    value={selectedCustomer}
                    onChange={(e, val) => {
                      setSelectedCustomer(val);
                      if (val) {
                        handleCustomerSelect(val ? val.id : null);
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
                          cursor: "not-allowed",
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
                        sx={{ width: "100%", height: "auto", pl: 2 }}
                      >
                        <Grid
                          item
                          xs={12}
                          md={2.3}
                          sx={{
                            display: "flex",
                            fontSize: "1rem",
                            color: "blueviolet",
                            gap: 1,
                          }}
                        >
                          PAN : Add PAN
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
                        disabled
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
                              cursor: "not-allowed",
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
              <Grid container>
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
                      disabled
                      style={{
                        width: "100%",
                        fontSize: "1rem",
                        cursor: "pointer",
                        padding: "8px 12px",
                        cursor: "not-allowed",
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
                          <InputAdornment position="start">INR</InputAdornment>
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
                      disabled
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
                            cursor: "not-allowed",
                            width: "100%",
                            fontSize: "1rem",
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
                      disabled
                      style={{
                        width: "100%",
                        fontSize: "1rem",
                        cursor: "not-allowed",
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
                      // onChange={(e) => setPrefix(e.target.value)}
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
                      handleEditSave();
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

export default EditCustomerPayment;
