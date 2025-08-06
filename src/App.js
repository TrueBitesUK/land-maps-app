import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Box,
  Divider,
  Paper,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MapView from './MapView';
import LoginDialog from './components/LoginDialog';
import { Switch } from '@mui/material';

import 'leaflet/dist/leaflet.css';
import LayersIcon from '@mui/icons-material/Layers';
import DrawIcon from '@mui/icons-material/Create';
import PersonIcon from '@mui/icons-material/Person';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

const drawerWidth = 240;

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAltLayer, setShowAltLayer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const mapRef = useRef();
  const [userLocation, setUserLocation] = useState(null);


  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleCenterMap = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]); // ✅ set state
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 14);
        }
      },
      () => {
        alert('Unable to retrieve your location.');
      }
    );
  };



  const drawerContent = (
    <>
    <Box sx={{ width: drawerWidth, p: 2 }}>
      {/* Header with close icon */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          p: 1,
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem button>
          <ListItemText primary="Placeholder Layer 1" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Show Alternate Layer" />
          <Switch
            edge="end"
            onChange={(e) => setShowAltLayer(e.target.checked)}
            checked={showAltLayer}
          />
        </ListItem>

      </List>
    </Box>

    <Box sx={{ p: 2 }}>
      {!isLoggedIn ? (
        <>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setLoginDialogOpen(true)}
        >
          Log In
        </Button>
        </>
      ) : (
        <>
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Logged in as: {userEmail}
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => {
              setIsLoggedIn(false);
              setUserEmail('');
            }}
          >
            Log Out
          </Button>
        </Box>
      </>
    )}
  </Box>   
  </> 
  );

  return (
    <>
      <CssBaseline />

      {/* App Bar with Burger Icon */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Land Maps by FG&B
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer}
        anchor="left"
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{ p: 3, mt: 8 }}
      >
        {isLoggedIn ? (
          <MapView 
            isLoggedIn={isLoggedIn} 
            showAltLayer={showAltLayer} 
            showSearch={showSearch} 
            mapRef={mapRef}
            userLocation={userLocation} // ✅ new prop
          />
        ) : (
          <Typography variant="h6" align="center" sx={{ mt: 10 }}>
            Please log in to access the map.
          </Typography>
        )}

        {/* Left floating menu: Map tools */}
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: 70,
            left: 16,
            zIndex: 1000,
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Tooltip title="Layer Options" placement="right">
            <IconButton>
              <LayersIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Draw Tool" placement="right">
            <IconButton>
              <DrawIcon />
            </IconButton>
          </Tooltip>
        </Paper>

        {/* Right floating menu: User tools */}
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: 70,
            right: 16,
            zIndex: 1000,
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {isLoggedIn && (
            <>
              <Tooltip title="Your Profile" placement="left">
                <IconButton>
                  <PersonIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={showSearch ? 'Close Search' : 'Search Location'} placement="left">
                <IconButton onClick={() => setShowSearch(!showSearch)} color={showSearch ? 'primary' : 'default'}>
                  {showSearch ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Center Map on You" placement="left">
                <IconButton onClick={handleCenterMap}>
                  <GpsFixedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Clear Tools" placement="left">
                <IconButton>
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Paper>

      </Box>
      <LoginDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        onLoginSuccess={(email) => {
          setIsLoggedIn(true);
          setUserEmail(email);
        }}
      />
    </>
    
  );
}
