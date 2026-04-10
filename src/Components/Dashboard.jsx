import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, Grid, IconButton, Avatar, Switch, TextField,
    InputAdornment, Card, CardContent, Divider, Button, Chip, CardMedia
} from "@mui/material";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DashboardImage from "../assets/maxresdefault.jpg";
import Sidebar from './Sidebar';

const MOCK_EQUIPMENTS = [
  { id: 1, title: "Batching Plant M30", location: "Site A - North Wing" },
];

export default function Dashboard({ toggleColorMode, mode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    const filteredEquipments = MOCK_EQUIPMENTS.filter(eq =>
        eq.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ 
                flexGrow: 1,
                minHeight: "100vh", 
                bgcolor: "background.default", 
                pb: 6 
            }}>

                <Box sx={{
                    p: "10px 30px",
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `1px solid #eee`,
                    bgcolor: '#F9F9FB',
                    minHeight: "75px",
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                <Typography sx={{ fontWeight: 700, fontSize: "1.5rem", color: "#1a1a1a" }}>
                    Elantris Technologies Pvt Ltd
                </Typography>

                <Box sx={{ display: 'flex', gap: { xs: 1, sm: 3 }, alignItems: 'center' }}>

                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search equipments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: 3,
                                bgcolor: mode === 'light' ? '#f4f6fb' : '#2b2b2b',
                                '& fieldset': { border: 'none' },
                                width: { xs: '150px', sm: '250px', md: '350px' },
                                transition: 'width 0.3s'
                            }
                        }}
                    />

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Switch
                            checked={mode === 'dark'}
                            onChange={toggleColorMode}
                            icon={<WbSunnyIcon sx={{ fontSize: 16, color: '#f57c00', mt: '3px', ml: '3px' }} />}
                            checkedIcon={<DarkModeIcon sx={{ fontSize: 16, color: '#90caf9', mt: '3px', ml: '3px' }} />}
                            sx={{
                                mr: 1,
                                '& .MuiSwitch-switchBase': {
                                    padding: 1,
                                },
                            }}
                        />

                        <Divider orientation="vertical" flexItem sx={{ mr: 2, my: 0.5 }} />

                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: '#4A7CF3', width: 40, height: 40 }}>JD</Avatar>
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Typography variant="body2" fontWeight="bold" sx={{ lineHeight: 1.2 }}>John Doe</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>System Admin</Typography>
                            </Box>
                        </Box>

                        <Divider orientation="vertical" flexItem sx={{ mx: 2, my: 0.5 }} />

                        <IconButton onClick={handleLogout} sx={{ color: 'error.main' }}>
                            <LogoutOutlinedIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>


            <Box sx={{ px: { xs: 3, md: 6 }, mt: 4 }}>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 5, width: '100%' }}>
                    <Card sx={{ flex: 1, borderRadius: 3, bgcolor: mode === 'light' ? '#fff' : '#1e1e1e', boxShadow: 'none', border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(74, 124, 243, 0.1)' }}>
                                <AssessmentOutlinedIcon sx={{ color: '#4A7CF3', fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight="bold">1</Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>Total Equipments</Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ flex: 1, borderRadius: 3, bgcolor: mode === 'light' ? '#fff' : '#1e1e1e', boxShadow: 'none', border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                                <CheckCircleOutlineOutlinedIcon sx={{ color: '#4caf50', fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight="bold">1</Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>Active on Site</Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card sx={{ flex: 1, borderRadius: 3, bgcolor: mode === 'light' ? '#fff' : '#1e1e1e', boxShadow: 'none', border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
                            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
                                <WarningAmberOutlinedIcon sx={{ color: '#ff9800', fontSize: 32 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight="bold">0</Typography>
                                <Typography variant="body2" color="text.secondary" fontWeight={500}>Needs Maintenance</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Featured Equipment
                    </Typography>
                </Box>

                {filteredEquipments.length > 0 ? (
                    <Card sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', lg: 'row' },
                        borderRadius: 4,
                        boxShadow: mode === 'light' ? '0 12px 32px rgba(0,0,0,0.05)' : '0 12px 32px rgba(0,0,0,0.5)',
                        bgcolor: 'background.paper',
                        overflow: 'hidden',
                        mb: 4
                    }}>
                        <Box sx={{ position: 'relative', width: { xs: '100%', lg: '50%', xl: '55%' } }}>
                            <CardMedia
                                component="img"
                                image={DashboardImage}
                                alt={filteredEquipments[0].title}
                                sx={{ width: '100%', height: '100%', minHeight: { xs: 300, lg: 500 }, objectFit: 'cover' }}
                            />
                            <Chip
                                label="ACTIVE"
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 24,
                                    right: 24,
                                    bgcolor: '#4caf50',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    px: 1,
                                    py: 2.5,
                                    letterSpacing: 1
                                }}
                            />
                        </Box>

                        <CardContent sx={{
                            p: { xs: 4, md: 6 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            width: { xs: '100%', lg: '50%', xl: '45%' },
                            position: 'relative',
                            zIndex: 1
                        }}>
                            <Typography variant="overline" sx={{ color: '#4A7CF3', fontWeight: 800, letterSpacing: 1.5, mb: 1.5, display: 'block' }}>
                                CONCRETE EQUIPMENT
                            </Typography>

                            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2.5, lineHeight: 1.1 }}>
                                {filteredEquipments[0].title}
                            </Typography>

                            <Typography variant="body1" color="text.secondary" sx={{ mb: 5, fontSize: '1.15rem', lineHeight: 1.7 }}>
                                High-performance concrete batching plant with automated weighing system for optimal mix quality and speed. Features state-of-the-art moisture sensors and twin-shaft mixers for maximum throughput. Currently deployed at {filteredEquipments[0].location}.
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 5 }}>
                                <Chip icon={<SettingsSuggestOutlinedIcon />} label="Equipment" variant="outlined" sx={{ py: 2.5, px: 1, borderRadius: 2, fontSize: '1rem' }} />
                                <Chip icon={<LocationOnOutlinedIcon />} label="On-site" variant="outlined" sx={{ py: 2.5, px: 1, borderRadius: 2, fontSize: '1rem' }} />
                            </Box>

                            <Divider sx={{ mb: 5, borderStyle: 'dashed' }} />

                            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={() => navigate('/plant')}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.8,
                                        px: 5,
                                        backgroundColor: "#4A7CF3",
                                        textTransform: 'none',
                                        fontSize: '1.2rem',
                                        fontWeight: 600,
                                        boxShadow: '0 8px 16px rgba(74, 124, 243, 0.3)',
                                        '&:hover': {
                                            backgroundColor: "#3a68d0",
                                        }
                                    }}
                                >
                                    View Detailed Metrics
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ) : (
                    <Box sx={{ py: 10, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">No equipments found matching "{searchQuery}"</Typography>
                    </Box>
                )}
            </Box>
        </Box>
        </Box>
    );
}