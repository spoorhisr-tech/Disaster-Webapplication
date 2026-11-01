import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  FileText, 
  Package, 
  Share2, 
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Disaster Events', icon: ShieldAlert },
    { id: 'requests', label: 'Emergency Requests', icon: AlertTriangle },
    { id: 'incidents', label: 'Incident Reports', icon: FileText },
    { id: 'resources', label: 'Resources Inventory', icon: Package },
    { id: 'distributions', label: 'Distribution Ledger', icon: Share2 },
  ];

  return (
    <header className="bg-white border-b border-[#D8DEE8] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1D4ED8] flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#172033] leading-tight">
                Disaster Relief Management
              </h1>
              <p className="text-xs text-[#5B6475]">Emergency Coordination Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Connected
            </span>
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
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
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
