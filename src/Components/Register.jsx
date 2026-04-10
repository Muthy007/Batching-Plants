import React, { useState } from "react";
import { Box, TextField, Typography, Button, Paper, Switch, InputAdornment, IconButton, Link as MuiLink } from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Link } from 'react-router-dom';

export default function Register({ toggleColorMode, mode }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: mode === 'light' ? '#e4e8f1' : '#0a0a0a',
                padding: 2
            }}
        >
            <Paper 
                elevation={mode === 'light' ? 6 : 2}
                sx={{ 
                    padding: { xs: 4, sm: 5 }, 
                    width: '100%',
                    maxWidth: 420, 
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    bgcolor: mode === 'light' ? '#f4f6fb' : '#1a1a1a', 
                }}
            >
                <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
                    <Switch 
                        checked={mode === 'dark'} 
                        onChange={toggleColorMode} 
                        icon={<WbSunnyIcon sx={{ fontSize: 16, color: '#f57c00', mt: '3px', ml: '3px' }} />}
                        checkedIcon={<DarkModeIcon sx={{ fontSize: 16, color: '#90caf9', mt: '3px', ml: '3px' }} />}
                        sx={{
                            '& .MuiSwitch-switchBase': {
                                padding: 1,
                            },
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 3,
                        backgroundColor: "#4A7CF3",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 3,
                        boxShadow: '0 4px 10px rgba(74, 124, 243, 0.4)'
                    }}
                >
                    <FlashOnIcon sx={{ color: "white" }} />
                </Box>

                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, fontFamily: '"Playfair Display", Georgia, serif', letterSpacing: '-0.5px' }}>
                    Create Account
                </Typography>

                <Typography sx={{ color: "text.secondary", mb: 4, fontWeight: 500 }}>
                    Sign up to get started
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Typography sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>
                        Username
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Enter your username"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PersonOutlineIcon />
                                </InputAdornment>
                            ),
                            sx: {
                                bgcolor: mode === 'light' ? '#fff' : '#2b2b2b',
                                borderRadius: 3,
                                '& fieldset': { 
                                    border: 'none' 
                                },
                            }
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>
                        Email
                    </Typography>
                    <TextField
                        fullWidth
                        type="email"
                        placeholder="Enter your email"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailOutlinedIcon />
                                </InputAdornment>
                            ),
                            sx: {
                                bgcolor: mode === 'light' ? '#fff' : '#2b2b2b',
                                borderRadius: 3,
                                '& fieldset': { 
                                    border: 'none' 
                                },
                            }
                        }}
                    />
                </Box>

                <Box sx={{ mb: 2 }}>
                    <Typography sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>
                        Password
                    </Typography>
                    <TextField
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                bgcolor: mode === 'light' ? '#fff' : '#2b2b2b',
                                borderRadius: 3,
                                '& fieldset': { 
                                    border: 'none' 
                                },
                            }
                        }}
                    />
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>
                        Confirm Password
                    </Typography>
                    <TextField
                        fullWidth
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        variant="outlined"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LockOutlinedIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: {
                                bgcolor: mode === 'light' ? '#fff' : '#2b2b2b',
                                borderRadius: 3,
                                '& fieldset': { 
                                    border: 'none' 
                                },
                            }
                        }}
                    />
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                        borderRadius: 3,
                        backgroundColor: "#4A7CF3",
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        py: 1.5,
                        boxShadow: '0 8px 16px rgba(74, 124, 243, 0.25)',
                        '&:hover': {
                            backgroundColor: "#3a68d0",
                        },
                        mb: 2
                    }}
                >
                    Sign Up
                </Button>

                <Typography variant="body2" align="center" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    Already have an account?{' '}
                    <MuiLink component={Link} to="/" sx={{ color: '#4A7CF3', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                        Sign In
                    </MuiLink>
                </Typography>

            </Paper>
        </Box>
    );
}
