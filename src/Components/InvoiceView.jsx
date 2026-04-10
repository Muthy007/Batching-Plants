import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, IconButton, Button, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import TaxInvoiceTemplate from './TaxInvoiceTemplate';

export default function InvoiceView({ mode }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const printRef = useRef();

  const details = state?.invoiceDetails || {};
  const tripDetails = state?.tripDetails || {};
  const title = state?.title || 'TAX INVOICE';
  const customerDetails = state?.customerDetails || {};

  const isDark = mode === 'dark';

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: isDark ? '#121212' : '#e0e4eb',
      pb: 8,
      px: { xs: 2, md: 4, lg: 6 },
      pt: 2,
      '@media print': {
        bgcolor: '#fff',
        pt: 0, px: 0, pb: 0,
        height: '100%',
        margin: 0,
      }
    }}>
      <Box className="no-print" sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: "20px 30px",
        borderBottom: '1px solid #eee',
        bgcolor: "#F9F9FB",
        minHeight: "75px",
        mb: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'text.primary' }}>
            <ArrowBackIosNewIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#1a1a1a" }}>
            {title} View
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<LocalPrintshopIcon />}
          onClick={handlePrint}
          sx={{
            bgcolor: '#4A7CF3',
            color: '#fff',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'bold',
            '&:hover': { bgcolor: '#3a68d0' }
          }}
        >
          Print Web
        </Button>
      </Box>

      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        '@media print': {
          display: 'block',
        }
      }}>
        <Box ref={printRef} sx={{
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
          '@media print': {
            boxShadow: 'none',
          }
        }}>
          <TaxInvoiceTemplate 
            invoiceDetails={details} 
            tripDetails={tripDetails} 
            customerDetails={customerDetails} 
            isGenerating={true} 
            title={title}
          />
        </Box>
      </Box>

      {/* Global styles for printing */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: white !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: auto;
            margin: 5mm;
          }
        }
      `}</style>
    </Box>
  );
}
