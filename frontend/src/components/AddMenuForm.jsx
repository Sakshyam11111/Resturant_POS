import React, { useState, useRef } from 'react';
import { Upload, Image, X } from 'lucide-react';

export default function AddMenuForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Add New Menu</h2>
          
          <div className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menu Group
                </label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all">
                  <option>Select group type</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menu Sub Group
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="Item name"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Code
                </label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all">
                  <option>Enter item code</option>
                </select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HS Code
                </label>
                <input
                  type="text"
                  placeholder="Enter HS Code e.g.121"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Print Type
                </label>
                <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all">
                  <option>Select print type</option>
                </select>
              </div>
            </div>

            {/* Row 4 - Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                placeholder="0.0"
                step="0.01"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Image Upload */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 mb-6 ${
              isDragging
                ? 'border-gray-400 bg-gray-50 scale-105'
                : 'border-gray-300 bg-gray-100'
            } ${uploadedImage ? 'p-0' : 'p-8'}`}
          >
            {uploadedImage ? (
              <div className="relative group">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-56 object-cover rounded-2xl"
                />
                <button
                  onClick={handleRemove}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-2xl" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gray-200 rounded-full blur-xl opacity-50" />
                  <div className="relative bg-white rounded-full p-5 shadow-md">
                    <Image className="w-10 h-10 text-gray-400" strokeWidth={1.5} />
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm">
                  Drop image here
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </button>

          <p className="text-center text-xs text-gray-400 mt-3">
            Max file size: 5MB (JPG, PNG, GIF)
          </p>
        </div>
      </div>
    </div>
  );
}