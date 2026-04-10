import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Divider,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import { useTheme } from "@mui/material/styles";

export default function PlantCard({ image, title }) {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
        maxWidth: '100%', 
        borderRadius: 4, 
        boxShadow: theme.palette.mode === 'light' ? '0 12px 24px rgba(0,0,0,0.05)' : '0 12px 24px rgba(0,0,0,0.5)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.palette.mode === 'light' ? '0 16px 32px rgba(0,0,0,0.1)' : '0 16px 32px rgba(0,0,0,0.6)',
        },
        bgcolor: 'background.paper',
        overflow: 'hidden'
    }}>
      <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="220"
            image={image}
            alt={title}
            sx={{ objectFit: 'cover' }}
          />
          <Chip 
            label="ACTIVE" 
            size="small"
            sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                bgcolor: '#4caf50', 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.7rem'
            }} 
          />
      </Box>

      <CardContent sx={{ p: 4 }}>
        <Typography variant="overline" sx={{ color: '#4A7CF3', fontWeight: 800, letterSpacing: 1 }}>
          CONCRETE EQUIPMENT
        </Typography>

        <Typography variant="h6" fontWeight="bold" sx={{ mt: 0.5, mb: 1, lineHeight: 1.2 }}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3} sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          High-performance concrete batching plant with automated weighing system for optimal mix quality and speed.
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Chip icon={<SettingsSuggestOutlinedIcon fontSize="small"/>} label="Equipment" variant="outlined" size="small" />
            <Chip icon={<LocationOnOutlinedIcon fontSize="small"/>} label="On-site" variant="outlined" size="small" />
        </Box>

        <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

        <Button
            variant="contained"
            fullWidth
            endIcon={<ArrowForwardIcon />}
            sx={{
                borderRadius: 2,
                py: 1.2,
                backgroundColor: "#4A7CF3",
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 10px rgba(74, 124, 243, 0.3)',
                '&:hover': {
                    backgroundColor: "#3a68d0",
                }
            }}
        >
            View Details
        </Button>

      </CardContent>
    </Card>
  );
}