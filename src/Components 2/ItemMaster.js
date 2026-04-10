import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ModalItemMaster from "../UsableContent/ModalItemMaster";
import axios from "axios";
import { Helmet } from "react-helmet";
import Sidebar from "../Navbars/Sidebar";
import { useNavigate } from "react-router";
import SuiSnackbar from "../Snackbars/SuiSnackbar";
import LoadingOverlay from "../Loading Animations/LoadingOverlay";
import nodata from "../Images/truck.png";

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

const ItemMaster = ({ onLogout }) => {
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("userid");
  const user = localStorage.getItem("user");
  const orgid = localStorage.getItem("Org_id");
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [itemTable, setItemTable] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Can be 'error', 'warning', 'info', 'success'
  const [loading, setLoading] = useState(false);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const selected = itemTable.map((item) => item.id); // Assuming each item has a unique identifier like `id`
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
    setSelectAll(newSelected.length === itemTable.length);
  };

  const url = "https://erp-api.schwingcloud.com/Service1.svc/ERP_app";

  const getItemTable = () => {
    setLoading(true);
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
          setItemTable(JsonData);
          setLoading(false);
        } else if (JSON.parse(res.data).json_sts === "2") {
          setItemTable([]);
          setLoading(false);
        } else if (JSON.parse(res.data).json_sts === "5") {
          onLogout();
          navigate("/");
        }
      });
  };

  useEffect(() => {
    getItemTable();
  }, []);

  const handleDelete = () => {
    const selectedIds = selectedItems;
    // Filter out items that are selected and map to only the required keys
    const filteredTable = itemTable
      .filter((item) => selectedIds.includes(item.id)) // Adjust this condition as per your data structure
      .map((item) => item.id); // Store only the id as an array
    const params = {
      json_type: "delete_item",
      item_ids: filteredTable,
      user: user,
      org_id: orgid,
      user_id: userid,
    };
    axios
      .post("https://erp-api.schwingcloud.com/Service1.svc/ERP_app2", params, {
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ModalItemMaster
            handleClose={handleClose}
            getItemTable={getItemTable}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
          />
        </Box>
      </Modal>
      {loading === true ? (
        <LoadingOverlay />
      ) : (
        <Sidebar onLogout={onLogout}>
          <Grid container>
            <Helmet>
              <title>Items</title>
            </Helmet>
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
                      fontFamily: "Times New Roman",
                      fontWeight: "bold",
                      alignItems: "center",
                    }}
                  >
                    Active Items
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
                  </Grid>
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
              <Grid
                item
                container
                xs={12}
                sx={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 837,
                  minHeight: 837,
                }}
              >
                <TableContainer
                  sx={{
                    width: "100%",
                    maxHeight: 837,
                    overflowX: "auto",
                    minHeight: 837,
                  }}
                >
                  <Table stickyHeader>
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
                                  "aria-label": "select all quotes",
                                }}
                                size="medium"
                              />
                            }
                          />
                        </TableCell>
                        {[
                          "Name",
                          "Description",
                          "Purchase Description",
                          "Rate",
                          "Purchase Rate",
                          "HSN/SAC",
                          "Usage Unit",
                        ].map((header) => (
                          <TableCell
                            key={header}
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
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {itemTable &&
                        itemTable.map((item) => (
                          <TableRow sx={{ cursor: "pointer" }}>
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
                                fontWeight: 500, // Added weight
                              }}
                              onClick={() => {
                                navigate("/ItemView", {
                                  state: { item },
                                });
                              }}
                            >
                              {item.name}
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "10px 16px",
                                borderBottom: "0.5px solid #e6e6e6",
                                fontSize: "1.1rem", // Adjusted size
                                fontWeight: 500, // Added weight
                              }}
                              onClick={() => {
                                navigate("/ItemView", {
                                  state: { item },
                                });
                              }}
                            >
                              {item.sales_desc}
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "10px 16px",
                                borderBottom: "0.5px solid #e6e6e6",
                                fontSize: "1.1rem", // Adjusted size
                                fontWeight: 500, // Added weight
                              }}
                              onClick={() => {
                                navigate("/ItemView", {
                                  state: { item },
                                });
                              }}
                            >
                              {item.pur_desc}
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "10px 16px",
                                borderBottom: "0.5px solid #e6e6e6",
                                fontSize: "1.1rem", // Adjusted size
                                fontWeight: 500, // Added weight
                              }}
                              onClick={() => {
                                navigate("/ItemView", {
                                  state: { item },
                                });
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(item.sales_s_price).toLocaleString(
                                "en-IN"
                              )}
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "10px 16px",
                                borderBottom: "0.5px solid #e6e6e6",
                                fontSize: "1.1rem", // Adjusted size
                                fontWeight: 500, // Added weight
                              }}
                              onClick={() => {
                                navigate("/ItemView", {
                                  state: { item },
                                });
                              }}
                            >
                              {/* Format the amount with currency symbol */}₹
                              {Number(item.pur_c_price).toLocaleString("en-IN")}
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "10px 16px",
                                borderBottom: "0.5px solid #e6e6e6",
                                fontSize: "1.1rem", // Adjusted size
                                fontWeight: 500, // Added weight
                              }}
                              onClick={() => {
                                navigate("/ItemView", {
                                  state: { item },
                                });
                              }}
                            >
                              {item.hsn_code || item.sac_code}
                            </TableCell>
                            <TableCell
                              sx={{
                                padding: "10px 16px",
                                borderBottom: "0.5px solid #e6e6e6",
                                fontSize: "1.1rem", // Adjusted size
                                fontWeight: 500, // Added weight
                              }}
                              onClick={() => {
                                navigate("/ItemView", {
                                  state: { item },
                                });
                              }}
                            >
                              {item.unit}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  {!itemTable.length && (
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
                        Currently, no items are available. Select 'Create New'
                        to add a new one.
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
                            <AddIcon sx={{ width: "30px", height: "30px" }} />
                          }
                          onClick={handleOpen}
                        >
                          Create New
                        </Button>
                      </Tooltip>
                    </Box>
                  )}
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Sidebar>
      )}
    </React.Fragment>
  );
};

export default ItemMaster;
