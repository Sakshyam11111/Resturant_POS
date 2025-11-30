import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Menu } from 'lucide-react'

import OrderSidebar from './OrderSidebar'
import ReservationForm from './ReservationForm'
import TakeawayForm from './TakeawayForm'
import Sidebar from './Sidebar'
import TableDisplay from './TableDisplay'
import WaiterAssignModal from './WaiterAssignModal'

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

  return (
    <div className="h-screen w-screen bg-gray-50 flex overflow-hidden text-sm">
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        isMobile={isMobile} 
      />

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
          <TableDisplay 
            tables={tables}
            selectedFloor={selectedFloor}
            setSelectedFloor={setSelectedFloor}
            navigate={navigate}
            onAssignWaiter={openAssignModal}
            waiters={WAITERS}
            isMobile={isMobile}
          />
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

export default TableManagement