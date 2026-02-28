import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { NewsItem } from '../types';

// Fix for default marker icon in Leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LiveMapProps {
  items: NewsItem[];
}

const MapUpdater: React.FC<{ items: NewsItem[] }> = ({ items }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (items.length > 0) {
      try {
        const bounds = L.latLngBounds(items.map(item => [item.location!.lat, item.location!.lng]));
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (e) {
        console.error("Error fitting map bounds", e);
      }
    }
  }, [items, map]);
  
  return null;
};

export const LiveMap: React.FC<LiveMapProps> = ({ items }) => {
  const locations = items.filter(item => item.location);

  return (
    <div className="w-full h-[320px] mb-12 relative">
      <div className="absolute top-4 left-4 z-[1000] glass-card px-4 py-2 flex items-center gap-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-100">Live Pulse Map</span>
      </div>
      
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((item) => (
          <Marker 
            key={item.id} 
            position={[item.location!.lat, item.location!.lng]}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h4 className="font-bold text-zinc-900 mb-1">{item.title}</h4>
                <p className="text-xs text-zinc-600 mb-2">{item.location!.name}</p>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-600 text-[10px] font-bold uppercase"
                >
                  View Update
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
        <MapUpdater items={locations} />
      </MapContainer>
    </div>
  );
};
