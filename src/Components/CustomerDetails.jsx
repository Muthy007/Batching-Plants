import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Chip,
  Grid,
  TextField,
  IconButton,
  Button,
  InputAdornment,
  Divider,
  LinearProgress,
  Fade
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Sidebar from './Sidebar';


const parseCurrency = (str) => {
  if (!str) return 0;
  let num = Number(str.replace(/[^0-9.-]+/g, ""));
  if (str.includes('L')) num *= 100000;
  return num;
};

const formatCurrency = (num) => {
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
};

export default function CustomerDetails({ mode = 'light' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const machine = location.state?.machine || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCustomers = async () => {
    setIsRefreshing(true);
    try {
      const token = sessionStorage.getItem("token");
      const macId = machine.id;
      const response = await fetch("http://13.234.251.159:9080/api/BatchingPlant/Get_InvoicePendingList", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mac_id: macId })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 1 && result.data) {
          const transformedData = result.data
            .filter(c => c.c_id)
            .map((c, index) => {
              const custId = c.c_id;
              const custName = c.c_name || custId;
              const totalAmt = c.t_inv || 0;
              const receivedAmt = c.amt_recd || 0;
              const balanceAmt = c.bal_amt || 0;
              const totalQty = c.t_qty || 0;

              return {
                id: index + 1,
                initial: custName.charAt(0).toUpperCase(),
                name: custId,
                displayName: custName,
                status: "Unpaid",
                progress: totalAmt > 0 ? Math.round((receivedAmt / totalAmt) * 100) : 0,
                invoiceAmt: formatCurrency(totalAmt),
                received: formatCurrency(receivedAmt),
                balance: formatCurrency(balanceAmt),
                qty: `${totalQty.toFixed(2)} m³`
              };
            });

          setCustomers(transformedData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleRefresh = () => {
    fetchCustomers();
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.displayName && c.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalCustomers = filteredCustomers.length;
  const unpaidCount = filteredCustomers.filter(c => c.status === "Unpaid").length;

  const totalInvoice = filteredCustomers.reduce((sum, c) => sum + parseCurrency(c.invoiceAmt), 0);
  const totalReceived = filteredCustomers.reduce((sum, c) => sum + parseCurrency(c.received), 0);
  const totalBalance = filteredCustomers.reduce((sum, c) => sum + parseCurrency(c.balance), 0);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{
        flexGrow: 1,
        minHeight: "100vh",
        bgcolor: 'background.default',
        pb: 8,
      }}>

        {/* Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: "10px 30px",
          borderBottom: '1px solid #eee',
          bgcolor: "#F9F9FB",
          minHeight: "75px",
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{ color: 'text.primary' }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 24 }} />
            </IconButton>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#1a1a1a" }}>
                {machine.model || "Unknown Machine"}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight="600">
                {machine.type || "-"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton sx={{ color: 'text.primary' }}>
              <TuneIcon sx={{ fontSize: 26 }} />
            </IconButton>
            <IconButton onClick={handleRefresh} disabled={isRefreshing} sx={{ color: 'text.primary' }}>
              <RefreshIcon sx={{
                fontSize: 26,
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 3, md: 6 }, pt: 3 }}>

        <Box sx={{ width: '100%' }}>


          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 4, width: '100%' }}>

            <Card sx={{
              flex: 1,
              bgcolor: mode === 'dark' ? 'rgba(25, 118, 210, 0.1)' : '#e5effb',
              boxShadow: 'none',
              borderRadius: 3,
              p: 2.5,
              border: '1px solid',
              borderColor: mode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : '#d0e1f9',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <ReceiptLongIcon sx={{ color: '#1976d2', fontSize: 22 }} />
              <Typography variant="h5" fontWeight="900" sx={{ color: '#1976d2', letterSpacing: '-0.5px' }}>
                {formatCurrency(totalInvoice)}
              </Typography>
              <Typography variant="body2" fontWeight="700" sx={{ color: 'text.primary' }}>
                Total Invoice
              </Typography>
            </Card>


            <Card sx={{
              flex: 1,
              bgcolor: mode === 'dark' ? 'rgba(25, 118, 210, 0.1)' : '#e5effb',
              boxShadow: 'none',
              borderRadius: 3,
              p: 2.5,
              border: '1px solid',
              borderColor: mode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : '#d0e1f9',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <CheckCircleOutlineIcon sx={{ color: '#1976d2', fontSize: 22 }} />
              <Typography variant="h5" fontWeight="900" sx={{ color: '#1976d2', letterSpacing: '-0.5px' }}>
                {formatCurrency(totalReceived)}
              </Typography>
              <Typography variant="body2" fontWeight="700" sx={{ color: 'text.primary' }}>
                Received
              </Typography>
            </Card>


            <Card sx={{
              flex: 1,
              bgcolor: mode === 'dark' ? 'rgba(211, 47, 47, 0.1)' : '#fbe9ed',
              boxShadow: 'none',
              borderRadius: 3,
              p: 2.5,
              border: '1px solid',
              borderColor: mode === 'dark' ? 'rgba(211, 47, 47, 0.2)' : '#f6d2d9',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}>
              <MoreHorizIcon sx={{ color: '#d32f2f', fontSize: 22, border: '1px solid #d32f2f', borderRadius: '50%', padding: '2px' }} />
              <Typography variant="h5" fontWeight="900" sx={{ color: '#d32f2f', letterSpacing: '-0.5px' }}>
                {formatCurrency(totalBalance)}
              </Typography>
              <Typography variant="body2" fontWeight="700" sx={{ color: 'text.primary' }}>
                Balance
              </Typography>
            </Card>
          </Box>


          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="800" sx={{ color: 'text.primary' }}>
              {totalCustomers} customers
            </Typography>
            <Chip
              label={`${unpaidCount} unpaid`}
              sx={{
                bgcolor: mode === 'dark' ? 'rgba(211, 47, 47, 0.1)' : '#ffebee',
                color: '#d32f2f',
                fontWeight: '800',
                border: '1px solid',
                borderColor: mode === 'dark' ? 'rgba(211, 47, 47, 0.2)' : '#ffcdd2',
                fontSize: '0.85rem'
              }}
            />
          </Box>


          <TextField
            placeholder="Search by customer name, ID..."
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon sx={{ color: 'text.secondary', ml: 1 }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: 'background.paper',
                borderRadius: 4,
                '& fieldset': { border: 'none' },
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                py: 0.8,
                fontWeight: 600,
                fontSize: '1.05rem',
                color: 'text.primary',
                mb: 4
              }
            }}
          />
        </Box>
      </Box>


      <Box sx={{ px: { xs: 3, md: 6 }, mt: 4, width: '100%', maxWidth: '100%' }}>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
          {filteredCustomers.map((customer) => (
            <Box key={customer.id} sx={{ width: '100%' }}>
              <Fade in={true} timeout={500} style={{ width: '100%' }}>
                <Card sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                  bgcolor: 'background.paper',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.06)'
                  }
                }}>
                  <Box sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: { xs: 3, md: 4, lg: 6 },
                    flexWrap: 'wrap'
                  }}>

                    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', flex: { xs: '1 1 auto', md: '1 1 300px' }, width: { xs: '100%', md: 'auto' }, flexShrink: 0, minWidth: 0 }}>
                      <Box sx={{
                        bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f0f2f5',
                        borderRadius: 3,
                        width: 56,
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Typography variant="h5" fontWeight="900" sx={{ color: 'text.primary' }}>
                          {customer.initial}
                        </Typography>
                      </Box>
                      <Box sx={{ overflow: 'hidden' }}>
                        <Typography variant="h6" fontWeight="800" sx={{ color: 'text.primary', mb: 0.5, lineHeight: 1.2, noWrap: true }}>
                          {customer.displayName || customer.name}
                        </Typography>
                        <Chip
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#d32f2f', mr: 1 }} />
                              {customer.status}
                            </Box>
                          }
                          size="small"
                          variant="outlined"
                          sx={{
                            bgcolor: mode === 'dark' ? 'rgba(211, 47, 47, 0.1)' : '#fff0f2',
                            borderColor: mode === 'dark' ? 'rgba(211, 47, 47, 0.2)' : '#ffcdd2',
                            color: '#d32f2f',
                            fontWeight: '800',
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                    </Box>


                    <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 250px' }, width: { xs: '100%', md: 'auto' }, flexShrink: 0, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <LocalShippingOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <Typography variant="body2" color="text.primary" fontWeight="800">
                          Qty: {customer.qty}
                        </Typography>
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                          <Typography variant="caption" fontWeight="800" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
                            Payment progress
                          </Typography>
                          <Typography variant="caption" fontWeight="900" sx={{ color: '#d32f2f' }}>
                            {customer.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={customer.progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f0f2f5',
                            '& .MuiLinearProgress-bar': { bgcolor: '#d32f2f' }
                          }}
                        />
                      </Box>
                    </Box>


                    <Box sx={{
                      display: 'flex',
                      gap: { xs: 4, sm: 6, md: 4, lg: 8 },
                      flex: { xs: '1 1 auto', md: '1 1 350px' },
                      width: { xs: '100%', md: 'auto' },
                      justifyContent: 'space-between',
                      flexShrink: 0,
                      minWidth: 0
                    }}>
                      <Box>
                        <Typography variant="caption" fontWeight="800" sx={{ color: 'text.secondary', display: 'block', mb: 0.8 }}>
                          INVOICE AMT
                        </Typography>
                        <Typography variant="h6" fontWeight="900" sx={{ color: 'text.primary' }}>
                          {customer.invoiceAmt}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight="800" sx={{ color: 'text.secondary', display: 'block', mb: 0.8 }}>
                          RECEIVED
                        </Typography>
                        <Typography variant="h6" fontWeight="900" sx={{ color: 'text.primary' }}>
                          {customer.received}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight="800" sx={{ color: 'text.secondary', display: 'block', mb: 0.8 }}>
                          BALANCE
                        </Typography>
                        <Typography variant="h6" fontWeight="900" sx={{ color: '#d32f2f' }}>
                          {customer.balance}
                        </Typography>
                      </Box>
                    </Box>


                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', mt: { xs: 1, lg: 0 } }}>
                      <Button
                        variant="text"
                        onClick={() => navigate('/customer-trip-details', { state: { customer, machine } })}
                        endIcon={<ArrowForwardIosIcon sx={{ fontSize: '14px !important' }} />}
                        sx={{
                          color: 'text.primary',
                          fontWeight: 800,
                          textTransform: 'none',
                          '&:hover': { bgcolor: 'transparent', color: '#4A7CF3' },
                          minWidth: 'fit-content'
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Fade>
            </Box>
          ))}
        </Box>
      </Box>
      </Box>
    </Box>
  );
}