import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  Card,
  TextField,
  InputAdornment,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  Drawer,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  Popover
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DoneIcon from '@mui/icons-material/Done';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useRef } from 'react';
import { generateInvoicePdf } from '../utils/pdfGenerator';
import TaxInvoiceTemplate from './TaxInvoiceTemplate';
import CashBillTemplate from './CashBillTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Sidebar from './Sidebar';

export default function CustomerTripDetails({ mode = 'light' }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const customer = state?.customer || { name: '', qty: 0, invoiceAmt: 0 };
  const machine = state?.machine || {};

  const [tripData, setTripData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [invoiceTab, setInvoiceTab] = useState(0);
  const [selectedTruckIds, setSelectedTruckIds] = useState(new Set());
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState("All Recipes");
  const [anchorEl, setAnchorEl] = useState(null);
  const [saveSendAnchorEl, setSaveSendAnchorEl] = useState(null);
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);
  const [selectedPdfTemplate, setSelectedPdfTemplate] = useState('Tax Invoice');
  const [previewPdfUrl, setPreviewPdfUrl] = useState(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const openFilterMenu = Boolean(anchorEl);
  const previewRef = useRef(null);

  const handlePreviewInvoice = async () => {
    setIsGeneratingPreview(true);
    try {
      const element = previewRef.current;
      if (!element) throw new Error("Element not found");

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const arrayBuffer = pdf.output('arraybuffer');
      
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPreviewPdfUrl(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleSaveSendClick = (event) => {
    setSaveSendAnchorEl(event.currentTarget);
  };

  const handleSaveSendClose = () => {
    setSaveSendAnchorEl(null);
  };

  React.useEffect(() => {
    fetchTrips();
  }, [customer.name, machine.id]);

  const filteredTrips = tripData.filter((trip) => {
    const matchesSearch = trip.truckNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.batch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRecipe = selectedRecipe === "All Recipes" || trip.mixInfo === selectedRecipe;
    return matchesSearch && matchesRecipe;
  });

  const uniqueRecipes = ["All Recipes", ...new Set(tripData.map(t => t.mixInfo))];

  const totalTrucks = filteredTrips.length;
  const totalQty = filteredTrips.reduce((acc, trip) => acc + trip.qty, 0).toFixed(1);
  const totalAmt = filteredTrips.reduce((acc, trip) => acc + trip.totalNum, 0);

  const groupedTrips = [];
  filteredTrips.forEach(trip => {
    let group = groupedTrips.find(g => g.date === trip.dateString);
    if (!group) {
      group = { date: trip.dateString, trips: [], totalQty: 0 };
      groupedTrips.push(group);
    }
    group.trips.push(trip);
    group.totalQty += trip.qty;
  });

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token");

      let actualCustId = customer.name;
      try {
        const mastersResponse = await fetch("http://13.234.251.159:9080/api/BatchingPlant/Get_MastersList", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            rpt_type: "customer list",
            mac_id: machine.id || "MI0001",
            Prod_id: machine.plantId || "PI001",
            date_filter: "No"
          })
        });

        if (mastersResponse.ok) {
          const result = await mastersResponse.json();
          if (result.status === 1 && result.data) {
             const transformedCustomers = result.data.map((c, index) => ({
                 id: (c.b || c.c_id || index.toString()).toString(),
                 name: (c.a || c.c_name || "Unknown").trim()
             }));
             
             // First try exact ID match
             const exactIdMatch = transformedCustomers.find(c => c.id === customer.name?.toString());
             
             // Then try name match
             const nameMatch = transformedCustomers.find(c => 
                 c.name.toLowerCase() === (customer.displayName || "").trim().toLowerCase() ||
                 c.name.toLowerCase() === (customer.name || "").trim().toLowerCase()
             );
             
             if (exactIdMatch) {
                 actualCustId = exactIdMatch.id;
             } else if (nameMatch) {
                 actualCustId = nameMatch.id;
             }
          }
        }
      } catch (err) {
        console.error("Failed to fetch customer list:", err);
      }

      let recipePrices = [];
      try {
        const currentCustId = actualCustId ? actualCustId.toString() : "Default";
        const priceListResponse = await fetch("http://13.234.251.159:9080/api/BatchingPlant/Get_RecipePriceList", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            mac_id: machine.id || "MI0001",
            prod_id: machine.plantId || "PI001", 
            cust_id: currentCustId
          })
        });
        if (priceListResponse.ok) {
           const priceResult = await priceListResponse.json();
           if (priceResult.status === 1 && priceResult.data) {
             recipePrices = priceResult.data.map(item => ({
               rec_id: item.rec_id,
               rec_name: item.rec_name,
               deftamt: item.deftamt || 0,
               custamt: item.custamt || 0,
               price: currentCustId === "Default" || currentCustId === "customer" ? (item.deftamt || 0) : (item.custamt || 0)
             }));
           }
        }
      } catch (err) {
        console.error("Failed to fetch recipe prices:", err);
      }

      const response = await fetch("http://13.234.251.159:9080/api/BatchingPlant/Get_InvoicePendingTruckList", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mac_id: machine.id,
          cust_id: customer.name
        })
      });

      if (response.ok) {
        const result = await response.json();

        if (result.status === 1 && result.data) {
          const mappedTrips = result.data.map((trip, index) => {
            const dt = new Date(trip.dat);

            const hours = dt.getHours() % 12 || 12;
            const ampm = dt.getHours() >= 12 ? 'PM' : 'AM';
            const formattedDate = `${dt.getDate().toString().padStart(2, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getFullYear()} ${hours}:${dt.getMinutes().toString().padStart(2, '0')} ${ampm}`;

            const timeString = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`;
            const day = dt.getDate();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const dateString = `${day} ${monthNames[dt.getMonth()]} ${dt.getFullYear()}`;

            let finalRate = Number(trip.amt) || 0;
            const matchedRecipe = recipePrices.find(r => r.rec_name === trip.rec_name);
            if (matchedRecipe) {
              if (Number(matchedRecipe.custamt) > 0) {
                finalRate = Number(matchedRecipe.custamt);
              } else if (Number(matchedRecipe.deftamt) > 0) {
                finalRate = Number(matchedRecipe.deftamt);
              }
            }

            const finalQty = Number(trip.qty) || 0;
            const finalTotalAmt = finalQty * finalRate;

            return {
              id: `${trip.batch}-${index}`,
              timeString,
              dateString,
              truckNo: trip.truck || "-",
              driverName: "-",
              driverNo: "-",
              grade: trip.rec_name ? trip.rec_name.split('-')[1]?.split(' ')[0] || "-" : "-",
              mixType: "Design Mix",
              cement: "-",
              admixture: "-",
              mixInfo: trip.rec_name || "-",
              batchDate: formattedDate,
              rawDate: dt,
              fullDate: trip.dat,
              batch: `#${trip.batch}`,
              concrete: `${trip.qty} m³`,
              qty: finalQty,
              rateStr: finalRate.toLocaleString('en-IN'),
              rateNum: finalRate,
              totalStr: finalTotalAmt.toLocaleString('en-IN'),
              totalNum: finalTotalAmt,
              rawBatch: trip.batch,
              rawQty: finalQty,
              rawAmt: finalRate,
              rawTotAmt: finalTotalAmt,
            };
          });
          mappedTrips.sort((a, b) => b.rawDate - a.rawDate);
          setTripData(mappedTrips);
        }
      }
    } catch (error) {
      console.error("Failed to fetch trips:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    setIsUpdating(true);
    try {
      const token = sessionStorage.getItem("token");
      const upd_by = sessionStorage.getItem("userId") || "L0001"; // Fallback to L0001

      const payload = {
        mac_id: machine.id || "MI0001",
        upd_by: upd_by,
        data: selectedTrips.map(trip => ({
          batch: trip.rawBatch,
          dat: trip.fullDate,
          qty: String(trip.rawQty),
          amt: String(trip.rawAmt),
          tot_amt: String(trip.rawTotAmt)
        }))
      };

      const response = await fetch("http://13.234.251.159:9080/api/BatchingPlant/UpdateBatchInvoicePriceList", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 1) {
          setSelectedTruckIds(new Set());
          setOpenConfirmDialog(false);
          await fetchTrips(); // Refresh the list
        } else {
          alert(result.msg || "Failed to update price");
        }
      } else {
        alert("Server error. Please try again later.");
      }
    } catch (error) {
      console.error("Payment confirmation failed:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedTruckIds(new Set(filteredTrips.map(trip => trip.id)));
    } else {
      setSelectedTruckIds(new Set());
    }
  };

  const handleToggleTruck = (tripId) => {
    const newSelected = new Set(selectedTruckIds);
    if (newSelected.has(tripId)) {
      newSelected.delete(tripId);
    } else {
      newSelected.add(tripId);
    }
    setSelectedTruckIds(newSelected);
  };

  const handleTripEdit = (tripId, field, value) => {
    setTripData(prevData => prevData.map(trip => {
      if (trip.id === tripId) {
        let newQty = trip.qty;
        let newRate = trip.rateNum;
        
        if (field === 'qty') {
          newQty = value === '' ? '' : parseFloat(value) || 0;
        } else if (field === 'rate') {
          newRate = value === '' ? '' : parseFloat(value) || 0;
        }
        
        const calcQty = newQty === '' ? 0 : newQty;
        const calcRate = newRate === '' ? 0 : newRate;
        const newTotal = calcQty * calcRate;
        
        return {
          ...trip,
          qty: newQty,
          concrete: `${newQty} m³`,
          rateNum: newRate,
          rateStr: calcRate.toLocaleString('en-IN'),
          totalNum: newTotal,
          totalStr: newTotal.toLocaleString('en-IN'),
          rawQty: newQty,
          rawAmt: newRate,
          rawTotAmt: newTotal
        };
      }
      return trip;
    }));
  };


  const selectedTrips = filteredTrips.filter(trip => selectedTruckIds.has(trip.id));
  const selectedCount = selectedTrips.length;
  const selectedTotalQty = selectedTrips.reduce((acc, trip) => acc + trip.qty, 0).toFixed(1);
  const selectedTotalAmt = selectedTrips.reduce((acc, trip) => acc + trip.totalNum, 0);


  const [reportsOpen, setReportsOpen] = useState(false);
  const [batchSearch, setBatchSearch] = useState("");


  const [selectedTrip, setSelectedTrip] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState({ 
    invoiceNo: '', billingName: '', billingAddress: '', gstin: '', companyName: '', companyAddress: '', companyGstin: '', invoiceDate: '', orderDate: '', consigneeName: '', consigneeAddress: '',
    items: [],
    discount: 0,
    discountType: '%',
    adjustment: 0,
    customerNotes: 'Looking forward for your business.'
  });
  const [cashBillData, setCashBillData] = useState({ billNumber: '', customerName: '', notes: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const invoiceRef = useRef(null);
  const cashBillRef = useRef(null);

  const isDark = mode === 'dark';

  const handleOpenDialog = (trip) => {
    setSelectedTrip(trip);
    setInvoiceDetails({
      cName: 'ADICONSTRO INFRA PVT LTD',
      cAddress: '12/4, OMR IT Expressway, Thoraipakkam, Chennai - 600097, TN',
      cGst: '33AAICA1234F1Z5',
      invNo: `INV-2026-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`,
      invDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      vehNo: trip?.truckNo || '',
      driver: trip?.driverName || '-',
      delDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      custCompany: customer?.name || '',
      custAddress: '',
      custGst: '',
      consigneeName: customer?.name || '',
      consigneeAddress: '',
      items: [
        {
          id: Date.now(),
          details: `Ready Mix Concrete (${trip?.mixInfo?.split(' ')[0] || ''})`,
          hsn: '38245010',
          qty: trip?.rawQty || 0,
          rate: trip?.rawAmt || 0,
          amount: (trip?.rawQty || 0) * (trip?.rawAmt || 0)
        }
      ],
      discount: 0,
      discountType: '%',
      adjustment: 0,
      customerNotes: 'Looking forward for your business.'
    });
    setOpenInvoiceDialog(true);
  };
  
  const handleAddItem = () => {
    setInvoiceDetails(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), details: '', hsn: '', qty: 1, rate: 0, amount: 0 }]
    }));
  };

  const handleRemoveItem = (id) => {
    setInvoiceDetails(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleItemChange = (id, field, value) => {
    setInvoiceDetails(prev => {
      const newItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'qty' || field === 'rate') {
            updatedItem.amount = Number(updatedItem.qty) * Number(updatedItem.rate);
          }
          return updatedItem;
        }
        return item;
      });
      return { ...prev, items: newItems };
    });
  };

  const calculateTotals = () => {
    const subTotal = invoiceDetails.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const discountAmt = invoiceDetails.discountType === '%' 
      ? subTotal * (Number(invoiceDetails.discount) || 0) / 100 
      : (Number(invoiceDetails.discount) || 0);
    const discountedTotal = subTotal - discountAmt;
    const gstAmt = invoiceTab === 0 ? discountedTotal * 0.18 : 0; // 18% GST for Tax Invoice
    const finalTotal = discountedTotal + gstAmt + (Number(invoiceDetails.adjustment) || 0);
    return { subTotal, discountAmt, gstAmt, finalTotal };
  };

  const totals = calculateTotals();
  
  // Also pass calculated total info into handleGenerateFormDialog
  const handleCloseDialog = () => {
    setOpenInvoiceDialog(false);
    setSelectedTrip(null);
  };

  const handleTabChange = (event, newValue) => setInvoiceTab(newValue);

  const handleGeneratePdfDialog = async () => {
    setIsGenerating(true);
    try {
      const element = previewRef.current;
      if (!element) throw new Error("Element not found");

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const title = selectedPdfTemplate || "Invoice";
      pdf.save(`${title.replace(' ', '_')}_${selectedTrip?.truckNo || 'Trip'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Failed to generate PDF. See console for details.');
    } finally {
      setIsGenerating(false);
      handleCloseDialog();
    }
  };

  const handleGenerateFormDialog = () => {
    const title = invoiceTab === 0 ? "TAX INVOICE" : "CASH BILL";
    navigate('/invoice-view', {
      state: {
        invoiceDetails: { ...invoiceDetails, ...totals },
        tripDetails: selectedTrip,
        customerDetails: customer,
        title
      }
    });
    handleCloseDialog();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{
        flexGrow: 1,
        minHeight: "100vh",
        bgcolor: isDark ? '#121212' : '#f0f2f5',
        pb: 8,
        p: 0,
      }}>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: "10px 30px",
        borderBottom: `1px solid ${isDark ? '#333' : '#eee'}`,
        bgcolor: isDark ? '#1e1e1e' : '#F9F9FB',
        minHeight: "75px",
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'text.primary' }}>
            <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: isDark ? '#fff' : '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
            {customer.displayName || customer.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            onClick={handleFilterClick}
            startIcon={<FilterListIcon sx={{ color: isDark ? '#aaa' : '#5f6368', fontSize: 20 }} />}
            endIcon={<KeyboardArrowDownIcon sx={{ color: isDark ? '#aaa' : '#5f6368', fontSize: 20 }} />}
            sx={{
              textTransform: 'none',
              color: isDark ? '#fff' : '#1a1a1a',
              fontWeight: 600,
              bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
              border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
              borderRadius: 2,
              px: 2,
              py: 0.8,
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#f5f5f5',
                borderColor: isDark ? '#444' : '#ccc'
              }
            }}
          >
            Filters
          </Button>
          <IconButton onClick={() => fetchTrips()} sx={{ color: 'text.primary' }}>
            <RefreshIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, pt: 2 }}>


      <Box sx={{ display: 'flex', gap: 2, mb: 3, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
        <Box sx={{
          flexShrink: 0,
          flex: 1,
          minWidth: '100px',
          bgcolor: isDark ? 'rgba(25, 118, 210, 0.1)' : '#e8f0fe',
          borderRadius: 3,
          p: 2,
          border: '1px solid',
          borderColor: isDark ? 'rgba(25, 118, 210, 0.2)' : '#d2e3fc',
        }}>
          <LocalShippingIcon sx={{ color: '#1976d2', mb: 1, fontSize: 20 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#1976d2', lineHeight: 1 }}>
            {totalTrucks}
          </Typography>
          <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#5f6368', fontWeight: 500, mt: 0.5 }}>
            Trucks
          </Typography>
        </Box>

        <Box sx={{
          flexShrink: 0,
          flex: 1,
          minWidth: '100px',
          bgcolor: isDark ? 'rgba(25, 118, 210, 0.1)' : '#e8f0fe',
          borderRadius: 3,
          p: 2,
          border: '1px solid',
          borderColor: isDark ? 'rgba(25, 118, 210, 0.2)' : '#d2e3fc',
        }}>
          <InvertColorsIcon sx={{ color: '#1976d2', mb: 1, fontSize: 20 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#1976d2', lineHeight: 1 }}>
            {totalQty}
          </Typography>
          <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#5f6368', fontWeight: 500, mt: 0.5 }}>
            Total Qty
          </Typography>
        </Box>

        <Box sx={{
          flexShrink: 0,
          flex: 1,
          minWidth: '100px',
          bgcolor: isDark ? 'rgba(233, 30, 99, 0.1)' : '#fce4ec',
          borderRadius: 3,
          p: 2,
          border: '1px solid',
          borderColor: isDark ? 'rgba(233, 30, 99, 0.2)' : '#f8bbd0',
        }}>
          <CurrencyRupeeIcon sx={{ color: '#e91e63', mb: 1, fontSize: 20 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#e91e63', lineHeight: 1 }}>
            ₹{totalAmt.toLocaleString('en-IN')}
          </Typography>
          <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#5f6368', fontWeight: 500, mt: 0.5 }}>
            Total Amt
          </Typography>
        </Box>
      </Box>


      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by truck no, batch..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            sx: {
              bgcolor: isDark ? '#1e1e1e' : '#fff',
              borderRadius: 3,
              '& fieldset': { border: 'none' },
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              py: 0.5,
              height: '100%',
            }
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            setBatchSearch(searchQuery);
            setReportsOpen(true);
          }}
          sx={{
            bgcolor: '#4A7CF3',
            color: '#fff',
            borderRadius: 3,
            px: 4,
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(74, 124, 243, 0.3)',
            '&:hover': { bgcolor: '#3a68d0' }
          }}
        >
          Reports
        </Button>
      </Box>

      {/* Select All Row */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
        px: 1,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: isDark ? '#121212' : '#f0f2f5',
        py: 1
      }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedTruckIds.size === filteredTrips.length && filteredTrips.length > 0}
              indeterminate={selectedTruckIds.size > 0 && selectedTruckIds.size < filteredTrips.length}
              onChange={handleToggleSelectAll}
              sx={{ color: '#4A7CF3', '&.Mui-checked': { color: '#4A7CF3' } }}
            />
          }
          label={<Typography variant="body2" fontWeight="800" color="text.primary">Select All</Typography>}
        />
        {selectedTruckIds.size > 0 && (
          <Button
            onClick={() => setSelectedTruckIds(new Set())}
            sx={{ color: '#e91e63', textTransform: 'none', fontWeight: 'bold' }}
          >
            Clear ({selectedTruckIds.size})
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {isLoading ? (
          <LinearProgress sx={{ mt: 2 }} />
        ) : filteredTrips.length === 0 ? (
          <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
            No trips available
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {groupedTrips.map((group) => (
              <Box key={group.date} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1, gap: 2 }}>
                  <Box sx={{
                    bgcolor: isDark ? 'rgba(74, 124, 243, 0.1)' : '#eef2fb',
                    px: 2,
                    py: 0.5,
                    borderRadius: 5,
                    border: `1px solid ${isDark ? 'rgba(74, 124, 243, 0.2)' : '#d0e1f9'}`,
                    whiteSpace: 'nowrap'
                  }}>
                    <Typography variant="body2" fontWeight="800" sx={{ color: isDark ? '#4A7CF3' : '#1976d2' }}>
                      {group.date}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: isDark ? '#333' : '#e0e0e0' }} />
                  <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#666', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                    {group.trips.length} {group.trips.length === 1 ? 'truck' : 'trucks'} • {group.totalQty.toFixed(1)}m³
                  </Typography>
                </Box>

                {group.trips.map((trip) => (
                  <Card key={trip.id} sx={{
                    bgcolor: isDark ? '#1e1e1e' : '#fff',
                    borderRadius: 4,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    p: 2.5
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Checkbox
                          checked={selectedTruckIds.has(trip.id)}
                          onChange={() => handleToggleTruck(trip.id)}
                          sx={{ ml: -1.5, color: '#4A7CF3', '&.Mui-checked': { color: '#4A7CF3' } }}
                        />
                        <Box sx={{
                          width: 48,
                          height: 48,
                          bgcolor: isDark ? '#333' : '#f0f2f5',
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <LocalShippingIcon sx={{ color: isDark ? '#ccc' : '#5f6368' }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.primary', lineHeight: 1.2 }}>
                            {trip.truckNo}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            {trip.mixInfo}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.8,
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f5f5f5',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 5,
                        border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`
                      }}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: isDark ? '#aaa' : '#666' }} />
                        <Typography variant="caption" fontWeight="bold" sx={{ color: isDark ? '#ddd' : '#444' }}>
                          {trip.timeString}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2, borderColor: isDark ? '#333' : '#f0f0f0', borderStyle: 'dashed' }} />


                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            # Batch
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                          {trip.batch}
                        </Typography>
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <InvertColorsIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Concrete
                          </Typography>
                        </Box>
                        <TextField
                          variant="standard"
                          type="number"
                          value={trip.qty}
                          onChange={(e) => handleTripEdit(trip.id, 'qty', e.target.value)}
                          InputProps={{
                            endAdornment: <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'bold' }}>m³</Typography>,
                            disableUnderline: true,
                            sx: { fontWeight: 'bold', color: 'text.primary', fontSize: '0.875rem' }
                          }}
                          sx={{ 
                            width: '90px', 
                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f0f2f5', 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1,
                            border: '1px solid transparent',
                            '&:hover': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#d0d0d0' },
                            '& .MuiInputBase-input': { p: 0, height: 'auto' }
                          }}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <ReceiptIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Rate
                          </Typography>
                        </Box>
                        <TextField
                          variant="standard"
                          type="number"
                          value={trip.rateNum}
                          onChange={(e) => handleTripEdit(trip.id, 'rate', e.target.value)}
                          InputProps={{
                            startAdornment: <Typography variant="body2" sx={{ mr: 0.5, fontWeight: 'bold' }}>₹</Typography>,
                            disableUnderline: true,
                            sx: { fontWeight: 'bold', color: 'text.primary', fontSize: '0.875rem' }
                          }}
                          sx={{ 
                            width: '100px', 
                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f0f2f5', 
                            px: 1, 
                            py: 0.5, 
                            borderRadius: 1,
                            border: '1px solid transparent',
                            '&:hover': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#d0d0d0' },
                            '& .MuiInputBase-input': { p: 0, height: 'auto' }
                          }}
                        />
                      </Box>

                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                          <CurrencyRupeeIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                            Total
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold" sx={{ color: 'text.primary' }}>
                          ₹{trip.totalStr}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2, borderColor: isDark ? '#333' : '#f0f0f0' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenDialog(trip)}
                        size="small"
                        sx={{
                          borderRadius: 2,
                          borderColor: '#4A7CF3',
                          color: '#4A7CF3',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': { bgcolor: 'rgba(74, 124, 243, 0.04)', borderColor: '#3a68d0' }
                        }}
                      >
                        Invoice Generate
                      </Button>
                    </Box>

                  </Card>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </Box>


      <Dialog
        open={reportsOpen}
        onClose={() => setReportsOpen(false)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: { borderRadius: 3, bgcolor: isDark ? '#1e1e1e' : '#fff', maxHeight: '90vh' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 2, pt: 3, px: 4, color: 'text.primary', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Customer Buying Report
          <IconButton onClick={() => setReportsOpen(false)} sx={{ color: 'text.secondary' }}>✕</IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: isDark ? '#333' : '#eee', p: 0, bgcolor: isDark ? '#121212' : '#ffffff' }}>
          {(() => {
            const tripRows = filteredTrips.map(trip => ({
              date: trip.batchDate,
              batch: trip.batch,
              truckNo: trip.truckNo,
              driverName: trip.driverName,
              driverNo: trip.driverNo,
              grade: trip.grade,
              mixType: trip.mixType,
              cement: trip.cement,
              admixture: trip.admixture,
              time: trip.fullDate,
              mix: trip.mixInfo,
              qty: trip.qty,
              rate: trip.rateNum,
              amount: trip.totalNum
            })
            ).sort((a, b) => a.batch.localeCompare(b.batch));

            const subtotal = tripRows.reduce((acc, row) => acc + row.amount, 0);
            const gst = subtotal * 0.05;
            const finalAmount = subtotal + gst;

            return (
              <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1100px', mx: 'auto', color: isDark ? '#e0e0e0' : '#000', fontFamily: 'Arial, sans-serif' }}>


                <Box className="report-container" sx={{
                  bgcolor: isDark ? '#1e1e1e' : '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.06)',
                  border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
                  mb: 4
                }}>


                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: { xs: 2.5, md: 4 },
                    borderBottom: `1px solid ${isDark ? '#333' : '#e0e0e0'}`,
                    bgcolor: isDark ? '#262626' : '#f8fbfc'
                  }}>
                    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                      <Box sx={{
                        width: 64,
                        height: 64,
                        bgcolor: '#4A7CF3',
                        borderRadius: '12px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff',
                        fontWeight: '900',
                        fontSize: '1.8rem',
                        boxShadow: '0 8px 16px rgba(74, 124, 243, 0.25)'
                      }}>
                        AC
                      </Box>
                      <Box>
                        <Typography variant="h5" fontWeight="900" sx={{ letterSpacing: '0.5px', color: isDark ? '#fff' : '#1a1a1a', mb: 0.5 }}>
                          ADICONSTRO INFRA PVT LTD
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: '500', color: isDark ? '#aaa' : '#5f6368' }}>ISO 9001:2015 Certified RMC Plant</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight="900" sx={{ color: '#4A7CF3', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        CUSTOMER REPORT
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: '600', color: isDark ? '#aaa' : '#5f6368', mt: 0.5 }}>
                        Generated • {new Date().toLocaleDateString('en-IN')}
                      </Typography>
                    </Box>
                  </Box>


                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: { xs: 2.5, md: 4 }, gap: 3, borderBottom: `1px solid ${isDark ? '#333' : '#e0e0e0'}` }}>
                    <Box sx={{ flex: 1, bgcolor: isDark ? '#2a2a2a' : '#f4f6fc', p: 2.5, borderRadius: 3 }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#4A7CF3', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Company Details</Typography>
                      <Typography variant="subtitle2" sx={{ mt: 1.5, fontWeight: 'bold', fontSize: '1rem', color: isDark ? '#fff' : '#1a1a1a' }}>ADICONSTRO INFRA PVT LTD</Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: isDark ? '#ccc' : '#555', lineHeight: 1.6 }}>12/4, OMR IT Expressway, Thoraipakkam, Chennai - 97<br />Ph: +91 98844 33221<br />GSTIN: 33AAICA1234F1Z5</Typography>
                    </Box>

                    <Box sx={{ flex: 1, bgcolor: isDark ? '#2a2a2a' : '#f4f6fc', p: 2.5, borderRadius: 3 }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#4A7CF3', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Customer Details</Typography>
                      <Typography variant="subtitle2" sx={{ mt: 1.5, fontWeight: 'bold', fontSize: '1rem', color: isDark ? '#fff' : '#1a1a1a' }}>{customer.name} <span style={{ fontSize: '0.8rem', color: '#888' }}>(CUST-8932)</span></Typography>
                      <Typography variant="body2" sx={{ mt: 1, color: isDark ? '#ccc' : '#555', lineHeight: 1.6 }}>Sri Kumaran Builders, Plot 45, Anna Nagar 2nd Ave, Chennai - 40<br />Mob: +91 94433 22110<br />GSTIN: 33BBXCS5678G2Z1</Typography>
                    </Box>

                    <Box sx={{ flex: 0.8, bgcolor: isDark ? 'rgba(74, 124, 243, 0.1)' : '#eef2fb', p: 2.5, borderRadius: 3, border: '1px solid', borderColor: isDark ? 'rgba(74, 124, 243, 0.2)' : '#d2e3fc' }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#4A7CF3', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Report Info</Typography>
                      <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#555' }}>Report No: <span style={{ fontWeight: '600', color: isDark ? '#fff' : '#000', float: 'right' }}>REP-2026-001</span></Typography>
                        <Typography variant="body2" sx={{ color: isDark ? '#aaa' : '#555' }}>Date: <span style={{ fontWeight: '600', color: isDark ? '#fff' : '#000', float: 'right' }}>21-03-2026</span></Typography>
                      </Box>
                    </Box>
                  </Box>


                  <Box sx={{ p: { xs: 2.5, md: 4 }, borderBottom: `1px solid ${isDark ? '#333' : '#e0e0e0'}` }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#4A7CF3', mb: 2, display: 'block', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Project / Site Details</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#888' : '#666' }}>Site Name</Typography>
                        <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5, color: isDark ? '#fff' : '#1a1a1a' }}>Skyline Elite Residency</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#888' : '#666' }}>Location</Typography>
                        <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5, color: isDark ? '#fff' : '#1a1a1a' }}>Velachery Main Rd, Chennai</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#888' : '#666' }}>Engineer</Typography>
                        <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5, color: isDark ? '#fff' : '#1a1a1a' }}>Er. R. Venkatesh</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#888' : '#666' }}>Contractor</Typography>
                        <Typography variant="body1" fontWeight="600" sx={{ mt: 0.5, color: isDark ? '#fff' : '#1a1a1a' }}>M/S Balaji Const.</Typography>
                      </Box>
                    </Box>
                  </Box>


                  <Box sx={{ borderBottom: `1px solid ${isDark ? '#333' : '#e0e0e0'}` }}>
                    <Box sx={{ px: { xs: 2.5, md: 4 }, pt: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShippingIcon sx={{ color: '#4A7CF3', fontSize: 22 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: isDark ? '#fff' : '#1a1a1a', letterSpacing: '0.5px' }}>
                        Load & Delivery Details
                      </Typography>
                    </Box>
                    <Box sx={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: isDark ? '#262626' : '#f8fbfc', borderTop: `1px solid ${isDark ? '#444' : '#eee'}`, borderBottom: `2px solid ${isDark ? '#555' : '#ddd'}` }}>
                            <th style={{ padding: '12px 16px', color: isDark ? '#aaa' : '#666', fontWeight: 600 }}>DATE</th>
                            <th style={{ padding: '12px 16px', color: isDark ? '#aaa' : '#666', fontWeight: 600 }}>BATCH NO</th>
                            <th style={{ padding: '12px 16px', color: isDark ? '#aaa' : '#666', fontWeight: 600 }}>VEHICLE NO</th>
                            <th style={{ padding: '12px 16px', color: isDark ? '#aaa' : '#666', fontWeight: 600 }}>DRIVER DETAILS</th>
                            <th style={{ padding: '12px 16px', color: isDark ? '#aaa' : '#666', fontWeight: 600 }}>GRADE & MIX</th>
                            <th style={{ padding: '12px 16px', color: isDark ? '#aaa' : '#666', fontWeight: 600 }}>MATERIALS</th>
                            <th style={{ padding: '12px 16px', color: isDark ? '#aaa' : '#666', fontWeight: 600 }}>TIME</th>
                            <th style={{ padding: '12px 16px', color: isDark ? '#aaa' : '#666', fontWeight: 600, textAlign: 'right' }}>QTY (m³)</th>
                            <th style={{ padding: '12px 16px', color: isDark ? '#aaa' : '#666', fontWeight: 600, textAlign: 'right' }}>RATE (₹)</th>
                            <th style={{ padding: '12px 16px', color: isDark ? '#aaa' : '#666', fontWeight: 600, textAlign: 'right' }}>AMOUNT (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tripRows.map((row, i) => (
                            <tr key={i} style={{ borderBottom: `1px solid ${isDark ? '#333' : '#eee'}`, transition: 'background-color 0.2s', '&:hover': { backgroundColor: isDark ? '#222' : '#fcfcfc' } }}>
                              <td style={{ padding: '14px 16px', color: isDark ? '#ccc' : '#444' }}>{row.date}</td>
                              <td style={{ padding: '14px 16px', fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>{row.batch}</td>
                              <td style={{ padding: '14px 16px', color: isDark ? '#ccc' : '#444' }}>{row.truckNo}</td>
                              <td style={{ padding: '14px 16px', color: isDark ? '#ccc' : '#444' }}>{row.driverName}<br /><span style={{ fontSize: '0.75rem', color: isDark ? '#888' : '#888' }}>{row.driverNo}</span></td>
                              <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: isDark ? '#ccc' : '#444' }}>
                                <span style={{ fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>{row.grade}</span> - {row.mixType}<br />
                                <span style={{ fontSize: '0.75rem', color: isDark ? '#888' : '#888' }}>{row.mix}</span>
                              </td>
                              <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: isDark ? '#ccc' : '#444' }}>
                                <span>{row.cement}</span><br />
                                <span style={{ fontSize: '0.75rem', color: isDark ? '#888' : '#888' }}>{row.admixture}</span>
                              </td>
                              <td style={{ padding: '14px 16px', color: isDark ? '#ccc' : '#444' }}>{row.time}</td>
                              <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: '500', color: isDark ? '#eee' : '#333' }}>{row.qty.toFixed(2)}</td>
                              <td style={{ padding: '14px 16px', textAlign: 'right', color: isDark ? '#ccc' : '#444' }}>{row.rate.toLocaleString('en-IN')}</td>
                              <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>{row.amount.toLocaleString('en-IN')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </Box>


                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' }, borderBottom: `1px solid ${isDark ? '#333' : '#e0e0e0'}` }}>

                    <Box sx={{ borderRight: { md: `1px solid ${isDark ? '#333' : '#e0e0e0'}` }, borderBottom: { xs: `1px solid ${isDark ? '#333' : '#e0e0e0'}`, md: 'none' }, p: { xs: 2.5, md: 4 } }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#4A7CF3', display: 'block', textTransform: 'uppercase', mb: 2, letterSpacing: '0.5px' }}>Payment Details</Typography>
                      <Box sx={{ display: 'flex', fontSize: '0.9rem', mb: 1.5, color: isDark ? '#ccc' : '#444' }}><strong style={{ width: '120px', color: isDark ? '#888' : '#666' }}>Mode:</strong> Bank Transfer (NEFT)</Box>
                      <Box sx={{ display: 'flex', fontSize: '0.9rem', mb: 1.5, color: isDark ? '#ccc' : '#444' }}><strong style={{ width: '120px', color: isDark ? '#888' : '#666' }}>Status:</strong> <Box sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800', px: 1.5, py: 0.2, borderRadius: 1, fontWeight: 'bold', fontSize: '0.8rem' }}>Pending</Box></Box>
                      <Box sx={{ display: 'flex', fontSize: '0.9rem', mb: 1.5, color: isDark ? '#ccc' : '#444' }}><strong style={{ width: '120px', color: isDark ? '#888' : '#666' }}>Txn ID:</strong> -</Box>

                      <Box sx={{ mt: 4 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: isDark ? '#888' : '#666' }}>Amount in Words:</Typography>
                        <Typography variant="body1" sx={{ fontWeight: '600', fontStyle: 'italic', mt: 0.5, color: isDark ? '#ddd' : '#222' }}>INR {finalAmount.toLocaleString('en-IN')} Only</Typography>
                      </Box>
                    </Box>


                    <Box sx={{ bgcolor: isDark ? '#252525' : '#fcfeff', p: { xs: 2.5, md: 4 } }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#4A7CF3', display: 'block', textTransform: 'uppercase', mb: 2, letterSpacing: '0.5px' }}>Summary</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ color: isDark ? '#aaa' : '#555', fontWeight: '500' }}>Subtotal</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', color: isDark ? '#eee' : '#222' }}>₹ {subtotal.toLocaleString('en-IN')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ color: isDark ? '#aaa' : '#555', fontWeight: '500' }}>Discount</Typography>
                          <Typography variant="body1" sx={{ color: '#4caf50', fontWeight: '500' }}>- ₹ 0.00</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ color: isDark ? '#aaa' : '#555', fontWeight: '500' }}>GST (5%)</Typography>
                          <Typography variant="body1" sx={{ fontWeight: '500', color: isDark ? '#eee' : '#333' }}>+ ₹ {gst.toLocaleString('en-IN')}</Typography>
                        </Box>

                        <Divider sx={{ my: 1, borderColor: isDark ? '#444' : '#ddd', borderStyle: 'dashed' }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: '900', color: isDark ? '#fff' : '#000' }}>FINAL AMOUNT</Typography>
                          <Typography variant="h5" sx={{ fontWeight: '900', color: '#4A7CF3' }}>₹ {finalAmount.toLocaleString('en-IN')}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>


                  <Box sx={{ p: { xs: 2.5, md: 4 }, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                    <Box sx={{ flex: 1, minWidth: '300px' }}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: isDark ? '#888' : '#666', display: 'block', mb: 1 }}>Remarks / Conditions:</Typography>
                      <Typography variant="caption" sx={{ display: 'block', fontStyle: 'italic', lineHeight: 1.6, color: isDark ? '#aaa' : '#888' }}>
                        1. Goods once sold will not be taken back.<br />
                        2. Payment must be cleared within 15 days of invoice date.<br />
                        3. Subject to Chennai (Tamil Nadu) Jurisdiction.
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 6, alignItems: 'flex-end', pb: 1, pt: 2 }}>
                      <Box sx={{ width: '160px', textAlign: 'center' }}>
                        <Box sx={{ borderBottom: `1px solid ${isDark ? '#555' : '#ccc'}`, mb: 1.5, height: '40px' }}></Box>
                        <Typography variant="caption" sx={{ fontWeight: '600', color: isDark ? '#ccc' : '#444' }}>Customer Signature</Typography>
                      </Box>
                      <Box sx={{ width: '160px', textAlign: 'center' }}>
                        <Box sx={{ borderBottom: `1px solid ${isDark ? '#555' : '#ccc'}`, mb: 1.5, height: '40px' }}></Box>
                        <Typography variant="caption" sx={{ display: 'block', fontWeight: '600', color: isDark ? '#ccc' : '#444' }}>Authorized Signatory</Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic', color: isDark ? '#888' : '#888' }}>For ADICONSTRO</Typography>
                      </Box>
                    </Box>
                  </Box>

                </Box>

                <Typography variant="body2" sx={{ display: 'block', textAlign: 'center', mt: 2, mb: 2, color: isDark ? '#666' : '#999' }}>
                  This is a computer-generated customer report and does not strictly act as a valid GST invoice unless authorized.
                </Typography>
              </Box>

            );
          })()}
        </DialogContent>
        <DialogActions sx={{ px: 4, py: 2, bgcolor: isDark ? '#1a1a1a' : '#f9f9f9', borderTop: `1px solid ${isDark ? '#333' : '#eee'}` }}>
          <Button variant="outlined" onClick={() => setReportsOpen(false)} sx={{ color: 'text.secondary', borderColor: isDark ? '#555' : '#ccc', textTransform: 'none', fontWeight: 600 }}>Close</Button>
          <Button variant="contained" sx={{ bgcolor: '#4A7CF3', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { bgcolor: '#3a68d0' } }} onClick={() => window.print()}>
            Print Report
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={openInvoiceDialog}
        onClose={handleCloseDialog}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: isDark ? '#1e1e1e' : '#fff',
            overflow: 'hidden',
            maxHeight: '90vh',
            height: '90vh',
            width: '85vw',
            boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', pb: 1, color: 'text.primary' }}>
          Generate Invoice
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: isGenerating ? 'visible' : 'auto' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
            <Tabs
              value={invoiceTab}
              onChange={handleTabChange}
              sx={{ minHeight: 48 }}
              TabIndicatorProps={{ sx: { bgcolor: '#4A7CF3' } }}
            >
              <Tab label="Tax (GST) Bill Invoice" sx={{ textTransform: 'none', fontWeight: 'bold', color: 'text.secondary', '&.Mui-selected': { color: '#4A7CF3' } }} />
              <Tab label="Cash Bill" sx={{ textTransform: 'none', fontWeight: 'bold', color: 'text.secondary', '&.Mui-selected': { color: '#4A7CF3' } }} />
            </Tabs>
          </Box>
          <Box sx={{ p: { xs: 2, md: 4 }, maxHeight: '75vh', overflowY: 'auto', bgcolor: isDark ? '#1a1a1a' : '#fcfcfc' }}>
          
            {/* Top Details Block */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, mb: 4, mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Typography variant="body2" sx={{ width: '150px', fontWeight: 500, mt: 1, color: isDark ? '#aaa' : '#444' }}>
                  Customer Name<span style={{ color: '#d32f2f' }}>*</span>
                </Typography>
                <Box sx={{ flex: 1, maxWidth: '600px' }}>
                  <TextField 
                    value={invoiceDetails.custCompany} 
                    onChange={e => setInvoiceDetails({...invoiceDetails, custCompany: e.target.value})} 
                    size="small" fullWidth 
                    sx={{ bgcolor: isDark ? '#262626' : '#fff', '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} 
                  />
                  <Box sx={{ display: 'flex', gap: 4, mt: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.5 }}>BILLING ADDRESS</Typography>
                      <TextField 
                        multiline rows={4}
                        value={invoiceDetails.custAddress}
                        onChange={e => setInvoiceDetails({...invoiceDetails, custAddress: e.target.value})}
                        size="small" fullWidth
                        placeholder="Enter billing address"
                        sx={{ mt: 1, bgcolor: isDark ? '#262626' : '#fafafa', '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.85rem' } }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.5 }}>SHIPPING ADDRESS</Typography>
                      <TextField 
                        multiline rows={4}
                        value={invoiceDetails.consigneeAddress}
                        onChange={e => setInvoiceDetails({...invoiceDetails, consigneeAddress: e.target.value})}
                        size="small" fullWidth
                        placeholder="Enter shipping address"
                        sx={{ mt: 1, bgcolor: isDark ? '#262626' : '#fafafa', '& .MuiOutlinedInput-root': { borderRadius: 1.5, fontSize: '0.85rem' } }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 1, borderColor: isDark ? '#333' : '#f0f0f0' }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ width: '150px', fontWeight: 500, color: isDark ? '#aaa' : '#444' }}>
                  Invoice#<span style={{ color: '#d32f2f' }}>*</span>
                </Typography>
                <TextField value={invoiceDetails.invNo} onChange={e => setInvoiceDetails({...invoiceDetails, invNo: e.target.value})} size="small" sx={{ width: '300px', bgcolor: isDark ? '#262626' : '#fff', '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ width: '150px', fontWeight: 500, color: isDark ? '#aaa' : '#444' }}>Vehicle No</Typography>
                <TextField value={invoiceDetails.vehNo} onChange={e => setInvoiceDetails({...invoiceDetails, vehNo: e.target.value})} size="small" sx={{ width: '300px', bgcolor: isDark ? '#262626' : '#fff', '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ width: '150px', fontWeight: 500, color: isDark ? '#aaa' : '#444' }}>
                  Invoice Date<span style={{ color: '#d32f2f' }}>*</span>
                </Typography>
                <TextField value={invoiceDetails.invDate} onChange={e => setInvoiceDetails({...invoiceDetails, invDate: e.target.value})} size="small" sx={{ width: '200px', bgcolor: isDark ? '#262626' : '#fff', '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
                
                <Typography variant="body2" sx={{ width: '120px', fontWeight: 500, ml: 4, color: isDark ? '#aaa' : '#444' }}>Supply Date</Typography>
                <TextField value={invoiceDetails.delDate} onChange={e => setInvoiceDetails({...invoiceDetails, delDate: e.target.value})} size="small" sx={{ width: '200px', bgcolor: isDark ? '#262626' : '#fff', '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ width: '150px', fontWeight: 500, color: isDark ? '#aaa' : '#444' }}>Buyer GSTIN</Typography>
                <TextField value={invoiceDetails.custGst} onChange={e => setInvoiceDetails({...invoiceDetails, custGst: e.target.value})} size="small" sx={{ width: '300px', bgcolor: isDark ? '#262626' : '#fff', '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }} />
              </Box>
            </Box>

            {/* Dynamic Items Table */}
            <Box sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', border: `1px solid ${isDark ? '#333' : '#e0e0e0'}`, bgcolor: isDark ? '#1e1e1e' : '#fff' }}>
              <Table size="small" sx={{ '& .MuiTableCell-root': { borderColor: isDark ? '#333' : '#e0e0e0' } }}>
                <TableHead sx={{ bgcolor: isDark ? '#2a2a2a' : '#f8f9fa' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 1.5 }}>ITEM DETAILS</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 1.5, width: '130px' }}>HSN</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 1.5, width: '100px', textAlign: 'right' }}>QUANTITY</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 1.5, width: '120px', textAlign: 'right' }}>RATE</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'text.secondary', py: 1.5, width: '120px', textAlign: 'right' }}>AMOUNT</TableCell>
                    <TableCell sx={{ py: 1.5, width: '50px', textAlign: 'center' }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceDetails.items.map((item, index) => (
                    <TableRow key={item.id} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa' } }}>
                      <TableCell sx={{ p: 1 }}>
                        <TextField 
                          fullWidth size="small" variant="outlined" placeholder="Type or select an item"
                          value={item.details} onChange={e => handleItemChange(item.id, 'details', e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'transparent', '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: '#d3d3d3' }, '&.Mui-focused fieldset': { borderColor: '#4A7CF3' } } }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 1 }}>
                        <TextField 
                          fullWidth size="small" variant="outlined"
                          value={item.hsn} onChange={e => handleItemChange(item.id, 'hsn', e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'transparent', '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: '#d3d3d3' }, '&.Mui-focused fieldset': { borderColor: '#4A7CF3' } } }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 1 }}>
                        <TextField 
                          type="number" fullWidth size="small" variant="outlined" inputProps={{ style: { textAlign: 'right' } }}
                          value={item.qty} onChange={e => handleItemChange(item.id, 'qty', e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'transparent', '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: '#d3d3d3' }, '&.Mui-focused fieldset': { borderColor: '#4A7CF3' } } }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 1 }}>
                        <TextField 
                          type="number" fullWidth size="small" variant="outlined" inputProps={{ style: { textAlign: 'right' } }}
                          value={item.rate} onChange={e => handleItemChange(item.id, 'rate', e.target.value)}
                          sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'transparent', '& fieldset': { borderColor: 'transparent' }, '&:hover fieldset': { borderColor: '#d3d3d3' }, '&.Mui-focused fieldset': { borderColor: '#4A7CF3' } } }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 1, textAlign: 'right', fontWeight: 'bold' }}>
                        {Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell sx={{ p: 1, textAlign: 'center' }}>
                        <IconButton onClick={() => handleRemoveItem(item.id)} size="small" sx={{ color: '#ff4d4f', '&:hover': { bgcolor: 'rgba(255,77,79,0.1)' } }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 1.5 }}>
                      <Button 
                        startIcon={<AddCircleOutlineIcon />} 
                        onClick={handleAddItem}
                        sx={{ pl: 2, textTransform: 'none', fontWeight: 600, color: '#4A7CF3' }}
                      >
                        Add New Row
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>

            {/* Bottom Section: Notes & Totals */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: 'text.secondary' }}>Customer Notes</Typography>
                <TextField 
                  fullWidth multiline rows={4} 
                  value={invoiceDetails.customerNotes} 
                  onChange={e => setInvoiceDetails({...invoiceDetails, customerNotes: e.target.value})}
                  placeholder="Looking forward for your business."
                  sx={{ bgcolor: isDark ? '#262626' : '#fff', borderRadius: 1 }} 
                />
              </Box>

              <Box sx={{ bgcolor: isDark ? '#262626' : '#fdfdfd', p: 3, borderRadius: 2, border: `1px solid ${isDark ? '#333' : '#eee'}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Sub Total</Typography>
                  <Typography sx={{ fontWeight: 600 }}>{totals.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Discount</Typography>
                  <Box sx={{ display: 'flex', gap: 1, width: '150px' }}>
                    <TextField 
                      type="number" size="small" 
                      value={invoiceDetails.discount} 
                      onChange={e => setInvoiceDetails({...invoiceDetails, discount: e.target.value})}
                      inputProps={{ style: { textAlign: 'right' } }}
                    />
                    <Select 
                      size="small" 
                      value={invoiceDetails.discountType}
                      onChange={e => setInvoiceDetails({...invoiceDetails, discountType: e.target.value})}
                    >
                      <MenuItem value="%">%</MenuItem>
                      <MenuItem value="₹">₹</MenuItem>
                    </Select>
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>- {totals.discountAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
                </Box>

                {invoiceTab === 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>IGST / GST (18%)</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{totals.gstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>Adjustment</Typography>
                  <TextField 
                    type="number" size="small" sx={{ width: '100px' }}
                    value={invoiceDetails.adjustment} 
                    onChange={e => setInvoiceDetails({...invoiceDetails, adjustment: e.target.value})}
                    inputProps={{ style: { textAlign: 'right' } }}
                  />
                  <Typography sx={{ fontWeight: 600 }}>{Number(invoiceDetails.adjustment || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Total (₹)</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#4A7CF3' }}>
                    {totals.finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        {/* Hidden area for rendering HTML-to-PDF templates */}
        <Box sx={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
           <Box ref={previewRef} sx={{ bgcolor: '#fff', width: 'max-content' }}>
              {selectedPdfTemplate === 'Tax Invoice' ? (
                <TaxInvoiceTemplate 
                  isGenerating={true} 
                  invoiceDetails={invoiceDetails} 
                  customerDetails={customer} 
                  tripDetails={{}} 
                />
              ) : (
                <CashBillTemplate 
                  isGenerating={true} 
                  customerDetails={customer} 
                  tripDetails={{}} 
                />
              )}
           </Box>
        </Box>

        <DialogActions sx={{ px: 3, pb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" sx={{ color: 'text.secondary', borderColor: isDark ? '#555' : '#ccc', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5' } }}>
              Save as Draft
            </Button>
            <Button variant="contained" onClick={handleSaveSendClick} disabled={isGenerating} sx={{ bgcolor: '#4A7CF3', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { bgcolor: '#3a68d0' } }}>
              {isGenerating ? 'Generating...' : 'Save and Send'}
            </Button>
            <Button variant="outlined" onClick={handlePreviewInvoice} disabled={isGeneratingPreview} sx={{ color: '#4A7CF3', borderColor: '#4A7CF3', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, '&:hover': { bgcolor: 'rgba(74, 124, 243, 0.05)' } }}>
              {isGeneratingPreview ? 'Loading...' : 'Preview'}
            </Button>
            <Button onClick={handleCloseDialog} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600, px: 2 }}>
              Cancel
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              PDF Template: <span style={{ color: isDark ? '#fff' : '#1a1a1a' }}>'{selectedPdfTemplate}'</span>
            </Typography>
            <Button size="small" onClick={() => setTemplateDrawerOpen(true)} sx={{ textTransform: 'none', fontWeight: 600, color: '#4A7CF3' }}>
              Change
            </Button>
          </Box>
        </DialogActions>

        <Dialog 
          open={Boolean(previewPdfUrl)} 
          onClose={() => setPreviewPdfUrl(null)}
          maxWidth="lg"
          fullWidth
          PaperProps={{ sx: { height: '85vh', borderRadius: 2 } }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
            <Typography variant="h6" fontWeight="bold">Invoice Preview</Typography>
            <Button onClick={() => setPreviewPdfUrl(null)} variant="outlined">Close</Button>
          </Box>
          <Box sx={{ flex: 1, p: 0 }}>
            {previewPdfUrl && (
              <iframe 
                src={previewPdfUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }} 
                title="PDF Preview"
              />
            )}
          </Box>
        </Dialog>

        <Drawer
          anchor="right"
          open={templateDrawerOpen}
          onClose={() => setTemplateDrawerOpen(false)}
          hideBackdrop={true}
          elevation={8}
          sx={{ zIndex: 1400 }}
          PaperProps={{
            sx: { width: { xs: '100%', sm: 360 }, bgcolor: isDark ? '#1e1e1e' : '#fff', display: 'flex', flexDirection: 'column' }
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${isDark ? '#333' : '#eee'}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">Choose Template</Typography>
              <Button size="small" startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 12 }} />} onClick={() => setTemplateDrawerOpen(false)} sx={{ textTransform: 'none', color: '#4A7CF3', fontWeight: 600 }}>
                Return
              </Button>
            </Box>
            <TextField 
              fullWidth size="small" placeholder="Search Template" 
              InputProps={{ startAdornment: <SearchOutlinedIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }}
              sx={{ bgcolor: isDark ? '#262626' : '#fafafa', '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
            />
          </Box>
          
          <Box sx={{ p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Tax Invoice Template */}
            <Card 
              onClick={() => { setSelectedPdfTemplate('Tax Invoice'); setTemplateDrawerOpen(false); }}
              sx={{ 
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                border: `1px solid ${isDark ? '#333' : '#eee'}`,
                borderRadius: 2, overflow: 'hidden',
                outline: selectedPdfTemplate === 'Tax Invoice' ? '2px solid #4A7CF3' : 'none'
              }}
            >
              <Box sx={{ height: 120, bgcolor: isDark ? '#2a2a2a' : '#f9f9f9', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, overflow: 'hidden' }}>
                <Box sx={{ width: 850, height: 1100, transform: 'scale(0.09)', transformOrigin: 'top center', pointerEvents: 'none', bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                   <TaxInvoiceTemplate 
                     isGenerating={true} 
                     invoiceDetails={{}} 
                     customerDetails={{}} 
                     tripDetails={{}} 
                   />
                </Box>
              </Box>
              {selectedPdfTemplate === 'Tax Invoice' ? (
                <Box sx={{ bgcolor: isDark ? 'rgba(74, 124, 243, 0.1)' : '#f0f4ff', py: 1, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: `1px solid ${isDark ? '#333' : '#eee'}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4A7CF3', mb: 0.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" fontWeight="bold">SELECTED</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">Tax Invoice</Typography>
                </Box>
              ) : (
                <Box sx={{ p: 1.5, textAlign: 'center', borderTop: `1px solid ${isDark ? '#333' : '#eee'}` }}>
                  <Typography variant="body2" fontWeight="500">Tax Invoice</Typography>
                </Box>
              )}
            </Card>

            {/* Cash Bill Template */}
            <Card 
              onClick={() => { setSelectedPdfTemplate('Cash Bill'); setTemplateDrawerOpen(false); }}
              sx={{ 
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                border: `1px solid ${isDark ? '#333' : '#eee'}`,
                borderRadius: 2, overflow: 'hidden',
                outline: selectedPdfTemplate === 'Cash Bill' ? '2px solid #4A7CF3' : 'none'
              }}
            >
              <Box sx={{ height: 120, bgcolor: isDark ? '#2a2a2a' : '#f9f9f9', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, overflow: 'hidden' }}>
                <Box sx={{ width: 800, height: 1000, transform: 'scale(0.09)', transformOrigin: 'top center', pointerEvents: 'none', bgcolor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                   <CashBillTemplate 
                     isGenerating={true} 
                     customerDetails={{}} 
                     tripDetails={{}} 
                   />
                </Box>
              </Box>
              {selectedPdfTemplate === 'Cash Bill' ? (
                <Box sx={{ bgcolor: isDark ? 'rgba(74, 124, 243, 0.1)' : '#f0f4ff', py: 1, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: `1px solid ${isDark ? '#333' : '#eee'}` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4A7CF3', mb: 0.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" fontWeight="bold">SELECTED</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold">Cash Bill</Typography>
                </Box>
              ) : (
                <Box sx={{ p: 1.5, textAlign: 'center', borderTop: `1px solid ${isDark ? '#333' : '#eee'}` }}>
                  <Typography variant="body2" fontWeight="500">Cash Bill</Typography>
                </Box>
              )}
            </Card>

            {/* Upload New Template */}
            <Card 
              sx={{ 
                p: 2, mt: 1,
                cursor: 'pointer', 
                border: `2px dashed ${isDark ? '#555' : '#ccc'}`,
                bgcolor: 'transparent',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                opacity: 0.7,
                '&:hover': { opacity: 1, borderColor: '#4A7CF3', bgcolor: isDark ? 'rgba(74, 124, 243, 0.05)' : '#f8faff', transform: 'translateY(-2px)' }
              }}
            >
              <AddCircleOutlineIcon sx={{ fontSize: 28, color: 'text.secondary', mb: 1 }} />
              <Typography variant="subtitle2" fontWeight="bold" color="text.primary">Upload New Template</Typography>
            </Card>
          </Box>
        </Drawer>

        <Menu
          anchorEl={saveSendAnchorEl}
          open={Boolean(saveSendAnchorEl)}
          onClose={handleSaveSendClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 180,
              borderRadius: 3,
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.12)',
              border: `1px solid ${isDark ? '#333' : '#eee'}`,
              bgcolor: isDark ? '#1e1e1e' : '#fff'
            }
          }}
          transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        >
          <MenuItem onClick={() => { handleSaveSendClose(); handleGenerateFormDialog(); }} sx={{ py: 1.5, fontWeight: 500, color: 'text.primary' }}>
            <ListItemIcon><ReceiptIcon sx={{ color: '#4A7CF3' }} fontSize="small" /></ListItemIcon>
            Generate Form
          </MenuItem>
          <MenuItem onClick={() => { handleSaveSendClose(); handleGeneratePdfDialog(); }} sx={{ py: 1.5, fontWeight: 500, color: 'text.primary' }}>
            <ListItemIcon><ReceiptIcon sx={{ color: '#e91e63' }} fontSize="small" /></ListItemIcon>
            Generate PDF
          </MenuItem>
        </Menu>
      </Dialog>

      {/* Sticky Bottom Bar */}
      {selectedTruckIds.size > 0 && (
        <Box sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: isDark ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          p: 2,
          px: { xs: 2, md: 4, lg: 6 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight="700">
              {selectedCount} trucks selected
            </Typography>
            <Typography variant="h5" fontWeight="900" color="primary" sx={{ my: 0.2 }}>
              ₹{selectedTotalAmt.toLocaleString('en-IN')}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight="700">
              {selectedTotalQty} m³ total
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={() => setOpenConfirmDialog(true)}
            sx={{
              bgcolor: '#4A7CF3',
              borderRadius: 3,
              px: { xs: 3, md: 5 },
              py: 1.5,
              textTransform: 'none',
              fontWeight: '900',
              fontSize: '1rem',
              boxShadow: '0 8px 24px rgba(74, 124, 243, 0.4)',
              '&:hover': { bgcolor: '#3a68d0' }
            }}
          >
            Payment Done
          </Button>
        </Box>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => !isUpdating && setOpenConfirmDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: isDark ? '#1e1e1e' : '#fff',
            p: 1,
            maxWidth: '400px',
            width: '100%'
          }
        }}
      >
        <DialogContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" fontWeight="900" sx={{ mb: 2, color: 'text.primary' }}>
            Confirm Payment
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', fontWeight: 600 }}>
            {selectedCount} {selectedCount === 1 ? 'truck' : 'trucks'} selected
          </Typography>

          <Box sx={{
            bgcolor: isDark ? 'rgba(74, 124, 243, 0.1)' : '#f0f4ff',
            p: 3,
            borderRadius: 3,
            mb: 4,
            border: `1px solid ${isDark ? 'rgba(74, 124, 243, 0.2)' : '#d0e0ff'}`
          }}>
            <Typography variant="h4" fontWeight="900" color="primary" sx={{ mb: 1 }}>
              Total: ₹{selectedTotalAmt.toLocaleString('en-IN')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Qty: {selectedTotalQty} m³
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setOpenConfirmDialog(false)}
              disabled={isUpdating}
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold',
                borderColor: isDark ? '#444' : '#ddd',
                color: 'text.secondary'
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleConfirmPayment}
              disabled={isUpdating}
              sx={{
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold',
                bgcolor: '#4A7CF3',
                '&:hover': { bgcolor: '#3a68d0' }
              }}
            >
              {isUpdating ? 'Processing...' : 'Confirm'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Recipe Filter Menu */}
      <Menu
        anchorEl={anchorEl}
        open={openFilterMenu}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
            borderRadius: 3,
            bgcolor: isDark ? '#1e1e1e' : '#fff',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)',
            border: `1px solid ${isDark ? '#333' : '#eee'}`,
            p: 1
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" sx={{ 
            fontWeight: 'bold', 
            color: isDark ? '#888' : '#999', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            fontSize: '0.7rem' 
          }}>
            Filter by Recipe
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {uniqueRecipes.map((recipe) => (
            <MenuItem
              key={recipe}
              onClick={() => {
                setSelectedRecipe(recipe);
                handleFilterClose();
              }}
              sx={{
                borderRadius: 2,
                py: 1.2,
                px: 2,
                mb: 0.2,
                bgcolor: selectedRecipe === recipe ? (isDark ? 'rgba(74, 124, 243, 0.1)' : '#f0f4ff') : 'transparent',
                '&:hover': {
                  bgcolor: selectedRecipe === recipe ? (isDark ? 'rgba(74, 124, 243, 0.15)' : '#e8efff') : (isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa'),
                }
              }}
            >
              <ListItemText 
                primary={recipe} 
                primaryTypographyProps={{ 
                  variant: 'body2', 
                  fontWeight: selectedRecipe === recipe ? 700 : 500,
                  color: selectedRecipe === recipe ? '#4A7CF3' : 'text.primary'
                }} 
              />
              {selectedRecipe === recipe && (
                <ListItemIcon sx={{ minWidth: 'auto', ml: 2 }}>
                  <DoneIcon sx={{ fontSize: 18, color: '#4A7CF3' }} />
                </ListItemIcon>
              )}
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </Box>
    </Box>
    </Box>
  );
}
