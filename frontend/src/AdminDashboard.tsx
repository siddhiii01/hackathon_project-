import React, { useEffect, useState } from "react"
import type { EmergencyFormData, UnitFormData } from "../types/emergency"
import axios from "axios";
import { DashboardCards } from "./components/DashboardCards";
import { data } from "react-router-dom";

export const AdminDashboard:React.FC = () => {
  const [emergencies,setEmergencies] = useState<EmergencyFormData[]>([]);
  const [units,setUnits] = useState<UnitFormData[]>([]);

  const fetchData = async() => {
    const emergencyList =await axios.get('http://localhost:3000/getEmergencies');
    setEmergencies(emergencyList.data.emergencies);
    const unitList =await axios.get('http://localhost:3000/getUnits');
    setUnits(unitList.data.units);
  }

  useEffect(() => {
    fetchData();
  },[]);

  return (
    <>
      <div className="">
        <DashboardCards emergencies={emergencies} units={units}/>  
      </div>
    </>
  )
}