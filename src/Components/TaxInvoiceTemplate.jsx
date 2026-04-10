import React, { forwardRef, useState } from 'react';
import { Box, Typography, InputBase, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const TaxInvoiceTemplate = forwardRef(({ invoiceDetails, setInvoiceDetails, tripDetails, isGenerating, customerDetails, title = "TAX INVOICE" }, ref) => {
  // Convert number to words helper
  const numberToWords = (num) => {
    if (num === 0) return "Zero Rupees Only";
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if ((num = num.toString()).length > 9) return 'overflow';
    const n = ('000000000' + num).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; 
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees Only' : 'Rupees Only';
    return str;
  }

  const getNum = (val) => Number(val?.toString().replace(/[^0-9.-]+/g, "") || 0);
  const fmt = (num) => num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Initialize defaults if empty
  const [localDetails, setLocalDetails] = useState({
    // 1. Company
    cName: 'ADICONSTRO INFRA PVT LTD',
    cAddress: '12/4, OMR IT Expressway, Thoraipakkam, Chennai - 600097, TN',
    cPhone: '+91 98844 33221',
    cEmail: 'billing@adiconstro.co.in',
    cGst: '33AAICA1234F1Z5',
    // 2. Customer
    custName: invoiceDetails?.billingName || customerDetails?.name || 'Unknown Customer',
    custId: 'CUST-8932',
    custCompany: 'Sri Kumaran Builders',
    custPhone: '+91 94433 22110',
    custAddress: invoiceDetails?.billingAddress || 'Plot 45, Anna Nagar 2nd Ave, Chennai - 40',
    custGst: invoiceDetails?.gstin || '33BBXCS5678G2Z1',
    // 3. Invoice Details
    invNo: invoiceDetails?.invoiceNo || `INV-2026-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`,
    invDate: invoiceDetails?.invoiceDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
    delDate: invoiceDetails?.orderDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
    vehNo: tripDetails?.truckNo || 'TN-07-BW-4321',
    driver: tripDetails?.driverName || 'Murugan K.',
    // 4. Project
    siteName: 'Skyline Elite Residency',
    siteLoc: 'Velachery Main Road, Chennai',
    engName: 'Er. R. Venkatesh',
    contName: 'M/S Balaji Constructions',
    // 5. Concrete
    grade: tripDetails?.mixInfo?.split(' ')[0] || 'M25',
    mixType: 'Design Mix',
    cement: 'OPC 53 Grade',
    aggSize: '20mm & 12mm',
    admix: 'Auramix 400',
    // 6. Delivery
    loadNo: 'L-004',
    bTime: tripDetails?.time || '08:15 AM',
    dTime: '08:30 AM',
    aTime: '09:15 AM',
    uTime: '09:45 AM',
    // 9. Payment & Addl
    payMode: 'Bank Transfer (NEFT)',
    payStatus: 'Pending',
    txnId: '-',
    remarks: 'Thank you for your business. Please clear the payment within 15 days.',
    // New editable fields
    qty: tripDetails?.concrete || 6.0,
    rate: tripDetails?.rate || 4500.0,
    hsn: '38245010',
    per: 'MCUBE',
    consigneeName: 'Sri Kumaran Builders',
    consigneeAddress: invoiceDetails?.billingAddress || 'Plot 45, Anna Nagar 2nd Ave, Chennai - 40',
    gstAmount: null, 
    ...invoiceDetails
  });

  const handleChange = (field, val) => {
    const next = { ...localDetails, [field]: val };
    setLocalDetails(next);
    if(setInvoiceDetails) setInvoiceDetails(next);
  };

  const renderInput = (field, multiline = false, sxProps = {}, fallback = '') => {
    const val = (localDetails[field] !== undefined && localDetails[field] !== null && localDetails[field] !== '') 
      ? localDetails[field] 
      : fallback;

    if (isGenerating) {
      return (
        <Typography 
          component="span" 
          sx={{ fontWeight: 600, color: '#333', whiteSpace: multiline ? 'pre-wrap' : 'normal', fontSize: 'inherit', ...sxProps }}
        >
          {val}
        </Typography>
      );
    }
    const commonSx = {
      width: '100%',
      fontFamily: 'inherit',
      fontSize: 'inherit',
      fontWeight: 600,
      color: '#2b2b2b',
      p: 0,
      fontVerticalAlign: 'bottom',
      ...sxProps
    };

    return (
      <InputBase
        multiline={multiline}
        minRows={multiline ? 2 : 1}
        value={val}
        onChange={e => handleChange(field, e.target.value)}
        sx={{
          ...commonSx,
          borderBottom: multiline ? '1px dashed #ccc' : '1px solid #ddd',
          '& .MuiInputBase-input': { p: '2px 0' }
        }}
      />
    );
  };

  const Lbl = ({children}) => (
    <Typography component="span" sx={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', mb: 0.5 }}>
      {children}
    </Typography>
  );

  
  const qtyVal = localDetails.qty ?? (tripDetails?.concrete || 6.0);
  const rateVal = localDetails.rate ?? (tripDetails?.rate || 4500.0);
  const qtyNum = getNum(qtyVal);
  const rateNum = getNum(rateVal);
  const subtotal = qtyNum * rateNum;
  
  const initialGst = (subtotal * 18) / 100;
  const gstAmountVal = localDetails.gstAmount ?? initialGst;
  const gstAmountNum = getNum(gstAmountVal);
  const finalAmt = subtotal + gstAmountNum;

  const sectionSx = { border: '1px solid #e0e0e0', borderRadius: '6px', p: 1.5, mb: 2, bgcolor: '#fafafa' };
  const getSectionTitle = (title) => (
    <Typography sx={{ fontWeight: 'bold', fontSize: '13px', color: '#1976d2', borderBottom: '1px solid #ccc', pb: 0.75, mb: 1 }}>
      {title}
    </Typography>
  );

  const grid2Sx = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 };
  const grid3Sx = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 };

  const tableHeaderCellSx = { border: '1px solid #000', fontWeight: 'bold', fontSize: '11px', py: 0.5, px: 1, textAlign: 'center', textTransform: 'uppercase' };
  const tableDataCellSx = { border: '1px solid #000', fontSize: '11px', py: 0.5, px: 1 };

  const borderSx = { border: '1px solid #000' };
  const cellSx = { p: 1, borderRight: '1px solid #000', borderBottom: '1px solid #000' };
  const lastCellSx = { p: 1, borderBottom: '1px solid #000' };

  return (
    <Box ref={ref} sx={{ p: 4, bgcolor: '#fff', width: '850px', boxSizing: 'border-box', color: '#000', fontFamily: '"Arial", sans-serif', fontSize: '11px', lineHeight: 1.4 }}>
      
      <Box sx={borderSx}>
       
        <Box sx={{ textAlign: 'center', borderBottom: '1px solid #000', py: 0.5 }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>{title}</Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', borderBottom: '1px solid #000' }}>
          <Box sx={{ ...cellSx, borderRight: '1px solid #000' }}>
            {renderInput('cName', false, { fontWeight: 'bold', fontSize: '12px' })}
            <Box sx={{ mt: 1 }}>
              <Lbl>Address</Lbl>
              {renderInput('cAddress', true, { fontSize: '10px', minHeight: '50px' })}
            </Box>
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 'bold', mr: 1, fontSize: '11px' }}>GSTIN :</Typography>
              {renderInput('cGst', false, { fontWeight: 'bold' })}
            </Box>
          </Box>
          <Box sx={{ ...cellSx, borderRight: '1px solid #000' }}>
            <Typography sx={{ fontSize: '10px', color: '#333' }}>Invoice Number</Typography>
            {renderInput('invNo', false, { fontWeight: 'bold', fontSize: '11px' })}
          </Box>
          <Box sx={lastCellSx}>
            <Typography sx={{ fontSize: '10px', color: '#333' }}>Invoice date</Typography>
            {renderInput('invDate', false, { fontWeight: 'bold', fontSize: '11px' })}
          </Box>
        </Box>

       
        <Box sx={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', borderBottom: '1px solid #000' }}>
          <Box sx={{ ...cellSx, borderRight: '1px solid #000' }}>
             <Box sx={{ display: 'flex', gap: 2 }}>
               <Box sx={{ flex: 1 }}><Lbl>Vehicle No</Lbl>{renderInput('vehNo')}</Box>
               <Box sx={{ flex: 1 }}><Lbl>Driver</Lbl>{renderInput('driver')}</Box>
             </Box>
          </Box>
          <Box sx={{ ...cellSx, borderRight: '1px solid #000' }} />
          <Box sx={lastCellSx}>
            <Typography sx={{ fontSize: '10px', color: '#333' }}>Buyer Order Date</Typography>
            {renderInput('delDate', false, { fontWeight: 'bold', fontSize: '11px' })}
          </Box>
        </Box>

        
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #000' }}>
          <Box sx={{ ...cellSx, borderRight: '1px solid #000' }}>
            <Typography sx={{ fontWeight: 'bold', mb: 0.5 }}>Buyer:</Typography>
            {renderInput('custCompany', false, { fontWeight: 'bold' })}
            <Box sx={{ mt: 1 }}>
              <Lbl>Address</Lbl>
              {renderInput('custAddress', true, { fontSize: '10px', minHeight: '50px' })}
            </Box>
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 'bold', mr: 1, fontSize: '11px' }}>GST IN:-</Typography>
              {renderInput('custGst', false, { fontWeight: 'bold' })}
            </Box>
          </Box>
          <Box sx={lastCellSx}>
            <Typography sx={{ fontWeight: 'bold', mb: 0.5 }}>Consignee:</Typography>
            {renderInput('consigneeName', false, { fontWeight: 'bold' })}
            <Box sx={{ mt: 1 }}>
              <Lbl>Address</Lbl>
              {renderInput('consigneeAddress', true, { fontSize: '10px', minHeight: '50px' })}
            </Box>
          </Box>
        </Box>

        
        <TableContainer sx={{ borderRadius: 0 }}>
          <Table sx={{ width: '100%', borderCollapse: 'collapse' }} size="small" padding="none">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...tableHeaderCellSx, width: '40px' }}>SI no</TableCell>
                <TableCell sx={{ ...tableHeaderCellSx, textAlign: 'left' }}>Description</TableCell>
                <TableCell sx={{ ...tableHeaderCellSx, width: '80px' }}>HSN/SAC</TableCell>
                <TableCell sx={{ ...tableHeaderCellSx, width: '90px' }}>RATE</TableCell>
                <TableCell sx={{ ...tableHeaderCellSx, width: '60px' }}>PER</TableCell>
                <TableCell sx={{ ...tableHeaderCellSx, width: '60px' }}>QTY</TableCell>
                <TableCell sx={{ ...tableHeaderCellSx, width: '100px' }}>AMOUNT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                
              <TableRow>
                <TableCell sx={{ ...tableDataCellSx, textAlign: 'center' }}>1</TableCell>
                <TableCell sx={{ ...tableDataCellSx, fontWeight: 'bold' }}>
                   Ready Mix Concrete ({localDetails.grade})
                </TableCell>
                <TableCell sx={{ ...tableDataCellSx, textAlign: 'center' }}>
                   {renderInput('hsn', false, { textAlign: 'center' })}
                </TableCell>
                <TableCell sx={{ ...tableDataCellSx, textAlign: 'right' }}>
                   {renderInput('rate', false, { textAlign: 'right' }, rateVal)}
                </TableCell>
                <TableCell sx={{ ...tableDataCellSx, textAlign: 'center' }}>
                   {renderInput('per', false, { textAlign: 'center' }, 'MCUBE')}
                </TableCell>
                <TableCell sx={{ ...tableDataCellSx, textAlign: 'center' }}>
                   {renderInput('qty', false, { textAlign: 'center' }, qtyVal)}
                </TableCell>
                <TableCell sx={{ ...tableDataCellSx, textAlign: 'right', fontWeight: 'bold' }}>
                   {fmt(subtotal)}
                </TableCell>
              </TableRow>

              
              <TableRow>
                 <TableCell sx={{ ...tableDataCellSx, height: '200px' }} />
                 <TableCell sx={tableDataCellSx} />
                 <TableCell sx={tableDataCellSx} />
                 <TableCell sx={tableDataCellSx} />
                 <TableCell sx={tableDataCellSx} />
                 <TableCell sx={tableDataCellSx} />
                 <TableCell sx={tableDataCellSx} />
              </TableRow>
              
              
              <TableRow>
                <TableCell colSpan={2} sx={{ ...tableDataCellSx, textAlign: 'right', borderTop: '2px solid #000' }}>
                  <Typography sx={{ fontSize: '11px', fontStyle: 'italic', fontWeight: 'bold' }}>IGST Output 18%</Typography>
                </TableCell>
                <TableCell sx={{ ...tableDataCellSx, borderTop: '2px solid #000' }} />
                <TableCell sx={{ ...tableDataCellSx, borderTop: '2px solid #000' }} />
                <TableCell sx={{ ...tableDataCellSx, borderTop: '2px solid #000' }} />
                <TableCell sx={{ ...tableDataCellSx, borderTop: '2px solid #000' }} />
                <TableCell sx={{ ...tableDataCellSx, textAlign: 'right', borderTop: '2px solid #000' }}>
                   {renderInput('gstAmount', false, { textAlign: 'right', fontWeight: 'bold' }, initialGst)}
                </TableCell>
              </TableRow>

              
              <TableRow>
                <TableCell colSpan={6} sx={{ ...tableDataCellSx, textAlign: 'right', fontWeight: 'bold', bgcolor: '#f9f9f9' }}>
                  Total
                </TableCell>
                <TableCell sx={{ ...tableDataCellSx, textAlign: 'right', fontWeight: 'bold', bgcolor: '#f9f9f9' }}>
                   {fmt(finalAmt)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        
        <Box sx={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr' }}>
          <Box sx={{ ...cellSx, borderRight: '1px solid #000' }}>
            <Typography sx={{ fontWeight: 'bold', mb: 0.5 }}>Amount in words</Typography>
            <Typography sx={{ fontWeight: 'bold', fontSize: '13px' }}>
              INR:- {numberToWords(Math.round(finalAmt))}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontWeight: 'bold' }}>Declaration:</Typography>
              <Typography sx={{ fontSize: '10px' }}>
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ ...lastCellSx, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '140px' }}>
             <Box />
             <Box sx={{ textAlign: 'right', p: 1 }}>
               <Typography sx={{ fontSize: '10px', mb: 4 }}>For, {localDetails.cName}</Typography>
               <Typography sx={{ fontSize: '10px', fontWeight: 'bold' }}>Authorised Signatory</Typography>
             </Box>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', py: 0.5, borderTop: '1px solid #000' }}>
           <Typography sx={{ fontWeight: 'bold', fontSize: '10px', letterSpacing: '1px' }}>THIS IS COMPUTER GENERATED INVOICE</Typography>
        </Box>
      </Box>
    </Box>
  );
});

export default TaxInvoiceTemplate;