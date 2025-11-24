// src/components/TableManagement.jsx
import React, { useState, useEffect, useRef } from 'react'
import { 
  Home, 
  ShoppingCart, 
  Calendar, 
  Clock, 
  Users, 
  Settings, 
  LogOut
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import OrderSidebar from './OrderSidebar'
import ReservationForm from './ReservationForm'

const API_URL = 'http://localhost:5000/api'

const TableManagement = () => {
  const [activeTab, setActiveTab] = useState('All')
  const [selectedFloor, setSelectedFloor] = useState('First Floor')
  
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [showTakeawayForm, setShowTakeawayForm] = useState(false)
  const [reservationStep, setReservationStep] = useState(1)
  
  const navigate = useNavigate()

  const [activityData, setActivityData] = useState([])
  const hasFetched = useRef(false) // Prevents double fetch in StrictMode

  const [tables, setTables] = useState([
    { no: 1, status: 'available', seats: 4 },
    { no: 2, status: 'available', seats: 6 },
    { no: 3, status: 'available', seats: 4 },
    { no: 4, status: 'available', seats: 4 },
    { no: 5, status: 'available', seats: 8 },
    { no: 6, status: 'available', seats: 4 },
    { no: 7, status: 'available', seats: 6 },
    { no: 8, status: 'available', seats: 4 },
    { no: 9, status: 'available', seats: 10 },
    { no: 10, status: 'available', seats: 4 },
    { no: 11, status: 'available', seats: 6 },
    { no: 12, status: 'available', seats: 2 },
    { no: 13, status: 'available', seats: 4 },
    { no: 14, status: 'available', seats: 6 },
    { no: 15, status: 'available', seats: 8 },
  ])

  // Fetch reservations only once (even in StrictMode)
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchReservations = async () => {
      try {
        const response = await fetch(`${API_URL}/reservations`)
        if (!response.ok) throw new Error('Failed to fetch reservations')

        const result = await response.json()
        console.log('API Response:', result) // You can remove this later

        // Handle all possible response formats
        let reservations = []
        if (Array.isArray(result)) {
          reservations = result
        } else if (result?.data && Array.isArray(result.data)) {
          reservations = result.data
        } else if (result?.reservations && Array.isArray(result.reservations)) {
          reservations = result.reservations
        }

        const today = new Date().toISOString().split('T')[0]

        const relevantReservations = reservations.filter(res => {
          if (!res.date) return false
          const resDate = new Date(res.date).toISOString().split('T')[0]
          return resDate >= today
        })

        const formatTime = (time) => {
          if (!time) return ''
          const [h, m] = time.split(':')
          const hour = parseInt(h)
          const ampm = hour >= 12 ? 'PM' : 'AM'
          const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
          return `${displayHour}:${m || '00'} ${ampm}`
        }

        const items = relevantReservations.map(res => ({
          id: res._id || res.id,
          type: 'reservation',
          name: res.customerName || 'Guest',
          time: `${formatTime(res.fromTime)} – ${formatTime(res.toTime)}`,
          people: res.guests || 1,
          table: `Table #${res.tableNumber}`
        }))

        setActivityData(items)

        // Update table statuses
        const reservedTables = relevantReservations
          .map(r => parseInt(r.tableNumber))
          .filter(n => !isNaN(n))

        setTables(prev => prev.map(table => ({
          ...table,
          status: reservedTables.includes(table.no) ? 'reserved' : 'available'
        })))

      } catch (error) {
        console.error('Error fetching reservations:', error)
      }
    }

    fetchReservations()
  }, [])

  // Filter activity data based on active tab
  const filteredData = activityData.filter(item => {
    if (activeTab === 'All') return true
    return item.type === activeTab.toLowerCase()
  })

  // Handle new reservation from form
  const handleReservationSuccess = (newReservation) => {
    const formatTime = (time) => {
      const [h, m] = time.split(':')
      const hour = parseInt(h)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      return `${displayHour}:${m} ${ampm}`
    }

    const newItem = {
      id: newReservation._id || Date.now(),
      type: 'reservation',
      name: newReservation.customerName,
      time: `${formatTime(newReservation.fromTime)} – ${formatTime(newReservation.toTime)}`,
      people: newReservation.guests,
      table: `Table #${newReservation.tableNumber}`
    }

    setActivityData(prev => [newItem, ...prev])

    setTables(prev => prev.map(table => 
      table.no === parseInt(newReservation.tableNumber)
        ? { ...table, status: 'reserved' }
        : table
    ))
  }

  const isTakeawayActive = activeTab === 'Takeaway'
  const buttonText = isTakeawayActive ? 'New Takeaway Order' : 'New Reservation'
  const buttonColor = isTakeawayActive ? 'bg-[#9C27B0] hover:bg-[#7B1FA2]' : 'bg-[#3673B4] hover:bg-[#2c5d94]'

  return (
    <div className="h-screen w-screen bg-gray-50 flex overflow-hidden text-sm">
      {/* Slim Navbar */}
      <div className="w-14 bg-white shadow-md flex flex-col items-center py-6 space-y-6">
        <NavItem icon={Home} active />
        <NavItem icon={ShoppingCart} />   
        <NavItem icon={Calendar} />
        <NavItem icon={Clock} />
        <NavItem icon={Users} />
        <div className="flex-1" />
        <NavItem icon={Settings} />
        <NavItem icon={LogOut} />
      </div>

      {/* Left Sidebar */}
      <OrderSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activityData={activityData}
        filteredData={filteredData}
        isTakeawayActive={isTakeawayActive}
        buttonText={buttonText}
        buttonColor={buttonColor}
        showReservationForm={showReservationForm}
        setShowReservationForm={setShowReservationForm}
        show  showTakeawayForm={showTakeawayForm}
        setShowTakeawayForm={setShowTakeawayForm}
        reservationStep={reservationStep}
        setReservationStep={setReservationStep}
        tables={tables}
        selectedFloor={selectedFloor}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold text-gray-900">Tables – {selectedFloor}</h1>
            <div className="flex gap-2">
              {['First Floor', 'Second Floor'].map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                    selectedFloor === floor
                      ? 'bg-[#3673B4] text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  {floor}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8 text-xs font-medium mb-6">
            <LegendItem color="bg-[#3673B4]" label="Available" />
            <LegendItem color="bg-[#1ABB83]" label="Reserved" />
            <LegendItem color="bg-[#FF6366]" label="On Dine" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 pb-10">
          <div className="grid grid-cols-5 gap-10 max-w-6xl w-full">
            {tables.map((table) => (
              <TableCircle key={table.no} table={table} navigate={navigate} />
            ))}
          </div>
        </div>
      </div>

      {/* Reservation Form Modal */}
      {showReservationForm && (
        <ReservationForm
          onClose={() => {
            setShowReservationForm(false)
            setReservationStep(1)
          }}
          currentStep={reservationStep}
          setStep={setReservationStep}
          tables={tables}
          selectedFloor={selectedFloor}
          navigate={navigate}
          onReservationSubmit={handleReservationSuccess}
        />
      )}
    </div>
  )
}

// Reusable Components
const NavItem = ({ icon: Icon, active = false }) => (
  <button className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
    active ? 'bg-[#3673B4] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
  }`}>
    <Icon className="w-5 h-5" strokeWidth={2} />
  </button>
)

const TableCircle = ({ table, navigate }) => {
  const color = 
    table.status === 'available' ? 'bg-[#3673B4]' :
    table.status === 'reserved' ? 'bg-[#1ABB83]' :
    'bg-[#FF6366]'

  const label = 
    table.status === 'available' ? 'Free' :
    table.status === 'reserved' ? 'Reserved' : 'Dining'

  const handleClick = () => {
    if (table.status === 'available') {
      navigate(`/pos?table=${table.no}`)
    }
  }

  return (
    <div className="group relative" onClick={handleClick}>
      <div className={`w-24 h-24 ${color} rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-200 border-4 border-white hover:scale-110 hover:shadow-xl active:scale-95 ${
        table.status !== 'available' ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
      }`}>
        <span className="text-2xl font-bold">#{table.no}</span>
        <span className="text-[10px] mt-1 px-2 py-0.5 bg-black/30 rounded-full font-medium">
          {label}
        </span>
      </div>
      <p className="text-center mt-3 text-xs text-gray-600 font-medium">{table.seats} seats</p>
    </div>
  )
}

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-5 h-5 ${color} rounded-full`}></div>
    <span className="text-gray-700">{label}</span>
  </div>
)

export default TableManagement