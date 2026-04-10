import { useState, useMemo } from 'react';
import './App.css'
import Login from './Components/Login'
import Register from './Components/Register'
import Dashboard from './Components/Dashboard'
import PlantDetails from './Components/PlantDetails'
import RecipePrices from './Components/RecipePrices'
import CustomerDetails from './Components/CustomerDetails'
import CustomerTripDetails from './Components/CustomerTripDetails'
import InvoiceView from './Components/InvoiceView'
import Quotes from './Components/Quotes'
import NewQuotes from './Components/NewQuotes'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ProtectedRoute = () => {
  const token = sessionStorage.getItem("token");
  const isAuthenticated = token && token !== "null" && token !== "undefined" && token.trim() !== "";
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

function App() {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                background: {
                  default: '#f4f6fb',
                  paper: '#ffffff',
                },
              }
            : {
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
              }),
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Login toggleColorMode={colorMode.toggleColorMode} mode={mode} />} />
        <Route path="/register" element={<Register toggleColorMode={colorMode.toggleColorMode} mode={mode} />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard toggleColorMode={colorMode.toggleColorMode} mode={mode} />} />
          <Route path="/plant" element={<PlantDetails toggleColorMode={colorMode.toggleColorMode} mode={mode} />} />
          <Route path="/recipe-prices" element={<RecipePrices toggleColorMode={colorMode.toggleColorMode} mode={mode} />} />
          <Route path="/customer-details" element={<CustomerDetails toggleColorMode={colorMode.toggleColorMode} mode={mode} />} />
          <Route path="/customer-trip-details" element={<CustomerTripDetails toggleColorMode={colorMode.toggleColorMode} mode={mode} />} />
          <Route path="/invoice-view" element={<InvoiceView toggleColorMode={colorMode.toggleColorMode} mode={mode} />} />
          <Route path="/Sales/Quotes" element={<Quotes toggleColorMode={colorMode.toggleColorMode} mode={mode} />} />
          <Route path="/Sales/NewQuotes" element={<NewQuotes toggleColorMode={colorMode.toggleColorMode} mode={mode} />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
