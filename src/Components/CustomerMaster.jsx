import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Collapse,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LaunchIcon from "@mui/icons-material/Launch";
import EditIcon from "@mui/icons-material/Edit";
import PhoneIcon from "@mui/icons-material/Phone";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SuiSnackbar from "../Snackbars/SuiSnackbar";

// ── Collapsible Section ──────────────────────────────────────────────────────
const SectionRow = ({ title, children, defaultOpen = false, onNew }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Box sx={{ borderBottom: "1px solid #f0f0f0" }}>
      <Box
        onClick={() => setOpen((o) => !o)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.4, cursor: "pointer", "&:hover": { bgcolor: "#fafafa" } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {open ? <ExpandLessIcon sx={{ fontSize: 17, color: "#555" }} /> : <ExpandMoreIcon sx={{ fontSize: 17, color: "#555" }} />}
          <Typography sx={{ fontWeight: 600, fontSize: "0.92rem", color: "#333" }}>{title}</Typography>
        </Box>
        {onNew && (
          <Button size="small" startIcon={<AddIcon sx={{ fontSize: 13 }} />}
            onClick={(e) => { e.stopPropagation(); onNew(); }}
            sx={{ textTransform: "none", fontSize: "0.78rem", color: "#408DFB", px: 1, py: 0.2, minWidth: "auto" }}>
            New
          </Button>
        )}
      </Box>
      <Collapse in={open}>
        <Box sx={{ px: 2.5, pb: 2.5 }}>{children}</Box>
      </Collapse>
    </Box>
  );
};

// ── Address Block ────────────────────────────────────────────────────────────
const AddressBlock = ({ label, attention, addr1, addr2, city, state, zip, phone, onEdit }) => {
  const lines = [attention, addr1, addr2, city, state && zip ? `${state} - ${zip}` : (state || zip), phone ? `Phone No: ${phone}` : null].filter(Boolean);
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1, cursor: onEdit ? "pointer" : "default" }} onClick={onEdit}>
        <Typography sx={{ fontWeight: 700, fontSize: "0.83rem", color: "#408DFB" }}>{label}</Typography>
        <EditIcon sx={{ fontSize: 13, color: "#408DFB" }} />
      </Box>
      {lines.length > 0 ? (
        lines.map((line, i) => (
          <Typography key={i} sx={{ fontSize: "0.83rem", color: "#333", lineHeight: 2 }}>{line}</Typography>
        ))
      ) : (
        <Typography sx={{ fontSize: "0.82rem", color: "#aaa" }}>—</Typography>
      )}
    </Box>
  );
};

// ── Transaction Accordion ───────────────────────────────────────────────────
const TransactionAccordion = ({ section, initialOpen, c, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <Box sx={{ border: "1px solid #f0f0f0", borderRadius: "4px", mb: 1.5, overflow: "hidden", bgcolor: "#fff" }}>
      <Box 
        onClick={() => setIsOpen(!isOpen)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.4, cursor: "pointer", "&:hover": { bgcolor: "#fafafa" } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isOpen ? <ExpandLessIcon sx={{ fontSize: 18, color: "#408DFB" }} /> : <ExpandMoreIcon sx={{ fontSize: 18, color: "#408DFB" }} />}
          <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#333" }}>{section.label}</Typography>
        </Box>
        <Button 
          size="small" 
          variant="text"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={(e) => { e.stopPropagation(); onNavigate && onNavigate(section.module, c); }}
          sx={{ textTransform: "none", fontSize: "0.9rem", color: "#408DFB", fontWeight: 700, "&:hover": { bgcolor: "transparent", color: "#3378d8" } }}
        >
          New
        </Button>
      </Box>
      <Collapse in={isOpen}>
         <Box sx={{ p: "30px 40px", borderTop: "1px solid #f8f8f8", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100px" }}>
            <Box sx={{ color: "#aaa", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.3px" }}>
                No {section.label} Available
            </Box>
         </Box>
      </Collapse>
    </Box>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────
const CustomerMaster = ({ onNewClick, addCustomer, onNavigate, onEdit }) => {
  const STORAGE_KEY = "batchingplant_customers";

  const [customerTable, setCustomerTable] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailView, setDetailView] = useState("basic");
  const [moreInfoTab, setMoreInfoTab] = useState(0);
  const [openCreditModal, setOpenCreditModal] = useState(false);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [addressType, setAddressType] = useState("billing"); // "billing" | "shipping"
  const [addressForm, setAddressForm] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customerTable));
    } catch {}
  }, [customerTable]);

  useEffect(() => {
    if (addCustomer) {
      setCustomerTable((prev) => {
        if (prev.some((c) => c.id === addCustomer.id)) return prev;
        return [addCustomer, ...prev];
      });
    }
  }, [addCustomer]);

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setDetailView("basic");
    setMoreInfoTab(0);
  };

  const columns = [
    { id: "name", label: "NAME" },
    { id: "company", label: "COMPANY NAME" },
    { id: "email", label: "E-MAIL" },
    { id: "phone", label: "PHONE" },
    { id: "gstTreatment", label: "GST TREATMENT" },
    { id: "placeOfSupply", label: "PLACE OF SUPPLY" },
    { id: "receivables", label: "RECEIVABLES", align: "center" },
    { id: "gstIn", label: "GST REGISTRATION NUMBER" },
  ];

  const transactionSections = [
    { label: "Invoices",           module: "Invoices" },
    { label: "Payments",           module: "Payments Received" },
    { label: "Quotes",             module: "Quotes" },
    { label: "Sales Orders",       module: "Sales Orders" },
    { label: "Credit Notes",       module: "Credit Notes" },
    { label: "Delivery Challans",  module: "Delivery Challans" },
  ];

  const handleEditAddress = (type) => {
    setAddressType(type);
    const prefix = type === "billing" ? "billing" : "shipping";
    setAddressForm({
      attention: selectedCustomer[`${prefix}Attention`] || "",
      country: selectedCustomer[`${prefix}Country`] || "India",
      addr1: selectedCustomer[`${prefix}Address1`] || "",
      addr2: selectedCustomer[`${prefix}Address2`] || "",
      city: selectedCustomer[`${prefix}City`] || "",
      state: selectedCustomer[`${prefix}State`] || "",
      zip: selectedCustomer[`${prefix}Zip`] || "",
      phone: selectedCustomer[`${prefix}Phone`] || "",
      fax: selectedCustomer[`${prefix}Fax`] || "",
    });
    setOpenAddressModal(true);
  };

  const handleSaveAddress = () => {
    const prefix = addressType === "billing" ? "billing" : "shipping";
    const updatedCustomer = {
      ...selectedCustomer,
      [`${prefix}Attention`]: addressForm.attention,
      [`${prefix}Country`]: addressForm.country,
      [`${prefix}Address1`]: addressForm.addr1,
      [`${prefix}Address2`]: addressForm.addr2,
      [`${prefix}City`]: addressForm.city,
      [`${prefix}State`]: addressForm.state,
      [`${prefix}Zip`]: addressForm.zip,
      [`${prefix}Phone`]: addressForm.phone,
      [`${prefix}Fax`]: addressForm.fax,
    };
    
    setCustomerTable(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setSelectedCustomer(updatedCustomer);
    setOpenAddressModal(false);
    setSnackbarMessage(`${addressType === "billing" ? "Billing" : "Shipping"} address updated successfully`);
    setSnackbarOpen(true);
  };
  const c = selectedCustomer;
  const contactName = c ? `${c.salutation || ""} ${c.firstName || ""} ${c.lastName || ""}`.trim() : "";

  // ── TABLE VIEW ──────────────────────────────────────────────────────────
  if (!selectedCustomer) {
    return (
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
        <SuiSnackbar open={snackbarOpen} color="#E8F5E9" icon="success" content={snackbarMessage} close={() => setSnackbarOpen(false)} />
        <Box sx={{ px: "30px", py: "18px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
          <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, color: "#1a1a1a" }}>All Customers</Typography>
          <Button variant="contained" startIcon={<AddIcon sx={{ fontSize: 17 }} />} onClick={onNewClick}
            sx={{ bgcolor: "#408DFB", textTransform: "uppercase", borderRadius: "4px", px: 3, height: "36px", fontWeight: 600, fontSize: "13px", boxShadow: "none" }}>
            NEW
          </Button>
        </Box>
        <TableContainer component={Paper} elevation={0} sx={{ flexGrow: 1, overflowY: "auto" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox size="small"
                    indeterminate={selectedItems.length > 0 && selectedItems.length < customerTable.length}
                    checked={customerTable.length > 0 && selectedItems.length === customerTable.length}
                    onChange={(e) => setSelectedItems(e.target.checked ? customerTable.map((r) => r.id) : [])} />
                </TableCell>
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align} sx={{ fontWeight: 700, color: "#888", fontSize: "0.7rem", py: 1.5, letterSpacing: 0.5 }}>
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {customerTable.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 12 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: "#888", letterSpacing: 1 }}>SCHWING STETTER</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mb: 1 }}>
                        Currently, no customers are available. Select 'Create New' to add a new one.
                      </Typography>
                      <Button variant="contained" startIcon={<AddIcon />} onClick={onNewClick}
                        sx={{ bgcolor: "#408DFB", textTransform: "none", px: 4, py: 1 }}>
                        CREATE NEW
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                customerTable.map((row) => (
                  <TableRow key={row.id} hover onClick={() => handleRowClick(row)} sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f9f9fb" } }}>
                    <TableCell padding="checkbox">
                      <Checkbox size="small" checked={selectedItems.includes(row.id)}
                        onClick={(e) => { e.stopPropagation(); setSelectedItems(p => p.includes(row.id) ? p.filter(i => i !== row.id) : [...p, row.id]); }} />
                    </TableCell>
                    <TableCell sx={{ color: "#408DFB", fontWeight: 600, fontSize: "0.85rem" }}>{row.name}</TableCell>
                    <TableCell sx={{ fontSize: "0.85rem" }}>{row.company || "-"}</TableCell>
                    <TableCell sx={{ fontSize: "0.85rem" }}>{row.email || "-"}</TableCell>
                    <TableCell sx={{ fontSize: "0.85rem" }}>{row.phone || row.mobile || "-"}</TableCell>
                    <TableCell sx={{ fontSize: "0.85rem" }}>{row.gstTreatment || "-"}</TableCell>
                    <TableCell sx={{ fontSize: "0.85rem" }}>{row.placeOfSupply || "-"}</TableCell>
                    <TableCell align="center" sx={{ fontSize: "0.85rem", color: "#408DFB" }}>₹{row.receivables?.toLocaleString() || "0"}</TableCell>
                    <TableCell sx={{ fontSize: "0.85rem" }}>{row.gstIn || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  // ── SPLIT VIEW ───────────────────────────────────────────────────────────
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "row", bgcolor: "#fff", overflow: "hidden" }}>
      <SuiSnackbar open={snackbarOpen} color="#E8F5E9" icon="success" content={snackbarMessage} close={() => setSnackbarOpen(false)} />

      {/* Left: customer name list */}
      <Box sx={{ width: 230, borderRight: "1px solid #eee", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <Box sx={{ px: 2, py: 1.4, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#1a1a1a" }}>All Customers</Typography>
          <Button variant="contained" startIcon={<AddIcon sx={{ fontSize: 13 }} />} onClick={onNewClick}
            sx={{ bgcolor: "#408DFB", textTransform: "uppercase", borderRadius: "4px", px: 1.5, height: "30px", fontWeight: 600, fontSize: "11px", boxShadow: "none", minWidth: 70 }}>
            NEW
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          {customerTable.map((row) => (
            <Box key={row.id} onClick={() => handleRowClick(row)}
              sx={{
                px: 2.5, py: 1.5, cursor: "pointer",
                borderLeft: c?.id === row.id ? "3px solid #408DFB" : "3px solid transparent",
                bgcolor: c?.id === row.id ? "#f0f6ff" : "transparent",
                "&:hover": { bgcolor: c?.id === row.id ? "#e8f0fe" : "#fafafa" },
                borderBottom: "1px solid #f5f5f5",
              }}>
              <Typography sx={{
                fontWeight: c?.id === row.id ? 700 : 500,
                fontSize: "0.82rem",
                color: c?.id === row.id ? "#408DFB" : "#333",
                textTransform: "uppercase",
                lineHeight: 1.4,
              }}>
                {row.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right: detail panel */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <Box sx={{ px: 3, py: 1.5, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, bgcolor: "#fff" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#1a1a1a" }}>
            {detailView === "basic" ? "Basic Info" : "More Info"}
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            {detailView === "basic" ? (
              <Button size="small" variant="outlined" onClick={() => setDetailView("more")}
                sx={{ textTransform: "none", fontSize: "0.8rem", fontWeight: 500, borderRadius: "4px", color: "#333", borderColor: "#e0e0e0", py: 0.4, px: 2, bgcolor: "#fff", "&:hover": { borderColor: "#408DFB", color: "#408DFB" } }}>
                More Info
              </Button>
            ) : (
              <Button size="small" variant="outlined" onClick={() => setDetailView("basic")}
                sx={{ textTransform: "none", fontSize: "0.8rem", fontWeight: 500, borderRadius: "4px", color: "#333", borderColor: "#e0e0e0", py: 0.4, px: 2, bgcolor: "#fff", "&:hover": { borderColor: "#408DFB", color: "#408DFB" } }}>
                Basic Info
              </Button>
            )}
            <Button size="small" variant="outlined" onClick={() => onEdit && onEdit(c)}
              sx={{ textTransform: "none", fontSize: "0.8rem", fontWeight: 500, borderRadius: "4px", color: "#333", borderColor: "#e0e0e0", py: 0.4, px: 2, bgcolor: "#fff" }}>
              Edit
            </Button>
            <IconButton onClick={() => setSelectedCustomer(null)} sx={{ color: "#ff4d4d", p: 0.5, "&:hover": { bgcolor: "#fff5f5" } }}>
              <CloseIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* ── BASIC INFO ── */}
        {detailView === "basic" && (
          <Box sx={{ flexGrow: 1, display: "flex", overflow: "hidden" }}>

            {/* Left column: contact + sections */}
            <Box sx={{ width: "55%", maxWidth: 530, borderRight: "1px solid #eee", overflowY: "auto" }}>

              {/* Customer name + avatar + contact */}
              <Box sx={{ px: 3, py: 2.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#1a1a1a", textTransform: "uppercase", mb: 2 }}>
                  {c.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Avatar sx={{ bgcolor: "#408DFB", color: "#fff", width: 46, height: 46, fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
                    {(c.firstName || c.name)?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Box>
                    {contactName && (
                      <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1a1a", mb: 0.4 }}>{contactName}</Typography>
                    )}
                    {c.email && (
                      <Typography sx={{ fontSize: "0.83rem", color: "#444", mb: 0.3 }}>{c.email}</Typography>
                    )}
                    {c.phone && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.2 }}>
                        <PhoneIcon sx={{ fontSize: 13, color: "#555" }} />
                        <Typography sx={{ fontSize: "0.83rem", color: "#444" }}>{c.phone}</Typography>
                      </Box>
                    )}
                    {c.mobile && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <PhoneAndroidIcon sx={{ fontSize: 13, color: "#555" }} />
                        <Typography sx={{ fontSize: "0.83rem", color: "#444" }}>{c.mobile}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>

              {/* Address */}
              <SectionRow title="Address" defaultOpen={true}>
                <Box sx={{ mt: 1.5 }}>
                  <AddressBlock label="Billing Address"
                    attention={c.billingAttention} addr1={c.billingAddress1} addr2={c.billingAddress2}
                    city={c.billingCity} state={c.billingState} zip={c.billingZip} phone={c.billingPhone}
                    onEdit={() => handleEditAddress("billing")} />
                  <AddressBlock label="Shipping Address"
                    attention={c.shippingAttention} addr1={c.shippingAddress1} addr2={c.shippingAddress2}
                    city={c.shippingCity} state={c.shippingState} zip={c.shippingZip} phone={c.shippingPhone}
                    onEdit={() => handleEditAddress("shipping")} />
                </Box>
              </SectionRow>

              {/* Contact Person */}
              <SectionRow title="Contact Person" defaultOpen={false}>
                {c.contacts?.filter(ct => ct.f_name || ct.email).length > 0 ? (
                  c.contacts.filter(ct => ct.f_name || ct.email).map((ct, i) => (
                    <Box key={i} sx={{ border: "1px solid #eee", borderRadius: 1.5, p: 1.5, mb: 1, display: "flex", gap: 1.5, alignItems: "flex-start", mt: 1 }}>
                      <Avatar sx={{ bgcolor: "#e8e8e8", color: "#888", width: 34, height: 34, fontSize: 14, flexShrink: 0 }}>
                        {ct.f_name?.charAt(0) || "?"}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#1a1a1a" }}>
                          {`${ct.salutation?.label || ""} ${ct.f_name || ""} ${ct.l_name || ""}`.trim() || "—"}
                        </Typography>
                        {ct.email && <Typography sx={{ fontSize: "0.8rem", color: "#555" }}>{ct.email}</Typography>}
                        <Box sx={{ display: "flex", gap: 1.5, mt: 0.3, flexWrap: "wrap" }}>
                          {ct.phone && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                              <PhoneIcon sx={{ fontSize: 12, color: "#888" }} />
                              <Typography sx={{ fontSize: "0.78rem", color: "#555" }}>{ct.phone}</Typography>
                            </Box>
                          )}
                          {ct.mobile && (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                              <PhoneAndroidIcon sx={{ fontSize: 12, color: "#888" }} />
                              <Typography sx={{ fontSize: "0.78rem", color: "#555" }}>{ct.mobile}</Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ fontSize: "0.82rem", color: "#aaa", mt: 1 }}>No contact persons added.</Typography>
                )}
              </SectionRow>

              {/* Other Details */}
              <SectionRow title="Other Details" defaultOpen={false}>
                <Box sx={{ display: "grid", gridTemplateColumns: "170px 1fr", rowGap: "8px", columnGap: "12px", mt: 1 }}>
                  {[
                    ["Customer Type", c.type],
                    ["Default Currency", "INR"],
                    ["Payment Terms", "Net 15"],
                    ["Business Legal Name", c.company],
                    ["GST Treatment", c.gstTreatment],
                    ["GSTIN", c.gstIn],
                    ["Place Of Supply", c.placeOfSupply],
                    ["PAN NO", c.panNo],
                    ["Tax Preference", c.taxPreference],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <React.Fragment key={label}>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.82rem", color: "#555" }}>{label}</Typography>
                      <Typography sx={{ fontSize: "0.82rem", color: "#1a1a1a" }}>{value}</Typography>
                    </React.Fragment>
                  ))}
                </Box>
              </SectionRow>
            </Box>

            {/* Right column: payment / receivables / history */}
            <Box sx={{ flexGrow: 1, px: 3, py: 3, overflowY: "auto" }}>

              {/* Payment Due Period */}
              <Typography sx={{ fontWeight: 800, fontSize: "0.72rem", color: "#555", letterSpacing: 1, textTransform: "uppercase", mb: 1.2 }}>
                Payment Due Period
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: "#1a1a1a" }}>Net 15</Typography>
                <IconButton size="small" sx={{ p: 0.3 }}>
                  <EditIcon sx={{ fontSize: 13, color: "#aaa" }} />
                </IconButton>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Receivables */}
              <Typography sx={{ fontWeight: 800, fontSize: "0.72rem", color: "#555", letterSpacing: 1, textTransform: "uppercase", mb: 1.5 }}>
                Receivables
              </Typography>
              <Box sx={{ border: "1px solid #eee", borderRadius: 1, overflow: "hidden", mb: 3 }}>
                {/* header row */}
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 140px 110px", bgcolor: "#f9f9f9", px: 2, py: 1, borderBottom: "1px solid #eee" }}>
                  <Typography sx={{ fontSize: "0.68rem", color: "#999", fontWeight: 700, textTransform: "uppercase" }}>Currency</Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#999", fontWeight: 700, textTransform: "uppercase", textAlign: "right" }}>Outstanding Receivables</Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: "#999", fontWeight: 700, textTransform: "uppercase", textAlign: "right" }}>Unused Credits</Typography>
                </Box>
                {/* data row */}
                <Box 
                  sx={{ display: "grid", gridTemplateColumns: "1fr 140px 110px", px: 2, py: 1.2, bgcolor: "#fff" }}
                >
                  <Typography sx={{ fontSize: "0.83rem", color: "#333" }}>INR - Indian Rupee</Typography>
                  <Typography 
                    onClick={() => setOpenInvoiceModal(true)}
                    sx={{ fontSize: "0.83rem", color: "#408DFB", fontWeight: 600, textAlign: "right", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                    ₹0
                  </Typography>
                  <Typography 
                    onClick={() => setOpenCreditModal(true)}
                    sx={{ fontSize: "0.83rem", color: "#408DFB", fontWeight: 600, textAlign: "right", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                    ₹0
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* History */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.8 }}>
                <Typography sx={{ fontWeight: 800, fontSize: "0.72rem", color: "#555", letterSpacing: 1, textTransform: "uppercase" }}>
                  History
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer" }}>
                  <CalendarMonthIcon sx={{ fontSize: 14, color: "#555" }} />
                  <Typography sx={{ fontSize: "0.75rem", color: "#555" }}>Filter by Date Range</Typography>
                </Box>
              </Box>

              {/* History entry */}
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                {/* Timestamp */}
                <Box sx={{ minWidth: 64, flexShrink: 0 }}>
                  <Typography sx={{ fontSize: "0.68rem", color: "#999", lineHeight: 1.5 }}>
                    {c.createdAt?.split(",")[0] || new Date().toLocaleDateString()}<br />
                    {c.createdAt?.split(",")[1]?.trim() || new Date().toLocaleTimeString()}
                  </Typography>
                </Box>
                {/* Icon */}
                <Box sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: "#e8f0fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ChatBubbleOutlineIcon sx={{ fontSize: 15, color: "#408DFB" }} />
                </Box>
                {/* Card */}
                <Box sx={{ flexGrow: 1, border: "1px solid #eee", borderRadius: 1.5, p: 1.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#1a1a1a", mb: 0.3 }}>Customer</Typography>
                  <Typography sx={{ fontSize: "0.8rem", color: "#555", mb: 0.2 }}>Customer created</Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "#408DFB" }}>
                    by {c.email || "user"}
                  </Typography>
                </Box>
              </Box>

            </Box>
          </Box>
        )}

        {/* ── MORE INFO ── */}
        {detailView === "more" && (
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "#fff" }}>
            <Box sx={{ borderBottom: "1px solid #eee", px: 2, pt: 1 }}>
              <Tabs value={moreInfoTab} onChange={(_, v) => setMoreInfoTab(v)}
                sx={{ 
                  minHeight: 40,
                  "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.9rem", minHeight: 40, color: "#666", px: 3 }, 
                  "& .Mui-selected": { color: "#408DFB !important" }, 
                  "& .MuiTabs-indicator": { bgcolor: "#408DFB", height: 2 } 
                }}>
                <Tab label="Transactions" />
                <Tab label="History" />
              </Tabs>
            </Box>

            {moreInfoTab === 0 && (
              <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-thumb": { bgcolor: "#eee", borderRadius: "10px" } }}>
                {transactionSections.map((section, idx) => (
                  <TransactionAccordion 
                    key={section.label} 
                    section={section} 
                    initialOpen={idx < 2} 
                    c={c} 
                    onNavigate={onNavigate} 
                  />
                ))}
              </Box>
            )}

            {moreInfoTab === 1 && (
              <Box sx={{ flexGrow: 1, overflowY: "auto", px: 3, pt: 4, display: "flex", flexDirection: "column" }}>
                {!c.history || c.history.length === 0 ? (
                  <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 3 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.4rem", color: "#333", letterSpacing: "0.5px" }}>
                      No History Available
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {[...c.history].reverse().map((item, idx) => (
                      <Box key={item.id || idx} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                        <Box sx={{ minWidth: 70, flexShrink: 0 }}>
                          <Typography sx={{ fontSize: "0.7rem", color: "#999", lineHeight: 1.6, fontWeight: 500 }}>
                            {item.date?.split(",")[0] || new Date().toLocaleDateString()}<br />
                            {item.date?.split(",")[1]?.trim() || "12:00 PM"}
                          </Typography>
                        </Box>
                        <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#eef5ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <ChatBubbleOutlineIcon sx={{ fontSize: 16, color: "#408DFB" }} />
                        </Box>
                        <Box sx={{ flexGrow: 1, border: "1px solid #f0f0f0", borderRadius: "8px", p: 2, bgcolor: "#fff" }}>
                          <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1a1a", mb: 0.5 }}>{item.type || "Event"}</Typography>
                          <Typography sx={{ fontSize: "0.85rem", color: "#555", mb: 0.4 }}>{item.message || "Customer updated"}</Typography>
                          <Typography sx={{ fontSize: "0.8rem", color: "#408DFB", fontWeight: 500 }}>by {item.user || "System"}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* ── CREDIT DETAILS MODAL ── */}
      <Dialog open={openCreditModal} onClose={() => setOpenCreditModal(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: "8px", overflow: "hidden" } }}>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fff" }}>
          <Typography sx={{ fontWeight: 600, fontSize: "1.1rem", color: "#333" }}>
            Credit details for {c?.name}
          </Typography>
          <IconButton onClick={() => setOpenCreditModal(false)} size="small">
            <CloseIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
        <Box sx={{ p: 4, bgcolor: "#fff" }}>
          <Box sx={{ border: "1px solid #eee", borderRadius: "4px", overflow: "hidden" }}>
            {/* Table Header */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", borderBottom: "1px solid #eee" }}>
              <Box sx={{ p: 1.5, borderRight: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>CREDIT INFO</Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRight: "1px solid #eee", textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>DATE CREDITED</Typography>
              </Box>
              <Box sx={{ p: 1.5, textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>AMOUNT</Typography>
              </Box>
            </Box>
            {/* Empty Content Placeholder */}
            <Box sx={{ minHeight: "60px", display: "flex", justifyContent: "center", alignItems: "center" }}>
               {/* Content would go here */}
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* ── INVOICES MODAL ── */}
      <Dialog open={openInvoiceModal} onClose={() => setOpenInvoiceModal(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: "8px", overflow: "hidden" } }}>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fff" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#111" }}>
            Invoices
          </Typography>
          <IconButton onClick={() => setOpenInvoiceModal(false)} size="small">
            <CloseIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
        <Box sx={{ p: 4, bgcolor: "#fff" }}>
          <Box sx={{ border: "1px solid #eee", borderRadius: "4px", overflow: "hidden" }}>
            {/* Table Header */}
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: "1px solid #eee", bgcolor: "#fafafa" }}>
              <Box sx={{ p: 1.5, borderRight: "1px solid #eee" }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>INVOICE NUMBER</Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRight: "1px solid #eee", textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>INVOICE DATE</Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRight: "1px solid #eee", textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>INVOICE AMOUNT</Typography>
              </Box>
              <Box sx={{ p: 1.5, textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", letterSpacing: 0.5 }}>INVOICE BALANCE</Typography>
              </Box>
            </Box>
            {/* Empty Content Placeholder */}
            <Box sx={{ minHeight: "80px", display: "flex", justifyContent: "center", alignItems: "center" }}>
               {/* Content logic goes here */}
            </Box>
          </Box>
        </Box>
      </Dialog>

      {/* ── ADDRESS EDIT MODAL ── */}
      <Dialog open={openAddressModal} onClose={() => setOpenAddressModal(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: "8px", overflow: "hidden" } }}>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fff" }}>
          <Typography sx={{ fontWeight: 600, fontSize: "1.1rem", color: "#333" }}>
            {addressType === "billing" ? "Billing Address" : "Shipping Address"}
          </Typography>
          <IconButton onClick={() => setOpenAddressModal(false)} size="small">
            <CloseIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
        <Box sx={{ p: 4, bgcolor: "#fff" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { label: "Attention", value: addressForm.attention, field: "attention" },
              { label: "Country / Region", value: addressForm.country, field: "country", type: "select" },
              { label: "Street 1", value: addressForm.addr1, field: "addr1" },
              { label: "Street 2", value: addressForm.addr2, field: "addr2" },
              { label: "City", value: addressForm.city, field: "city" },
              { label: "State", value: addressForm.state, field: "state" },
              { label: "Pin Code", value: addressForm.zip, field: "zip" },
              { label: "Phone", value: addressForm.phone, field: "phone" },
              { label: "Fax Number", value: addressForm.fax, field: "fax" },
            ].map((f) => (
              <Box key={f.label} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#333" }}>{f.label}</Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  value={f.value} 
                  onChange={(e) => setAddressForm({ ...addressForm, [f.field]: e.target.value })}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { fontSize: "0.85rem", borderRadius: "4px" },
                    "& fieldset": { borderColor: "#ddd" }
                  }}
                />
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={handleSaveAddress}
              sx={{ bgcolor: "#408DFB", textTransform: "uppercase", px: 3, py: 0.8, fontSize: "0.85rem", fontWeight: 600, boxShadow: "none" }}>
              SAVE
            </Button>
            <Button variant="outlined" onClick={() => setOpenAddressModal(false)}
              sx={{ color: "#408DFB", borderColor: "#408DFB", textTransform: "uppercase", px: 3, py: 0.8, fontSize: "0.85rem", fontWeight: 600 }}>
              CANCEL
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CustomerMaster;
