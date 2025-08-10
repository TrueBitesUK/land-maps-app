// App.js
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, CssBaseline, Box, Divider, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import MapView from './MapView';
import LoginDialog from './components/LoginDialog';

const drawerWidth = 240;

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAltLayer, setShowAltLayer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const drawerContent = (
    <Box sx={{ width: drawerWidth, p: 2 }}>
      <Box sx={{ display:'flex', justifyContent:'flex-end', p:1 }}>
        <IconButton onClick={() => setDrawerOpen(false)}><CloseIcon/></IconButton>
      </Box>
      <Divider />
      <Box sx={{ p:2 }}>
        {!isLoggedIn ? (
          <Button fullWidth variant="contained" onClick={() => setLoginDialogOpen(true)}>Log In</Button>
        ) : (
          <>
            <Typography variant="body2" sx={{ mb:1 }}>Logged in as: {userEmail}</Typography>
            <Button fullWidth variant="outlined" color="secondary" onClick={() => { setIsLoggedIn(false); setUserEmail(''); }}>Log Out</Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} sx={{ mr:2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>Land Maps by FG&B</Typography>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor="left">
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ p:3, mt:8 }}>
        {isLoggedIn ? (
          <MapView
            isLoggedIn={isLoggedIn}
            showAltLayer={showAltLayer}
            setShowAltLayer={setShowAltLayer}
          />
        ) : (
          <Typography variant="h6" align="center" sx={{ mt:10 }}>
            Please log in to access the map.
          </Typography>
        )}
      </Box>

      <LoginDialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        onLoginSuccess={(email) => { setIsLoggedIn(true); setUserEmail(email); }}
      />
    </>
  );
}
