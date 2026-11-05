import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  FileText, 
  Package, 
  Share2, 
  LayoutDashboard,
  ShieldAlert,
  Home,
  HeartHandshake,
  LogOut,
  Building2,
  ShieldCheck,
  LogIn
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, user: propUser, onLogout }) {
  const [currentUser, setCurrentUser] = useState(propUser || null);

  useEffect(() => {
    if (propUser) {
      setCurrentUser(propUser);
      return;
    }
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      setCurrentUser(null);
    }
  }, [propUser]);

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Disaster Events', icon: ShieldAlert },
    { id: 'requests', label: 'Emergency Requests', icon: AlertTriangle },
    { id: 'incidents', label: 'Incident Reports', icon: FileText },
    { id: 'resources', label: 'Resources Inventory', icon: Package },
    { id: 'distributions', label: 'Distribution Ledger', icon: Share2 },
    { id: 'shelters', label: 'Shelters', icon: Home },
    { id: 'volunteers', label: 'Volunteers', icon: HeartHandshake },
  ];

  const isAdmin = currentUser?.role === 'admin';
  const isOrg = currentUser?.role === 'organization';

  return (
    <header className="bg-white border-b border-[#D8DEE8] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h4l2 2 2.5-8 3 14 2.5-8H21" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#172033] leading-tight">
                Disaster Relief Management
              </h1>
              <p className="text-xs text-[#5B6475]">Emergency Operations Command</p>
            </div>
          </div>

          {/* Right Action Bar: Status Badge + Auth Profile & Logout */}
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live DB
            </span>

            {currentUser ? (
              <div className="flex items-center gap-3 pl-3 border-l border-[#D8DEE8]">
                {/* User Identity Details */}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs ${
                    isAdmin ? 'bg-blue-600' : 'bg-emerald-600'
                  }`}>
                    {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold text-[#172033] leading-tight">
                      {currentUser.name}
                    </p>
                    <p className="text-[11px] text-[#5B6475] font-medium leading-none mt-0.5">
                      {isAdmin && (
                        <span className="text-blue-600 font-semibold">Administrator</span>
                      )}
                      {isOrg && (
                        <span className="text-emerald-700 font-semibold truncate max-w-[140px] inline-block">
                          {currentUser.organization?.name || 'Organization Coordinator'}
                        </span>
                      )}
                      {!isAdmin && !isOrg && (
                        <span className="capitalize">{currentUser.role || 'Staff'}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out of Command Portal"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 transition-colors shadow-xs cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </a>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto border-t border-[#F1F5F9] pt-1 -mb-px">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#1D4ED8] text-[#1D4ED8]'
                    : 'border-transparent text-[#5B6475] hover:text-[#172033] hover:border-[#D8DEE8]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1D4ED8]' : 'text-[#5B6475]'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;