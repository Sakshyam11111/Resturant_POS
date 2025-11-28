// src/components/TableManagement.jsx
import React, { useState, useEffect, useRef } from 'react'
import {
  Home,
  Receipt,
  Calendar,
  Clock,
  Users,
  Settings,
  LogOut,
  User,
  Menu,
  ChevronDown,
  FileText, 
  Folder,
  DollarSign,
  ChevronUp,
  X,
  BarChart
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import OrderSidebar from './OrderSidebar'
import ReservationForm from './ReservationForm'
import TakeawayForm from './TakeawayForm'

const API_URL = 'http://localhost:5000/api'

const WAITERS = [
  { id: uuidv4(), name: 'Ram Bahadur' },
  { id: uuidv4(), name: 'Sita Sharma' },
  { id: uuidv4(), name: 'Gopal Singh' },
  { id: uuidv4(), name: 'Anita Patel' },
  { id: uuidv4(), name: 'Raj Kumar' }
]

const TableManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [masterOpen, setMasterOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('All')
  const [selectedFloor, setSelectedFloor] = useState('First Floor')
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [showTakeawayForm, setShowTakeawayForm] = useState(false)
  const [reservationStep, setReservationStep] = useState(1)
  const [activityData, setActivityData] = useState([])
  const [assignModal, setAssignModal] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const hasFetched = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarOpen])

  const [tables, setTables] = useState(() =>
    [
      { id: uuidv4(), no: 1, status: 'available', seats: 4 },
      { id: uuidv4(), no: 2, status: 'available', seats: 6 },
      { id: uuidv4(), no: 3, status: 'available', seats: 4 },
      { id: uuidv4(), no: 4, status: 'available', seats: 4 },
      { id: uuidv4(), no: 5, status: 'available', seats: 8 },
      { id: uuidv4(), no: 6, status: 'available', seats: 4 },
      { id: uuidv4(), no: 7, status: 'available', seats: 6 },
      { id: uuidv4(), no: 8, status: 'available', seats: 4 },
      { id: uuidv4(), no: 9, status: 'available', seats: 10 },
      { id: uuidv4(), no: 10, status: 'available', seats: 4 },
      { id: uuidv4(), no: 11, status: 'available', seats: 6 },
      { id: uuidv4(), no: 12, status: 'available', seats: 2 },
      { id: uuidv4(), no: 13, status: 'available', seats: 4 },
      { id: uuidv4(), no: 14, status: 'available', seats: 6 },
      { id: uuidv4(), no: 15, status: 'available', seats: 8 },
    ].map((t, i) => ({
      ...t,
      waiterId: WAITERS[i % WAITERS.length].id,
      waiterName: WAITERS[i % WAITERS.length].name
    }))
  )

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchData = async () => {
      try {
        const [resRes, takeRes] = await Promise.all([
          fetch(`${API_URL}/reservations`).then(r => r.json()),
          fetch(`${API_URL}/takeaways`).then(r => r.json())
        ])

        const today = new Date().toISOString().split('T')[0]
        const reservations = Array.isArray(resRes) ? resRes : resRes?.data || []
        const relevant = reservations.filter(r => r.date && new Date(r.date).toISOString().split('T')[0] >= today)

        const formatTime = t => {
          if (!t) return ''
          const [h, m] = t.split(':')
          const hr = parseInt(h)
          const ampm = hr >= 12 ? 'PM' : 'AM'
          const dh = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr
          return `${dh}:${m || '00'} ${ampm}`
        }

        const reservationItems = relevant.map(r => ({
          id: r._id || r.id,
          type: 'reservation',
          name: r.customerName || 'Guest',
          time: `${formatTime(r.fromTime)} – ${formatTime(r.toTime)}`,
          people: r.guests || 1,
          table: `Table #${r.tableNumber}`,
          tableId: r.tableId
        }))

        const takeaways = Array.isArray(takeRes) ? takeRes : takeRes?.data || []
        const takeawayItems = takeaways.map(t => ({
          id: t._id || t.id,
          type: 'takeaway',
          orderId: t.orderId,
          customer: t.customerName,
          time: new Date(t.orderDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          items: t.items?.length ? `${t.items.length} item${t.items.length > 1 ? 's' : ''}` : 'No items',
          status: t.status
        }))

        setActivityData([...reservationItems, ...takeawayItems])

        const reservedIds = relevant
          .map(r => r.tableId || tables.find(tbl => tbl.no === parseInt(r.tableNumber))?.id)
          .filter(Boolean)

        setTables(prev => prev.map(t => ({
          ...t,
          status: reservedIds.includes(t.id) ? 'reserved' : 'available'
        })))
      } catch (e) {
        console.error('Fetch error:', e)
      }
    }

    fetchData()
  }, [])

  const handleReservationSuccess = newRes => {
    const formatTime = t => {
      const [h, m] = t.split(':')
      const hr = parseInt(h)
      const ampm = hr >= 12 ? 'PM' : 'AM'
      const dh = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr
      return `${dh}:${m || '00'} ${ampm}`
    }

    const tbl = tables.find(t => t.no === parseInt(newRes.tableNumber))
    if (!tbl) return

    const item = {
      id: newRes._id || Date.now(),
      type: 'reservation',
      name: newRes.customerName,
      time: `${formatTime(newRes.fromTime)} – ${formatTime(newRes.toTime)}`,
      people: newRes.guests,
      table: `Table #${newRes.tableNumber}`,
      tableId: tbl.id
    }

    setActivityData(prev => [item, ...prev])
    setTables(prev => prev.map(t => t.id === tbl.id ? { ...t, status: 'reserved' } : t))
  }

  const handleTakeawaySuccess = newTake => {
    const item = {
      id: newTake._id || Date.now(),
      type: 'takeaway',
      orderId: newTake.orderId,
      customer: newTake.customerName,
      time: new Date(newTake.orderDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      items: newTake.items?.length ? `${newTake.items.length} item${newTake.items.length > 1 ? 's' : ''}` : 'No items',
      status: newTake.status
    }
    setActivityData(prev => [item, ...prev])
  }

  const openAssignModal = id => setAssignModal({ tableId: id })
  const closeAssignModal = () => setAssignModal(null)

  const assignWaiter = (tableId, waiterId) => {
    const waiter = WAITERS.find(w => w.id === waiterId)
    setTables(prev => prev.map(t =>
      t.id === tableId ? { ...t, waiterId, waiterName: waiter?.name ?? null } : t
    ))
    closeAssignModal()
  }

  const filteredData = activityData.filter(item =>
    activeTab === 'All' ? true : item.type === activeTab.toLowerCase()
  )

  const isTakeawayActive = activeTab === 'Takeaway'
  const buttonText = isTakeawayActive ? 'New Takeaway Order' : 'New Reservation'
  const buttonColor = isTakeawayActive ? 'bg-[#3673B4] hover:bg-[#3673B4]' : 'bg-[#3673B4] hover:bg-[#2c5d94]'

  const getGridCols = () => {
    if (isMobile) return 'grid-cols-2'
    return 'grid-cols-5'
  }

  return (
    <div className="h-screen w-screen bg-gray-50 flex overflow-hidden text-sm">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
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
              className="text-xl font-bold tracking-tight mr-32"
              style={{ color: '#3673B4' }}
            >
              Logo
            </span>
          )}
        </div>

        <div className="flex flex-col items-center py-6 space-y-6 flex-1">
          <NavItem icon={Home} label="Home" expanded={sidebarOpen} active />
          <NavItem icon={DollarSign} label="PSO" expanded={sidebarOpen} />

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
                  'Menu Group',
                  'Menu Create',
                  'Location Create',
                  'Table Create',
                  'Waiter Create',
                  'Table Split'
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

      <OrderSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activityData={activityData}
        setActivityData={setActivityData}
        filteredData={filteredData}
        isTakeawayActive={isTakeawayActive}
        buttonText={buttonText}
        buttonColor={buttonColor}
        showReservationForm={showReservationForm}
        setShowReservationForm={setShowReservationForm}
        showTakeawayForm={showTakeawayForm}
        setShowTakeawayForm={setShowTakeawayForm}
        reservationStep={reservationStep}
        setReservationStep={setReservationStep}
        tables={tables}
        setTables={setTables}
        selectedFloor={selectedFloor}
        isMobile={isMobile}
      />

      <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <div
          className={`
            flex-1 transition-all duration-300
            ${sidebarOpen && !isMobile}
          `}
        >
          <div className="p-4 md:p-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Tables – {selectedFloor}</h1>
              <div className="flex gap-2">
                {['First Floor', 'Second Floor'].map(floor => (
                  <button
                    key={floor}
                    onClick={() => setSelectedFloor(floor)}
                    className={`px-3 md:px-5 py-2 rounded-lg text-xs md:text-sm font-medium transition ${selectedFloor === floor
                        ? 'bg-[#3673B4] text-white'
                        : 'bg-white text-gray-700 border border-gray-300'
                      }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8 text-xs font-medium mb-6">
              <LegendItem color="bg-[#3673B4]" label="Available" />
              <LegendItem color="bg-[#1ABB83]" label="Reserved" />
              <LegendItem color="bg-[#FF6366]" label="On Dine" />
            </div>

            <div className="flex-1 flex items-center justify-center px-4 md:px-8 pb-10 overflow-auto">
              <div className={`grid ${getGridCols()} gap-4 md:gap-10 max-w-6xl w-full`}>
                {tables.map(table => (
                  <TableCircle
                    key={table.id}
                    table={table}
                    navigate={navigate}
                    onAssignWaiter={openAssignModal}
                    allTables={tables}
                    waiters={WAITERS}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReservationForm && (
        <ReservationForm
          onClose={() => {
            setShowReservationForm(false)
            setReservationStep(1)
          }}
          currentStep={reservationStep}
          setStep={setReservationStep}
          tables={tables}
          selectedFloor={selectedFloor}
          navigate={navigate}
          onReservationSubmit={handleReservationSuccess}
          isMobile={isMobile}
        />
      )}

      {showTakeawayForm && (
        <TakeawayForm
          onClose={() => setShowTakeawayForm(false)}
          navigate={navigate}
          onTakeawaySubmit={handleTakeawaySuccess}
          isMobile={isMobile}
        />
      )}

      {assignModal && (
        <WaiterAssignModal
          table={tables.find(t => t.id === assignModal.tableId)}
          waiters={WAITERS}
          onAssign={assignWaiter}
          onClose={closeAssignModal}
          isMobile={isMobile}
        />
      )}
    </div>
  )
}

const NavItem = ({ icon: Icon, label, expanded, active = false }) => (
  <div
    className={`
      flex items-center w-full px-3 transition-all
      ${expanded ? 'justify-start' : 'justify-center'}
      ${active ? 'text-[#3673B4]' : 'text-gray-500'}
    `}
  >
    <button
      className={`
        w-10 h-10 rounded-xl flex items-center justify-center transition-all
        ${active ? 'bg-[#E3F2FD] shadow-lg' : 'hover:bg-gray-100 hover:text-gray-700'}
      `}
    >
      <Icon className="w-5 h-5" strokeWidth={2} />
    </button>

    {expanded && <span className="ml-3 flex-1 text-left">{label}</span>}
  </div>
)

const TableCircle = ({ table, navigate, onAssignWaiter, allTables, waiters, isMobile }) => {
  const color =
    table.status === 'available' ? 'bg-[#3673B4]' :
      table.status === 'reserved' ? 'bg-[#1ABB83]' :
        'bg-[#FF6366]'

  const label =
    table.status === 'available' ? 'Free' :
      table.status === 'reserved' ? 'Reserved' : 'Dining'

  const handleClick = () => {
    navigate(`/pos?table=${table.no}`, { state: { tableData: table, waiters, allTables } })
  }

  const handleAssign = e => {
    e.stopPropagation()
    onAssignWaiter(table.id)
  }

  const tableSize = isMobile ? 'w-24 h-24' : 'w-32 h-32'
  const fontSize = isMobile ? 'text-2xl' : 'text-3xl'

  return (
    <div className="group relative">
      <div
        className={`
          ${tableSize} ${color} rounded-full flex flex-col items-center justify-center
          text-white shadow-lg transition-all border-6 border-white
          hover:scale-110 hover:shadow-xl active:scale-95 cursor-pointer
        `}
        onClick={handleClick}
      >
        <span className={`${fontSize} font-bold`}>#{table.no}</span>
        <span className="text-xs mt-1 px-2 py-0.5 bg-black/30 rounded-full font-medium">
          {label}
        </span>
      </div>

      <p className="text-center mt-2 md:mt-4 text-xs md:text-sm text-gray-600 font-medium">{table.seats} seats</p>

      <button
        onClick={handleAssign}
        className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition"
        title="Change Waiter"
      >
        <User className="w-4 h-4 text-gray-700" />
      </button>
    </div>
  )
}

const WaiterAssignModal = ({ table, waiters, onAssign, onClose, isMobile }) => {
  const [selected, setSelected] = useState(table.waiterId || '')

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${isMobile ? 'max-w-sm' : 'max-w-md'} p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Assign Waiter – Table #{table.no}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {waiters.map(waiter => (
            <label
              key={waiter.id}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition"
            >
              <input
                type="radio"
                name="waiter"
                value={waiter.id}
                checked={selected === waiter.id}
                onChange={e => setSelected(e.target.value)}
                className="w-4 h-4 text-[#3673B4]"
              />
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                {waiter.name}
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onAssign(table.id, selected)}
            disabled={!selected}
            className="px-4 py-2 bg-[#3673B4] text-white rounded-lg hover:bg-[#2c5d94] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  )
}

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 ${color} rounded-full`} />
    <span className="text-gray-700 text-xs md:text-sm">{label}</span>
  </div>
)

export default TableManagement