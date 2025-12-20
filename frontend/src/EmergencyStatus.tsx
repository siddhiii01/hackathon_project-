  import { useParams } from "react-router-dom";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import type { Location } from "../types/emergency";
  import { calculateRadialDistanceBetweenCoordinates } from "./utils/distance";
import { LiveTrackingMap } from "./components/LiveTrackingMap";

  export const EmergencyStatus = () => {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [unitLoc,setUnitLoc] = useState<Location | null>(null);
    const [distance,setDistance] = useState<number>();
    const [eta, setEta] = useState<number>();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // only for updating status 
    useEffect(() => {
      if (!id) return;
      const interval = setInterval(async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/emergency/${id}/status`);
          setData(res.data);
          setLoading(false);

          if (res.data.emergency.status === "resolved") {
            clearInterval(interval);
          }
        } catch (err) {
          console.error(err);
        }
      }, 3000);

      return () => clearInterval(interval);
    }, [id]);

    // “When the unit is dispatched, start tracking from its real position”
    useEffect(() => {
      if (!data) return;
      if(data.emergency.status!=="active") return;
      if(!data.unit.location) return;

      // Instead of resetting every time, Set unit location ONLY ONCE
      // setUnitLoc(data.unit.location);
      setUnitLoc(prev => prev ?? data.unit.location);
    },[data])


    // While emergency is active, move the unit closer every few second
    useEffect(() => {
      if(!unitLoc || !data.emergency.location) return;

      const interval = setInterval(() => {
        setUnitLoc(prev => {
          if(!prev) return null;
          const step = 0.08;
          
          return {
            lat: prev?.lat + (data.emergency.location.lat - prev.lat) * step,
            lng: prev?.lng + (data.emergency.location.lng - prev.lng) * step
          }
        })
      },2000);
      return () => clearInterval(interval);
    },[unitLoc,data?.emergency?.status]);

    useEffect(() => {
        if (!unitLoc || !data.emergency.location) return

        const distKm = calculateRadialDistanceBetweenCoordinates(unitLoc,data.emergency.location);

        setDistance(Number(distKm.toFixed(2)))
        setEta(Math.ceil((distKm / 40) * 60)) // 40 km/h
      }, [unitLoc])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg">Checking emergency status...</p>
        </div>
      );
    }

    const { emergency, unit, assigment } = data;
  return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
          <h2 className="text-xl font-semibold text-center">
            Emergency Status
          </h2>

          <div className=" mt-2 p-4">
            <p><strong>ID:</strong> {emergency.id}</p>
            <p><strong>Type:</strong> {emergency.type.toUpperCase()}</p>
          </div>

          {unit && assigment && emergency.status === 'assigned' && (
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="font-semibold text-green-700 mb-2">
                Unit Assigned
              </h3>
              <p><strong>Unit ID:</strong> {unit.id}</p>
              <p><strong>Unit Type:</strong> {unit.type}</p>
              <p className="mt-2 text-green-700 font-medium">
                Estimated Arrival: {assigment.etaMinutes} minutes
              </p>
            </div>
          )}

          {emergency.status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
              <p className="text-yellow-700 font-medium">
                Finding the nearest available unit...
              </p>
            </div>
          )}

          {emergency.status === "active" && unitLoc && (
            <div className="mt-2 text-sm text-gray-700">
              <p>Distance remaining: <strong>{distance} km</strong></p>
              <p>ETA: <strong>{eta} minutes</strong></p>

              <LiveTrackingMap
                emergencyLoc={emergency.location}
                unitLoc={unitLoc}
              />
            </div>
          )}

          {emergency.status === "resolved" && (
            <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg">
              <p className="text-blue-700 font-medium">
                Unit resolved
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };
