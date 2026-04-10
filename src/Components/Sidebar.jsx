import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Dialog,
  Slide,
  DialogTitle
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Quotes from './Quotes';
import NewQuotes from './NewQuotes';
import Invoice from './Invoice';
import NewInvoice from './NewInvoice';
import SalesOrder from './SalesOrder';
import NewSalesOrder from './NewSalesOrder';
import CustomerMaster from './CustomerMaster';
import DeliveryChallan from './DeliveryChallan';
import NewDeliveryChallan from './NewDeliveryChallan';
import PaymentsReceived from './PaymentsReceived';
import NewPaymentsReceived from './NewPaymentsReceived';
import CreditNotes from './CreditNotes';
import NewCreditNote from './NewCreditNote';
import RecurringInvoice from './RecurringInvoice';
import NewRecurringInvoice from './NewRecurringInvoice';
import ModalCustomerMaster from '../UsableContent/ModalCustomerMaster';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const drawerWidth = 260;

export default function Sidebar() {
  const [openSales, setOpenSales] = useState(true);
  const [salesModalOpen, setSalesModalOpen] = useState(false);
  const [activeModule, setActiveModule] = useState('Quotes'); // 'Quotes', 'Invoices', etc.
  const [viewType, setViewType] = useState('list'); // 'list' or 'new'

  const handleClickSales = () => setOpenSales(!openSales);

  const salesItems = [
    'Customers',
    'Quotes',
    'Sales Orders',
    'Delivery Challans',
    'Invoices',
    'Payments Received',
    'Recurring Invoices',
    'Credit Notes'
  ];

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'Customers':
        return viewType === 'list' ? (
          <CustomerMaster onClose={() => setSalesModalOpen(false)} onNewClick={() => setViewType('new')} />
        ) : (
          <ModalCustomerMaster handleClose={() => setViewType('list')} />
        );
      case 'Quotes':
        return viewType === 'list' ? (
          <Quotes onClose={() => setSalesModalOpen(false)} onNewClick={() => setViewType('new')} />
        ) : (
          <NewQuotes handleClose={() => setViewType('list')} />
        );
      case 'Invoices':
        return viewType === 'list' ? (
          <Invoice onClose={() => setSalesModalOpen(false)} onNewClick={() => setViewType('new')} />
        ) : (
          <NewInvoice handleClose={() => setViewType('list')} />
        );
      case 'Sales Orders':
        return viewType === 'list' ? (
          <SalesOrder onClose={() => setSalesModalOpen(false)} onNewClick={() => setViewType('new')} />
        ) : (
          <NewSalesOrder handleClose={() => setViewType('list')} />
        );
      case 'Delivery Challans':
        return viewType === 'list' ? (
          <DeliveryChallan onClose={() => setSalesModalOpen(false)} onNewClick={() => setViewType('new')} />
        ) : (
          <NewDeliveryChallan handleClose={() => setViewType('list')} />
        );
      case 'Payments Received':
        return viewType === 'list' ? (
          <PaymentsReceived onClose={() => setSalesModalOpen(false)} onNewClick={() => setViewType('new')} />
        ) : (
          <NewPaymentsReceived handleClose={() => setViewType('list')} />
        );
      case 'Recurring Invoices':
        return viewType === 'list' ? (
          <RecurringInvoice onClose={() => setSalesModalOpen(false)} onNewClick={() => setViewType('new')} />
        ) : (
          <NewRecurringInvoice handleClose={() => setViewType('list')} />
        );
      case 'Credit Notes':
        return viewType === 'list' ? (
          <CreditNotes onClose={() => setSalesModalOpen(false)} onNewClick={() => setViewType('new')} />
        ) : (
          <NewCreditNote handleClose={() => setViewType('list')} />
        );
      default:
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>{activeModule} module is currently being integrated...</Typography>
            <Button variant="contained" onClick={() => setSalesModalOpen(false)}>Close Window</Button>
          </Box>
        );
    }
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #e0e0e0',
            backgroundColor: '#f8f9fa'
          },
        }}
      >
        <Box sx={{ overflow: 'auto', mt: 2, px: 2 }}>
          <List sx={{ pt: 0 }}>
            {/* Sales Menu */}
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={handleClickSales}
                sx={{
                  borderRadius: 1.5,
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.12)' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: '#1976d2' }}>
                  <ShoppingCartOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Sales"
                  primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500, color: '#1976d2' }}
                />
                {openSales ? <ExpandLess sx={{ color: '#1976d2' }} /> : <ExpandMore sx={{ color: '#1976d2' }} />}
              </ListItemButton>
            </ListItem>

            <Collapse in={openSales} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {salesItems.map((subItem) => {
                  const isActive = activeModule === subItem && salesModalOpen;
                  return (
                    <ListItemButton
                      key={subItem}
                      onClick={() => {
                        setActiveModule(subItem);
                        setViewType('list');
                        setSalesModalOpen(true);
                      }}
                      sx={{
                        pl: 6,
                        py: 1,
                        mb: 0.5,
                        borderRadius: 1.5,
                        bgcolor: isActive ? '#4A7CF3' : 'transparent',
                        color: isActive ? '#fff' : '#000',
                        '&:hover': {
                          bgcolor: isActive ? '#3a68d0' : 'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      <ListItemText
                        primary={subItem}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: isActive ? 600 : 400
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>

      {/* Shared Sales Popup context */}
      <Dialog
        open={salesModalOpen}
        onClose={() => setSalesModalOpen(false)}
        TransitionComponent={Transition}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            height: '94vh',
            maxHeight: '94vh',
            width: '96vw',
            maxWidth: '96vw',
            m: '2vh auto',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }
        }}
        sx={{
          zIndex: 1300,
          '& .MuiDialog-container': {
            alignItems: 'center',
          }
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {renderModuleContent()}
        </Box>
      </Dialog>
    </>
  );
}
