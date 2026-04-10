import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Card,
  Fade,
  Chip,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Autocomplete
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ScienceIcon from '@mui/icons-material/Science'; // Using Science icon for flask
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Sidebar from './Sidebar';

export default function RecipePrices({ mode = 'light' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const machine = location.state?.machine || { id: "MI0001", plantId: "PI001" };
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [pricingMode, setPricingMode] = useState('default'); // 'default' or 'customer'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [priceInput, setPriceInput] = useState("");
  const [customers, setCustomers] = useState([]);
  const [fetchingCustomers, setFetchingCustomers] = useState(false);
  const [productionData, setProductionData] = useState(null);
  const [fetchingProduction, setFetchingProduction] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRecipes = async (customerId = "") => {
    if (!machine.id) return;
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const currentCustId = customerId ? customerId.toString() : "Default";
      
      const response = await fetch("http://13.234.251.159:9080/api/BatchingPlant/Get_RecipePriceList", {
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

      if (response.ok) {
        const result = await response.json();
        if (result.status === 1 && result.data) {
          const transformedData = result.data.map(item => ({
            id: item.rec_id || "",
            cid: item.cid || 0,
            name: item.rec_name || "",
            deftamt: item.deftamt || 0,
            custamt: item.custamt || 0,
            price: currentCustId === "Default" ? (item.deftamt || 0) : (item.custamt || 0)
          }));
          
          setRecipes(transformedData);

          if (customerId) {
            // Update selected recipe if we're in a modal
            if (selectedRecipe) {
              const updatedRecipe = transformedData.find(r => r.id === selectedRecipe.id);
              if (updatedRecipe) {
                setSelectedRecipe(updatedRecipe);
                setPriceInput(currentCustId === "Default" ? updatedRecipe.deftamt.toString() : updatedRecipe.custamt.toString());
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCustomers = async () => {
    if (!machine.id || customers.length > 0) return;
    setFetchingCustomers(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch("http://13.234.251.159:9080/api/BatchingPlant/Get_MastersList", {
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

      if (response.ok) {
        const result = await response.json();
        if (result.status === 1 && result.data) {
          const transformedCustomers = result.data.map((c, index) => ({
            id: c.b || c.c_id || index.toString(), // Support multiple common ID fields
            name: c.a || c.c_name || "Unknown"
          }));
          setCustomers(transformedCustomers);
        }
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setFetchingCustomers(false);
    }
  };

  const fetchProductionData = async (customer) => {
    if (!customer || !selectedRecipe) return;
    setFetchingProduction(true);
    const customerName = customer.name;
    const customerId = customer.id;
    try {
      const token = sessionStorage.getItem("token");
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      
      const formatDate = (date) => date.toISOString().split('T')[0];

      const response = await fetch("http://13.234.251.159:9080/api/BatchingPlant/Report_CustomerWiseProductionData", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          rpt_type: " Production Report ",
          mac_id: machine.id || "MI0001",
          prod_id: machine.plantId || "PI001",
          cust_id: customerId ? customerId.toString() : "",
          start: formatDate(lastMonth),
          end: formatDate(today)
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.status === 1 && result.data) {
          // Find the selected recipe's data in the report
          const customerData = result.data.find(d => 
            d.cust_name?.trim().toLowerCase() === customerName.trim().toLowerCase()
          );
          
          if (customerData && customerData.data) {
            // Try to find matching recipe - can be broad match
            const recipeData = customerData.data.find(r => 
              r.recp_name?.toLowerCase().includes(selectedRecipe.name.toLowerCase()) ||
              selectedRecipe.name.toLowerCase().includes(r.recp_id?.toLowerCase())
            );
            
            setProductionData({
              cust_id: customerName,
              details: recipeData || null,
              rawData: customerData.data // Store all recipes for this customer as fallback
            });
            
            // If the user expects a 'rate', but the API only has historical batches,
            // we might have to use a different field if 'amt' is not present.
            // Based on other screens, 'amt' is usually the rate.
            if (recipeData && recipeData.amt) {
              setPriceInput(recipeData.amt.toString());
            }
          } else {
            setProductionData({ cust_id: customerName, details: null });
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch production data:", error);
    } finally {
      setFetchingProduction(false);
    }
  };

  const handleOpenModal = (recipe) => {
    setSelectedRecipe(recipe);
    if (pricingMode === 'default') {
        setPriceInput(recipe.deftamt?.toString() || recipe.price?.toString() || "0");
        setProductionData(null);
    } else {
        setPriceInput(recipe.custamt?.toString() || recipe.price?.toString() || "0");
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRecipe(null);
    setProductionData(null);
  };

  const handleApply = async () => {
    if (!selectedRecipe || !priceInput) return;
    setIsUpdating(true);
    try {
      const token = sessionStorage.getItem("token");
      const upd_by = sessionStorage.getItem("userId") || "L0001";
      
      const payload = {
        cust_id: pricingMode === 'customer' ? "customer" : "Default",
        upd_by: upd_by,
        mac_id: machine.id || "MI0001",
        data: [
          {
            cid: selectedRecipe.cid.toString(),
            deftamt: priceInput.toString()
          }
        ]
      };

      const response = await fetch("http://13.234.251.159:9080/api/BatchingPlant/updatepricelist", {
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
          handleCloseModal();
          await fetchRecipes(pricingMode === 'customer' && selectedCustomer ? selectedCustomer.id : "");
        } else {
          alert(result.msg || "Failed to update price");
        }
      } else {
        alert("Server error. Please try again later.");
      }
    } catch (error) {
      console.error("Price update failed:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (pricingMode === 'customer') {
      fetchCustomers();
    }
  }, [pricingMode]);

  useEffect(() => {
    if (pricingMode === 'customer' && selectedCustomer) {
      fetchRecipes(selectedCustomer.id);
    } else if (pricingMode === 'default') {
      fetchRecipes();
      setSelectedCustomer(null);
    }
  }, [selectedCustomer, pricingMode, machine.id]);

  // Fetch production data when modal opens in customer mode
  useEffect(() => {
    if (openModal && pricingMode === 'customer' && selectedCustomer && selectedRecipe) {
      fetchProductionData(selectedCustomer);
    }
  }, [openModal, pricingMode, selectedCustomer, selectedRecipe]);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isDark = mode === 'dark';

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{
        flexGrow: 1,
        minHeight: "100vh",
        bgcolor: isDark ? '#121212' : '#f4f6fb',
        pb: 4,
      }}>
        {/* Header */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: "10px 30px",
          borderBottom: "1px solid #eee",
          bgcolor: "#F9F9FB",
          minHeight: "75px",
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          mb: 3
        }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#f5f5f5' }
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18, color: 'text.primary' }} />
        </IconButton>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#1a1a1a" }}>
            Recipe Prices
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: { xs: 2, md: 4 }, pt: 1 }}>

      {/* Tabs / Mode Selection */}
      <Box sx={{ 
        display: 'flex', 
        bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', 
        borderRadius: 2, 
        p: 0.5, 
        mb: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <Button
          disableElevation
          onClick={() => setPricingMode('default')}
          sx={{
            flex: 1,
            py: 1,
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: pricingMode === 'default' ? 800 : 600,
            color: pricingMode === 'default' ? (isDark ? 'white' : 'white') : 'text.secondary',
            bgcolor: pricingMode === 'default' ? '#4A7CF3' : 'transparent',
            boxShadow: pricingMode === 'default' ? '0 4px 10px rgba(74, 124, 243, 0.3)' : 'none',
            '&:hover': {
              bgcolor: pricingMode === 'default' ? '#3B68E1' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'),
            }
          }}
        >
          Default Pricing
        </Button>
        <Button
          disableElevation
          onClick={() => setPricingMode('customer')}
          sx={{
            flex: 1,
            py: 1,
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: pricingMode === 'customer' ? 800 : 600,
            color: pricingMode === 'customer' ? (isDark ? 'white' : 'white') : 'text.secondary',
            bgcolor: pricingMode === 'customer' ? '#4A7CF3' : 'transparent',
            boxShadow: pricingMode === 'customer' ? '0 4px 10px rgba(74, 124, 243, 0.3)' : 'none',
            '&:hover': {
              bgcolor: pricingMode === 'customer' ? '#3B68E1' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'),
            }
          }}
        >
          Customer-wise Price List
        </Button>
      </Box>

      {/* Side option to select customer */}
      {pricingMode === 'customer' && (
        <Box sx={{ mb: 3 }}>
          <Autocomplete
            options={customers}
            getOptionLabel={(option) => option.name}
            value={selectedCustomer}
            onChange={(event, newValue) => {
              setSelectedCustomer(newValue);
            }}
            loading={fetchingCustomers}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select a customer to view or edit their specific price list..."
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {fetchingCustomers ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                  sx: { 
                    borderRadius: 3, 
                    bgcolor: isDark ? '#1a1a1a' : 'white',
                    '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                  }
                }}
              />
            )}
          />
        </Box>
      )}

      {/* Search Bar */}
      <TextField
        placeholder="Search recipe name or ID..."
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
            bgcolor: isDark ? '#1a1a1a' : 'white',
            borderRadius: 3,
            '& fieldset': { border: 'none' },
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            mb: 2,
            fontWeight: 500
          }
        }}
      />

      {/* Info & Count Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" fontWeight="600">
            Tap a recipe to set custom price.
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" fontWeight="700">
          {filteredRecipes.length} results
        </Typography>
      </Box>

      {/* Recipe List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {pricingMode === 'customer' && !selectedCustomer ? (
          <Box sx={{ textAlign: 'center', py: 8, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'white', borderRadius: 4, border: '1px dashed', borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#ccc' }}>
            <Typography variant="subtitle1" color="text.secondary" fontWeight="600">
              Please select a customer above
            </Typography>
          </Box>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} thickness={4} sx={{ color: '#4A7CF3' }} />
          </Box>
        ) : filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe, index) => (
            <Fade in={true} key={`${recipe.id}-${index}`} timeout={500}>
              <Card sx={{
                p: 2.5,
                borderRadius: 4,
                bgcolor: isDark ? '#1a1a1a' : 'white',
                boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                position: 'relative'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: isDark ? 'rgba(74, 124, 243, 0.15)' : '#eef2fb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ScienceIcon sx={{ color: '#4A7CF3', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="800" sx={{ color: 'text.primary', lineHeight: 1.2 }}>
                        {recipe.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight="700">
                        ID: {recipe.id}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight="900" sx={{ color: 'text.primary' }}>
                    {recipe.price > 0 ? `₹${recipe.price}` : "Set Price"}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleOpenModal(recipe)}
                    startIcon={<EditOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                    sx={{
                      color: 'text.secondary',
                      textTransform: 'none',
                      fontWeight: 700,
                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f5',
                      borderRadius: 2,
                      px: 2,
                      fontSize: '0.75rem',
                      '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#eeeeee' }
                    }}
                  >
                    Tap to edit
                  </Button>
                </Box>
              </Card>
            </Fade>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" fontWeight="600">
              No recipes found matching "{searchQuery}"
            </Typography>
          </Box>
        )}
      </Box>

      {/* Set Price Modal */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: isDark ? '#1a1a1a' : 'white',
            backgroundImage: 'none',
            width: '100%',
            maxWidth: 400,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }} component="div">
          <Typography variant="h6" fontWeight="800">Set Price</Typography>
          <Typography variant="caption" color="text.secondary" fontWeight="600">
            {selectedRecipe?.name}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ 
            p: 2, 
            borderRadius: 3, 
            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fcfcfc', 
            border: '1px solid', 
            borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#eee' 
          }}>
            {pricingMode === 'default' ? (
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" fontWeight="600">Current Default Price</Typography>
                <Typography variant="body1" fontWeight="800">₹{selectedRecipe?.deftamt}</Typography>
              </Box>
            ) : (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">Current Price for this Customer</Typography>
                  <Typography variant="body1" fontWeight="800" sx={{ color: '#4A7CF3' }}>₹{selectedRecipe?.custamt || selectedRecipe?.deftamt}</Typography>
                </Box>

                {fetchingProduction ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : productionData && productionData.details ? (
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(255, 152, 0, 0.05)' : '#fff8e1', border: '1px dashed #ff9800' }}>
                    <Typography variant="caption" color="warning.main" fontWeight="800" sx={{ display: 'block', mb: 1 }}>
                      LATEST HISTORICAL BATCH
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">Recipe Found</Typography>
                      <Typography variant="caption" fontWeight="800" sx={{ color: '#4A7CF3' }}>
                        {productionData.details.recp_name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">Last Batch Qty</Typography>
                      <Typography variant="caption" fontWeight="800">{productionData.details.qty} m³</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">Last Batch No</Typography>
                      <Typography variant="caption" fontWeight="800">#{productionData.details.b_no}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">Last Date</Typography>
                      <Typography variant="caption" fontWeight="800">{productionData.details.b_Date}</Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f5f5f5', border: '1px dashed', borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0' }}>
                    <Typography variant="caption" color="text.secondary" fontStyle="italic" sx={{ display: 'block', mb: 1, textAlign: 'center' }}>
                      No historical batch data found for this recipe with the selected customer.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="700">Default Price</Typography>
                      <Typography variant="body2" fontWeight="800" sx={{ color: 'text.primary' }}>
                        ₹{selectedRecipe?.deftamt || 0}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {/* Editing Option area */}
            <Typography variant="caption" color="text.secondary" fontWeight="700" sx={{ mb: 1, display: 'block' }}>
              {pricingMode === 'default' ? 'Set New Default Price' : `Set New Price for ${selectedCustomer?.name || 'Customer'}`}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography fontWeight="700" color="text.primary">₹</Typography>
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 2, 
                  bgcolor: isDark ? '#121212' : 'white',
                  '& fieldset': { borderColor: '#4A7CF3', borderWidth: '2px' },
                  fontSize: '1.5rem',
                  fontWeight: '900',
                  textAlign: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3, gap: 1 }}>
          <Button 
            onClick={handleCloseModal}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 700, 
              color: 'text.secondary',
              flex: 1
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained"
            onClick={handleApply}
            disabled={isUpdating}
            sx={{ 
              textTransform: 'none', 
              fontWeight: 700, 
              bgcolor: '#4A7CF3',
              borderRadius: 2,
              flex: 1,
              py: 1.2,
              boxShadow: '0 4px 12px rgba(74, 124, 243, 0.3)'
            }}
          >
            {isUpdating ? <CircularProgress size={24} color="inherit" /> : 'Apply'}
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Box>
    </Box>
  );
}
