import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Chip,
  Grid,
  TextField,
  IconButton,
  InputAdornment,
  Divider,
  Fade,
  CircularProgress
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import DomainIcon from '@mui/icons-material/Domain';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ScienceIcon from '@mui/icons-material/Science';
import TuneIcon from '@mui/icons-material/Tune';
import Sidebar from './Sidebar';

export default function PlantDetails({ mode = 'light' }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMachines = async () => {
    setIsRefreshing(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://13.234.251.159:9080/api/BatchingPlant/Get_MachineDetails", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === 1 && result.data) {
          const transformedData = result.data.map(machine => ({
            id: machine.mac_id || "",
            model: machine.mac_name || "",
            type: machine.mac_type || "",
            status: "Inactive",
            location: "7, Pammal, Kanchipuram, Tamil Nadu",
            serialNo: machine.mac_sl || "",
            runHours: "12.5 hrs",
            expires: new Date(machine.expiry_date).toLocaleDateString('en-GB') || "",
            plantId: machine.cust_code || ""
          }));
          setData(transformedData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch machines:", error);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  const handleRefresh = () => {
    fetchMachines();
  };

  const filteredMachines = data.filter(machine => 
    (machine.model && machine.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (machine.id && machine.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (machine.serialNo && machine.serialNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (machine.type && machine.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ 
        flexGrow: 1,
        minHeight: "100vh", 
        bgcolor: 'background.default',
        background: mode === 'dark' ? 'none' : 'linear-gradient(135deg, #f6f8fb 0%, #e9edf3 100%)', 
        pb: 8, 
      }}>

        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          p: "10px 30px",
          borderBottom: "1px solid #eee",
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
            sx={{ 
              bgcolor: 'background.paper', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f0f0' },
              width: 44,
              height: 44
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 20, color: 'text.primary', mr: 0.5 }} />
          </IconButton>
          <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#1a1a1a" }}>
            Batching Plant M30
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton 
            onClick={() => navigate('/recipe-prices', { state: { machine: filteredMachines[0] } })}
            sx={{ 
              bgcolor: 'background.paper', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f0f0' },
              width: 44,
              height: 44
            }}
          >
            <ScienceIcon sx={{ fontSize: 22, color: '#4A7CF3' }} />
          </IconButton>
          <IconButton 
            onClick={handleRefresh}
            disabled={isRefreshing}
            sx={{ 
              bgcolor: 'background.paper', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f0f0f0' },
              width: 44,
              height: 44
            }}
          >
            <RefreshIcon 
              sx={{ 
                fontSize: 24, 
                color: 'text.primary',
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} 
            />
          </IconButton>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 3, md: 6 }, pt: 4 }}>

      <Box sx={{ px: { xs: 0, sm: 1 }, width: '100%' }}>
       
        <TextField
          placeholder="Search by name, type, serial..."
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
              borderRadius: 3,
              '& fieldset': { border: 'none' },
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              py: 0.8,
              fontWeight: 500,
              fontSize: '1.05rem',
              color: 'text.primary',
              mb: 4,
              transition: 'box-shadow 0.3s ease',
              '&:focus-within': {
                boxShadow: '0 4px 25px rgba(74, 124, 243, 0.15)',
              }
            }
          }}
        />

    
        {isRefreshing ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} thickness={4} sx={{ color: '#4A7CF3' }} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredMachines.length > 0 ? (
              filteredMachines.map((machine) => (
                <Fade in={true} key={machine.id} timeout={500}>
                  <Card sx={{ 
                    borderRadius: 4, 
                    boxShadow: '0 8px 30px rgba(0,0,0,0.04)', 
                    bgcolor: 'background.paper',
                    p: 0,
                    overflow: 'hidden',
                    transition: 'transform 0.2s',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                  
                    <Box sx={{ p: 3.5, pb: 2.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center' }}>
                          <Box sx={{ 
                            background: mode === 'dark' ? 'rgba(74, 124, 243, 0.15)' : 'linear-gradient(135deg, #f0f4ff 0%, #e0eaff 100%)', 
                            borderRadius: 3, 
                            p: 1.5, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.5)'
                          }}>
                            <PrecisionManufacturingOutlinedIcon sx={{ color: '#4A7CF3', fontSize: 32 }} />
                          </Box>
                          <Box>
                            <Typography variant="h5" fontWeight="800" sx={{ lineHeight: 1.1, color: 'text.primary', mb: 0.5 }}>
                              {machine.model}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" fontWeight="600">
                              {machine.type}
                            </Typography>
                          </Box>
                        </Box>
                          <Chip 
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ 
                                  width: 8, 
                                  height: 8, 
                                  borderRadius: '50%', 
                                  bgcolor: machine.status === 'Active' ? '#4caf50' : '#757575', 
                                  mr: 1,
                                  boxShadow: machine.status === 'Active' ? '0 0 8px rgba(76, 175, 80, 0.6)' : 'none'
                                }} />
                                {machine.status}
                              </Box>
                            }
                            variant="outlined"
                            sx={{ 
                              bgcolor: machine.status === 'Active' ? 'rgba(76, 175, 80, 0.05)' : (mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#fafafa'), 
                              borderColor: machine.status === 'Active' ? 'rgba(76, 175, 80, 0.3)' : (mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#e0e0e0'), 
                              color: machine.status === 'Active' ? (mode === 'dark' ? '#81c784' : '#2e7d32') : 'text.secondary',
                              fontWeight: '700',
                              fontSize: '0.85rem',
                              height: 32,
                              px: 1
                            }} 
                          />
                      </Box>

                  
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#f8fafc', p: 1.5, borderRadius: 2 }}>
                        <LocationOnOutlinedIcon sx={{ color: '#4A7CF3', fontSize: 20 }} />
                        <Typography variant="body2" color="text.primary" fontWeight="600" sx={{ letterSpacing: 0.2 }}>
                          {machine.location}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ borderColor: 'divider', borderBottomWidth: 1 }} />

                  
                    <Box sx={{ p: 3.5, py: 3, bgcolor: mode === 'dark' ? 'background.default' : '#fafcfd' }}>
                      <Grid container spacing={3.5}>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="overline" fontWeight="700" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, letterSpacing: 1 }}>
                            Machine ID
                          </Typography>
                          <Typography variant="body1" fontWeight="800" sx={{ color: 'text.primary', fontSize: '1.1rem' }}>
                            {machine.id}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="overline" fontWeight="700" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, letterSpacing: 1 }}>
                            Serial No.
                          </Typography>
                          <Typography variant="body1" fontWeight="800" sx={{ color: 'text.primary', fontSize: '1.1rem' }}>
                            {machine.serialNo}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="overline" fontWeight="700" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, letterSpacing: 1 }}>
                            Run Hours
                          </Typography>
                          <Typography variant="body1" fontWeight="800" sx={{ color: 'text.primary', fontSize: '1.1rem' }}>
                            {machine.runHours}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Typography variant="overline" fontWeight="700" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, letterSpacing: 1 }}>
                            Expires
                          </Typography>
                          <Typography variant="body1" fontWeight="800" sx={{ color: 'text.primary', fontSize: '1.1rem' }}>
                            {machine.expires}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider sx={{ borderColor: 'divider', borderBottomWidth: 1 }} />

                 
                    <Box 
                      onClick={() => navigate('/customer-details', { state: { machine } })}
                      sx={{ 
                      p: 3, 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#f4f6fb', transition: 'background-color 0.2s', '& .arrow': { transform: 'translateX(4px)' } }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ p: 0.8, bgcolor: mode === 'dark' ? 'rgba(74, 124, 243, 0.15)' : '#f0f4ff', borderRadius: 1.5 }}>
                          <DomainIcon sx={{ color: '#4A7CF3', fontSize: 18 }} />
                        </Box>
                        <Typography variant="body1" color="text.primary" fontWeight="700" sx={{ letterSpacing: 0.2 }}>
                          Batching Plant • {machine.plantId}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" fontWeight="800" sx={{ color: '#4A7CF3' }}>
                          View details
                        </Typography>
                        <ArrowForwardIosIcon className="arrow" sx={{ fontSize: 12, fontWeight: '900', color: '#4A7CF3', ml: 0.5, transition: 'transform 0.2s' }} />
                      </Box>
                    </Box>
                  </Card>
                </Fade>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" fontWeight="600">
                  No machines found matching "{searchQuery}"
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search terms.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
      </Box>
      </Box>
    </Box>
  );
}