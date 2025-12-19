import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export const EmergencyStatus = () => {
  const { id } = useParams();
  const [emergency, setEmergency] = useState<any>(null);
  const [assignments,setAssignments] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:3000/emergency/${id}`);
        const assRes = await axios.get(`http://localhost :3000/getAssignments`);
        console.log(assRes);
        setEmergency(res.data);
        setAssignments(assRes.data);
        setLoading(false);

        if (res.data.status === "dispatched") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <p>Checking emergency status...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          Emergency Status
        </h2>

        <p><strong>ID:</strong> {emergency.id}</p>
        <p><strong>Type:</strong> {emergency.type}</p>
        <p><strong>Status:</strong> {emergency.status}</p>

        {emergency.assignedUnitId && (
          <p className="mt-2 text-green-600">
            Unit Dispatched: {emergency.assignedUnitId}
          </p>
        )}

        {emergency.status === "pending" && (
          <p className="mt-4 text-yellow-600">
            Assigning nearest unit...
          </p>
        )}
      </div>
    </div>
  );
};
