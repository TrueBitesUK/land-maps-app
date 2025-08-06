import { useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import { TextField, InputAdornment, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBox() {
  const map = useMap();
  const [query, setQuery] = useState('');
  const inputRef = useRef();

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const results = await response.json();
      if (results.length > 0) {
        const { lat, lon } = results[0];
        map.setView([parseFloat(lat), parseFloat(lon)], 14);
      } else {
        alert('Location not found');
      }
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: '80%',
        maxWidth: 400,
        p: 1,
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Search location..."
        variant="outlined"
        value={query}
        inputRef={inputRef}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Paper>
  );
}
