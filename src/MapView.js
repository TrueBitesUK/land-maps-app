import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';

export default function MapView({ isLoggedIn, showAltLayer }) {
  return (
    <Card sx={{ height: '80vh' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Map View
        </Typography>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: '70vh', width: '100%' }}
          >

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
