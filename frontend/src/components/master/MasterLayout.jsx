// src/components/MasterLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, DollarSign, Folder, FileText, Settings, LogOut, Menu,
  ChevronDown, ChevronUp
} from 'lucide-react';

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

const MasterLayout = ({ children, title = "Master" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [masterOpen, setMasterOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On desktop → always open
      if (!mobile) setSidebarOpen(true);
      // On mobile → close when switching
      if (mobile && sidebarOpen) setSidebarOpen(false);
    };
    handleResize(); // initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const isMasterItemActive = (item) => {
    const path = `/${item.toLowerCase().replace(/\s+/g, '_')}`;
    return location.pathname === path;
  };

  const handleMasterItemClick = (item) => {
    const path = `/${item.toLowerCase().replace(/\s+/g, '_')}`;
    navigate(path);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
            <span className="text-xl font-bold tracking-tight mr-20" style={{ color: PRIMARY_BLUE }}>
              Logo
            </span>
          )}
        </div>

        <div className="flex flex-col items-center py-6 space-y-6 flex-1">
          <NavItem icon={Home} label="Home" expanded={sidebarOpen} onClick={() => navigate('/')} />
          <NavItem icon={DollarSign} label="POS" expanded={sidebarOpen} active={location.pathname === '/pos'} />

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
                    className={`
                      w-full text-left px-10 py-2 text-sm rounded-md transition
                      ${isMasterItemActive(item)
                        ? 'bg-[#E3F2FD] text-[#3673B4] font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
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

      <div className="flex-1 flex flex-col overflow-hidden">
        {isMobile && (
          <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between border-b">
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>
        )}

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MasterLayout;