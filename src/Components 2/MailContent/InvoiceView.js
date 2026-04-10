import React, { useState } from "react";
import EmailView from "../EmailView/EmailView";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from "@mui/material";

const InvoiceView = ({ onLogout }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const data = localStorage.getItem("data");

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const organisationId = params.get("organisationId");
  const customerId = params.get("customerId");
  const organisation = params.get("organisation");

  console.log("organisation ID:", organisationId);
  console.log("Customer ID:", customerId);
  console.log("organisation:", organisation);

  const [invoiceTable, setInvoiceTable] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getInvoiceTable = () => {
    const params = {
      json_type: "get_invoice",
      type: "4",
      user: user,
      org_id: orgid,
      cust_id: customerId,
      action: selectedTab === 0 ? "1" : "2",
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
        } else {
          setInvoiceTable([]);
        }
      });
  };

  useEffect(() => {
    getInvoiceTable();
  }, [selectedTab]);

  return (
    <EmailView onLogout={onLogout}>
      <Box>
        {/* Header Section */}
        <Grid container sx={{ backgroundColor: "#21263C", padding: "16px" }}>
          <Grid item xs={8}>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: "bold" }}>
              {organisation}
            </Typography>
          </Grid>
          <Grid item xs={4} textAlign="right">
            <Button
              variant="contained"
              sx={{ backgroundColor: "#fff", color: "#408DFB" }}
              onClick={() => {
                onLogout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
        <Box p={2}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Open Invoices" sx={{ fontSize: "1.2rem" }} />
            <Tab label="All Invoices" sx={{ fontSize: "1.2rem" }} />
          </Tabs>
          {selectedTab === 0 && (
            <>
              {invoiceTable.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                          Invoice #
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                          Reference#
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                          Date
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                          Total
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoiceTable &&
                        invoiceTable.map((item, index) => (
                          <TableRow
                            key={index}
                            onClick={() =>
                              navigate(
                                `/Sales/InvoiceAccept?organisationId=${organisationId}&organisation=${organisation}&customerId=${customerId}`,
                                {
                                  state: { item },
                                }
                              )
                            }
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell sx={{ fontSize: "1rem" }}>
                              <Typography color="primary">
                                {item.invoice_no}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>
                              {item.reference}
                            </TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>
                              {item.invoice_date}
                            </TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>
                              {item.total}
                            </TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>
                              <Typography color="primary">
                                {item.status}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Grid
                  item
                  container
                  xs={12}
                  sx={{
                    width: "100%",
                    height: "auto",
                    minHeight: 200,
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    fontFamily: "Helvetica",
                    fontSize: "25px",
                    fontWeight: "bold",
                  }}
                >
                  No Invoice Available
                </Grid>
              )}
            </>
          )}

          {selectedTab === 1 && (
            <>
              {invoiceTable.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                          Invoice #
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                          Reference#
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                          Date
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                          Total
                        </TableCell>
                        <TableCell
                          sx={{ fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoiceTable &&
                        invoiceTable.map((item, index) => (
                          <TableRow
                            key={index}
                            onClick={() =>
                              navigate(
                                `/Sales/InvoiceAccept?organisationId=${organisationId}&organisation=${organisation}&customerId=${customerId}`,
                                {
                                  state: { item },
                                }
                              )
                            }
                            sx={{ cursor: "pointer" }}
                          >
                            <TableCell sx={{ fontSize: "1rem" }}>
                              <Typography color="primary">
                                {item.invoice_no}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>
                              {item.reference}
                            </TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>
                              {item.invoice_date}
                            </TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>
                              {item.total}
                            </TableCell>
                            <TableCell sx={{ fontSize: "1rem" }}>
                              <Typography color="primary">
                                {item.status}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Grid
                  item
                  container
                  xs={12}
                  sx={{
                    width: "100%",
                    height: "auto",
                    minHeight: 200,
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    fontFamily: "Helvetica",
                    fontSize: "25px",
                    fontWeight: "bold",
                  }}
                >
                  No Invoice Available
                </Grid>
              )}
            </>
          )}
        </Box>
      </Box>
    </EmailView>
  );
};

export default InvoiceView;
