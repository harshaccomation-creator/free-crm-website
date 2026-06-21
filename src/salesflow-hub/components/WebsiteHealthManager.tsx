import React, { useState } from 'react';
import { 
  Globe, 
  Activity, 
  Cpu, 
  Database, 
  ShieldAlert, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Server,
  Network
} from 'lucide-react';
import { HealthIssue } from '../types';

interface HealthProps {
  issues: HealthIssue[];
  onResolveIssue: (id: string) => void;
  onResetIssues: () => void;
  onAddIssue?: (issue: HealthIssue) => void;
}

export default function WebsiteHealthManager({ issues, onResolveIssue, onResetIssues, onAddIssue }: HealthProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'warnings'>('all');
  const [systemPinging, setSystemPinging] = useState(false);

  // Custom Bug Injection Modal States
  const [showInjectBugModal, setShowInjectBugModal] = useState(false);
  const [newBugService, setNewBugService] = useState('Payment Gateway');
  const [newBugSeverity, setNewBugSeverity] = useState<'critical' | 'warning'>('warning');
  const [newBugMessage, setNewBugMessage] = useState('SSL handshake timeout resulting in network request drop.');
  const [newBugMetric, setNewBugMetric] = useState('TCP 504 Gateway Delay');
  const [newBugImpact, setNewBugImpact] = useState('Tier-1 Core Database');

  const handleManualRemediate = (id: string, service: string) => {
    onResolveIssue(id);
    alert(`Successfully applied remedial configuration to service cluster: [${service}]! Issue resolved, telemetry counters synchronized.`);
  };

  const handleManualDiagnosticPing = () => {
    setSystemPinging(true);
    setTimeout(() => {
      setSystemPinging(false);
      alert('Manual Cluster Endpoint Ping successful! Heartbeat verified across all 14 global tenant database shards.');
    }, 1250);
  };

  const submitCustomBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBugService.trim() || !newBugMessage.trim() || !newBugMetric.trim() || !newBugImpact.trim()) {
      alert('Please fill out all fields of the anomaly report.');
      return;
    }
    if (onAddIssue) {
      onAddIssue({
        id: `issue_${Date.now()}`,
        service: newBugService.trim(),
        status: newBugSeverity,
        message: newBugMessage.trim(),
        metric: newBugMetric.trim(),
        impactLevel: newBugImpact.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Just Now'
      });
      setShowInjectBugModal(false);
      
      // Reset defaults
      setNewBugService('Payment Gateway');
      setNewBugSeverity('warning');
      setNewBugMessage('SSL handshake timeout resulting in network request drop.');
      setNewBugMetric('TCP 504 Gateway Delay');
      setNewBugImpact('Tier-1 Core Database');
    }
  };

  const activeIssues = issues;
  const filteredIssues = activeIssues.filter((i) => {
    if (activeTab === 'critical') return i.status === 'critical';
    if (activeTab === 'warnings') return i.status === 'warning';
    return true;
  });

  // Calculate live health multiplier
  const baseHealth = 100 - (activeIssues.filter(i => i.status === 'critical').length * 15) - (activeIssues.filter(i => i.status === 'warning').length * 5);
  const healthPercentage = Math.max(0, Math.min(100, baseHealth));

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600 animate-spin-slow" />
            Website & Cluster Health Monitor
          </h2>
          <p className="text-xs text-slate-500">
            Audit operational health indicators, evaluate inbound gateway loads, and resolve CDN latency delays.
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleManualDiagnosticPing}
            disabled={systemPinging}
            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-55"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-blue-500 ${systemPinging ? 'animate-spin' : ''}`} /> 
            {systemPinging ? 'Pinging Shards...' : 'Broadcast Node Diagnostics'}
          </button>
          {onAddIssue && (
            <button
              onClick={() => setShowInjectBugModal(true)}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold px-3.5 py-2.5 rounded text-xs transition-colors shadow-sm cursor-pointer"
            >
              + Report New Bug
            </button>
          )}
          {activeIssues.length < 4 && (
            <button
              onClick={onResetIssues}
              className="bg-[#3b82f6] hover:bg-blue-600 font-bold text-white px-3.5 py-2.5 rounded text-xs transition-colors shadow-sm cursor-pointer"
            >
              Restore Initial Errors
            </button>
          )}
        </div>
      </div>

      {/* Main Health Status Dashboard indicator */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Core Global SLA Score Gauge */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">Platform Integrity</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className={`text-4xl font-extrabold ${healthPercentage > 85 ? 'text-emerald-600' : healthPercentage > 65 ? 'text-amber-500' : 'text-rose-600'} leading-none tracking-tight`}>
                {healthPercentage}%
              </h3>
              <span className="text-xs font-bold text-slate-500">of SLA limits</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Calculates database buffer ratios, API ingress queues, caching bounds, and active SSL validations.
            </p>
          </div>

          <div className="w-full bg-slate-100 border border-slate-200 h-2.5 rounded-full overflow-hidden mt-4">
            <div 
              className={`h-full transition-all duration-500 ${
                healthPercentage > 85 ? 'bg-emerald-500' : healthPercentage > 65 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
        </div>

        {/* Live Visitor Traffic & Telemetry Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">Live Website Traffic</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <h3 className="text-4xl font-extrabold text-blue-600 leading-none tracking-tight">158</h3>
              <span className="text-xs font-bold text-slate-500">visitors active</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Inbound gateway organic tunnel sessions: average workload of <strong>2,482 pageviews / hour</strong>.
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mt-4 pt-2.5 border-t border-slate-100 font-mono">
            <span>Bounce Rate: <strong className="text-slate-700 font-sans">24.1% Avg</strong></span>
            <span className="text-emerald-600 font-bold">Excellent</span>
          </div>
        </div>

        {/* Live Diagnostics Metrics Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-slate-705">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Ingress Network Bounds</span>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="space-y-1">
              <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5 text-blue-500" /> Web App CPU
              </div>
              <div className="text-md font-bold text-slate-900 leading-none">64.2% <span className="text-[10px] text-slate-400 font-normal">avg</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                <Database className="h-3.5 w-3.5 text-indigo-500" /> Database Conn
              </div>
              <div className="text-md font-bold text-slate-900 leading-none">74 / 200 <span className="text-[10px] text-slate-400 font-normal">pool</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5 text-orange-500" /> API Gateway Lag
              </div>
              <div className="text-md font-bold text-slate-900 leading-none">42ms <span className="text-[10px] text-slate-400 font-normal">p95</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-emerald-500" /> TLS Encryption
              </div>
              <div className="text-md font-bold text-slate-900 leading-none">Strong <span className="text-[10px] text-slate-400 font-normal">SSL v3</span></div>
            </div>
          </div>
        </div>

        {/* Global CDN nodes checklist */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-slate-705">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Edge Cluster Heartbeat</span>
          <div className="space-y-2 mt-3 font-semibold text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Network className="h-3.5 w-3.5 text-slate-400" /> US-East Edge</span>
              <span className="text-emerald-600 font-bold">● Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Network className="h-3.5 w-3.5 text-slate-400" /> AP-South Gateway</span>
              <span className="text-emerald-600 font-bold">● Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Network className="h-3.5 w-3.5 text-slate-400" /> EU-Central CDN</span>
              <span className="text-emerald-600 font-bold">● Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Network className="h-3.5 w-3.5 text-slate-400" /> EU-West CDN</span>
              <span className={`${activeIssues.some(i => i.service === 'EU CDN') ? 'text-amber-500 animate-pulse' : 'text-emerald-600'} font-bold`}>
                {activeIssues.some(i => i.service === 'EU CDN') ? '● Latency Peak' : '● Operational'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main warning blocks listed out */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Active Superadmin Alert Queue</h3>
            <p className="text-[11px] text-slate-500">The following {activeIssues.length} active anomalies are currently degrading service boundaries.</p>
          </div>
          
          <div className="flex gap-1.5">
            {[
              { id: 'all', val: 'All Alerts' },
              { id: 'critical', val: 'Critical Node' },
              { id: 'warnings', val: 'Warning' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-1 text-[10px] font-bold border rounded transition-colors cursor-pointer ${
                  activeTab === t.id 
                    ? 'bg-blue-600 text-white border-transparent' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-205'
                }`}
              >
                {t.val}
              </button>
            ))}
          </div>
        </div>

        {/* Warning cards lists */}
        <div className="space-y-3.5">
          {filteredIssues.length === 0 ? (
            <div className="p-8 border border-slate-150 rounded-lg bg-emerald-50/20 text-center space-y-2">
              <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-xs font-extrabold text-emerald-800">All Systems Are Green!</h4>
              <p className="text-[11px] text-emerald-600 max-w-sm mx-auto">Zero critical anomalies pending superadmin action. Edge CDN loads and replication heartbeats are perfectly synchronized.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div 
                key={issue.id} 
                className={`border p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                  issue.status === 'critical' 
                    ? 'bg-rose-50/20 border-rose-150/80 shadow-[0_1px_3px_rgba(244,63,94,0.03)]' 
                    : 'bg-amber-50/25 border-amber-155'
                }`}
              >
                <div className="flex items-start gap-3">
                  {issue.status === 'critical' ? (
                    <div className="p-2 bg-rose-50 rounded text-rose-600 shrink-0 border border-rose-100 mt-0.5 animate-pulse">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="p-2 bg-amber-55 rounded text-amber-600 shrink-0 border border-amber-100 mt-0.5">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        issue.status === 'critical' ? 'bg-rose-100/70 text-rose-700' : 'bg-amber-100/75 text-amber-700'
                      }`}>
                        {issue.status}
                      </span>
                      <h4 className="text-xs font-black text-slate-900">{issue.service} - Cluster Node Event</h4>
                    </div>
                    
                    <p className="text-[11px] font-semibold text-slate-700 mt-1.5">{issue.message}</p>
                    
                    <div className="text-[10px] text-slate-500 font-medium mt-1.5 flex flex-wrap gap-x-4 gap-y-1 items-center font-mono">
                      <span>Telemetry Peak: <span className="font-bold text-slate-800 font-sans">{issue.metric}</span></span>
                      <span>Impact Multiplier: <span className="font-bold text-slate-800">{issue.impactLevel}</span></span>
                      <span>Trigger: <span>{issue.timestamp}</span></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleManualRemediate(issue.id, issue.service)}
                  className={`px-4 py-2 bg-white text-xs font-bold rounded border shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors ${
                    issue.status === 'critical'
                      ? 'border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white hover:border-transparent'
                      : 'border-amber-250 text-amber-700 hover:bg-amber-600 hover:text-white hover:border-transparent'
                  }`}
                >
                  <Zap className="h-3 w-3" /> Execute Remedial Auto-Fix
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Bug Simulating Modal */}
      {showInjectBugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowInjectBugModal(false)} />
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md p-6 relative z-10 text-slate-800 shadow-2xl text-left">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="h-5 w-5 text-rose-500 animate-bounce" />
                  Inject Website Bug Anomaly
                </h3>
                <p className="text-[11px] text-slate-500">Simulate cluster/website exceptions to test resilience and auto-remediation triggers.</p>
              </div>
              <button 
                onClick={() => setShowInjectBugModal(false)}
                className="text-slate-400 hover:text-slate-600 font-extrabold text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitCustomBug} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-mono">Service Endpoint *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Credit Card API"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-805 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all"
                    value={newBugService}
                    onChange={(e) => setNewBugService(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-mono">Bug Severity Level</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700 font-bold cursor-pointer"
                    value={newBugSeverity}
                    onChange={(e) => setNewBugSeverity(e.target.value as any)}
                  >
                    <option value="warning">⚠️ Warning Alert</option>
                    <option value="critical">🚨 Critical / SLA</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-455 tracking-wider font-mono font-mono">Diagnostic Core Metric *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HTTP 502 Bad Gateway"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-805 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all"
                  value={newBugMetric}
                  onChange={(e) => setNewBugMetric(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-455 tracking-wider font-mono">System Impact Radius *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Billing Gateway Cluster"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-805 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all"
                  value={newBugImpact}
                  onChange={(e) => setNewBugImpact(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-455 tracking-wider font-mono">Anomaly Log Statement *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Signature failing from regional auth routing balancer."
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-805 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all resize-none font-sans"
                  value={newBugMessage}
                  onChange={(e) => setNewBugMessage(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInjectBugModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  Discard Form
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-black shadow-sm cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Deploy Exception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
