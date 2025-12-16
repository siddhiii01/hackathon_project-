import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker,Popup, useMap } from 'react-leaflet'

type MapViewProps = {
  lat?: number;
  lng?: number;
};

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap(); // Get the Leaflet map instance

  useEffect(() => {     // Run effect when lat or lng changes
    if (lat !== undefined && lng !== undefined) {
      map.setView([lat, lng], map.getZoom()); // Move map to new location
    }
  }, [lat, lng, map]);

  return null; 
}

function MapView({lat,lng}: MapViewProps) {
  const position: [number, number] = lat && lng ? [lat, lng] : [51.505, -0.09];
  console.log(lat,lng);
  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false}  style={{ height: "100%", width: "100%" }}  >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
       {lat !== undefined && lng !== undefined && <RecenterMap lat={lat} lng={lng} />}
    </MapContainer>
  )
}

export default MapView;