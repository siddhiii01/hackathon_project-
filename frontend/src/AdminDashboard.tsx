import React, { useEffect, useState } from "react"
import type { EmergencyFormData, UnitFormData } from "../types/emergency"
import axios from "axios";
import { DashboardCards } from "./components/DashboardCards";
import { DynamicTable } from "./components/DynamicTable";

export const AdminDashboard:React.FC = () => {
  const [emergencies,setEmergencies] = useState<EmergencyFormData[]>([]);
  const [units,setUnits] = useState<UnitFormData[]>([]);
  const [selectedView,setSelectedView] = useState<string | null>(null);

  const fetchData = async() => {
    try {
    const emergencyList =await axios.get('http://localhost:3000/getEmergencies');
    setEmergencies(emergencyList.data.emergencies);
    const unitList =await axios.get('http://localhost:3000/getUnits');
    setUnits(unitList.data.units);
    } catch(err) {
      console.error("Dashboard fetch failed",err);
      
    } 
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData,3000);
    return () => clearInterval(interval);
  },[]);

  const onCardClick = (view:string) => {
    setSelectedView(view);
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-8xl px-6 py-10">
          <DashboardCards emergencies={emergencies} units={units} selectedView={selectedView} onCardClick={onCardClick}/>  

          <DynamicTable emergencies={emergencies} units={units} selectedView={selectedView}/>
        </div>
      </div>
    </>
  )
}