// src/components/TableManagement.jsx
import React, { useState, useEffect } from 'react'
import { 
  Home, 
  ShoppingCart, 
  Calendar, 
  Clock, 
  Users, 
  Settings, 
  LogOut,
  Search,
  Plus,
  Package as PackageIcon,
  X,
  Check,
  AlertCircle
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const TableManagement = () => {
  const [activeTab, setActiveTab] = useState('All')
  const [selectedFloor, setSelectedFloor] = useState('First Floor')
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [showTakeawayForm, setShowTakeawayForm] = useState(false)
  const [reservationStep, setReservationStep] = useState(1)
  
  const navigate = useNavigate()

  const activityData = [
    // Dine
    { id: 1, type: 'dine', table: 'Table #3', time: '09:30 – 10:30 AM', people: 4 },

    // Reservations
    { id: 2, type: 'reservation', name: 'Sakshyam Shrestha', time: '10:00 AM', people: 6 },
    { id: 3, type: 'reservation', name: 'Ali Khan', time: '12:30 PM', people: 8 },

    // Takeaway
    { id: 4, type: 'takeaway', orderId: '#TAK-127', time: 'Ready by 11:45 AM', items: 'Butter Chicken, Naan x4', customer: 'Rahul M.' },
    { id: 5, type: 'takeaway', orderId: '#TAK-128', time: 'Ready by 12:10 PM', items: 'Veg Biryani, Raita', customer: 'Anita K.' },
  ]

  const filteredData = activityData.filter(item => {
    if (activeTab === 'All') return true
    return item.type === activeTab.toLowerCase()
  })

  const tables = [
    { no: 1, status: 'available', seats: 4 },
    { no: 2, status: 'reserved', seats: 6 },
    { no: 3, status: 'on-dine', seats: 4, timeLeft: '42 min' },
    { no: 4, status: 'available', seats: 4 },
    { no: 5, status: 'on-dine', seats: 8, timeLeft: '18 min' },
    { no: 6, status: 'available', seats: 4 },
    { no: 7, status: 'available', seats: 6 },
    { no: 8, status: 'on-dine', seats: 4, timeLeft: '25 min' },
    { no: 9, status: 'reserved', seats: 10 },
    { no: 10, status: 'available', seats: 4 },
    { no: 11, status: 'reserved', seats: 6 },
    { no: 12, status: 'available', seats: 2 },
    { no: 13, status: 'on-dine', seats: 4, timeLeft: '8 min' },
    { no: 14, status: 'available', seats: 6 },
    { no: 15, status: 'available', seats: 8 },
  ]

  // Determine button text and styling based on active tab
  const isTakeawayActive = activeTab === 'Takeaway'
  const buttonText = isTakeawayActive ? 'New Takeaway Order' : 'New Reservation'
  const buttonColor = isTakeawayActive ? 'bg-[#9C27B0] hover:bg-[#7B1FA2]' : 'bg-[#3673B4] hover:bg-[#2c5d94]'

  const handleNewReservation = () => {
    setShowReservationForm(true)
    setReservationStep(1)
  }

  const handleNewTakeaway = () => {
    setShowTakeawayForm(true)
  }

  return (
    <div className="h-screen w-screen bg-gray-50 flex overflow-hidden text-sm">
      {/* Slim Navbar - Now using only lucide-react */}
      <div className="w-14 bg-white shadow-md flex flex-col items-center py-6 space-y-6">
        <NavItem icon={Home} active />
        <NavItem icon={ShoppingCart} />   
        <NavItem icon={Calendar} />
        <NavItem icon={Clock} />
        <NavItem icon={Users} />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Items */}
        <NavItem icon={Settings} />
        <NavItem icon={LogOut} />
      </div>

      {/* Left Sidebar */}
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
      </div>

      {/* Main Table View */}
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

// Dynamic Reservation Form Component
const ReservationForm = ({ onClose, currentStep, setStep, tables, selectedFloor, navigate }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    customerName: '',
    phoneNumber: '',
    email: '',
    companyName: '',
    
    // Booking Details
    date: new Date().toISOString().split('T')[0],
    fromTime: '09:30',
    toTime: '10:30',
    tableNumber: '',
    floor: selectedFloor === 'First Floor' ? 'first' : 'second',
    guests: '',
    
    // Payment & Additional Details
    advanceAmount: '0',
    paymentMode: '',
    refer: '',
    note: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableTables, setAvailableTables] = useState([])

  // Payment modes
  const paymentModes = [
    { value: 'esewa', label: 'eSewa', icon: '💳' },
    { value: 'khalti', label: 'Khalti', icon: '📱' },
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'card', label: 'Card', icon: '💳' },
    { value: 'bank', label: 'Bank Transfer', icon: '🏦' }
  ]

  // Time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00'
  ]

  // Update available tables based on selected floor and guest count
  useEffect(() => {
    const filteredTables = tables.filter(table => {
      const isAvailable = table.status === 'available'
      const hasEnoughSeats = table.seats >= (parseInt(formData.guests) || 1)
      return isAvailable && hasEnoughSeats
    })
    setAvailableTables(filteredTables)
  }, [formData.floor, formData.guests, tables])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required'
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required'
      else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
        newErrors.phoneNumber = 'Invalid phone number format'
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format'
      }
    }

    if (step === 2) {
      if (!formData.date) newErrors.date = 'Date is required'
      if (!formData.fromTime) newErrors.fromTime = 'Start time is required'
      if (!formData.toTime) newErrors.toTime = 'End time is required'
      if (formData.fromTime >= formData.toTime) newErrors.toTime = 'End time must be after start time'
      if (!formData.guests || formData.guests < 1) newErrors.guests = 'Number of guests is required'
      if (!formData.tableNumber) newErrors.tableNumber = 'Table selection is required'
    }

    if (step === 3) {
      if (formData.advanceAmount && parseFloat(formData.advanceAmount) < 0) {
        newErrors.advanceAmount = 'Amount cannot be negative'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Reservation submitted:', formData)

    // Always navigate to /esewa after form submission and then close the form
    navigate('/esewa', { state: { amount: formData.advanceAmount } })
    onClose()
    
    setIsSubmitting(false)
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {currentStep === 1 && 'Basic Information'}
            {currentStep === 2 && 'Booking Details'}
            {currentStep === 3 && 'Payment & Additional Details'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex px-6 pt-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                step < currentStep ? 'bg-green-500 text-white' :
                step === currentStep ? 'bg-[#3673B4] text-white' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </div>
              {step < 3 && (
                <div className={`h-1 flex-1 mx-2 transition-all ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] transition-colors ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] transition-colors ${
                    errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+977 - 9876543210"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="customer@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4]"
                  placeholder="Enter company name (optional)"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] transition-colors ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.date}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="fromTime"
                    value={formData.fromTime}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] transition-colors ${
                      errors.fromTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{formatTime(time)}</option>
                    ))}
                  </select>
                  {errors.fromTime && <p className="text-red-500 text-xs mt-1">{errors.fromTime}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="toTime"
                    value={formData.toTime}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] transition-colors ${
                      errors.toTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {timeSlots.map(time => (
                      <option key={time} value={time} disabled={time <= formData.fromTime}>
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                  {errors.toTime && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.toTime}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Guests <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] transition-colors ${
                    errors.guests ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter number of guests"
                />
                {errors.guests && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.guests}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <select
                    name="floor"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4]"
                  >
                    <option value="first">First Floor</option>
                    <option value="second">Second Floor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tableNumber"
                    value={formData.tableNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] transition-colors ${
                      errors.tableNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={availableTables.length === 0}
                  >
                    <option value="">Select table</option>
                    {availableTables.map(table => (
                      <option key={table.no} value={table.no}>
                        Table {table.no} ({table.seats} seats)
                      </option>
                    ))}
                  </select>
                  {errors.tableNumber && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.tableNumber}
                    </p>
                  )}
                  {availableTables.length === 0 && formData.guests && (
                    <p className="text-amber-500 text-xs mt-1">
                      No available tables for {formData.guests} guests
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="advanceAmount"
                    value={formData.advanceAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] transition-colors ${
                      errors.advanceAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.advanceAmount && <p className="text-red-500 text-xs mt-1">{errors.advanceAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentModes.map(mode => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMode: mode.value }))}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 justify-center ${
                        formData.paymentMode === mode.value
                          ? 'border-[#3673B4] bg-[#3673B4]/10 text-[#3673B4]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg">{mode.icon}</span>
                      <span className="text-sm font-medium">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Refer</label>
                <input
                  type="text"
                  name="refer"
                  value={formData.refer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4]"
                  placeholder="Enter refer person name (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] resize-none"
                  placeholder="Add any special requests or occasion details..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.note.length}/500 characters
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <div className="flex gap-2">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isSubmitting}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className={`px-6 py-2 font-medium rounded-lg transition-all flex items-center gap-2 ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-[#3673B4] text-white hover:bg-[#2c5d94]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {currentStep === 3 ? 'Submit' : 'Next'}
                  {currentStep < 3 && <span>→</span>}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// New Takeaway Form Component
const TakeawayForm = ({ onClose, navigate }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    location: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required'
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Invalid phone number format'
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Takeaway order submitted:', formData)
    
    navigate('/', { state: { customerDetails: formData } })
    onClose()
    
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Form Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Takeaway Address</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9C27B0] transition-colors ${
                errors.customerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter customer name"
            />
            {errors.customerName && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.customerName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9C27B0] transition-colors ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+977 - 98-xxx-xxx-xx"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.phoneNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9C27B0] transition-colors ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter delivery location"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.location}
              </p>
            )}
          </div>
        </div>

        {/* Form Footer */}
        <div className="flex justify-between p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 font-medium rounded-lg transition-all flex items-center gap-2 ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Reusable Nav Item
const NavItem = ({ icon: Icon, active = false }) => (
  <button
    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
      active 
        ? 'bg-[#3673B4] text-white shadow-lg' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
    }`}
  >
    <Icon className="w-5 h-5" strokeWidth={2} />
  </button>
)

// Table Circle Component
const TableCircle = ({ table, navigate }) => {
  const color = 
    table.status === 'available' ? 'bg-[#3673B4]' :
    table.status === 'reserved' ? 'bg-[#1ABB83]' :
    'bg-[#FF6366]'

  const label = 
    table.status === 'available' ? 'Free' :
    table.status === 'reserved' ? 'Reserved' : 'Dining'

  const handleClick = () => {
    navigate(`/pos?table=${table.no}`)
  }

  return (
    <div className="group relative" onClick={handleClick}>
      <div
        className={`w-24 h-24 ${color} rounded-full flex flex-col items-center justify-center text-white shadow-lg cursor-pointer transition-all duration-200 border-4 border-white
          hover:scale-110 hover:shadow-xl active:scale-95 group-hover:z-10`}
      >
        <span className="text-2xl font-bold">#{table.no}</span>
        <span className="text-[10px] mt-1 px-2 py-0.5 bg-black/30 rounded-full font-medium">
          {label}
        </span>
        {table.timeLeft && (
          <div className="absolute -top-2 -right-1 bg-black/90 text-white text-[9px] px-2 py-0.5 rounded-full animate-pulse font-bold">
            {table.timeLeft}
          </div>
        )}
      </div>
      <p className="text-center mt-3 text-xs text-gray-600 font-medium">{table.seats} seats</p>
    </div>
  )
}

// Legend Item
const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-5 h-5 ${color} rounded-full`}></div>
    <span className="text-gray-700">{label}</span>
  </div>
)

export default TableManagement

// Add this to your CSS or style tag
const style = document.createElement('style')
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
`
document.head.appendChild(style)