import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputBase,
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
import React, { useEffect, useState } from "react";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";
import Sidebar from "../Navbars/Sidebar";

const RecurringInvoice = ({ onLogout }) => {
  const navigate = useNavigate();
  const [recurringInvoiceTable, setRecurringrecurringInvoiceTable] = useState(
    []
  );
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Function to handle selecting all checkboxes
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const selected = recurringInvoiceTable.map((item) => item.id); // Assuming each item has a unique identifier like `id`
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
    setSelectAll(newSelected.length === recurringInvoiceTable.length);
  };

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getrecurringInvoiceTable = () => {
    const params = { json_type: "get_invoice", type: "1", id: "" };
    axios
      .post(url, params, {
        headers: {
          "Content-Type": "application/text",
        },
      })
      .then((res) => {
        const JsonData = JSON.parse(res.data).data;
        setRecurringrecurringInvoiceTable(JsonData);
      });
  };

  useEffect(() => {
    getrecurringInvoiceTable();
  }, []);

  return (
    <React.Fragment>
      <Sidebar onLogout={onLogout}>
        <Grid container>
          <Helmet>
            <title>Recurring Invoices</title>
          </Helmet>
          <Grid
            item
            container
            xs={12}
            sx={{
              mt: 2,
              width: "100%",
              height: "100%",
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
                    fontSize: "1.7rem",
                    fontFamily: "Helvetica",
                    fontWeight: "bold",
                    alignItems: "center",
                  }}
                >
                  All Recurring Invoices
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
                  <Tooltip title="Create Invoice" arrow>
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
                        navigate("/Sales/NewRecurringInvoice");
                      }}
                    >
                      new
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid>
                  <IconButton
                    aria-label="menu"
                    sx={{ border: "1px solid black" }}
                  >
                    <MoreVertIcon />
                  </IconButton>
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
                minHeight: 800,
              }}
            >
              <TableContainer
                sx={{
                  width: "100%",
                  maxHeight: 800,
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          fontSize: "1.2rem",
                          fontFamily: "Helvetica",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                          pl: 3,
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectAll}
                              onChange={handleSelectAllClick}
                              inputProps={{
                                "aria-label": "select all invoices",
                              }}
                              size="medium"
                            />
                          }
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1.2rem",
                          fontFamily: "Helvetica",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                          pl: 2,
                        }}
                      >
                        Customer Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1.2rem",
                          fontFamily: "Helvetica",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                        }}
                      >
                        Profile Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1.2rem",
                          fontFamily: "Helvetica",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                        }}
                      >
                        Frequency
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1.2rem",
                          fontFamily: "Helvetica",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                        }}
                      >
                        Last Invoice Date
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1.2rem",
                          fontFamily: "Helvetica",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                        }}
                      >
                        Next Invoice Date
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1.2rem",
                          fontFamily: "Helvetica",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "1.2rem",
                          fontFamily: "Helvetica",
                          textTransform: "uppercase",
                          p: 1,
                          color: "#6C7184",
                          borderBottom: "0.5px solid #e6e6e6",
                        }}
                      >
                        Amount
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recurringInvoiceTable &&
                      recurringInvoiceTable.map((item, index) => (
                        <TableRow key={index} sx={{ cursor: "pointer" }}>
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              pl: 2,
                              borderBottom: "0.5px solid #e6e6e6",
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
                              fontSize: "1.2rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              pl: 2,
                              borderBottom: "0.5px solid #e6e6e6",
                            }}
                            onClick={() => {
                              navigate("/SalesPage/InvoiceDetailsPage", {
                                state: { item },
                              });
                            }}
                          >
                            {item.invoice_date}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              borderBottom: "0.5px solid #e6e6e6",
                            }}
                            onClick={() => {
                              navigate("/SalesPage/InvoiceDetailsPage", {
                                state: { item },
                              });
                            }}
                          >
                            {item.invoice_no}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              borderBottom: "0.5px solid #e6e6e6",
                            }}
                            onClick={() => {
                              navigate("/SalesPage/InvoiceDetailsPage", {
                                state: { item },
                              });
                            }}
                          >
                            {item.sales_order_no}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              borderBottom: "0.5px solid #e6e6e6",
                            }}
                            onClick={() => {
                              navigate("/SalesPage/InvoiceDetailsPage", {
                                state: { item },
                              });
                            }}
                          >
                            {item.cust_name}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              borderBottom: "0.5px solid #e6e6e6",
                            }}
                            onClick={() => {
                              navigate("/SalesPage/InvoiceDetailsPage", {
                                state: { item },
                              });
                            }}
                          >
                            {item.status}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              borderBottom: "0.5px solid #e6e6e6",
                            }}
                            onClick={() => {
                              navigate("/SalesPage/InvoiceDetailsPage", {
                                state: { item },
                              });
                            }}
                          >
                            {item.due_date}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "1.2rem",
                              fontFamily: "Helvetica",
                              p: 1,
                              borderBottom: "0.5px solid #e6e6e6",
                            }}
                            onClick={() => {
                              navigate("/SalesPage/InvoiceDetailsPage", {
                                state: { item },
                              });
                            }}
                          >
                            {item.total}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Sidebar>
    </React.Fragment>
  );
};

export default RecurringInvoice;
