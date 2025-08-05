import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Box,
  Divider,
  TextField,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MapView from './MapView';
import LoginForm from './components/LoginForm'; // adjust path as needed
import LoginDialog from './components/LoginDialog';
import { Switch } from '@mui/material';


const drawerWidth = 240;

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAltLayer, setShowAltLayer] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
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
          <MapView isLoggedIn={isLoggedIn} showAltLayer={showAltLayer} />
        ) : (
          <Typography variant="h6" align="center" sx={{ mt: 10 }}>
            Please log in to access the map.
          </Typography>
        )}
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
