import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { 
  FiMenu, 
  FiHome, 
  FiDollarSign, 
  FiCreditCard, 
  FiBell, 
  FiLogOut 
} from 'react-icons/fi';

const NavBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const { signOut } = useSupabaseAuth();

  const navItems = [
    { to: '/', icon: <FiHome />, text: 'Home' },
    { to: '/porcobrar', icon: <FiDollarSign />, text: 'Por Cobrar' },
    { to: '/porpagar', icon: <FiCreditCard />, text: 'Por Pagar' },
    { to: '/notificaciones', icon: <FiBell />, text: 'Notificaciones' },
  ];

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-zinc-600 text-white transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-18'}`}>
      {/* Menu Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-500">
        {isExpanded && <h1 className="text-xl font-bold">Menú</h1>}
        <button 
          onClick={toggleNavbar}
          className="p-2 rounded-full hover:bg-zinc-700 transition-colors"
          aria-label={isExpanded ? 'Collapse menu' : 'Expand menu'}
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.to} className="mb-2">
              <Link
                to={item.to}
                className={`flex items-center ${isExpanded ? 'px-4 py-4' : 'justify-center p-4'} hover:bg-zinc-700 transition-colors ${location.pathname === item.to ? 'bg-zinc-800' : ''}`}
              >
                <span className="text-xl">{item.icon}</span>
                {isExpanded && <span className="ml-4">{item.text}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-full p-4 border-t border-zinc-500">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 rounded hover:bg-zinc-700 transition-colors"
        >
          <span className="text-xl"><FiLogOut /></span>
          {isExpanded && <span className="ml-4">Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default NavBar;