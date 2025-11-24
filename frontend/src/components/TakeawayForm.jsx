// src/components/TakeawayForm.jsx
import React, { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'

const TakeawayForm = ({ onClose, navigate }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    alternativeNumber: '',
    location: '',
    remarks: ''
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
              placeholder="+977 - 98-xxx-xxx-xx"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9C27B0] transition-colors ${
                errors.remarks ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter any special instructions"
              rows="3"
            />
            {errors.remarks && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.remarks}
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

export default TakeawayForm