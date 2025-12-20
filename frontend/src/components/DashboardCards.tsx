import React from "react"
import type { DashboardCardProps } from "../../types/emergency";

interface cardProps {
  title:string,
  value:number,
  active?: boolean, 
  onClick?: () => void
}

export function Cards({title,value,active,onClick}: cardProps) {
  return ( 
    <>
      <div className={` p-4 rounded-lg border cursor-pointer transition-all
        ${active ? "bg-blue-50 border-blue-500 shadow-md" : "bg-white border-gray-200"}
        hover:shadow-md hover:border-blue-400`} onClick={onClick}>
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </>
  )
}

export const DashboardCards:React.FC<DashboardCardProps> = ({emergencies,units,selectedView,onCardClick}) => {

  return (
    <>
    <div className="w-6xl items-center ml-4">
      <h2 className="font-bold mt-2">All Reports</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          <Cards title="Total Emergencies" value={emergencies.length} onClick={() => onCardClick?.("All_Emergencies")} active={selectedView==="All_Emergencies"}/>

          <Cards title="Pending Emergencies" value={emergencies.filter(e => e.status==='pending').length} onClick={() => onCardClick?.("Pending_Emergency")} active={selectedView==="Pending_Emergency"} />

          <Cards title="Resolved Emergencies" onClick={() => onCardClick?.("Resolved_Emergency")} value={emergencies.filter(e => e.status==='resolved').length} active={selectedView==="Resolved_Emergency"} />

          <Cards title="Active Emergencies" onClick={() => onCardClick?.("Active_Emergency")} value={emergencies.filter(e => e.status==='active').length} active={selectedView==="Active_Emergency"} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
          <Cards title="Total Units" value={units.length} />

          <Cards title="Available Units" onClick={() => onCardClick?.("Available_Units")} value={units.filter(u => u.status==='available').length} active={selectedView==="Available_Units"} />

          <Cards title="Dispatched Units" onClick={() => onCardClick?.("Dispatched_Units")} value={units.filter(u => u.status==='dispatched').length} active={selectedView==="Dispatched_Units"} />

          <Cards title="Busy Units" onClick={() => onCardClick?.("Busy_Units")} value={units.filter(u => u.status==='busy').length} active={selectedView==="Busy_Units"} />
        </div>
      </div>
    </>
  )
}