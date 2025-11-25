// src/components/TakeawayForm.jsx
import React, { useState } from 'react'
import { X, AlertCircle, Check } from 'lucide-react'

const API_URL = 'http://localhost:5000/api'

// Toast Notification Component
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

const TakeawayForm = ({ onClose, navigate, onTakeawaySubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    alternativeNumber: '',
    location: '',
    remarks: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (apiError) setApiError('')
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
    
    if (formData.alternativeNumber && !/^\+?\d{10,15}$/.test(formData.alternativeNumber.replace(/\s/g, ''))) {
      newErrors.alternativeNumber = 'Invalid phone number format'
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
    setApiError('')
    
    try {
      // Prepare data for API
      const takeawayData = {
        ...formData,
        items: [], 
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        status: 'pending',
        paymentStatus: 'unpaid'
      }

      // Send to backend
      const response = await fetch(`${API_URL}/takeaways`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(takeawayData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create takeaway order')
      }

      console.log('Takeaway order saved to database:', result.data)

      if (onTakeawaySubmit) {
        onTakeawaySubmit(result.data)
      }

      setShowSuccessToast(true)

      setTimeout(() => {
        navigate('/pos', { 
          state: { 
            takeawayData: result.data,
            orderType: 'takeaway'
          } 
        })
        onClose()
      }, 1500)

    } catch (error) {
      console.error('Error creating takeaway order:', error)
      setApiError(error.message || 'Failed to create takeaway order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
          {/* Form Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Takeaway Address</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
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
                Phone Number <span className="text-red-500">*</span>
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
                Alternative Number
              </label>
              <input
                type="tel"
                name="alternativeNumber"
                value={formData.alternativeNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9C27B0] transition-colors ${
                  errors.alternativeNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+977 - 98-xxx-xxx-xx (optional)"
              />
              {errors.alternativeNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.alternativeNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9C27B0] resize-none"
                placeholder="Enter any special instructions (optional)"
                rows="3"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.remarks.length}/500 characters
              </p>
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
                  : 'bg-[#9C27B0] text-white hover:bg-[#7B1FA2]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue to Order'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <ToastNotification 
          message="Takeaway order created successfully!" 
          onClose={() => setShowSuccessToast(false)} 
        />
      )}
    </>
  )
}

export default TakeawayForm