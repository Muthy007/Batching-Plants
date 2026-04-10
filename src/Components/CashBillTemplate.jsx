import React, { forwardRef, useState } from 'react';
import { Box, Typography, InputBase } from '@mui/material';
import elantrisLogo from '../assets/elantris logo.png';

const CashBillTemplate = forwardRef(({ isGenerating, customerDetails, tripDetails }, ref) => {
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

  const defaultDesc = tripDetails ? `Ready Mix Concrete (${tripDetails.grade || 'M35'}) - ${tripDetails.mixInfo || ''}` : 'Trench Cutter Display Service Charges\nMake: XCMG';

  const [localDetails, setLocalDetails] = useState({
    billNumber: '00123',
    date: new Date().toLocaleDateString('en-GB'),
    customerName: customerDetails?.name || 'Unknown Customer',
    customerAddress: 'Chennai',
    companyName: 'Elantris Technologies Private Limited',
    companyAddress: 'DrNo 47, Plot No 16, F.No 3, Arunachala Enclave,\nIndira Nagar 4th West St, Kattupakkam, Ch - 600056',
    companyEmail: 'elantristechnologies@gmail.com',
    companyPhone: '+91 9884060315',
    gstin: '33AADCE1234F1Z5',
    stateCode: '33',
    hsn: '9987',
    qty: (getNum(tripDetails?.concrete) || 1).toString(),
    rate: (getNum(tripDetails?.rate) || 1125).toString(),
    description: defaultDesc,
    notes: '',
    accountHolder: 'HOLDERNAME',
    bankName: 'BANKNAME',
    accountType: 'Savings',
    accountNo: '1234567890',
    ifsc: 'HDSF123456'
  });

  const qty = getNum(localDetails.qty);
  const rate = getNum(localDetails.rate);
  const amount = qty * rate;

  const handleChange = (field, val) => {
    setLocalDetails({ ...localDetails, [field]: val });
  };

  const renderInput = (field, multiline = false, sxProps = {}) => {
    const val = localDetails[field] || '';
    if (isGenerating) {
      return (
        <Typography 
          component="span" 
          sx={{ fontWeight: 'normal', color: '#000', whiteSpace: multiline ? 'pre-wrap' : 'normal', wordBreak: 'break-word', fontSize: 'inherit', ...sxProps }}
        >
          {val}
        </Typography>
      );
    }
    const commonSx = {
      border: 'none', background: 'transparent', outline: 'none', width: '100%', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'normal', color: '#000', p: 0, wordBreak: 'break-word', ...sxProps
    };

    return (
      <InputBase
        multiline={multiline}
        minRows={multiline ? (sxProps.rows || 3) : 1}
        value={val}
        onChange={e => handleChange(field, e.target.value)}
        sx={{
          ...commonSx,
          borderBottom: multiline ? '1px dashed #ccc' : '1px solid #ddd',
          '& .MuiInputBase-input': { padding: '2px 0' }
        }}
      />
    );
  };

  return (
    <Box ref={ref} sx={{
      width: '850px',
      p: '20px',
      bgcolor: '#fff',
      color: '#000',
      fontFamily: 'Roboto, Arial, sans-serif',
      fontSize: '11px',
      lineHeight: 1.4,
      boxSizing: 'border-box'
    }}>
      <Box sx={{ border: '1px solid #000' }}>
        
         <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
            <Box sx={{ width: '60%', borderRight: '1px solid #000', p: '10px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Box sx={{ flexShrink: 0, height: '60px', width: '150px', display: 'flex', alignItems: 'center' }}>
                    <img src={elantrisLogo} alt="Elantris Logo" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '12px', mb: '4px' }}>{renderInput('companyName')}</Typography>
                    <Box sx={{ fontSize: '10px', lineHeight: '1.4' }}>
                        {renderInput('companyAddress', true, { fontSize: '10px', rows: 2 })}
                        <Box sx={{ display: 'flex', whiteSpace: 'nowrap' }}><Typography component="span" sx={{ fontWeight: 'bold', mr: '4px', fontSize: '10px' }}>Email:</Typography> {renderInput('companyEmail', false, { width: 'auto', flexGrow: 1, fontSize: '10px' })}</Box>
                        <Box sx={{ display: 'flex', whiteSpace: 'nowrap' }}><Typography component="span" sx={{ fontWeight: 'bold', mr: '4px', fontSize: '10px' }}>Phone:</Typography> {renderInput('companyPhone', false, { width: 'auto', flexGrow: 1, fontSize: '10px' })}</Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ width: '40%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ color: '#55725f', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Estimation Copy</Typography>
            </Box>
         </Box>
         
         <Box sx={{ display: 'flex', p: '4px 10px', fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #000', alignItems: 'center' }}>
             <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                 GST NO : <Typography component="span" sx={{ px: '8px', fontWeight: 'normal', fontSize: 'inherit' }}>{renderInput('gstin', false, { width: '150px', ml: '5px' })}</Typography> &nbsp;&nbsp;&nbsp; STATE CODE : <Typography component="span" sx={{ px: '8px', fontWeight: 'normal', fontSize: 'inherit' }}>{renderInput('stateCode', false, { width: '50px', ml: '5px' })}</Typography>
             </Box>
         </Box>
         
         <Box sx={{ display: 'flex', borderBottom: '1px solid #000' }}>
             <Box sx={{ width: '55%', borderRight: '1px solid #000', p: '16px 12px', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <Typography sx={{ fontWeight: 'bold', fontSize: '11px' }}>Invoice Address</Typography>
                 <Box>{renderInput('customerName', true, { rows: 2, fontSize: '11px', fontWeight: 'bold' })}</Box>
                 <Box>{renderInput('customerAddress', true, { rows: 2, fontSize: '10px' })}</Box>
             </Box>
             <Box sx={{ width: '45%', display: 'flex' }}>
                 <Box sx={{ width: '50%', borderRight: '1px solid #000', p: '10px', display: 'flex', alignItems: 'center', fontSize: '10px' }}>
                     <Typography component="span" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', fontSize: '10px' }}>Estimate No:</Typography> <Typography component="span" sx={{ ml: '6px', flexGrow: 1, fontSize: '11px' }}>{renderInput('billNumber', false, { fontSize: '11px' })}</Typography>
                 </Box>
                 <Box sx={{ width: '50%', p: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                     <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '10px', mr: '6px' }}>Date:</Typography> 
                     <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '11px', flexGrow: 1 }}>{renderInput('date', false, { fontWeight: 'bold', textAlign: 'center', fontSize: '11px' })}</Typography>
                 </Box>
             </Box>
         </Box>
        
         <Box sx={{ display: 'flex', borderBottom: '1px solid #000', fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>
             <Box sx={{ width: '6%', borderRight: '1px solid #000', p: '8px' }}>S.NO</Box>
             <Box sx={{ width: '45%', borderRight: '1px solid #000', p: '8px', textAlign: 'left' }}>DESCRIPTION OF GOODS</Box>
             <Box sx={{ width: '10%', borderRight: '1px solid #000', p: '8px' }}>HSN</Box>
             <Box sx={{ width: '9%', borderRight: '1px solid #000', p: '8px' }}>QTY</Box>
             <Box sx={{ width: '15%', borderRight: '1px solid #000', p: '8px' }}>RATE (INR)</Box>
             <Box sx={{ width: '15%', p: '8px' }}>AMOUNT (INR)</Box>
         </Box>
         
         <Box sx={{ display: 'flex', minHeight: '150px', fontSize: '11px' }}>
             <Box sx={{ width: '6%', borderRight: '1px solid #000', p: '8px', textAlign: 'center' }}>1</Box>
             <Box sx={{ width: '45%', borderRight: '1px solid #000', p: '8px', whiteSpace: 'pre-wrap' }}>
                 {renderInput('description', true)}
                 {(!isGenerating || localDetails.notes) && (
                   <Box sx={{ mt: '10px' }}>
                     <Box sx={{ fontStyle: 'italic', color: '#666', fontSize: '10px', mb: '2px', fontWeight: 'bold' }}>Additional Notes:</Box>
                     {renderInput('notes', true, { fontStyle: 'italic', fontWeight: 'normal' })}
                   </Box>
                 )}
             </Box>
             <Box sx={{ width: '10%', borderRight: '1px solid #000', p: '8px', textAlign: 'center' }}>{renderInput('hsn', false, { textAlign: 'center' })}</Box>
             <Box sx={{ width: '9%', borderRight: '1px solid #000', p: '8px', textAlign: 'center' }}>{renderInput('qty', false, { textAlign: 'center' })}</Box>
             <Box sx={{ width: '15%', borderRight: '1px solid #000', p: '8px', textAlign: 'right' }}>{renderInput('rate', false, { textAlign: 'right' })}</Box>
             <Box sx={{ width: '15%', p: '8px', textAlign: 'right', fontWeight: 'bold' }}>{fmt(amount)}</Box>
         </Box>
         
         <Box sx={{ display: 'flex', borderTop: '1px solid #000', fontSize: '11px' }}>
             <Box sx={{ width: '85%', borderRight: '1px solid #000', p: '4px 8px' }}></Box>
             <Box sx={{ width: '15%', p: '4px 8px', textAlign: 'right', fontWeight: 'bold' }}>{fmt(amount)}</Box>
         </Box>
         <Box sx={{ display: 'flex', borderTop: '1px solid #000', fontSize: '11px' }}>
             <Box sx={{ width: '51%', borderRight: '1px solid #000', p: '4px 8px' }}>
                 <Typography component="span" sx={{ fontWeight: 'bold', fontSize: 'inherit' }}>Amount In Words: </Typography> {numberToWords(Math.round(amount))}
             </Box>
             <Box sx={{ width: '34%', borderRight: '1px solid #000' }}>
                 <Box sx={{ display: 'flex', borderBottom: '1px solid #000', height: '50%' }}>
                     <Box sx={{ width: '100%', p: '4px 8px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>Round Off</Box>
                 </Box>
                 <Box sx={{ display: 'flex', height: '50%' }}>
                     <Box sx={{ width: '100%', p: '4px 8px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>Total</Box>
                 </Box>
             </Box>
             <Box sx={{ width: '15%' }}>
                 <Box sx={{ borderBottom: '1px solid #000', p: '4px 8px', textAlign: 'right', height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>0.00</Box>
                 <Box sx={{ p: '4px 8px', textAlign: 'right', fontWeight: 'bold', height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{fmt(amount)}</Box>
             </Box>
         </Box>
         
         <Box sx={{ display: 'flex', borderTop: '1px solid #000', fontSize: '11px', p: '10px' }}>
             <Box sx={{ width: '40%' }}>
                 <table style={{ borderCollapse: 'collapse', width: '100%', wordBreak: 'keep-all' }}>
                     <tbody>
                         <tr><td style={{ fontWeight: 'bold', paddingRight: '10px', paddingBottom: '2px', width: '100px' }}>Account Holder</td><td style={{ paddingBottom: '2px' }}>: {renderInput('accountHolder')}</td></tr>
                         <tr><td style={{ fontWeight: 'bold', paddingRight: '10px', paddingBottom: '2px' }}>Bank</td><td style={{ paddingBottom: '2px' }}>: {renderInput('bankName')}</td></tr>
                         <tr><td style={{ fontWeight: 'bold', paddingRight: '10px', paddingBottom: '2px' }}>Account Type</td><td style={{ paddingBottom: '2px' }}>: {renderInput('accountType')}</td></tr>
                         <tr><td style={{ fontWeight: 'bold', paddingRight: '10px', paddingBottom: '2px' }}>Account No</td><td style={{ paddingBottom: '2px' }}>: {renderInput('accountNo')}</td></tr>
                         <tr><td style={{ fontWeight: 'bold', paddingRight: '10px' }}>IFSC</td><td>: {renderInput('ifsc')}</td></tr>
                     </tbody>
                 </table>
             </Box>
             <Box sx={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=elantris@okaxis`} alt="QR Code" style={{ width: '85px', height: '85px', objectFit: 'contain' }} />
             </Box>
             <Box sx={{ width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', pr: '10px' }}>
                 <Box sx={{ fontWeight: 'bold' }}>For {localDetails.companyName.split(' ')[0]} Technologies</Box>
                 <Box sx={{ mt: '50px' }}>Authorised Signatory</Box>
             </Box>
         </Box>
         
         <Box sx={{ borderTop: '1px solid #000', p: '6px', textAlign: 'center', fontSize: '11px' }}>
             This is a Computer Generated Invoice
         </Box>
      </Box>
    </Box>
  );
});

export default CashBillTemplate;
