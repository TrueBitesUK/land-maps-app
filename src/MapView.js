import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, Typography } from '@mui/material';
import SearchBox from './components/searchBox';

import 'leaflet/dist/leaflet.css';

export default function MapView({ isLoggedIn, showAltLayer, showSearch, mapRef, userLocation }) {

  return (
    <Card sx={{ height: '80vh' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom align='center'>
          Map View
        </Typography>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: '70vh', width: '100%' }}
            zoomControl={false}
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
          >

          {showSearch && <SearchBox />}

          {userLocation && (
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {/* Default street layer */}
          {!showAltLayer && (
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© OpenStreetMap contributors'
            />
          )}

          {/* Satellite layer */}
          {showAltLayer && (
            <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles © Esri'
            />
          )}

          {isLoggedIn && (
            <Marker position={[51.505, -0.09]}>
            <Popup>Hello there logged in user!</Popup>
            </Marker>
          )}
          
        </MapContainer>
      </CardContent>
    </Card>
  );
}
