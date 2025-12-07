// src/components/ReservationForm.jsx
import React, { useState, useEffect } from 'react'
import { X, Check, AlertCircle } from 'lucide-react'

const API_URL = 'http://localhost:5000/api'

// Custom Alert Component - positioned in bottom right
const CustomAlert = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <p className="text-gray-800 font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// Alternative simpler toast notification
const ToastNotification = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl p-4 flex items-center space-x-3 border border-gray-100">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-gray-800 font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ReservationForm = ({ 
  onClose, 
  currentStep, 
  setStep, 
  tables, 
  selectedFloor, 
  navigate,
  onReservationSubmit
}) => {
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
  const [apiError, setApiError] = useState('')
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

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
    if (apiError) setApiError('')
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
    setApiError('')
    
    try {
      // Prepare data for API
      const reservationData = {
        ...formData,
        guests: parseInt(formData.guests),
        advanceAmount: parseFloat(formData.advanceAmount) || 0
      }

      // Send to backend
      const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create reservation')
      }

      console.log('Reservation saved to database:', result.data)

      // Call the callback function with the result
      if (onReservationSubmit) {
        onReservationSubmit(result.data)
      }

      // Navigate to payment page if advance amount is set
      if (parseFloat(formData.advanceAmount) > 0) {
        navigate('/esewa', { 
          state: { 
            amount: formData.advanceAmount,
            reservationId: result.data._id 
          } 
        })
      } else {
        // If no payment, show success alert
        setShowSuccessAlert(true)
        
        // Auto-close after 3 seconds and navigate
        setTimeout(() => {
          setShowSuccessAlert(false)
          onClose()
          navigate('/table')
        }, 3000)
      }
      
    } catch (error) {
      console.error('Error creating reservation:', error)
      setApiError(error.message || 'Failed to create reservation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccessAlertClose = () => {
    setShowSuccessAlert(false)
    onClose()
    navigate('/table')
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <>
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

          {apiError && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          )}

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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                    <input
                      type="number"
                      name="advanceAmount"
                      value={formData.advanceAmount}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className={`w-full pl-12 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3673B4] transition-colors ${
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
                    maxLength={500}
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
                    Saving...
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

      {/* Custom Success Alert - positioned in bottom right */}
      {showSuccessAlert && (
        <ToastNotification 
          message="Reservation created successfully!" 
          onClose={handleSuccessAlertClose} 
        />
      )}
    </>
  )
}

export default ReservationForm