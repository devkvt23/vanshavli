'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Population } from '@/services/api';

// Fix for default Leaflet marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create different colored markers for different timeframes
const createMarkerIcon = (timeframe: string) => {
  const color = timeframe === 'Modern' ? 'blue' : 
                timeframe === 'Bronze Age' ? 'red' : 
                timeframe === 'Paleolithic' ? 'green' : 'gray';
                
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

interface PopulationMapProps {
  populations: Population[];
  selectedPopulation?: string;
  onPopulationSelect?: (id: string) => void;
}

export default function PopulationMap({ 
  populations,
  selectedPopulation,
  onPopulationSelect
}: PopulationMapProps) {
  // Default center and zoom for empty state
  const defaultCenter: [number, number] = [20, 0];
  const defaultZoom = 2;

  // Calculate map settings based on populations
  const mapCenter = populations.length > 0
    ? (() => {
        const bounds = L.latLngBounds(
          populations.map(pop => [pop.coordinates.latitude, pop.coordinates.longitude])
        );
        const center = bounds.getCenter();
        return [center.lat, center.lng] as [number, number];
      })()
    : defaultCenter;

  const zoom = populations.length > 0 ? 4 : defaultZoom;

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {populations.map((pop) => (
          <Marker
            key={pop._id}
            position={[pop.coordinates.latitude, pop.coordinates.longitude]}
            icon={createMarkerIcon(pop.timeframe)}
            eventHandlers={{
              click: () => onPopulationSelect?.(pop._id)
            }}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold">{pop.name}</h3>
                <p className="text-gray-600">{pop.region}</p>
                <p className="text-gray-600">{pop.timeframe}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md z-[1000]">
          <div className="text-sm font-semibold mb-1">Timeframes:</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs">Modern</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs">Bronze Age</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs">Paleolithic</span>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
} 