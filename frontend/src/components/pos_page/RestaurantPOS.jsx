
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, Home, Receipt, Menu, Search, X,
  Minus, Plus, Trash2, CreditCard, DollarSign, Printer,
  Utensils, Cake, Wine, Cigarette, Calendar as CalendarIcon,
  Edit, Wallet, Building, Grid3X3, List, Square,
  Folder, ChevronDown, ChevronUp, Settings, LogOut, FileText
} from 'lucide-react';
import menuData from '../../data/menuData.json';
import OrderDetailsSidebar from '../pos_page/OrderDetailsSidebar';

const PRIMARY_BLUE = '#3673B4';

const NavItem = ({ icon: Icon, label, expanded, active = false, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center px-3 transition-all
      ${expanded ? 'justify-start' : 'justify-center'}
      ${active ? 'text-[#3673B4]' : 'text-gray-500'}
    `}
  >
    <div
      className={`
        w-10 h-10 rounded-xl flex items-center justify-center transition-all
        ${active ? 'bg-[#E3F2FD] shadow-lg' : 'hover:bg-gray-100 hover:text-gray-700'}
      `}
    >
      <Icon className="w-5 h-5" strokeWidth={2} />
    </div>
    {expanded && <span className="ml-3 flex-1 text-left">{label}</span>}
  </button>
);

export default function RestaurantPOS() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationState = location.state || {};
  const initialTableData = navigationState.tableData || {};
  const waiters = navigationState.waiters || [];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [masterOpen, setMasterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const hasResized = useRef(false);

  const [activeSection, setActiveSection] = useState('dine-in');
  const [activeCategory, setActiveCategory] = useState('All Menu');
  const [orderType, setOrderType] = useState('dine-in');
  const [cardSize, setCardSize] = useState('large');

  const [dineInOrderItems, setDineInOrderItems] = useState([]);
  const [takeawayOrderItems, setTakeawayOrderItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [table, setTable] = useState(initialTableData.no ? `#${initialTableData.no}` : 'B6');
  const [tableId, setTableId] = useState(initialTableData.id || '');
  const [tableSeats, setTableSeats] = useState(initialTableData.seats || 4);
  const [waiterId, setWaiterId] = useState(initialTableData.waiterId || '');
  const [waiterName, setWaiterName] = useState(initialTableData.waiterName || '');

  const [dineInDiscount, setDineInDiscount] = useState(0);
  const [takeawayDiscount, setTakeawayDiscount] = useState(0);

  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [showTakeaway, setShowTakeaway] = useState(false);
  const [showQuickBill, setShowQuickBill] = useState(false);

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [currentNoteItem, setCurrentNoteItem] = useState(null);
  const [itemNote, setItemNote] = useState('');

  const [showEditForm, setShowEditForm] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedRemovals, setSelectedRemovals] = useState([]);
  const [editNote, setEditNote] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('cash');

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

  const paymentMethods = [
    { id: 'esewa', name: 'eSewa', icon: Wallet },
    { id: 'khalti', name: 'Khalti', icon: Wallet },
    { id: 'cash', name: 'Cash', icon: DollarSign },
    { id: 'card', name: 'Card', icon: CreditCard },
    { id: 'bank', name: 'Bank Transfer', icon: Building }
  ];

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && sidebarOpen) setSidebarOpen(false);
    };

    if (!hasResized.current) {
      hasResized.current = true;
      handleResize();
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const getCurrentOrderItems = () => orderType === 'dine-in' ? dineInOrderItems : takeawayOrderItems;
  const getCurrentDiscount = () => orderType === 'dine-in' ? dineInDiscount : takeawayDiscount;

  const combinedSubtotal = dineInOrderItems.reduce((sum, i) => sum + i.price * i.quantity, 0) +
    takeawayOrderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const combinedTax = combinedSubtotal * 0.13;
  const combinedTotal = combinedSubtotal + combinedTax - (dineInDiscount + takeawayDiscount);

  const allCategories = useMemo(() =>
    Array.from(new Set(menuData.map(item => item.category).filter(Boolean))),
    [menuData]);

  const sectionCategories = useMemo(() => {
    const cats = { 'dine-in': ['All Menu'], desserts: ['Desserts'], drinks: ['Drinks'], smoking: ['Smoking'], reservations: [] };
    allCategories.forEach(cat => {
      if (!['Desserts', 'Drinks', 'Smoking'].includes(cat)) cats['dine-in'].push(cat);
    });
    return cats;
  }, [allCategories]);

  const filteredItems = useMemo(() => {
    if (!menuData?.length) return [];
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
    const setOrder = orderType === 'dine-in' ? setDineInOrderItems : setTakeawayOrderItems;
    setOrder(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1, note: '', extras: [], removals: [], originalPrice: item.price }];
    });
  };

  const updateQuantity = (id, delta) => {
    const setOrder = orderType === 'dine-in' ? setDineInOrderItems : setTakeawayOrderItems;
    setOrder(prev => prev
      .map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
      .filter(i => i.quantity > 0)
    );
  };

  const removeItem = (id) => {
    const setOrder = orderType === 'dine-in' ? setDineInOrderItems : setTakeawayOrderItems;
    setOrder(prev => prev.filter(i => i.id !== id));
  };

  const clearOrder = () => {
    setDineInOrderItems([]);
    setTakeawayOrderItems([]);
    setDineInDiscount(0);
    setTakeawayDiscount(0);
  };

  const openNoteForm = (item) => {
    setCurrentNoteItem(item);
    setItemNote(item.note || '');
    setShowNoteForm(true);
  };

  const saveNote = () => {
    if (!currentNoteItem) return;
    const setOrder = orderType === 'dine-in' ? setDineInOrderItems : setTakeawayOrderItems;
    setOrder(prev => prev.map(i => i.id === currentNoteItem.id ? { ...i, note: itemNote } : i));
    setShowNoteForm(false); setCurrentNoteItem(null); setItemNote('');
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
        ? { ...i, extras: selectedExtras, removals: selectedRemovals, note: editNote, price: (i.originalPrice || i.price) + extraPrice }
        : i
    ));

    setShowEditForm(false); setCurrentEditItem(null); setSelectedExtras([]); setSelectedRemovals([]); setEditNote('');
  };

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
  };

  const handlePay = () => {
    const billData = { dineInOrderItems, takeawayOrderItems, dineInDiscount, takeawayDiscount, tableId, table, waiterId, waiterName };
    localStorage.setItem('quickBillData', JSON.stringify(billData));

    if (['esewa', 'khalti'].includes(paymentMethod)) {
      navigate('/quickesewa', { state: { amount: combinedTotal } });
    } else {
      clearOrder();
      setShowQuickBill(false);
      navigate('/quickbill');
    }
  };

  const getGridClasses = () => {
    if (cardSize === 'large') return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5';
    if (cardSize === 'small') return 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3';
    return 'space-y-3';
  };

  const renderMenuItems = () => {
    if (!filteredItems.length) {
      return (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm sm:text-base">No items found</p>
        </div>
      );
    }

    if (cardSize === 'list') {
      return (
        <div className="space-y-3 max-w-5xl mx-auto">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => addToOrder(item)}
              className="bg-white rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">{item.name}</h3>
              </div>
              <div className="text-base sm:text-lg font-bold text-blue-700">Rs. {item.price.toLocaleString()}</div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={`${getGridClasses()} max-w-7xl mx-auto`}>
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => addToOrder(item)}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className={`relative overflow-hidden bg-gray-100 ${cardSize === 'large' ? 'aspect-[4/3]' : 'aspect-square'}`}>
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
            </div>
            <div className={`p-2 sm:p-3 ${cardSize === 'small' ? 'p-1.5' : ''}`}>
              <h3 className={`font-medium text-gray-900 truncate text-xs sm:text-sm ${cardSize === 'small' ? 'text-xs' : ''}`}>
                {item.name}
              </h3>
              <p className={`font-bold text-blue-700 mt-1 text-sm sm:text-base ${cardSize === 'small' ? 'text-xs' : ''}`}>
                Rs. {item.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="h-screen w-screen bg-gray-50 flex overflow-hidden text-sm">
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-10" onClick={() => setSidebarOpen(false)} />
        )}

        <div
          className={`
            bg-white shadow-md flex flex-col transition-all duration-300 ease-in-out z-20
            ${sidebarOpen ? 'w-64' : 'w-14'}
            ${isMobile ? 'fixed h-full' : 'relative'}
            ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          `}
        >
          <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            {sidebarOpen && (
              <span
                className="text-xl font-bold tracking-tight mr-20"
                style={{ color: PRIMARY_BLUE }}
              >
                Logo
              </span>
            )}
          </div>

          <div className="flex flex-col items-center py-6 space-y-6 flex-1">
            <NavItem icon={Home} label="Home" expanded={sidebarOpen} onClick={() => navigate('/')} />
            <NavItem icon={DollarSign} label="POS" expanded={sidebarOpen} active />

            <div className="w-full">
              <button
                onClick={() => sidebarOpen && setMasterOpen(prev => !prev)}
                className={`
                  w-full flex items-center px-3 transition-all
                  ${sidebarOpen ? 'justify-start' : 'justify-center'}
                  text-gray-500 hover:text-[#3673B4]
                `}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100">
                  <Folder className="w-5 h-5" strokeWidth={2} />
                </div>
                {sidebarOpen && (
                  <>
                    <span className={`ml-3 flex-1 text-left font-medium ${masterOpen ? 'text-[#3673B4]' : 'text-gray-500'}`}>
                      Master
                    </span>
                    {masterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </>
                )}
              </button>

              {sidebarOpen && masterOpen && (
                <div className="mt-1 space-y-1 px-3">
                  {[
                    'Menu Group', 'Menu Create', 'Location Create',
                    'Table Create', 'Waiter Create', 'Table Split'
                  ].map(item => (
                    <button
                      key={item}
                      onClick={() => console.log('Navigate to:', item)}
                      className="w-full text-left px-10 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <NavItem icon={FileText} label="Reports" expanded={sidebarOpen} />
            <div className="flex-1" />
            <NavItem icon={Settings} label="Settings" expanded={sidebarOpen} />
            <NavItem icon={LogOut} label="Logout" expanded={sidebarOpen} />
          </div>
        </div>

        {isMobile && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-3 py-2.5 md:px-6 md:py-3">
            <div className="flex items-center justify-between">
              <div className="hidden md:flex items-center gap-4 lg:gap-6">
                {[
                  { section: 'dine-in', icon: Utensils },
                  { section: 'desserts', icon: Cake },
                  { section: 'drinks', icon: Wine },
                  { section: 'smoking', icon: Cigarette }
                ].map(({ section, icon: Icon }) => (
                  <button
                    key={section}
                    onClick={() => handleSectionClick(section)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeSection === section ? 'bg-blue-50' : ''}`}>
                      <Icon
                        className="w-5 h-5"
                        style={{ color: activeSection === section ? PRIMARY_BLUE : '#6B7280' }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowRightSidebar(true)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </header>

          {activeSection !== 'reservations' && (
            <div className="bg-white border-b border-gray-200 px-3 py-3 md:px-6 md:py-4">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                      >
                        <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>

                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setCardSize('large')}
                      className={`p-1.5 rounded ${cardSize === 'large' ? 'bg-white shadow-sm' : ''}`}
                      title="Large"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCardSize('small')}
                      className={`p-1.5 rounded ${cardSize === 'small' ? 'bg-white shadow-sm' : ''}`}
                      title="Small"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCardSize('list')}
                      className={`p-1.5 rounded ${cardSize === 'list' ? 'bg-white shadow-sm' : ''}`}
                      title="List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {sectionCategories[activeSection].map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category
                          ? 'bg-blue-700 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 overflow-y-auto p-3 md:p-6 bg-gray-50">
            {renderMenuItems()}
          </main>
        </div>

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
          combinedDiscount={dineInDiscount + takeawayDiscount}
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
          handlePaymentMethodSelect={setPaymentMethod}
          availableExtras={availableExtras}
          availableRemovals={availableRemovals}
          updateOrderWaiter={(id, name) => { setWaiterId(id); setWaiterName(name); }}
          showNoteForm={showNoteForm}
          setShowNoteForm={setShowNoteForm}
          currentNoteItem={currentNoteItem}
          itemNote={itemNote}
          setItemNote={setItemNote}
          saveNote={saveNote}
        />
      </div>

      {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Item</h3>
              <button onClick={() => setShowEditForm(false)} className="text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-5 text-sm">
              <div>
                <h4 className="font-medium mb-2">Extras</h4>
                {availableExtras.map(e => (
                  <label key={e.id} className="flex items-center gap-2 mb-1.5">
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(e.id)}
                      onChange={(ev) => setSelectedExtras(prev =>
                        ev.target.checked ? [...prev, e.id] : prev.filter(id => id !== e.id)
                      )}
                      className="rounded"
                    />
                    <span>{e.name} {e.price > 0 && `(Rs. ${e.price})`}</span>
                  </label>
                ))}
              </div>
              <div>
                <h4 className="font-medium mb-2">Remove</h4>
                {availableRemovals.map(r => (
                  <label key={r.id} className="flex items-center gap-2 mb-1.5">
                    <input
                      type="checkbox"
                      checked={selectedRemovals.includes(r.id)}
                      onChange={(ev) => setSelectedRemovals(prev =>
                        ev.target.checked ? [...prev, r.id] : prev.filter(id => id !== r.id)
                      )}
                      className="rounded"
                    />
                    <span>{r.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowEditForm(false)} className="flex-1 py-2.5 bg-gray-200 rounded-lg text-gray-700 font-medium">
                Cancel
              </button>
              <button onClick={saveEdit} style={{ backgroundColor: PRIMARY_BLUE }} className="flex-1 py-2.5 text-white rounded-lg font-medium">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuickBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold">Quick Bill</h2>
              <button onClick={() => setShowQuickBill(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl text-center mb-5">
              <p className="text-3xl font-bold" style={{ color: PRIMARY_BLUE }}>Rs {combinedTotal.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Total Amount</p>
            </div>

            <div className="space-y-4 mb-5 text-sm">
              {dineInOrderItems.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Dine-in</h4>
                  {dineInOrderItems.map(i => (
                    <div key={i.id} className="flex justify-between">
                      <span>{i.name} × {i.quantity}</span>
                      <span>Rs. {(i.price * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              {takeawayOrderItems.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Takeaway</h4>
                  {takeawayOrderItems.map(i => (
                    <div key={i.id} className="flex justify-between">
                      <span>{i.name} × {i.quantity}</span>
                      <span>Rs. {(i.price * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 text-xs transition-all ${paymentMethod === m.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                  >
                    <m.icon className="w-5 h-5" style={{ color: paymentMethod === m.id ? PRIMARY_BLUE : '#6B7280' }} />
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={handlePay}
                style={{ backgroundColor: PRIMARY_BLUE }}
                className="flex-1 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" /> Pay
              </button>
              <button
                onClick={() => { clearOrder(); setShowQuickBill(false); }}
                className="flex-1 py-3 rounded-lg bg-red-500 text-white font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}