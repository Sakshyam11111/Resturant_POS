import React from 'react'
import { User } from 'lucide-react'

const TableCircle = ({ table, navigate, onAssignWaiter, allTables, waiters, isMobile }) => {
  const color =
    table.status === 'available' ? 'bg-[#3673B4]' :
      table.status === 'reserved' ? 'bg-[#1ABB83]' :
        'bg-[#FF6366]'

  const label =
    table.status === 'available' ? 'Free' :
      table.status === 'reserved' ? 'Reserved' : 'Dining'

  const handleClick = () => {
    navigate(`/pos?table=${table.no}`, { state: { tableData: table, waiters, allTables } })
  }

  const handleAssign = e => {
    e.stopPropagation()
    onAssignWaiter(table.id)
  }

  const tableSize = isMobile ? 'w-24 h-24' : 'w-32 h-32'
  const fontSize = isMobile ? 'text-2xl' : 'text-3xl'

  return (
    <div className="group relative">
      <div
        className={`
          ${tableSize} ${color} rounded-full flex flex-col items-center justify-center
          text-white shadow-lg transition-all border-6 border-white
          hover:scale-110 hover:shadow-xl active:scale-95 cursor-pointer
        `}
        onClick={handleClick}
      >
        <span className={`${fontSize} font-bold`}>#{table.no}</span>
        <span className="text-xs mt-1 px-2 py-0.5 bg-black/30 rounded-full font-medium">
          {label}
        </span>
      </div>

      <p className="text-center mt-2 md:mt-4 text-xs md:text-sm text-gray-600 font-medium">{table.seats} seats</p>

      <button
        onClick={handleAssign}
        className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition"
        title="Change Waiter"
      >
        <User className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  )
}

export default TableCircle