'use client';

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Home, Book, Clock, User, Settings, LogOut, Search, X, ChevronDown, 
  Minus, Plus, Trash2, Phone, UserIcon, CreditCard, DollarSign, Printer,
  Utensils, Cake, Wine, Cigarette, Calendar as CalendarIcon, Menu as MenuIcon,
  Edit, Notebook, Wallet, Building,
} from 'lucide-react';
import menuData from '../data/menuData.json';

const PRIMARY_BLUE = '#3673B4';
const NOTE_CHARACTER_LIMIT = 200;
const EDIT_CHARACTER_LIMIT = 100;

const NavItem = ({ icon: Icon, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
      active 
        ? 'bg-[#3673B4] text-white shadow-lg' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
    }`}
  >
    <Icon className="w-5 h-5" strokeWidth={2} />
  </button>
);

export default function RestaurantPOS() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dine-in');
  const [activeCategory, setActiveCategory] = useState('All Menu');
  const [orderType, setOrderType] = useState('dine-in');
  
  // Separate state for dine-in and takeaway orders
  const [dineInOrderItems, setDineInOrderItems] = useState([]);
  const [takeawayOrderItems, setTakeawayOrderItems] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [table, setTable] = useState('B6');
  
  // Separate discounts for dine-in and takeaway
  const [dineInDiscount, setDineInDiscount] = useState(0);
  const [takeawayDiscount, setTakeawayDiscount] = useState(0);

  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showTakeaway, setShowTakeaway] = useState(false);
  const [showQuickBill, setShowQuickBill] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // State for item notes
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [currentNoteItem, setCurrentNoteItem] = useState(null);
  const [itemNote, setItemNote] = useState('');

  // State for item edit form
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedRemovals, setSelectedRemovals] = useState([]);
  const [editNote, setEditNote] = useState('');

  // Define available extras and removals
  const availableExtras = [
    { id: 'extraCheese', name: 'Extra Cheese', price: 0 },
    { id: 'extraPatty', name: 'Extra Patty', price: 50 },
    { id: 'extraMayo', name: 'Extra Mayo', price: 0 },
    { id: 'extraLettuce', name: 'Extra Lettuce', price: 0 },
    { id: 'extraPickles', name: 'Extra Pickles', price: 0 }
  ];

  const availableRemovals = [
    { id: 'noOnion', name: 'No Onion' },
    { id: 'noTomato', name: 'No Tomato' },
    { id: 'noMayo', name: 'No Mayo' },
    { id: 'noLettuce', name: 'No Lettuce' }
  ];

  // Payment methods
  const paymentMethods = [
    { id: 'esewa', name: 'eSewa', icon: Wallet },
    { id: 'khalti', name: 'Khalti', icon: Wallet },
    { id: 'cash', name: 'Cash', icon: DollarSign },
    { id: 'card', name: 'Card', icon: CreditCard },
    { id: 'bank', name: 'Bank Transfer', icon: Building }
  ];

  // Get the current order items based on order type
  const getCurrentOrderItems = () => {
    return orderType === 'dine-in' ? dineInOrderItems : takeawayOrderItems;
  };

  // Get the current discount based on order type
  const getCurrentDiscount = () => {
    return orderType === 'dine-in' ? dineInDiscount : takeawayDiscount;
  };

  // Set the current discount based on order type
  const setCurrentDiscount = (value) => {
    if (orderType === 'dine-in') {
      setDineInDiscount(value);
    } else {
      setTakeawayDiscount(value);
    }
  };

  // Calculate combined values for quick bill
  const combinedSubtotal = dineInOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 
                          takeawayOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const combinedDiscount = dineInDiscount + takeawayDiscount;
  const combinedTax = combinedSubtotal * 0.13;
  const combinedTotal = combinedSubtotal + combinedTax - combinedDiscount;
  const paidAmount = Number(cashAmount || 0);
  const change = paidAmount > combinedTotal ? paidAmount - combinedTotal : 0;

  const allCategories = useMemo(() => {
    if (!menuData || !Array.isArray(menuData)) return [];
    const categories = new Set();
    menuData.forEach(item => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return Array.from(categories);
  }, [menuData]);

  const sectionCategories = useMemo(() => {
    const categories = {
      'dine-in': ['All Menu'],
      'desserts': ['Desserts'],
      'drinks': ['Drinks'],
      'smoking': ['Smoking'],
      'reservations': []
    };
    
    allCategories.forEach(cat => {
      if (!['Desserts', 'Drinks', 'Smoking'].includes(cat)) {
        categories['dine-in'].push(cat);
      }
    });
    
    return categories;
  }, [allCategories]);

  const filteredItems = useMemo(() => {
    if (!menuData || !Array.isArray(menuData)) return [];
    
    return menuData.filter(item => {
      const inSection = activeSection === 'dine-in' || 
        (activeSection === 'desserts' && item.category === 'Desserts') ||
        (activeSection === 'drinks' && item.category === 'Drinks') ||
        (activeSection === 'smoking' && item.category === 'Smoking');
      
      const matchesCategory = activeCategory === 'All Menu' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return inSection && matchesCategory && matchesSearch;
    });
  }, [activeSection, activeCategory, searchQuery, menuData]);

  const addToOrder = (item) => {
    if (orderType === 'dine-in') {
      setDineInOrderItems(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
          return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { ...item, quantity: 1, note: '', extras: [], removals: [] }];
      });
    } else {
      setTakeawayOrderItems(prev => {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
          return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { ...item, quantity: 1, note: '', extras: [], removals: [] }];
      });
    }
  };

  const updateQuantity = (id, delta) => {
    if (orderType === 'dine-in') {
      setDineInOrderItems(prev => {
        return prev
          .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
          .filter(i => i.quantity > 0);
      });
    } else {
      setTakeawayOrderItems(prev => {
        return prev
          .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
          .filter(i => i.quantity > 0);
      });
    }
  };

  const removeItem = (id) => {
    if (orderType === 'dine-in') {
      setDineInOrderItems(prev => prev.filter(i => i.id !== id));
    } else {
      setTakeawayOrderItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const clearOrder = () => {
    if (orderType === 'dine-in') {
      setDineInOrderItems([]);
      setDineInDiscount(0);
    } else {
      setTakeawayOrderItems([]);
      setTakeawayDiscount(0);
    }
    setCustomerName('');
    setCustomerPhone('');
    setCashAmount('');
    setCardAmount('');
  };

  // Function to handle opening the note form
  const openNoteForm = (item) => {
    setCurrentNoteItem(item);
    setItemNote(item.note || '');
    setShowNoteForm(true);
  };

  // Function to save the note
  const saveNote = () => {
    if (currentNoteItem) {
      if (orderType === 'dine-in') {
        setDineInOrderItems(prev => 
          prev.map(item => 
            item.id === currentNoteItem.id ? { ...item, note: itemNote } : item
          )
        );
      } else {
        setTakeawayOrderItems(prev => 
          prev.map(item => 
            item.id === currentNoteItem.id ? { ...item, note: itemNote } : item
          )
        );
      }
    }
    setShowNoteForm(false);
    setCurrentNoteItem(null);
    setItemNote('');
  };

  // Function to handle opening the edit form
  const openEditForm = (item) => {
    setCurrentEditItem(item);
    setSelectedExtras(item.extras || []);
    setSelectedRemovals(item.removals || []);
    setEditNote(item.note || '');
    setShowEditForm(true);
  };

  // Function to save the edited item
  const saveEdit = () => {
    if (currentEditItem) {
      if (orderType === 'dine-in') {
        setDineInOrderItems(prev => 
          prev.map(item => 
            item.id === currentEditItem.id ? { 
              ...item, 
              extras: selectedExtras, 
              removals: selectedRemovals,
              note: editNote,
              // Calculate new price based on selected extras
              price: item.price + selectedExtras.reduce((sum, extraId) => {
                const extra = availableExtras.find(e => e.id === extraId);
                return extra ? extra.price : 0;
              }, 0)
            } : item
          )
        );
      } else {
        setTakeawayOrderItems(prev => 
          prev.map(item => 
            item.id === currentEditItem.id ? { 
              ...item, 
              extras: selectedExtras, 
              removals: selectedRemovals,
              note: editNote,
              // Calculate new price based on selected extras
              price: item.price + selectedExtras.reduce((sum, extraId) => {
                const extra = availableExtras.find(e => e.id === extraId);
                return extra ? extra.price : 0;
              }, 0)
            } : item
          )
        );
      }
    }
    setShowEditForm(false);
    setCurrentEditItem(null);
    setSelectedExtras([]);
    setSelectedRemovals([]);
    setEditNote('');
  };

  // Calculate values based on current order type
  const currentOrderItems = getCurrentOrderItems();
  const currentDiscount = getCurrentDiscount();
  const subtotal = currentOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.13;
  const total = subtotal + tax - currentDiscount;

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setActiveCategory('All Menu');
    setSearchQuery('');
    setShowTakeaway(false);
    setShowQuickBill(false);
    setShowLeftSidebar(false);
  };

  // Function to handle payment method selection
  const handlePaymentMethodSelect = (methodId) => {
    setPaymentMethod(methodId);
  };

  const handlePay = () => {
    const billData = {
      dineInOrderItems,
      takeawayOrderItems,
      dineInDiscount,
      takeawayDiscount,
    };
    localStorage.setItem('quickBillData', JSON.stringify(billData));

    if (paymentMethod === 'esewa' || paymentMethod === 'khalti') {
      // For digital payments, navigate to payment page
      navigate('/quickesewa', { state: { amount: combinedTotal } });
      // Note: For khalti, you may need a separate route or handling
    } else {
      // For other methods, assume payment successful, clear orders, navigate to quickbill
      setDineInOrderItems([]);
      setTakeawayOrderItems([]);
      setDineInDiscount(0);
      setTakeawayDiscount(0);
      setShowQuickBill(false);
      navigate('/quickbill');
    }
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50 md:flex-row">
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

        <div className={`fixed inset-y-0 left-0 z-50 w-14 bg-white shadow-md flex flex-col items-center py-6 space-y-6 transition-transform md:relative md:translate-x-0 ${
          showLeftSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <NavItem icon={Home} onClick={() => navigate('/')} />
          <NavItem icon={ShoppingCart} active />   
          <NavItem icon={Book} />
          <NavItem icon={Clock} />
          <NavItem icon={User} />
          <div className="flex-1" />
          <NavItem icon={Settings} />
          <NavItem icon={LogOut} />
        </div>

        {(showLeftSidebar || showRightSidebar) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => {
              setShowLeftSidebar(false);
              setShowRightSidebar(false);
            }}
          />
        )}

        <div className="flex-1 flex flex-col pb-16 md:pb-0">
          <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowLeftSidebar(!showLeftSidebar)}
                className="md:hidden"
              >
                <MenuIcon className="w-6 h-6 text-gray-700" />
              </button>

              <div className="hidden md:flex items-center space-x-6">
                {[
                  { section: 'dine-in', icon: Utensils },
                  { section: 'desserts', icon: Cake },
                  { section: 'drinks', icon: Wine },
                  { section: 'smoking', icon: Cigarette },
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
                          ? 'bg-blue-700 text-white shadow-sm'
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

          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            {filteredItems.length === 0 ? (
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
                      <p className="text-base md:text-lg font-bold text-blue-700 mt-1">Rs. {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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

            <div className="flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-900 text-sm md:text-base">Order Items</h3>
                {currentOrderItems.length > 0 && (
                  <button onClick={clearOrder} className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {currentOrderItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 opacity-30" />
                    <p className="text-xs md:text-sm">No items added</p>
                  </div>
                ) : (
                  currentOrderItems.map(item => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900 text-sm md:text-base flex-1">{item.name}</h4>
                        <div className="flex items-center gap-1 ml-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEditForm(item); }} 
                            className="p-1 text-blue-600 transition-colors"
                            title="Edit item"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); openNoteForm(item); }} 
                            className="p-1 text-blue-600 transition-colors"
                            title="View details"
                          >
                            <Notebook className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} 
                            className="p-1 text-red-500 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }} 
                            className="px-2 py-1 text-red-600 hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 border-l border-r border-gray-300 text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }} 
                            className="px-2 py-1 text-blue-600 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-bold text-blue-800 text-sm md:text-base">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      {/* Display item note if it exists */}
                      {item.note && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-md text-xs text-gray-700">
                          <span className="font-medium">Note:</span> {item.note}
                        </div>
                      )}
                      {/* Display item extras if they exist */}
                      {item.extras && item.extras.length > 0 && (
                        <div className="mt-2 p-2 bg-green-50 rounded-md text-xs text-gray-700">
                          <span className="font-medium">Extras:</span> {item.extras.map(extraId => {
                            const extra = availableExtras.find(e => e.id === extraId);
                            return extra ? extra.name : '';
                          }).join(', ')}
                        </div>
                      )}
                      {/* Display item removals if they exist */}
                      {item.removals && item.removals.length > 0 && (
                        <div className="mt-2 p-2 bg-red-50 rounded-md text-xs text-gray-700">
                          <span className="font-medium">Removals:</span> {item.removals.map(removalId => {
                            const removal = availableRemovals.find(r => r.id === removalId);
                            return removal ? removal.name : '';
                          }).join(', ')}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Order Summary - Display for both dine-in and takeaway */}
            {currentOrderItems.length > 0 && (
              <div className="p-4 md:p-1 border-t border-gray-200 space-y-3 md:space-y-4 bg-gray-50 text-xs md:text-sm">
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
                    <span className="font-medium text-gray-900">Rs {currentDiscount.toLocaleString()}</span>
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

      {/* Note Form Modal - No Black Background */}
      {showNoteForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Add Item Note</h3>
              <button onClick={() => setShowNoteForm(false)} className="text-red-500 hover:text-red-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={itemNote}
                onChange={(e) => {
                  if (e.target.value.length <= NOTE_CHARACTER_LIMIT) {
                    setItemNote(e.target.value);
                  }
                }}
                placeholder="Add any cooking preferences... e.g., spicy little, extra sauce, no onion..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Character limit: {NOTE_CHARACTER_LIMIT}</span>
                <span className={itemNote.length === NOTE_CHARACTER_LIMIT ? 'text-red-500 font-medium' : ''}>
                  {itemNote.length}/{NOTE_CHARACTER_LIMIT}
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setShowNoteForm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                style={{ backgroundColor: PRIMARY_BLUE }}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Form Modal - No Black Background with Character Limit */}
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Additional Toppings</h3>
              <button onClick={() => setShowEditForm(false)} className="text-red-500 hover:text-red-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Extras:</h4>
                <div className="space-y-2">
                  {availableExtras.map(extra => (
                    <label key={extra.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExtras([...selectedExtras, extra.id]);
                          } else {
                            setSelectedExtras(selectedExtras.filter(id => id !== extra.id));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{extra.name}</span>
                      {extra.price > 0 && <span className="text-sm text-gray-500 ml-1">(+{extra.price})</span>}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Remove:</h4>
                <div className="space-y-2">
                  {availableRemovals.map(removal => (
                    <label key={removal.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRemovals.includes(removal.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRemovals([...selectedRemovals, removal.id]);
                          } else {
                            setSelectedRemovals(selectedRemovals.filter(id => id !== removal.id));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{removal.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Note:</h4>
                <textarea
                  value={editNote}
                  onChange={(e) => {
                    if (e.target.value.length <= EDIT_CHARACTER_LIMIT) {
                      setEditNote(e.target.value);
                    }
                  }}
                  placeholder="Add any cooking preferences... e.g., spicy little, extra sauce, no onion..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Character limit: {EDIT_CHARACTER_LIMIT}</span>
                  <span className={editNote.length === EDIT_CHARACTER_LIMIT ? 'text-red-500 font-medium' : ''}>
                    {editNote.length}/{EDIT_CHARACTER_LIMIT}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                style={{ backgroundColor: PRIMARY_BLUE }}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Bill Form Modal - No Black Background */}
      {showQuickBill && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
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
                  Rs {combinedTotal.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Amount</p>
              </div>

              {/* Display Dine-in Orders */}
              {dineInOrderItems.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dine-in Orders</h4>
                  <div className="space-y-2">
                    {dineInOrderItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="flex-1">{item.name} x{item.quantity}</span>
                        <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display Takeaway Orders */}
              {takeawayOrderItems.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Takeaway Orders</h4>
                  <div className="space-y-2">
                    {takeawayOrderItems.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="flex-1">{item.name} x{item.quantity}</span>
                        <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className='text-'/>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map(method => (
                      <button
                        key={method.id}
                        onClick={() => handlePaymentMethodSelect(method.id)}
                        className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                          paymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <method.icon className="w-6 h-6" style={{ color: paymentMethod === method.id ? PRIMARY_BLUE : '#6B7280' }} />
                        <span className="text-xs font-medium">{method.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePay}
                    style={{ backgroundColor: PRIMARY_BLUE }}
                    className="flex-1 py-3 rounded-lg text-white font-semibold hover:opacity-90 flex items-center justify-center gap-2 text-sm"
                  >
                    <Printer className="w-5 h-5" />
                    Pay
                  </button>
                  <button
                    onClick={() => { 
                      setShowQuickBill(false); 
                      // Clear both dine-in and takeaway orders
                      setDineInOrderItems([]);
                      setTakeawayOrderItems([]);
                      setDineInDiscount(0);
                      setTakeawayDiscount(0);
                      setCashAmount('');
                      setCardAmount('');
                    }}
                    className="flex-1 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}