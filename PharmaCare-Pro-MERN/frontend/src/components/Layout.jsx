import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Pill, ReceiptText, Truck, BarChart3, Users, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/inventory', 'Inventory', Pill],
  ['/billing', 'POS Billing', ReceiptText],
  ['/suppliers', 'Suppliers', Truck],
  ['/sales', 'Sales History', BarChart3],
  ['/reports', 'Reports', BarChart3],
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const allowed = links.filter(([p]) => !['/reports'].includes(p) || user.role !== 'CASHIER');

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <aside className={`fixed z-30 inset-y-0 left-0 w-64 bg-[#0b1f3a] text-white transform ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div className="h-10 w-10 rounded-xl bg-[#f3ead7] text-[#0b1f3a] flex items-center justify-center">
            <Pill />
          </div>
          <div>
            <div className="font-bold">PharmaCare Pro</div>
            <div className="text-xs text-blue-200">Pharmacy Management</div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {allowed.map(([p, label, Icon]) => (
            <NavLink
              key={p}
              to={p}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? 'bg-brand-600 text-white shadow-md shadow-blue-900/40' : 'text-blue-100 hover:bg-white/10'}`}
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}

          {user.role !== 'CASHIER' && (
            <div className="pt-4">
              <div className="px-4 pb-2 text-xs uppercase tracking-wider text-blue-200">Administration</div>
              <NavLink
                to="/users"
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? 'bg-brand-600 text-white shadow-md shadow-blue-900/40' : 'text-blue-100 hover:bg-white/10'}`}
              >
                <Users size={19} />
                Users
              </NavLink>
            </div>
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <button
            onClick={() => {
              logout();
              nav('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-white/10 rounded-xl"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:ml-64 min-h-screen">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200 px-4 lg:px-7 py-4 flex justify-between items-center">
          <button className="lg:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>

          <div>
            <h1 className="font-bold text-lg">{user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.role}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
