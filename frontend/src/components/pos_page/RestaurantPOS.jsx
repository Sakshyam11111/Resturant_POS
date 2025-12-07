import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import menuData from '../../data/menuData.json';
import OrderDetailsSidebar from '../pos_page/OrderDetailsSidebar';
import Sidebar from '../pos_page/Sidebar';
import Header from '../pos_page/Header';
import MenuItems from '../pos_page/MenuItems';
import EditItemModal from '../pos_page/EditItemModal';
import QuickBillModal from '../pos_page/QuickBillModal';
import AIRecommendation from '../pos_page/ai/AIRecommendation';

const PRIMARY_BLUE = '#3673B4';

export default function RestaurantPOS() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationState = location.state || {};
  const initialTableData = navigationState.tableData || {};
  const waiters = navigationState.waiters || [];

  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [editingItem, setEditingItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editExtras, setEditExtras] = useState([]);
  const [editRemovals, setEditRemovals] = useState([]);

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
    []);

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
  }, [activeSection, activeCategory, searchQuery]);

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
    setShowNoteForm(false); 
    setCurrentNoteItem(null); 
    setItemNote('');
  };

  const openEditForm = (item) => {
    setEditingItem(item);
    setEditQuantity(item.quantity || 1);
    setEditExtras(item.extras || []);
    setEditRemovals(item.removals || []);
    setShowEditForm(true);
  };

  const saveEdit = () => {
    if (!editingItem) return;
    const extraPrice = editExtras.reduce((sum, id) => {
      const extra = availableExtras.find(e => e.id === id);
      return sum + (extra?.price || 0);
    }, 0);

    const setOrder = orderType === 'dine-in' ? setDineInOrderItems : setTakeawayOrderItems;
    setOrder(prev => prev.map(i =>
      i.id === editingItem.id
        ? { 
            ...i, 
            quantity: editQuantity,
            extras: editExtras, 
            removals: editRemovals, 
            price: (i.originalPrice || i.price) + extraPrice 
          }
        : i
    ));

    setShowEditForm(false); 
    setEditingItem(null); 
    setEditQuantity(1);
    setEditExtras([]); 
    setEditRemovals([]);
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
    const billData = { 
      dineInOrderItems, 
      takeawayOrderItems, 
      dineInDiscount, 
      takeawayDiscount, 
      tableId, 
      table, 
      waiterId, 
      waiterName,
      paymentMethod
    };
    localStorage.setItem('quickBillData', JSON.stringify(billData));

    if (['esewa', 'khalti'].includes(paymentMethod)) {
      navigate('/quickesewa', { state: { amount: combinedTotal, ...billData } });
    } else {
      navigate('/quickbill', { state: billData });
      clearOrder();
      setShowQuickBill(false);
    }
  };

  return (
    <>
      <div className="h-screen w-screen bg-gray-50 flex overflow-hidden text-sm">
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-10" onClick={() => setSidebarOpen(false)} />
        )}

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
          navigate={navigate}
        />

        {isMobile && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex-1 flex flex-col">
          <Header
            activeSection={activeSection}
            handleSectionClick={handleSectionClick}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            cardSize={cardSize}
            setCardSize={setCardSize}
            sectionCategories={sectionCategories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            setShowRightSidebar={setShowRightSidebar}
            isMobile={isMobile}
          />

          <main className="flex-1 overflow-y-auto p-3 md:p-6 bg-gray-50">
            <MenuItems
              filteredItems={filteredItems}
              cardSize={cardSize}
              addToOrder={addToOrder}
            />
            
            {/* AI RECOMMENDATIONS - Shows when there are items in order */}
            {currentOrderItems.length > 0 && (
              <div className="mt-6 max-w-7xl mx-auto">
                <AIRecommendation 
                  currentOrderItems={currentOrderItems}
                  onAddRecommendation={addToOrder}
                />
              </div>
            )}
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
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
          editingItem={editingItem}
          editQuantity={editQuantity}
          setEditQuantity={setEditQuantity}
          editExtras={editExtras}
          setEditExtras={setEditExtras}
          editRemovals={editRemovals}
          setEditRemovals={setEditRemovals}
          saveEdit={saveEdit}
        />
      </div>

      <QuickBillModal
        showQuickBill={showQuickBill}
        setShowQuickBill={setShowQuickBill}
        combinedTotal={combinedTotal}
        dineInOrderItems={dineInOrderItems}
        takeawayOrderItems={takeawayOrderItems}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        handlePay={handlePay}
        clearOrder={clearOrder}
      />
    </>
  );
}