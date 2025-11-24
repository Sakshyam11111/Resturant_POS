// src/components/OrderSidebar.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  Users, 
  Search,
  Plus,
  Package as PackageIcon
} from 'lucide-react'
import ReservationForm from './ReservationForm'
import TakeawayForm from './TakeawayForm'

const OrderSidebar = ({ 
  activeTab, 
  setActiveTab, 
  activityData, 
  filteredData,
  isTakeawayActive,
  buttonText,
  buttonColor,
  showReservationForm,
  setShowReservationForm,
  showTakeawayForm,
  setShowTakeawayForm,
  reservationStep,
  setReservationStep,
  tables,
  selectedFloor
}) => {
  const navigate = useNavigate()

  const handleNewReservation = () => {
    setShowReservationForm(true)
    setReservationStep(1)
  }

  const handleNewTakeaway = () => {
    setShowTakeawayForm(true)
  }

  return (
    <div className="w-96 bg-white shadow-xl flex flex-col">
      <div className="p-5 space-y-4 flex-1 overflow-y-auto">
        <div className="flex gap-2 flex-wrap">
          {['All', 'Reservation', 'Dine', 'Takeaway'].map((tab) => {
            const count = activityData.filter(i => tab === 'All' || i.type === tab.toLowerCase()).length
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === tab
                    ? 'bg-[#3673B4] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab} ({count})
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">Wed, 12 Nov 2025</span>
          <Calendar className="w-4 h-4 text-[#3673B4]" />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, customers..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4]"
          />
        </div>

        <div className="space-y-2.5">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className={`
                rounded-lg p-3 shadow-sm border-l-4 flex items-center justify-between text-xs cursor-pointer transition hover:shadow-md
                ${item.type === 'dine' ? 'bg-[#FF6366]/5 border-[#FF6366]' : ''}
                ${item.type === 'reservation' ? 'bg-[#1ABB83]/5 border-[#1ABB83]' : ''}
                ${item.type === 'takeaway' ? 'bg-[#9C27B0]/5 border-[#9C27B0]' : ''}
              `}
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {item.type === 'dine' && item.table}
                  {item.type === 'reservation' && item.name}
                  {item.type === 'takeaway' && (
                    <span className="flex items-center gap-2">
                      <PackageIcon className="w-4 h-4" />
                      {item.orderId}
                    </span>
                  )}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {item.type === 'takeaway' ? (
                    <>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {item.time}
                      </span>
                      <span className="block mt-0.5 truncate">{item.items}</span>
                      <span className="text-gray-400">— {item.customer}</span>
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      {item.time}
                      {item.people && (
                        <>
                          <span className="mx-1">•</span>
                          <Users className="w-3.5 h-3.5" />
                          {item.people} people
                        </>
                      )}
                    </span>
                  )}
                </p>
              </div>

              <span
                className={`
                  px-2.5 py-1 rounded-full text-xs font-bold text-white
                  ${item.type === 'dine' ? 'bg-[#FF6366]' : ''}
                  ${item.type === 'reservation' ? 'bg-[#1ABB83]' : ''}
                  ${item.type === 'takeaway' ? 'bg-[#9C27B0]' : ''}
                `}
              >
                {item.type === 'dine' ? 'Dine' : item.type === 'reservation' ? 'Res' : 'Takeaway'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 border-t">
        <button 
          className={`w-full ${buttonColor} text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow transition`}
          onClick={() => {
            if (isTakeawayActive) {
              handleNewTakeaway()
            } else {
              handleNewReservation()
            }
          }}
        >
          <Plus className="w-5 h-5" />
          {buttonText}
        </button>
      </div>

      {/* Reservation Form Modal */}
      {showReservationForm && (
        <ReservationForm 
          onClose={() => setShowReservationForm(false)}
          currentStep={reservationStep}
          setStep={setReservationStep}
          tables={tables}
          selectedFloor={selectedFloor}
          navigate={navigate}
        />
      )}

      {/* Takeaway Form Modal */}
      {showTakeawayForm && (
        <TakeawayForm 
          onClose={() => setShowTakeawayForm(false)}
          navigate={navigate}
        />
      )}
    </div>
  )
}

export default OrderSidebar