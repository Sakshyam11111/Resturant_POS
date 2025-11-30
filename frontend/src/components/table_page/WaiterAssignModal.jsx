import React, { useState } from 'react'
import { X, User } from 'lucide-react'

const WaiterAssignModal = ({ table, waiters, onAssign, onClose, isMobile }) => {
  const [selected, setSelected] = useState(table.waiterId || '')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${isMobile ? 'max-w-sm' : 'max-w-md'} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Assign Waiter – Table #{table.no}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {waiters.map(waiter => (
            <label
              key={waiter.id}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition"
            >
              <input
                type="radio"
                name="waiter"
                value={waiter.id}
                checked={selected === waiter.id}
                onChange={e => setSelected(e.target.value)}
                className="w-4 h-4 text-[#3673B4]"
              />
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                {waiter.name}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onAssign(table.id, selected)}
            disabled={!selected}
            className="px-4 py-2 bg-[#3673B4] text-white rounded-lg hover:bg-[#2c5d94] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  )
}

export default WaiterAssignModal