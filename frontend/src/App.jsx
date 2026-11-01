import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DisasterEventsView } from './components/DisasterEventsView';
import { EmergencyRequestsView } from './components/EmergencyRequestsView';
import { IncidentReportsView } from './components/IncidentReportsView';
import { ResourcesView } from './components/ResourcesView';
import { DistributionsView } from './components/DistributionsView';
import { SheltersView } from './components/SheltersView';
import { VolunteersView } from './components/VolunteersView';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#172033] flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
        {activeTab === 'events' && <DisasterEventsView />}
        {activeTab === 'requests' && <EmergencyRequestsView />}
        {activeTab === 'incidents' && <IncidentReportsView />}
        {activeTab === 'resources' && <ResourcesView />}
        {activeTab === 'distributions' && <DistributionsView />}
        {activeTab === 'shelters' && <SheltersView />}
        {activeTab === 'volunteers' && <VolunteersView />}
      </main>

      <footer className="bg-white border-t border-[#D8DEE8] py-6 mt-auto text-xs text-[#5B6475] text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-[#172033]">
            Disaster Relief and Emergency Management System
          </p>
          <p className="mt-1">
            Connected to Live MySQL Database (<code>disaster_relief_db</code>) &amp; Laravel 12 API Backend (<code>http://localhost:8000/api</code>)
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
