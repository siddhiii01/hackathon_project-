import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect } from "react";

import { useMap } from "react-leaflet";

const RecenterMap = ({ position }: { position: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [position]);

  return null;
};


export const LiveTrackingMap = ({ unitLoc, emergencyLoc }:any) => {
  const unitPos: [number, number] = [unitLoc.lat, unitLoc.lng];
  const emergencyPos: [number, number] = [emergencyLoc.lat, emergencyLoc.lng];

  return (
    <MapContainer center={unitPos} zoom={13} style={{ height: "300px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      <RecenterMap position={[unitLoc.lat,unitLoc.lng]}/>
      <Marker position={unitPos} />
      <Marker position={emergencyPos} />

      {/* Line between unit and emergency */}
      <Polyline positions={[unitPos, emergencyPos]} />
    </MapContainer>
  );
};
