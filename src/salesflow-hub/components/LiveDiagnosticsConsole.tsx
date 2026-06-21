import { useState, useEffect } from 'react';
import { Play, RotateCw, Shield, AlertCircle, CheckCircle, Flame, Cpu, ToggleLeft, ToggleRight, Radio } from 'lucide-react';

interface LogMessage {
  time: string;
  type: 'info' | 'success' | 'warn' | 'error';
  msg: string;
}

interface LiveDiagnosticsProps {
  onAddSystemLog: (category: 'System' | 'Billing' | 'Security', message: string, status: 'success' | 'info' | 'warning' | 'error') => void;
  onAddNotification: (notif: { title: string; desc: string; category: string }) => void;
  onShowToast: (msg: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  onRemedyIssuesCount: () => void;
}

export default function LiveDiagnosticsConsole({
  onAddSystemLog,
  onAddNotification,
  onShowToast,
  onRemedyIssuesCount
}: LiveDiagnosticsProps) {
  // Live Metrics States (fluctuating naturally for authentic feel)
  const [cpu, setCpu] = useState(41.4);
  const [ram, setRam] = useState(48.2);
  const [sockets, setSockets] = useState(2108);
  const [latency, setLatency] = useState(12);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Diagnostics Progress States
  const [activeTask, setActiveTask] = useState<'none' | 'secScan' | 'rebuildMemory' | 'testSLA'>('none');
  const [progress, setProgress] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<LogMessage[]>([
    { time: '12:45:01', type: 'info', msg: 'SuperAdmin NOC environment initialized successfully.' },
    { time: '12:45:02', type: 'success', msg: 'Database shard routers response metric: OK (12ms)' }
  ]);

  // Handle subtle fluctuations
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setCpu((prev) => {
        const delta = (Math.random() - 0.5) * 6;
        return parseFloat(Math.max(10, Math.min(95, prev + delta)).toFixed(1));
      });
      setRam((prev) => {
        const delta = (Math.random() - 0.5) * 1.5;
        return parseFloat(Math.max(20, Math.min(90, prev + delta)).toFixed(1));
      });
      setSockets((prev) => prev + Math.floor(Math.random() * 7 - 3));
      setLatency((prev) => {
        const delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 2 : -2) : 0;
        return Math.max(4, Math.min(48, prev + delta));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Append customized logs to our terminal and app state
  const addTerminalLog = (msg: string, type: LogMessage['type']) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setConsoleLogs((prev) => [{ time: timeStr, type, msg }, ...prev].slice(0, 15));
  };

  // 1. Simulate Security & Encryption Core verification scan
  const startSecurityScan = () => {
    if (activeTask !== 'none') {
      onShowToast('Another administrative diagnostic sequence is currently active.', 'warning');
      return;
    }
    setActiveTask('secScan');
    setProgress(0);
    addTerminalLog('Initiated global multi-tenant security verification matrix...', 'info');
    onShowToast('Initiating Global SHA-256 Token Shard Integrity Scan...', 'info');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);

      if (currentProgress === 20) {
        addTerminalLog('Verifying custom domain SSL mappings & corporate SSL cert chain...', 'info');
      } else if (currentProgress === 50) {
        addTerminalLog('Auditing administrative endpoint access lists (ACL) controls...', 'warn');
      } else if (currentProgress === 80) {
        addTerminalLog('Synthesizing threat signatures and intrusion prevention snapshots...', 'success');
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setActiveTask('none');
        addTerminalLog('SSL / TLS certificate chain & shard authentication: EXTREMELY SECURE (100% Integrity)', 'success');
        onAddSystemLog('Security', 'Completed security audit sweep. No policy intrusions detected.', 'success');
        onShowToast('Security Core Scan completed! 100% Cryptographic Integrity verified.', 'success');
      }
    }, 450);
  };

  // 2. Memory optimizer
  const triggerMemoryRecovery = () => {
    if (activeTask !== 'none') {
      onShowToast('Diagnostics channel busy. Wait for current operation to terminate.', 'warning');
      return;
    }
    setActiveTask('rebuildMemory');
    setProgress(0);
    addTerminalLog('Initiating memory compaction sweep on Node clusters...', 'info');
    onShowToast('Compacting Node RAM Buffers...', 'info');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      if (currentProgress === 30) {
        addTerminalLog('Forcing garbage collection on active CRM session sockets...', 'info');
      } else if (currentProgress === 60) {
        addTerminalLog('Purging ephemeral webhook queue cache buffers...', 'success');
      } else if (currentProgress === 85) {
        addTerminalLog('Optimizing indexing trees for tenant billing data metrics...', 'info');
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setActiveTask('none');
        setRam(41.2); // Settle memory load
        addTerminalLog('Buffer compilation sweep successful. Freed up 680MB heap memory pools.', 'success');
        onRemedyIssuesCount(); // Remediates critical dashboard issues!
        onAddSystemLog('System', 'Triggered Garbage Compaction on cluster: Recovered 680MB RAM.', 'success');
        onShowToast('Platform Node optimization complete. Critical database shards back to nominal stats!', 'success');
      }
    }, 180);
  };

  // 3. Test High SLA escalation simulation
  const simulateSLAGradeSpike = () => {
    if (activeTask !== 'none') return;
    setActiveTask('testSLA');
    setProgress(0);
    addTerminalLog('Simulating enterprise client incident trigger escalation process...', 'warn');
    onShowToast('Simulating high priority CRM client SLA ticket incident...', 'warning');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 25;
      setProgress(currentProgress);

      if (currentProgress === 50) {
        addTerminalLog('Dispatching automated SLA dispatch priority warning to target support center...', 'info');
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setActiveTask('none');
        addTerminalLog('Incident SLA escalation fully logged in central ticket queue.', 'error');
        onAddNotification({
          title: 'High Severity CRM Billing Alert',
          desc: 'Automated webhook retry failed 3 times for Apex Systems on production shard EU-4.',
          category: 'system'
        });
        onAddSystemLog('System', 'Urgent client SLA alert dispatched due to simulated retry exception.', 'error');
        onShowToast('SLA Escalation Simulated! Check Support Tickets & system logs.', 'error');
      }
    }, 300);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-slate-300 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-orange-500 animate-pulse" />
            <h4 className="font-extrabold text-slate-900 text-sm">Super Admin Interactive NOC & Diagnostics</h4>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Test platform fail-safes and run system checkups on live simulated metrics.
          </p>
        </div>

        {/* Live system simulator switch */}
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors font-bold text-slate-700 cursor-pointer"
        >
          {autoRefresh ? (
            <>
              <ToggleRight className="h-4 w-4 text-emerald-500" />
              <span>Telemetry Active</span>
            </>
          ) : (
            <>
              <ToggleLeft className="h-4 w-4 text-slate-400" />
              <span>Telemetry Paused</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of live stats representing real servers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-b border-slate-100">
        <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 hover:bg-slate-50 transition-colors">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Host CPU Limit</span>
            <Cpu className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-slate-800 font-mono">{cpu}%</span>
            <span className={`text-[9px] font-bold ${cpu > 80 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {cpu > 80 ? 'Stress Threshold' : 'Nominal'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
            <div
              className={`h-1 rounded-full transition-all duration-1000 ${cpu > 80 ? 'bg-rose-500' : 'bg-blue-600'}`}
              style={{ width: `${cpu}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 hover:bg-slate-50 transition-colors">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">RAM Compaction</span>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-slate-800 font-mono">{ram}%</span>
            <span className="text-[9px] font-bold text-slate-400">Memory Allocation</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
            <div
              className="bg-indigo-600 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${ram}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 hover:bg-slate-50 transition-colors">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Socket Streams</span>
            <Flame className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-slate-800 font-mono">{sockets.toLocaleString()}</span>
            <span className="text-[9px] font-bold text-emerald-500">Active</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
            <div
              className="bg-amber-500 h-1 rounded-full"
              style={{ width: `${(sockets / 3000) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 hover:bg-slate-50 transition-colors">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Database Ping</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-slate-800 font-mono">{latency}ms</span>
            <span className="text-[9px] font-bold text-emerald-600">Optimized</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
            <div
              className="bg-emerald-600 h-1 rounded-full transition-all"
              style={{ width: `${(latency / 50) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Simulator Actions triggers */}
      <div className="py-4">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
          Available Simulation Protocols
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={startSecurityScan}
            disabled={activeTask !== 'none'}
            className="flex items-center gap-2 justify-center bg-slate-900 text-white hover:bg-slate-800 transition-colors text-xs font-semibold px-4 py-2.5 rounded-md cursor-pointer disabled:opacity-50 border border-slate-800"
          >
            <Shield className={`h-4.5 w-4.5 text-blue-400 ${activeTask === 'secScan' ? 'animate-spin' : ''}`} />
            <span>Cryptographic Shard Audit</span>
          </button>

          <button
            onClick={triggerMemoryRecovery}
            disabled={activeTask !== 'none'}
            className="flex items-center gap-2 justify-center bg-slate-900 text-white hover:bg-slate-800 transition-colors text-xs font-semibold px-4 py-2.5 rounded-md cursor-pointer disabled:opacity-50 border border-slate-800"
          >
            <RotateCw className={`h-4.5 w-4.5 text-indigo-400 ${activeTask === 'rebuildMemory' ? 'animate-spin' : ''}`} />
            <span>Compact & Garbage Collect</span>
          </button>

          <button
            onClick={simulateSLAGradeSpike}
            disabled={activeTask !== 'none'}
            className="flex items-center gap-2 justify-center bg-rose-50 text-rose-750 hover:bg-rose-100 border border-rose-200 transition-colors text-xs font-semibold px-4 py-2.5 rounded-md cursor-pointer disabled:opacity-50"
          >
            <AlertCircle className="h-4.5 w-4.5 text-rose-600" />
            <span>Raise Cluster Incident SLA</span>
          </button>
        </div>
      </div>

      {/* Conditional Diagnostics progress block */}
      {activeTask !== 'none' && (
        <div className="mb-4 bg-blue-50/40 border border-blue-100 rounded-md p-3.5 mt-2">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <RotateCw className="h-3.5 w-3.5 text-blue-600 animate-spin" />
              Executing simulation drill matrix...
            </span>
            <span className="text-xs font-bold text-blue-600 font-mono">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-[#3b82f6] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Terminal View */}
      <div className="mt-2 bg-[#090d16] border border-slate-850 rounded-lg p-3.5">
        <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-2.5 text-slate-400 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="ml-1.5 text-slate-300 font-bold font-sans">NOC DIRECT LOG CONSOLE MATRIX</span>
          </div>
          <span className="font-bold text-slate-500 uppercase tracking-wide">Secure Terminal feed (Live)</span>
        </div>

        <div className="font-mono text-[10.5px] leading-relaxed max-h-32 overflow-y-auto space-y-1.5 scrollbar-thin">
          {consoleLogs.map((log, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <span className="text-slate-500 select-none">[{log.time}]</span>
              <span className={`font-bold select-none px-1 py-0.2 text-[9px] rounded uppercase ${
                log.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                log.type === 'error' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/25' :
                log.type === 'warn' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/25'
              }`}>
                {log.type}
              </span>
              <span className={`${
                log.type === 'error' ? 'text-rose-300 font-semibold' :
                log.type === 'success' ? 'text-emerald-300' :
                log.type === 'warn' ? 'text-amber-300' :
                'text-slate-300'
              }`}>
                {log.msg}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
