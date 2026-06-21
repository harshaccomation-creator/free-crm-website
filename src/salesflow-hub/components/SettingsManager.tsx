import React, { useState } from 'react';
import { SystemSettings, Company, User, SaaSPlan, Lead, SystemLog } from '../types';
import {
  Sliders,
  Database,
  Shield,
  Download,
  Terminal,
  Activity,
  HardDrive,
  Save,
  Radio,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface SettingsManagerProps {
  settings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
  // Whole DB state to download backup
  companies: Company[];
  users: User[];
  plans: SaaSPlan[];
  leads: Lead[];
  logs: SystemLog[];
}

export default function SettingsManager({
  settings,
  onUpdateSettings,
  companies,
  users,
  plans,
  leads,
  logs
}: SettingsManagerProps) {
  const [systemName, setSystemName] = useState(settings.systemName);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(settings.sessionTimeoutMinutes);

  const handleToggle = (key: keyof SystemSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleSaveTextSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      systemName,
      sessionTimeoutMinutes
    });
    alert('Platform variables successfully updated on internal settings cluster.');
  };

  // Perform genuine Database download backup!
  const triggerDatabaseBackupDownload = () => {
    try {
      const fullCRMDatabase = {
        meta: {
          platform: 'SalesFlow Hub CRM Super Admin Console',
          version: '4.8.2-enterprise',
          exportedAt: new Date().toISOString(),
          actor: 'Sania Banik (baniksania231@gmail.com)'
        },
        payload: {
          settings,
          companies,
          users,
          plans,
          leads,
          logs
        }
      };

      const fileString = JSON.stringify(fullCRMDatabase, null, 2);
      const blob = new Blob([fileString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `salesflow_crm_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to construct relational JSON dump file.');
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="h-5 w-5 text-blue-400" />
          Platform Cluster Settings
        </h2>
        <p className="text-xs text-slate-400">
          Enforce MFA protocol gates, toggle global registrations, customize platform labels, and downscale database dumps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Settings Forms panel */}
        <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-5 lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="h-4.5 w-4.5 text-blue-400" />
            <h3 className="font-bold text-white text-sm">Cluster Variables</h3>
          </div>

          <form onSubmit={handleSaveTextSettings} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Platform System Label</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#0d1321] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">Session Timeout Period (Min)</label>
                <input
                  type="number"
                  min="5"
                  required
                  className="w-full bg-[#0d1321] border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none"
                  value={sessionTimeoutMinutes}
                  onChange={(e) => setSessionTimeoutMinutes(parseInt(e.target.value) || 30)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-1 shadow-md shadow-blue-500/10"
            >
              <Save className="h-3.5 w-3.5" /> Save Cluster Parameters
            </button>
          </form>

          {/* Inline Toggles */}
          <div className="border-t border-slate-800 pt-5 space-y-4">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Gate Security Toggles</h4>

            <div className="space-y-3.5">
              {/* Toggle: Maintenance Mode */}
              <div className="flex items-center justify-between p-3 bg-[#0d1321]/40 border border-slate-800/80 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-white">Platform Maintenance Mode</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Locks out customer domains and displays temporary warning screen.</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('maintenanceMode')}
                  className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  {settings.maintenanceMode ? (
                    <ToggleRight className="h-8 w-8 text-rose-500" />
                  ) : (
                    <ToggleLeft className="h-8 w-8 text-slate-500" />
                  )}
                </button>
              </div>

              {/* Toggle: Open registration */}
              <div className="flex items-center justify-between p-3 bg-[#0d1321]/40 border border-slate-800/80 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-white">Enable Open Tenant Registration</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Allows new customer domains to auto-register on Starter pricing rates.</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('allowNewRegistrations')}
                  className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  {settings.allowNewRegistrations ? (
                    <ToggleRight className="h-8 w-8 text-blue-500" />
                  ) : (
                    <ToggleLeft className="h-8 w-8 text-slate-500" />
                  )}
                </button>
              </div>

              {/* Toggle: MFA Enforced */}
              <div className="flex items-center justify-between p-3 bg-[#0d1321]/40 border border-slate-800/80 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-white">Enforce Multi-Factor MFA Rules</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Requires secure OTP app credentials for all legal tenant account owners.</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle('mfaEnforced')}
                  className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  {settings.mfaEnforced ? (
                    <ToggleRight className="h-8 w-8 text-blue-500" />
                  ) : (
                    <ToggleLeft className="h-8 w-8 text-slate-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Database backup portal panel on right */}
        <div className="space-y-6 lg:col-span-1">
          {/* Actionable Backup Download */}
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-4.5 w-4.5 text-blue-400" />
              <h3 className="font-bold text-white text-sm">Direct CRM Data Backup</h3>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Extract a secure, relational database backup file immediately containing all accounts, leads records, settings, and logs.
            </p>

            <button
              onClick={triggerDatabaseBackupDownload}
              className="w-full bg-[#1c2436] hover:bg-[#25324c] border border-slate-700 hover:text-white text-slate-300 font-semibold text-xs py-3 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="h-4 w-4 text-blue-400" /> Download SQL-formatted JSON
            </button>
          </div>

          {/* System Performance gauges */}
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4.5 w-4.5 text-blue-400 animate-pulse" />
              <h3 className="font-bold text-white text-sm">Cluster Telemetry</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
                <span>Database engine:</span>
                <span className="font-mono text-white">PostgreSQL (Serverless v16)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
                <span>Server zone:</span>
                <span className="font-mono text-white">asia-southeast1 (Cloud Run)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-slate-400">
                <span>Host Status:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  Operational
                </span>
              </div>
              <div className="flex justify-between py-1 text-slate-400">
                <span>Total records cached:</span>
                <span className="font-mono text-white">{companies.length + users.length + leads.length + logs.length} nodes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
