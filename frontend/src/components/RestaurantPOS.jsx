'use client';

import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, Home, Book, Clock, User, Settings, LogOut, Search, X, ChevronDown,
  Minus, Plus, Trash2, Phone, UserIcon, CreditCard, DollarSign, Printer,
  Utensils, Cake, Wine, Cigarette, Calendar as CalendarIcon, Menu as MenuIcon,
  Edit, Notebook, Wallet, Building, Grid3X3, List, Square
} from 'lucide-react';
import menuData from '../data/menuData.json';
import OrderDetailsSidebar from '../components/OrderDetailsSidebar';

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
  const location = useLocation();
  
  // Get data from navigation state
  const navigationState = location.state || {};
  const initialTableData = navigationState.tableData || {};
  const waiters = navigationState.waiters || [];
  const allTables = navigationState.allTables || [];
  
  const [activeSection, setActiveSection] = useState('dine-in');
  const [activeCategory, setActiveCategory] = useState('All Menu');
  const [orderType, setOrderType] = useState('dine-in');
  // New state for card size view
  const [cardSize, setCardSize] = useState('large'); // 'large', 'small', 'list'

  // Separate state for dine-in and takeaway orders
  const [dineInOrderItems, setDineInOrderItems] = useState([]);
  const [takeawayOrderItems, setTakeawayOrderItems] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Table and waiter states with initial values from navigation
  const [table, setTable] = useState(initialTableData.no ? `#${initialTableData.no}` : 'B6');
  const [tableId, setTableId] = useState(initialTableData.id || '');
  const [tableSeats, setTableSeats] = useState(initialTableData.seats || 4);
  const [waiterId, setWaiterId] = useState(initialTableData.waiterId || '');
  const [waiterName, setWaiterName] = useState(initialTableData.waiterName || '');

  // Separate discounts
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

  // Item note & edit states
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [currentNoteItem, setCurrentNoteItem] = useState(null);
  const [itemNote, setItemNote] = useState('');

  const [showEditForm, setShowEditForm] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedRemovals, setSelectedRemovals] = useState([]);
  const [editNote, setEditNote] = useState('');

  // Extras & Removals
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

  // Helper: Get current order items & discount
  const getCurrentOrderItems = () => orderType === 'dine-in' ? dineInOrderItems : takeawayOrderItems;
  const getCurrentDiscount = () => orderType === 'dine-in' ? dineInDiscount : takeawayDiscount;
  const setCurrentDiscount = (value) => orderType === 'dine-in' ? setDineInDiscount(value) : setTakeawayDiscount(value);

  // Combined values for Quick Bill
  const combinedSubtotal = dineInOrderItems.reduce((sum, i) => sum + i.price * i.quantity, 0) +
                          takeawayOrderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const combinedDiscount = dineInDiscount + takeawayDiscount;
  const combinedTax = combinedSubtotal * 0.13;
  const combinedTotal = combinedSubtotal + combinedTax - combinedDiscount;

  // Menu categories
  const allCategories = useMemo(() => {
    if (!menuData || !Array.isArray(menuData)) return [];
    return Array.from(new Set(menuData.map(item => item.category).filter(Boolean)));
  }, [menuData]);

  const sectionCategories = useMemo(() => {
    const cats = { 'dine-in': ['All Menu'], desserts: ['Desserts'], drinks: ['Drinks'], smoking: ['Smoking'], reservations: [] };
    allCategories.forEach(cat => {
      if (!['Desserts', 'Drinks', 'Smoking'].includes(cat)) {
        cats['dine-in'].push(cat);
      }
    });
    return cats;
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

  // Order actions
  const addToOrder = (item) => {
    const setOrder = orderType === 'dine-in' ? setDineInOrderItems : setTakeawayOrderItems;
    setOrder(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, note: '', extras: [], removals: [] }];
    });
  };

  const updateQuantity = (id, delta) => {
    const setOrder = orderType === 'dine-in' ? setDineInOrderItems : setTakeawayOrderItems;
    setOrder(prev => prev
      .map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const removeItem = (id) => {
    const setOrder = orderType === 'dine-in' ? setDineInOrderItems : setTakeawayOrderItems;
    setOrder(prev => prev.filter(i => i.id !== id));
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

  // Note & Edit Handlers
  const openNoteForm = (item) => {
    setCurrentNoteItem(item);
    setItemNote(item.note || '');
    setShowNoteForm(true);
  };

  const saveNote = () => {
    if (!currentNoteItem) return;
    const setOrder = orderType === 'dine-in' ? setDineInOrderItems : setTakeawayOrderItems;
    setOrder(prev => prev.map(i => i.id === currentNoteItem.id ? { ...i, note: itemNote } : i));
    setShowNoteForm(false);
    setCurrentNoteItem(null);
    setItemNote('');
  };

  const openEditForm = (item) => {
    setCurrentEditItem(item);
    setSelectedExtras(item.extras || []);
    setSelectedRemovals(item.removals || []);
    setEditNote(item.note || '');
    setShowEditForm(true);
  };

  const saveEdit = () => {
    if (!currentEditItem) return;
    const extraPrice = selectedExtras.reduce((sum, id) => {
      const extra = availableExtras.find(e => e.id === id);
      return sum + (extra?.price || 0);
    }, 0);

    const setOrder = orderType === 'dine-in' ? setDineInOrderItems : setTakeawayOrderItems;
    setOrder(prev => prev.map(i =>
      i.id === currentEditItem.id
        ? { ...i, extras: selectedExtras, removals: selectedRemovals, note: editNote, price: i.price + extraPrice }
        : i
    ));

    setShowEditForm(false);
    setCurrentEditItem(null);
    setSelectedExtras([]);
    setSelectedRemovals([]);
    setEditNote('');
  };

  // Update waiter for the current order
  const updateOrderWaiter = (newWaiterId, newWaiterName) => {
    setWaiterId(newWaiterId);
    setWaiterName(newWaiterName);
  };

  // Calculations
  const currentOrderItems = getCurrentOrderItems();
  const currentDiscount = getCurrentDiscount();
  const subtotal = currentOrderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
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

  const handlePaymentMethodSelect = (methodId) => setPaymentMethod(methodId);

  const handlePay = () => {
    const billData = { 
      dineInOrderItems, 
      takeawayOrderItems, 
      dineInDiscount, 
      takeawayDiscount,
      tableId,
      table,
      waiterId,
      waiterName
    };
    localStorage.setItem('quickBillData', JSON.stringify(billData));

    if (paymentMethod === 'esewa' || paymentMethod === 'khalti') {
      navigate('/quickesewa', { state: { amount: combinedTotal } });
    } else {
      setDineInOrderItems([]);
      setTakeawayOrderItems([]);
      setDineInDiscount(0);
      setTakeawayDiscount(0);
      setShowQuickBill(false);
      navigate('/quickbill');
    }
  };

  // Determine grid classes based on card size
  const getGridClasses = () => {
    if (cardSize === 'large') return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6';
    if (cardSize === 'small') return 'grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3';
    return 'space-y-2'; // For list view
  };

  // Render menu items based on card size
  const renderMenuItems = () => {
    if (filteredItems.length === 0) {
      return (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 opacity-30" />
          <p className="text-base md:text-lg">No items found</p>
        </div>
      );
    }

    if (cardSize === 'list') {
      return (
        <div className="space-y-2 max-w-7xl mx-auto">
          {filteredItems.map(item => (
            <div key={item.id} onClick={() => addToOrder(item)} className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
              </div>
              <div className="text-lg font-bold text-blue-700">Rs. {item.price.toLocaleString()}</div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={getGridClasses()} max-w-7xl mx-auto>
        {filteredItems.map(item => (
          <div key={item.id} onClick={() => addToOrder(item)} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group">
            <div className={`relative overflow-hidden bg-gray-100 ${cardSize === 'large' ? 'aspect-square' : 'aspect-[3/4]'}`}>
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
            </div>
            <div className={`p-3 md:p-4 ${cardSize === 'small' ? 'p-2' : ''}`}>
              <h3 className={`font-semibold text-gray-900 truncate ${cardSize === 'small' ? 'text-xs' : 'text-sm md:text-base'}`}>{item.name}</h3>
              <p className={`${cardSize === 'small' ? 'text-sm' : 'text-base md:text-lg'} font-bold text-blue-700 mt-1`}>Rs. {item.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50 md:flex-row">
        {/* Mobile Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex md:hidden z-40">
          {[{ section: 'dine-in', icon: Utensils }, { section: 'desserts', icon: Cake }, { section: 'drinks', icon: Wine }, { section: 'smoking', icon: Cigarette }, { section: 'reservations', icon: CalendarIcon }].map(({ section, icon: Icon }) => (
            <button key={section} onClick={() => handleSectionClick(section)} className={`flex-1 py-3 flex flex-col items-center gap-1 ${activeSection === section ? 'text-blue-600' : 'text-gray-500'}`}>
              <Icon className="w-5 h-5" />
              <span className="text-xs capitalize">{section.split('-').join(' ')}</span>
            </button>
          ))}
        </div>

        {/* Left Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-14 bg-white shadow-md flex flex-col items-center py-6 space-y-6 transition-transform md:relative md:translate-x-0 ${showLeftSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
          <NavItem icon={Home} onClick={() => navigate('/')} />
          <NavItem icon={ShoppingCart} active />
          <NavItem icon={Book} />
          <NavItem icon={Clock} />
          <NavItem icon={User} />
          <div className="flex-1" />
          <NavItem icon={Settings} />
          <NavItem icon={LogOut} />
        </div>

        {/* Overlay */}
        {(showLeftSidebar || showRightSidebar) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => { setShowLeftSidebar(false); setShowRightSidebar(false); }} />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col pb-16 md:pb-0">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
            <div className="flex items-center justify-between">
              <button onClick={() => setShowLeftSidebar(!showLeftSidebar)} className="md:hidden"><MenuIcon className="w-6 h-6 text-gray-700" /></button>
              <div className="hidden md:flex items-center space-x-6">
                {[{ section: 'dine-in', icon: Utensils }, { section: 'desserts', icon: Cake }, { section: 'drinks', icon: Wine }, { section: 'smoking', icon: Cigarette }].map(({ section, icon: Icon }) => (
                  <div key={section} className="flex flex-col items-center cursor-pointer" onClick={() => handleSectionClick(section)}>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${activeSection === section ? 'bg-blue-50' : 'bg-transparent'}`}>
                      <Icon className="w-6 h-6" style={{ color: activeSection === section ? PRIMARY_BLUE : '#6B7280' }} />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowRightSidebar(!showRightSidebar)} className="md:hidden"><ShoppingCart className="w-6 h-6 text-blue-600" /></button>
              <X className="hidden md:block w-6 h-6 text-gray-600 cursor-pointer hover:text-red-600 transition-colors" />
            </div>
          </div>

          {/* Category & Search Bar */}
          {activeSection !== 'reservations' && (
            <div className="bg-white px-4 py-3 border-b border-gray-200 md:px-6 md:py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                  {sectionCategories[activeSection].map(category => (
                    <button key={category} onClick={() => setActiveCategory(category)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category ? 'bg-blue-700 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {category}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 transform -translate-y-1/2"><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>}
                  </div>
                  {/* Card Size Selector */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setCardSize('large')}
                      className={`p-2 rounded ${cardSize === 'large' ? 'bg-white shadow-sm' : ''}`}
                      title="Large"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCardSize('small')}
                      className={`p-2 rounded ${cardSize === 'small' ? 'bg-white shadow-sm' : ''}`}
                      title="Small"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCardSize('list')}
                      className={`p-2 rounded ${cardSize === 'list' ? 'bg-white shadow-sm' : ''}`}
                      title="List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Menu Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
            {renderMenuItems()}
          </div>
        </div>

        {/* Order Details Sidebar */}
        <OrderDetailsSidebar
          showRightSidebar={showRightSidebar}
          setShowRightSidebar={setShowRightSidebar}
          orderType={orderType}
          setOrderType={setOrderType}
          showTakeaway={showTakeaway}
          setShowTakeaway={setShowTakeaway}
          showQuickBill={showQuickBill}
          setShowQuickBill={setShowQuickBill}
          table={table}
          tableId={tableId}
          tableSeats={tableSeats}
          waiterId={waiterId}
          setWaiterId={setWaiterId}
          waiterName={waiterName}
          setWaiterName={setWaiterName}
          waiters={waiters}
          currentOrderItems={currentOrderItems}
          currentDiscount={currentDiscount}
          subtotal={subtotal}
          tax={tax}
          total={total}
          combinedSubtotal={combinedSubtotal}
          combinedTax={combinedTax}
          combinedDiscount={combinedDiscount}
          combinedTotal={combinedTotal}
          dineInOrderItems={dineInOrderItems}
          takeawayOrderItems={takeawayOrderItems}
          dineInDiscount={dineInDiscount}
          takeawayDiscount={takeawayDiscount}
          clearOrder={clearOrder}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
          openEditForm={openEditForm}
          openNoteForm={openNoteForm}
          handlePay={handlePay}
          paymentMethod={paymentMethod}
          handlePaymentMethodSelect={handlePaymentMethodSelect}
          availableExtras={availableExtras}
          availableRemovals={availableRemovals}
          updateOrderWaiter={updateOrderWaiter}

          // Note Modal Props
          showNoteForm={showNoteForm}
          setShowNoteForm={setShowNoteForm}
          currentNoteItem={currentNoteItem}
          itemNote={itemNote}
          setItemNote={setItemNote}
          saveNote={saveNote}
        />
      </div>

      {/* Edit Item Form Modal (Still in main for now - can move later) */}
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Additional Toppings</h3>
              <button onClick={() => setShowEditForm(false)} className="text-red-500 hover:text-red-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Extras:</h4>
                <div className="space-y-2">
                  {availableExtras.map(extra => (
                    <label key={extra.id} className="flex items-center">
                      <input type="checkbox" checked={selectedExtras.includes(extra.id)} onChange={(e) => {
                        setSelectedExtras(prev => e.target.checked ? [...prev, extra.id] : prev.filter(id => id !== extra.id));
                      }} className="mr-2" />
                      <span className="text-sm">{extra.name}{extra.price > 0 && ` (+${extra.price})`}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Remove:</h4>
                <div className="space-y-2">
                  {availableRemovals.map(removal => (
                    <label key={removal.id} className="flex items-center">
                      <input type="checkbox" checked={selectedRemovals.includes(removal.id)} onChange={(e) => {
                        setSelectedRemovals(prev => e.target.checked ? [...prev, removal.id] : prev.filter(id => id !== removal.id));
                      }}  className="mr-2" />
                      <span className="text-sm">{removal.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button onClick={() => setShowEditForm(false)} className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              <button onClick={saveEdit} style={{ backgroundColor: PRIMARY_BLUE }} className="px-4 py-2 text-white rounded-lg hover:opacity-90">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Bill Modal */}
      {showQuickBill && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Quick Bill</h2>
              <button onClick={() => setShowQuickBill(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl md:text-3xl font-bold" style={{ color: PRIMARY_BLUE }}>Rs {combinedTotal.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mt-1">Total Amount</p>
              </div>

              {dineInOrderItems.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Dine-in Orders</h4>
                  {dineInOrderItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm"><span>{item.name} x{item.quantity}</span><span>Rs {(item.price * item.quantity).toFixed(2)}</span></div>
                  ))}
                </div>
              )}

              {takeawayOrderItems.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Takeaway Orders</h4>
                  {takeawayOrderItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm"><span>{item.name} x{item.quantity}</span><span>Rs {(item.price * item.quantity).toFixed(2)}</span></div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map(method => (
                      <button key={method.id} onClick={() => handlePaymentMethodSelect(method.id)} className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <method.icon className="w-6 h-6" style={{ color: paymentMethod === method.id ? PRIMARY_BLUE : '#6B7280' }} />
                        <span className="text-xs font-medium">{method.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={handlePay} style={{ backgroundColor: PRIMARY_BLUE }} className="flex-1 py-3 rounded-lg text-white font-semibold hover:opacity-90 flex items-center justify-center gap-2 text-sm">
                    <Printer className="w-5 h-5" /> Pay
                  </button>
                  <button onClick={() => { setShowQuickBill(false); setDineInOrderItems([]); setTakeawayOrderItems([]); setDineInDiscount(0); setTakeawayDiscount(0); }} className="flex-1 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 text-sm">
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