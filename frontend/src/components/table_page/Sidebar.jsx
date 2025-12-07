// src/components/Sidebar.jsx (Updated - with navigation)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, DollarSign, Folder, FileText, Settings, LogOut, Menu,
  ChevronDown, ChevronUp
} from 'lucide-react';

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

const Sidebar = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
  const [masterOpen, setMasterOpen] = useState(false);
  const navigate = useNavigate();

  const handleMasterItemClick = (item) => {
    const path = `/${item.toLowerCase().replace(/\s+/g, '_')}`;
    navigate(path);
  };

  return (
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
            style={{ color: '#3673B4' }}
          >
            Logo
          </span>
        )}
      </div>

      <div className="flex flex-col items-center py-6 space-y-6 flex-1">
        <NavItem icon={Home} label="Home" expanded={sidebarOpen} active onClick={() => navigate('/table')} />
        <NavItem icon={DollarSign} label="POS" expanded={sidebarOpen} />

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
                  onClick={() => handleMasterItemClick(item)}
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
  );
};

export default Sidebar;