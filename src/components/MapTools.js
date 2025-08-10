// src/components/MapTools.js
import React, { useState } from 'react';
import {
  Paper,
  IconButton,
  Tooltip,
  Menu,
  Box,
  Switch,
  FormControlLabel,
  FormGroup,
  RadioGroup, 
  Radio, 
  Typography, 
  Divider,
} from '@mui/material';
import LayersIcon from '@mui/icons-material/Layers';
import DrawIcon from '@mui/icons-material/Create';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import ClearIcon from '@mui/icons-material/Clear';

export function MapToolsLeft({
  baseLayerId,
  setBaseLayerId,
  overlaysState,           // { [id]: boolean }
  setOverlaysState,        // setter
  baseLayers,              // config arrays
  overlayLayers,
  onDrawClick,
}) {
  const [layersMenuAnchor, setLayersMenuAnchor] = useState(null);
  const layersMenuOpen = Boolean(layersMenuAnchor);

  return (
    <>
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
          <IconButton onClick={(e) => setLayersMenuAnchor(e.currentTarget)}>
            <LayersIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Draw Tool" placement="right">
          <IconButton onClick={onDrawClick}>
            <DrawIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      <Menu
        anchorEl={layersMenuAnchor}
        open={layersMenuOpen}
        onClose={() => setLayersMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ px: 2, py: 1, minWidth: 260 }}>
          <Typography variant="subtitle2" gutterBottom>Base map</Typography>
          <RadioGroup
            value={baseLayerId}
            onChange={(e) => setBaseLayerId(e.target.value)}
          >
            {baseLayers.map(bl => (
              <FormControlLabel
                key={bl.id}
                value={bl.id}
                control={<Radio />}
                label={bl.name}
              />
            ))}
          </RadioGroup>

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="subtitle2" gutterBottom>Overlays</Typography>
          <FormGroup>
            {overlayLayers.map(ol => (
              <FormControlLabel
                key={ol.id}
                control={
                  <Switch
                    checked={!!overlaysState[ol.id]}
                    onChange={(e) =>
                      setOverlaysState(prev => ({ ...prev, [ol.id]: e.target.checked }))
                    }
                  />
                }
                label={ol.name}
              />
            ))}
          </FormGroup>
        </Box>
      </Menu>
    </>
  );
}

export function MapToolsRight({
  isLoggedIn,
  showSearch,
  setShowSearch,
  onCenterMap,   // required: centers map (your handleCenterMap from App)
  onClear,       // optional: clear tools/overlays
  onProfileClick // optional: open profile
}) {
  if (!isLoggedIn) return null;

  return (
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
      <Tooltip title="Your Profile" placement="left">
        <IconButton onClick={onProfileClick}>
          <PersonIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={showSearch ? 'Close Search' : 'Search Location'} placement="left">
        <IconButton
          onClick={() => setShowSearch(!showSearch)}
          color={showSearch ? 'primary' : 'default'}
        >
          {showSearch ? <CloseIcon /> : <SearchIcon />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Center Map on You" placement="left">
        <IconButton onClick={onCenterMap}>
          <GpsFixedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Clear Tools" placement="left">
        <IconButton onClick={onClear}>
          <ClearIcon />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}
