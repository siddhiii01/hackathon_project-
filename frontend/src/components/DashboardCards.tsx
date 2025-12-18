import React, { useEffect, useState } from "react"
import axios from "axios";
import type { DashboardCardProps } from "../../types/emergency";

interface cardProps {
  title:string,
  value:number
}

export function Cards({title,value}: cardProps) {
  return ( 
    <>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </>
  )
}

export const DashboardCards:React.FC<DashboardCardProps> = ({emergencies,units}) => {

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Cards title="Total Emergencies" value={emergencies.length}/>
        <Cards title="Pending Emergencies" value={emergencies.filter(e => e.status==='pending').length}/>
        <Cards title="Resolved Emergencies" value={emergencies.filter(e => e.status==='active').length}/>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
        <Cards title="Total Units" value={units.length} />
        <Cards title="Available Units" value={units.filter(u => u.status==='available').length} />
        <Cards title="Dispatched Units" value={units.filter(u => u.status==='dispatched').length} />
        <Cards title="Busy Units" value={units.filter(u => u.status==='busy').length} />
      </div>
    </>
  )
}