// MapView.js
import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, CardContent, Typography } from '@mui/material';
import SearchBox from './components/searchBox';
import { MapToolsLeft, MapToolsRight } from './components/MapTools';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';

import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';


// Recenter helper (unchanged)
function RecenterOn({ location, zoom = 14 }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.invalidateSize();
      map.flyTo(location, zoom, { duration: 0.5 });
    }
  }, [location, zoom, map]);
  return null;
}

function GeomanControls({ enabled, onAnyChange }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    // toggle controls
    if (enabled) {
      map.pm.addControls({
        position: 'topleft',
        drawMarker: true,
        drawPolygon: true,
        drawPolyline: true,
        drawRectangle: true,
        drawCircle: false,
        drawCircleMarker: false,
        editMode: true,
        dragMode: true,
        removalMode: true,
      });
    } else {
      map.pm.removeControls();
    }

    const handleChange = () => {
      if (!onAnyChange) return;
      const features = [];
      map.eachLayer((l) => {
        if (l?.pm && typeof l.toGeoJSON === 'function') {
          const gj = l.toGeoJSON();
          if (gj?.type === 'FeatureCollection') features.push(...gj.features);
          else if (gj) features.push(gj);
        }
      });
      onAnyChange({ type: 'FeatureCollection', features });
    };

    map.on('pm:create', handleChange);
    map.on('pm:remove', handleChange);
    map.on('pm:edit', handleChange);
    return () => {
      map.off('pm:create', handleChange);
      map.off('pm:remove', handleChange);
      map.off('pm:edit', handleChange);
      map.pm.removeControls();
    };
  }, [map, enabled, onAnyChange]);
  return null;
}

function ClearGeoman({ trigger }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !trigger) return;

    // Remove any Geoman-drawn layers
    map.eachLayer((l) => {
      // Geoman adds `pm` to editable layers; also check for toGeoJSON so we don't nuke tile layers
      if (l?.pm && typeof l.toGeoJSON === 'function') {
        try { map.removeLayer(l); } catch (_) {}
      }
    });

    // Hide Geoman controls too (we also turn off drawEnabled in state above)
    if (map.pm) {
      try { map.pm.removeControls(); } catch (_) {}
    }
  }, [map, trigger]);

  return null;
}

export default function MapView({ isLoggedIn, showAltLayer, setShowAltLayer }) {
  const [showSearch, setShowSearch] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [drawEnabled, setDrawEnabled] = useState(false);
  const [drawnGeoJSON, setDrawnGeoJSON] = useState(null);
  const [clearTick, setClearTick] = useState(0);

  const STADIA = (path) =>
  `https://tiles.stadiamaps.com/tiles/${path}/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_STADIA_API_KEY}`;

  // ⚙️ Layer configs (add as many as you like)
  const baseLayers = useMemo(() => ([
    {
      id: 'streets-osm',
      name: 'Streets (OSM)',
      type: 'tile',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors',
    },
    {
      id: 'sat-esri',
      name: 'Satellite (ESRI)',
      type: 'tile',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles © Esri',
    },
    {
      id: 'toner-lite',
      name: 'Toner Lite (Stadia/Stamen)',
      type: 'tile',
      url: STADIA('stamen_toner_lite'),
      attribution:
        '© <a href="https://stadiamaps.com/">Stadia Maps</a> © <a href="https://stamen.com/">Stamen</a> © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    },
    {
      id: 'toner',
      name: 'Toner (Stadia/Stamen)',
      type: 'tile',
      url: STADIA('stamen_toner'),
      attribution:
        '© <a href="https://stadiamaps.com/">Stadia Maps</a> © <a href="https://stamen.com/">Stamen</a> © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    },
    {
      id: 'topo-opentopo',
      name: 'Topographic (OpenTopoMap)',
      type: 'tile',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '© OpenTopoMap',
    },
  ]), []);

  const overlayLayers = useMemo(() => ([
    {
      id: 'hillshade-esri',
      name: 'Hillshade (ESRI)',
      kind: 'tile',
      url: 'https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Hillshade © Esri',
      zIndex: 450, opacity: 0.7,
    },
    {
      id: 'terrain-lines-stadia',
      name: 'Terrain Lines (Stadia/Stamen)',
      kind: 'tile',
      url: STADIA('stamen_terrain_lines'),
      attribution: '© Stadia Maps © Stamen',
      zIndex: 460, opacity: 0.6,
    },
    // Example placeholder for future GeoJSON:
    // { id: 'parcels', name: 'Parcels (GeoJSON)', kind: 'geojson', data: someGeoJsonObject }
  ]), []);

  // state: selected base and overlay toggles
  const [baseLayerId, setBaseLayerId] = useState(baseLayers[0].id);
  const [overlaysState, setOverlaysState] = useState({}); // { id: true/false }

  // if you still want the toggle from App (showAltLayer) to map to a base layer:
  useEffect(() => {
    if (showAltLayer) setBaseLayerId('sat-esri');
    // else leave current selection; or set to osm if you prefer:
    // else setBaseLayerId('streets-osm');
  }, [showAltLayer]);

  const handleCenterMap = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => setUserLocation([latitude, longitude]),
      () => alert('Unable to retrieve your location.')
    );
  };

  const activeBase = baseLayers.find(b => b.id === baseLayerId) || baseLayers[0];

  return (
    <Card sx={{ height: '80vh', position: 'relative' }}>
      <CardContent sx={{ height: '100%', position: 'relative' }}>
        <Typography variant="h6" align="center" gutterBottom>Map View</Typography>

        {/* Floating toolbars */}
        {isLoggedIn && (
          <>
            <MapToolsLeft
              baseLayerId={baseLayerId}
              setBaseLayerId={setBaseLayerId}
              overlaysState={overlaysState}
              setOverlaysState={setOverlaysState}
              baseLayers={baseLayers}
              overlayLayers={overlayLayers}
              onDrawClick={() => setDrawEnabled(v => !v)}
              drawEnabled={drawEnabled}
            />
            {/* Right tools can stay as you had them, or import MapToolsRight: */}
            <MapToolsRight
              isLoggedIn={isLoggedIn}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              onCenterMap={handleCenterMap}
              onClear={() => {
                // reset React state
                setOverlaysState({});
                setDrawnGeoJSON(null);
                setUserLocation(null);
                setShowSearch(false);
                setDrawEnabled(false);
                // tell the map to clear drawn layers
                setClearTick(t => t + 1);
              }}
              onProfileClick={() => {
                // placeholder: open profile dialog here
              }}
            />
          </>
        )}

        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: '70vh', width: '100%' }}
          zoomControl={false}
        >
          <RecenterOn location={userLocation} />
          <ClearGeoman trigger={clearTick} />
          <GeomanControls
            enabled={drawEnabled}
            onAnyChange={(geojson) => setDrawnGeoJSON(geojson)}
          />
          {showSearch && <SearchBox />}

          {/* User location marker */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>You are here</Popup>
            </Marker>
          )}

          {/* Base layer */}
          <TileLayer
            key={activeBase.id}
            url={activeBase.url}
            attribution={activeBase.attribution}
          />

          {/* Overlays */}
          {overlayLayers.map(ol => {
            if (!overlaysState[ol.id]) return null;
            if (ol.kind === 'tile') {
              return (
                <TileLayer
                  key={ol.id}
                  url={ol.url}
                  attribution={ol.attribution}
                  opacity={ol.opacity ?? 1}
                  zIndex={ol.zIndex ?? 500}
                />
              );
            }
            // if (ol.kind === 'geojson') return <GeoJSON key={ol.id} data={ol.data} />;
            return null;
          })}

          {/* Example logged-in marker */}
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
