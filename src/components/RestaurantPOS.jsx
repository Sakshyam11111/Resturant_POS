'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, Home, Book, Clock, User, Settings, LogOut, Search, X, ChevronDown, 
  Minus, Plus, Trash2, Phone, UserIcon, CreditCard, DollarSign, Printer,
  Utensils, Cake, Wine, Cigarette, Calendar as CalendarIcon, Menu as MenuIcon
} from 'lucide-react';

// === FULL MENU DATA ===
const allMenuItems = [
  { id: 1, name: 'Chicken Mo:Mo', price: 200, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop', category: 'Momo' },
  { id: 2, name: 'Buff Chowmein', price: 180, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop', category: 'Chowmin' },
  { id: 3, name: 'Veg Fried Rice', price: 180, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', category: 'Rice' },
  { id: 4, name: 'Paneer Chilly', price: 250, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', category: 'Starters' },
  { id: 5, name: 'Chicken Wings', price: 280, image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop', category: 'Starters' },
  { id: 6, name: 'Veg Mo:Mo', price: 120, image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop', category: 'Momo' },
  { id: 7, name: 'Club Sandwich', price: 200, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop', category: 'Sandwich' },
  { id: 8, name: 'Buff Sekuwa', price: 200, image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=300&fit=crop', category: 'Thakali Set' },
  { id: 9, name: 'Aloo Tama Set', price: 200, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop', category: 'Newari Khaja Set' },
  { id: 10, name: 'Chocolate Cake', price: 350, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop', category: 'Desserts' },
  { id: 11, name: 'Vanilla Ice Cream', price: 150, image: 'https://imgs.search.brave.com/P6DpiGzx9SZDj0bu9cpGrQyZlUzG-u0G0d6EwWT_NZ0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTIv/NTM0LzUyNC9zbWFs/bC92YW5pbGxhLWlj/ZS1jcmVhbS1zY29v/cC1pc29sYXRlZC1v/bi13aGl0ZS1iYWNr/Z3JvdW5kLWlsbHVz/dHJhdGlvbi1waG90/by5qcGVn', category: 'Desserts' },
  { id: 12, name: 'Gulab Jamun', price: 120, image: 'https://i.pinimg.com/736x/2c/b8/5f/2cb85f9158b5aa91aadd4b98ba826fa0.jpg', category: 'Desserts' },
  { id: 13, name: 'Cappuccino', price: 180, image: 'https://i.pinimg.com/736x/f8/56/1e/f8561ea80e14bd1989b4fe87736e1468.jpg', category: 'Drinks' },
  { id: 14, name: 'Masala Tea', price: 80, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=300&fit=crop', category: 'Drinks' },
  { id: 15, name: 'Coca Cola', price: 60, image: 'https://i.pinimg.com/1200x/40/ca/cc/40caccf6b34f25a3c6ba489217bb49c3.jpg', category: 'Drinks' },
  { id: 16, name: 'Virgin Mojito', price: 220, image: 'https://i.pinimg.com/736x/73/58/ee/7358eeff45e0b81521ea23b0b84c4f23.jpg', category: 'Drinks' },
  { id: 17, name: 'Classic Hookah', price: 800, image: 'https://i.pinimg.com/1200x/06/1f/2d/061f2d302f7ce44d805f8f2adcbb0254.jpg', category: 'Smoking' },
  { id: 18, name: 'Mint Hookah', price: 850, image: 'https://i.pinimg.com/1200x/3d/58/2d/3d582d194dfa7b99d0c3d47cdbf8bb4a.jpg', category: 'Smoking' },
  { id: 19, name: 'Cigar (Cuban)', price: 1200, image: 'https://i.pinimg.com/736x/e5/31/95/e53195f257ed32cca4d17568254a0497.jpg', category: 'Smoking' },
];

const sectionCategories = {
  'dine-in': ['All Menu', 'Momo', 'Chowmin', 'Rice', 'Starters', 'Sandwich', 'Thakali Set', 'Newari Khaja Set'],
  'desserts': ['Desserts'],
  'drinks': ['Drinks'],
  'smoking': ['Smoking'],
  'reservations': []
};

const PRIMARY_BLUE = '#3673B4';

export default function RestaurantPOS() {
  const [activeSection, setActiveSection] = useState('dine-in');
  const [activeCategory, setActiveCategory] = useState('All Menu');
  const [orderType, setOrderType] = useState('dine-in');
  const [orderItems, setOrderItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [table, setTable] = useState('B6');
  const [discount, setDiscount] = useState(0);

  // Mobile sidebar toggles
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  // Modals
  const [showTakeaway, setShowTakeaway] = useState(false);
  const [showQuickBill, setShowQuickBill] = useState(false);
  const [showReservation, setShowReservation] = useState(false);

  // Takeaway
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Quick Bill
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');

  // Reservation
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resDate, setResDate] = useState('');
  const [resTime, setResTime] = useState('');
  const [resGuests, setResGuests] = useState('2');

  const filteredItems = useMemo(() => {
    return allMenuItems.filter(item => {
      const inSection = activeSection === 'dine-in' || 
        (activeSection === 'desserts' && item.category === 'Desserts') ||
        (activeSection === 'drinks' && item.category === 'Drinks') ||
        (activeSection === 'smoking' && item.category === 'Smoking');
      
      const matchesCategory = activeCategory === 'All Menu' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return inSection && matchesCategory && matchesSearch;
    });
  }, [activeSection, activeCategory, searchQuery]);

  const addToOrder = (item) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setOrderItems(prev => {
      return prev
        .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
        .filter(i => i.quantity > 0);
    });
  };

  const removeItem = (id) => {
    setOrderItems(prev => prev.filter(i => i.id !== id));
  };

  const clearOrder = () => {
    setOrderItems([]);
    setDiscount(0);
    setCustomerName('');
    setCustomerPhone('');
    setCashAmount('');
    setCardAmount('');
  };

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax - discount;
  const paidAmount = Number(cashAmount || 0) + Number(cardAmount || 0);
  const change = paidAmount > total ? paidAmount - total : 0;

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setActiveCategory('All Menu');
    setSearchQuery('');
    setShowTakeaway(false);
    setShowQuickBill(false);
    setShowReservation(section === 'reservations');
    setShowLeftSidebar(false);
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50 md:flex-row">
        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-40">
          {[
            { section: 'dine-in', icon: Utensils },
            { section: 'desserts', icon: Cake },
            { section: 'drinks', icon: Wine },
            { section: 'smoking', icon: Cigarette },
            { section: 'reservations', icon: CalendarIcon },
          ].map(({ section, icon: Icon }) => (
            <button
              key={section}
              onClick={() => handleSectionClick(section)}
              className={`flex-1 py-3 flex flex-col items-center gap-1 ${
                activeSection === section ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs capitalize">{section.split('-').join(' ')}</span>
            </button>
          ))}
        </div>

        {/* Left Sidebar - Hidden on mobile unless toggled */}
        <div className={`fixed inset-y-0 left-0 z-50 w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 space-y-8 transition-transform md:relative md:translate-x-0 ${
          showLeftSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <Home className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
          <ShoppingCart className="w-6 h-6 text-blue-600" />
          <Book className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
          <Clock className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
          <User className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
          <div className="flex-1" />
          <Settings className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" />
          <LogOut className="w-6 h-6 text-gray-600 cursor-pointer hover:text-red-600 transition-colors" />
        </div>

        {/* Overlay for mobile sidebars */}
        {(showLeftSidebar || showRightSidebar) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => {
              setShowLeftSidebar(false);
              setShowRightSidebar(false);
            }}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col pb-16 md:pb-0">
          {/* Top Navbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                className="md:hidden"
              >
                <MenuIcon className="w-6 h-6 text-gray-700" />
              </button>

              {/* Desktop Top Icons */}
              <div className="hidden md:flex items-center space-x-6">
                {[
                  { section: 'dine-in', icon: Utensils },
                  { section: 'desserts', icon: Cake },
                  { section: 'drinks', icon: Wine },
                  { section: 'smoking', icon: Cigarette },
                  { section: 'reservations', icon: CalendarIcon },
                ].map(({ section, icon: Icon }) => (
                  <div
                    key={section}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => handleSectionClick(section)}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
                      activeSection === section ? 'bg-blue-50' : 'bg-transparent'
                    }`}>
                      <Icon className="w-6 h-6" style={{ color: activeSection === section ? PRIMARY_BLUE : '#6B7280' }} />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowRightSidebar(!showRightSidebar)}
                className="md:hidden"
              >
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </button>
              <X className="hidden md:block w-6 h-6 text-gray-600 cursor-pointer hover:text-red-600 transition-colors" />
            </div>
          </div>

          {/* Category Tabs and Search */}
          {activeSection !== 'reservations' && (
            <div className="bg-white px-4 py-3 border-b border-gray-200 md:px-6 md:py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                  {sectionCategories[activeSection].map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                        activeCategory === category
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            {activeSection === 'reservations' ? (
              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Table Reservation</h2>
                <div className="space-y-4">
                  <input type="text" placeholder="Name" value={resName} onChange={e => setResName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base" />
                  <input type="tel" placeholder="Phone" value={resPhone} onChange={e => setResPhone(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base" />
                  <input type="date" value={resDate} onChange={e => setResDate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base" />
                  <input type="time" value={resTime} onChange={e => setResTime(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base" />
                  <select value={resGuests} onChange={e => setResGuests(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base">
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Guests</option>)}
                  </select>
                  <button style={{ backgroundColor: PRIMARY_BLUE }} className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm md:text-base">
                    Confirm Reservation
                  </button>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-30" />
                <p className="text-base md:text-lg">No items found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
                {filteredItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => addToOrder(item)}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="font-semibold text-gray-900 truncate text-sm md:text-base">{item.name}</h3>
                      <p className="text-base md:text-lg font-bold text-blue-600 mt-1">Rs. {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Order Details */}
        <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-gray-200 flex flex-col transition-transform md:relative md:translate-x-0 md:w-96 ${
          showRightSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-4 md:p-6 space-y-4 md:space-y-6 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Order Details</h2>
              <button onClick={() => setShowRightSidebar(false)} className="md:hidden">
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Order Type Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setOrderType('dine-in'); setShowTakeaway(false); setShowQuickBill(false); }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  orderType === 'dine-in' && !showTakeaway && !showQuickBill
                    ? 'bg-white border-2 border-blue-500 text-blue-600 shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Dine in
              </button>
              <button
                onClick={() => { setOrderType('takeaway'); setShowTakeaway(true); setShowQuickBill(false); }}
                className={`flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  showTakeaway ? 'bg-white border-2 border-blue-500 text-blue-600 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Takeaway
              </button>
              <button
                onClick={() => { setShowQuickBill(true); setShowTakeaway(false); }}
                style={{ backgroundColor: PRIMARY_BLUE }}
                className="flex-1 py-2 px-3 rounded-lg text-xs md:text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                Quick Bill
              </button>
            </div>

            {/* Order ID & Table */}
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID</span>
                <span className="font-bold text-gray-900">PR3004</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Table</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900">{table}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-900 text-sm md:text-base">Order Items</h3>
                {orderItems.length > 0 && (
                  <button onClick={clearOrder} className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {orderItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-xs md:text-sm">No items added</p>
                  </div>
                ) : (
                  orderItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-xs md:text-sm">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }} className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                          <Minus className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                        </button>
                        <span className="w-6 md:w-8 text-center font-semibold">{item.quantity}</span>
                        <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }} className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center hover:opacity-80" style={{ backgroundColor: '#E6F0FA' }}>
                          <Plus className="w-3 h-3 md:w-4 md:h-4" style={{ color: PRIMARY_BLUE }} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} className="ml-1 md:ml-2 text-red-500 hover:text-red-700">
                          <X className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                      </div>
                      <div className="ml-2 md:ml-3 text-right">
                        <p className="font-medium text-gray-900">Rs. {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Summary */}
            {orderItems.length > 0 && !showTakeaway && !showQuickBill && (
              <div className="p-4 md:p-6 border-t border-gray-200 space-y-3 md:space-y-4 bg-gray-50 text-xs md:text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal :</span>
                    <span className="font-medium text-gray-900">Rs {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (13%) :</span>
                    <span className="font-medium text-gray-900">Rs {tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-gray-900">Rs {discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-lg md:text-xl font-bold" style={{ color: PRIMARY_BLUE }}>Rs {total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-2 md:gap-3">
                  <button style={{ backgroundColor: PRIMARY_BLUE }} className="flex-1 py-2.5 md:py-3 rounded-lg text-white font-semibold hover:opacity-90 text-xs md:text-sm">
                    Send to Kitchen
                  </button>
                  <button onClick={clearOrder} className="flex-1 py-2.5 md:py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 text-xs md:text-sm">
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TAKEAWAY MODAL */}
      {showTakeaway && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Takeaway Order</h2>
              <button onClick={() => setShowTakeaway(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (13%)</span>
                  <span className="font-medium">Rs {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span style={{ color: PRIMARY_BLUE }}>Rs {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  style={{ backgroundColor: PRIMARY_BLUE }}
                  className="flex-1 py-3 rounded-lg text-white font-semibold hover:opacity-90 flex items-center justify-center gap-2 text-sm"
                >
                  <Printer className="w-5 h-5" />
                  Print & Send
                </button>
                <button
                  onClick={() => setShowTakeaway(false)}
                  className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK BILL MODAL */}
      {showQuickBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Quick Bill</h2>
              <button onClick={() => setShowQuickBill(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl md:text-3xl font-bold" style={{ color: PRIMARY_BLUE }}>
                  Rs {total.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Amount</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cash</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={cardAmount}
                      onChange={(e) => setCardAmount(e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                {paidAmount > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Change</p>
                    <p className="text-xl md:text-2xl font-bold text-green-600">Rs {change.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  style={{ backgroundColor: PRIMARY_BLUE }}
                  className="flex-1 py-3 rounded-lg text-white font-semibold hover:opacity-90 flex items-center justify-center gap-2 text-sm"
                  disabled={paidAmount < total}
                >
                  <Printer className="w-5 h-5" />
                  Print Bill
                </button>
                <button
                  onClick={() => { setShowQuickBill(false); clearOrder(); }}
                  className="flex-1 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}