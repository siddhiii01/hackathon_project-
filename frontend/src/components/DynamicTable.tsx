import React from "react"
import type { TableProps } from "../../types/emergency"

export const DynamicTable:React.FC<TableProps> = ({emergencies,units,selectedView}) => {
  if(!selectedView) return null;

  let columns:string[] = [];
  let tableData: any[] = [];

  switch (selectedView) {
    case "Pending_Emergency":
      columns = ["Id","Type","Status","Severity"];
      tableData = emergencies.filter(e => e.status==="pending");
      break;
    
    case "Resolved_Emergency":
      columns = ["Id","Type","Status","Severity"];
      tableData = emergencies.filter(e => e.status==='resolved');
      break;

    case "Active_Emergency":
      columns = ["Id","Type","Status","Severity"];
      tableData = emergencies.filter(e => e.status==='active');
      break;

    case "Available_Units":
      columns = ["Id","Type","Status"];
      tableData = units.filter(u => u.status==='available');
      break;

    case "Dispatched_Units":
      columns = ["Id","Type","Status"];
      tableData = units.filter(u => u.status==='dispatched');
      break;

    case "Busy_Units":
      columns = ["Id","Type","Status"];
      tableData = units.filter(u => u.status==='busy');
      break;

    default:
      return null
  }

  if(tableData.length == 0) {
    return (
      <div className="bg-white rounded-lg border shadow p-8 mt-6 max-w-4xl mx-auto text-center">
         <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No data available
        </h3>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow border p-4 mt-6">
      <h3 className="font-semibold mb-4 text-gray-700">
        Showing results for: {selectedView.replace("_", " ")}
      </h3>
      <table className="w-full test-sm border-collapse">
        <thead className="text-gray-700 bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-5 py-3 text-left">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map(row => (
            <tr key={row.id} className="hover:bg-gray-100 transition">
              <td className="px-5 py-3 font-medium">{row.id}</td>
              <td className="px-5 py-3">{row.type}</td>
              <td className="px-4 py-2 text-left">{row.status}</td>
              <td className="px-5 py-3">
                <span className={`rounded-full px-3 py-1 font-semibold 
                  ${row.severity>7 && "bg-red-500 text-white"}
                  ${row.severity<=7 && row.severity>=5 && "bg-yellow-400 text-black"}
                  ${row.severity<=4 && row.severity>=1 && "bg-gray-300 text-black"}
                  `}>
                  {row.severity}
                </span>
              </td>
            </tr>
          ))}
          
        </tbody>
      </table>
    </div>
  )
}