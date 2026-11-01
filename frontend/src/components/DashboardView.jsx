import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { StatusBadge } from './StatusBadge';
import { 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  Package, 
  Share2, 
  Home,
  HeartHandshake,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

export function DashboardView({ onNavigate }) {
  const [stats, setStats] = useState({
    eventsCount: 0,
    requestsPending: 0,
    requestsTotal: 0,
    incidentsCount: 0,
    resourcesCount: 0,
    distributionsCount: 0,
    sheltersCount: 0,
    volunteersCount: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [activeEvents, setActiveEvents] = useState([]);
  const [shelterSummaries, setShelterSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const [events, requests, incidents, resources, distributions, shelters, volunteers] = await Promise.all([
        api.getDisasterEvents().catch(() => []),
        api.getEmergencyRequests().catch(() => []),
        api.getIncidentReports().catch(() => []),
        api.getResources().catch(() => []),
        api.getDistributions().catch(() => []),
        api.getShelters().catch(() => []),
        api.getVolunteers().catch(() => []),
      ]);

      const evts = Array.isArray(events) ? events : [];
      const reqs = Array.isArray(requests) ? requests : [];
      const incs = Array.isArray(incidents) ? incidents : [];
      const res = Array.isArray(resources) ? resources : [];
      const dist = Array.isArray(distributions) ? distributions : [];
      const shlts = Array.isArray(shelters) ? shelters : [];
      const vol = Array.isArray(volunteers) ? volunteers : [];

      setStats({
        eventsCount: evts.length,
        requestsPending: reqs.filter((r) => r.status === 'pending').length,
        requestsTotal: reqs.length,
        incidentsCount: incs.length,
        resourcesCount: res.reduce((sum, r) => sum + (Number(r.quantity_available) || 0), 0),
        distributionsCount: dist.length,
        sheltersCount: shlts.length,
        volunteersCount: vol.filter((v) => v.is_available).length,
      });

      setRecentRequests(reqs.slice(0, 5));
      setActiveEvents(evts.slice(0, 4));
      setShelterSummaries(shlts.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const kpis = [
    {
      title: 'Active Disasters',
      value: stats.eventsCount,
      sub: 'Tracked in database',
      icon: ShieldAlert,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      tab: 'events',
    },
    {
      title: 'Emergency Requests',
      value: stats.requestsTotal,
      sub: `${stats.requestsPending} pending action`,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      tab: 'requests',
    },
    {
      title: 'Verified Incidents',
      value: stats.incidentsCount,
      sub: 'Hazard field reports',
      icon: FileText,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      tab: 'incidents',
    },
    {
      title: 'Warehouse Stock',
      value: stats.resourcesCount.toLocaleString(),
      sub: 'Relief units in stock',
      icon: Package,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      tab: 'resources',
    },
    {
      title: 'Relief Shelters',
      value: stats.sheltersCount,
      sub: 'Designated camps',
      icon: Home,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      tab: 'shelters',
    },
    {
      title: 'Active Volunteers',
      value: stats.volunteersCount,
      sub: 'Ready for deployment',
      icon: HeartHandshake,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      tab: 'volunteers',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#172033]">Operations Command Center</h2>
          <p className="text-sm text-[#5B6475]">
            Real-time live telemetry querying MySQL database tables directly.
          </p>
        </div>
        <button
          onClick={fetchOverview}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border border-[#D8DEE8] rounded-lg bg-white hover:bg-gray-50 transition cursor-pointer self-start"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Live Data
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate(kpi.tab)}
              className="bg-white rounded-xl border border-[#D8DEE8] p-4 shadow-xs hover:shadow-md hover:border-[#2563EB] transition cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#5B6475]">{kpi.title}</span>
                <div className={`p-1.5 rounded-lg ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-[#172033] tracking-tight">
                  {kpi.value}
                </div>
                <div className="text-[11px] text-[#5B6475] mt-0.5 flex items-center justify-between">
                  <span>{kpi.sub}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Active Disasters + Urgent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Events (1/3) */}
        <div className="bg-white rounded-xl border border-[#D8DEE8] p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#172033] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#1D4ED8]" />
              Active Disaster Zones
            </h3>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {activeEvents.length === 0 ? (
              <p className="text-xs text-[#5B6475] py-8 text-center">No active disasters in database.</p>
            ) : (
              activeEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onNavigate('events')}
                  className="p-3.5 rounded-lg border border-gray-100 hover:border-[#D8DEE8] bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#172033]">{evt.title}</span>
                    <StatusBadge status={evt.severity} />
                  </div>
                  <div className="text-xs text-[#5B6475] flex items-center justify-between mt-2">
                    <span>{evt.location_name}</span>
                    <span className="uppercase text-[10px] font-semibold">{evt.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Pending Emergency Requests (2/3) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#D8DEE8] p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#172033] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Latest Citizen Requests
            </h3>
            <button
              onClick={() => onNavigate('requests')}
              className="text-xs font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
            >
              Manage all
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9FC] text-[#5B6475] border-b border-gray-100 uppercase">
                <tr>
                  <th className="px-4 py-2.5">Ticket</th>
                  <th className="px-4 py-2.5">Requester</th>
                  <th className="px-4 py-2.5">Needs</th>
                  <th className="px-4 py-2.5">Priority</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-[#5B6475]">
                      No emergency requests logged yet in database.
                    </td>
                  </tr>
                ) : (
                  recentRequests.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() => onNavigate('requests')}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-[#1D4ED8]">
                        {req.request_number}
                      </td>
                      <td className="px-4 py-3 font-medium text-[#172033]">
                        {req.requester_name}
                      </td>
                      <td className="px-4 py-3 text-[#5B6475]">
                        {req.request_type} ({req.people_affected} affected)
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={req.priority} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={req.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
