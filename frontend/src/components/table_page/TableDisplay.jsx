import React from 'react'
import TableCircle from './TableCircle'

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 ${color} rounded-full`} />
    <span className="text-gray-700 text-xs md:text-sm">{label}</span>
  </div>
)

const TableDisplay = ({ 
  tables, 
  selectedFloor, 
  setSelectedFloor, 
  navigate, 
  onAssignWaiter, 
  waiters, 
  isMobile 
}) => {
  const getGridCols = () => {
    if (isMobile) return 'grid-cols-2'
    return 'grid-cols-5'
  }

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Tables – {selectedFloor}</h1>
        <div className="flex gap-2">
          {['First Floor', 'Second Floor'].map(floor => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm font-medium transition ${selectedFloor === floor
                  ? 'bg-[#3673B4] text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
                }`}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8 text-xs font-medium mb-6">
        <LegendItem color="bg-[#3673B4]" label="Available" />
        <LegendItem color="bg-[#1ABB83]" label="Reserved" />
        <LegendItem color="bg-[#FF6366]" label="On Dine" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 md:px-8 pb-10 overflow-auto">
        <div className={`grid ${getGridCols()} gap-4 md:gap-10 max-w-6xl w-full`}>
          {tables.map(table => (
            <TableCircle
              key={table.id}
              table={table}
              navigate={navigate}
              onAssignWaiter={onAssignWaiter}
              allTables={tables}
              waiters={waiters}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TableDisplay