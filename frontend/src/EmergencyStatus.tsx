import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export const EmergencyStatus = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
   // 💥 new state to store all statuses
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://localhost:3000/emergency/${id}/status`);
         console.log(res.data)
        setData(res.data);
        setLoading(false);
        // 💥 push only if new status (prevents duplicates)
        setHistory((prev) => {
          const currentStatus = res.data.emergency.status;
          if (prev[prev.length - 1] === currentStatus) return prev;
          return [...prev, currentStatus];
        });

        if (res.data.emergency.status === "resolved") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

   if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Checking emergency status...</p>
      </div>
    );
  }

  const { emergency, unit, assignment } = data;
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

         {unit && assignment && (
          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="font-semibold text-green-700 mb-2">
              Unit Assigned
            </h3>
            <p><strong>Unit ID:</strong> {unit.id}</p>
            <p><strong>Unit Type:</strong> {unit.type}</p>
            <p className="mt-2 text-green-700 font-medium">
              Estimated Arrival: {assignment.etaMinutes} minutes
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

        {emergency.status === "dispatched" && (
           <div className="bg-green-50 border border-green-300 p-4 rounded-lg">
            <p className="text-green-700 font-medium">
              Help is on the way
            </p>
          </div>
        )}

        {emergency.status === "resolved" && (
          <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg">
            <p className="text-blue-700 font-medium">
              Unit resolved
            </p>
          </div>
        )}


         {/* 💥 NEW TIMELINE UI */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2 text-gray-700">
            Status Timeline
          </h3>

          <ul className="space-y-1">
            {history.map((s, index) => (
              <li key={index} className="text-sm text-gray-800">
                {index + 1}. {s.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
