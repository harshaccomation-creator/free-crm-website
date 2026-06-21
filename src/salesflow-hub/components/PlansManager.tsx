import React, { useState } from 'react';
import { SaaSPlan, PlanType } from '../types';
import {
  BarChart3,
  DollarSign,
  Users,
  Award,
  Check,
  Edit2,
  ListPlus,
  Save,
  Undo2,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface PlansManagerProps {
  plans: SaaSPlan[];
  onUpdatePlan: (plan: SaaSPlan) => void;
  onAddPlan?: (plan: SaaSPlan) => void;
}

export default function PlansManager({ plans, onUpdatePlan, onAddPlan }: PlansManagerProps) {
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  // Form states
  const [price, setPrice] = useState(0);
  const [maxUsers, setMaxUsers] = useState(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState('');

  // New Plan Creation states
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState(199);
  const [newPlanMaxUsers, setNewPlanMaxUsers] = useState(25);
  const [newPlanBillingCycle, setNewPlanBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [newPlanFeatures, setNewPlanFeatures] = useState<string[]>(['Basic CRM Panel', 'Custom integrations']);
  const [newFeatureInput, setNewFeatureInput] = useState('');

  const triggerEdit = (plan: SaaSPlan) => {
    setEditingPlanId(plan.id);
    setPrice(plan.price);
    setMaxUsers(plan.maxUsers);
    setBillingCycle(plan.billingCycle);
    setFeaturesList([...plan.features]);
    setNewFeatureText('');
  };

  const handleSave = (plan: SaaSPlan) => {
    onUpdatePlan({
      ...plan,
      price,
      maxUsers,
      billingCycle,
      features: featuresList
    });
    setEditingPlanId(null);
  };

  const addFeatureInput = () => {
    if (!newFeatureText.trim()) return;
    setFeaturesList([...featuresList, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const removeFeatureAt = (idx: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== idx));
  };

  const handleAddNewPlanFeatures = () => {
    if (!newFeatureInput.trim()) return;
    setNewPlanFeatures([...newPlanFeatures, newFeatureInput.trim()]);
    setNewFeatureInput('');
  };

  const removeNewPlanFeatureAt = (idx: number) => {
    setNewPlanFeatures(newPlanFeatures.filter((_, i) => i !== idx));
  };

  const submitNewPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) {
      alert('Plan name is required.');
      return;
    }
    if (onAddPlan) {
      onAddPlan({
        id: `plan-${Date.now()}`,
        name: newPlanName as any,
        price: newPlanPrice,
        billingCycle: newPlanBillingCycle,
        activeCompanies: 0,
        features: newPlanFeatures.length > 0 ? newPlanFeatures : ['Basic access'],
        maxUsers: newPlanMaxUsers
      });
      setShowAddPlanModal(false);
      // Reset
      setNewPlanName('');
      setNewPlanPrice(199);
      setNewPlanMaxUsers(25);
      setNewPlanFeatures(['Basic CRM Panel', 'Custom integrations']);
    }
  };

  const getPlanGradientColor = (name: PlanType) => {
    switch (name) {
      case PlanType.Enterprise:
        return 'from-indigo-950/40 to-[#0e1628] border-indigo-800/60 shadow-lg';
      case PlanType.Professional:
        return 'from-blue-950/40 to-[#0e1628] border-blue-800/60 shadow-lg';
      default:
        return 'from-[#111827] to-[#0e1628] border-slate-800 shadow-lg';
    }
  };

  const getSaaSBadge = (name: PlanType) => {
    switch (name) {
      case PlanType.Enterprise:
        return <span className="bg-indigo-950/50 text-indigo-350 border border-indigo-800/50 font-extrabold text-[9px] uppercase font-mono px-2 py-0.5 rounded tracking-wide">ENTERPRISE CLOUD</span>;
      case PlanType.Professional:
        return <span className="bg-blue-950/50 text-blue-350 border border-blue-800/50 font-extrabold text-[9px] uppercase font-mono px-2 py-0.5 rounded tracking-wide font-sans">POPULAR / GROWTH</span>;
      default:
        return <span className="bg-purple-950/50 text-purple-350 border border-purple-800/50 font-extrabold text-[9px] uppercase font-mono px-2 py-0.5 rounded tracking-wide">STARTER RETAIL</span>;
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Revenue Tier & Plan Models
          </h2>
          <p className="text-xs text-slate-500">
            Set global SaaS product pricing bounds, user capacities, and premium SaaS bundle details.
          </p>
        </div>
        {onAddPlan && (
          <button
            onClick={() => setShowAddPlanModal(true)}
            className="bg-[#3b82f6] hover:bg-blue-600 font-bold text-white px-3.5 py-2.5 rounded text-xs transition-colors shadow-sm cursor-pointer"
          >
            + Create New Plan
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isEditing = editingPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-gradient-to-br ${getPlanGradientColor(plan.name)} border rounded-lg p-5 flex flex-col justify-between shadow-sm relative overflow-hidden`}
            >
              {/* Overlay graphics */}
              <div className="absolute right-0 top-0 -mr-6 -mt-6 w-24 h-24 bg-slate-100/50 rounded-full blur-xl pointer-events-none" />

              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between">
                  {getSaaSBadge(plan.name)}

                  {!isEditing ? (
                    <button
                      onClick={() => triggerEdit(plan)}
                      className="p-1 px-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded border border-slate-200 transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
                      title="Update plan pricing features"
                    >
                      <Edit2 className="h-3 w-3" /> Edit Model
                    </button>
                  ) : (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleSave(plan)}
                        className="p-1.5 bg-slate-100 text-emerald-700 hover:bg-slate-200 hover:text-emerald-800 rounded border border-slate-200 cursor-pointer"
                        title="Save Changes"
                      >
                        <Save className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => setEditingPlanId(null)}
                        className="p-1.5 bg-slate-100 text-rose-600 hover:bg-slate-200 hover:text-rose-700 rounded border border-slate-200 cursor-pointer"
                        title="Discard"
                      >
                        <Undo2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Plan Heading */}
                <h4 className="text-lg font-extrabold text-slate-900 mt-4 tracking-tight">{plan.name} Package</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enrolled organizations on this rate: <strong className="text-slate-800 font-bold">{plan.activeCompanies} Companies</strong>
                </p>

                {/* Pricing values */}
                <div className="my-5 border-y border-slate-100 py-3.5 flex items-baseline gap-1">
                  {!isEditing ? (
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tighter">₹{plan.price}</span>
                  ) : (
                    <div className="flex items-center bg-white border border-slate-250 rounded-md px-2 py-0.5 max-w-28 font-mono">
                      <span className="text-xs text-slate-400 font-black">₹</span>
                      <input
                        type="number"
                        className="w-full bg-transparent text-xs text-slate-850 font-bold select-all focus:outline-none focus:ring-0 text-right outline-none"
                        value={price}
                        onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                      />
                    </div>
                  )}
                  <span className="text-xs text-slate-450 font-bold uppercase tracking-wider font-mono">
                    / {isEditing ? (
                      <select
                        className="bg-transparent text-[10px] text-blue-600 font-bold focus:outline-none border-none py-0 pr-6"
                        value={billingCycle}
                        onChange={(e: any) => setBillingCycle(e.target.value)}
                      >
                        <option value="monthly">mo</option>
                        <option value="yearly">yr</option>
                      </select>
                    ) : (
                      plan.billingCycle === 'monthly' ? 'mo' : 'yr'
                    )}
                  </span>
                </div>

                {/* Max User cap details */}
                <div className="flex justify-between items-center bg-slate-100/50 border border-slate-250/60 rounded-md px-3 py-2 text-xs mb-5 font-mono">
                  <span className="text-slate-500 flex items-center gap-1 font-sans font-bold">
                    <Users className="h-3.5 w-3.5 text-blue-600" /> Max Seats:
                  </span>
                  {!isEditing ? (
                    <span className="text-slate-800 font-bold">{plan.maxUsers > 2000 ? 'Unlimited' : `${plan.maxUsers} Users`}</span>
                  ) : (
                    <input
                      type="number"
                      className="bg-white border border-slate-250 text-[11px] text-slate-800 font-bold rounded px-1.5 py-0.5 w-20 text-right focus:outline-none focus:border-[#3b82f6]"
                      value={maxUsers}
                      onChange={(e) => setMaxUsers(parseInt(e.target.value) || 0)}
                    />
                  )}
                </div>

                {/* Features Inclusion List */}
                <div className="space-y-2 mt-4">
                  <div className="text-[10px] uppercase font-extrabold text-slate-455 tracking-widest">Bundle Features</div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {(!isEditing ? plan.features : featuresList).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 mr-1.5">
                        <Check className="h-3.5 w-3.5 text-[#3b82f6] mt-0.5 shrink-0" />
                        <span className="flex-1 leading-normal font-semibold text-slate-705">{feat}</span>

                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeFeatureAt(idx)}
                            className="text-slate-400 hover:text-rose-600 text-xs px-1 cursor-pointer font-bold"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Feature dynamic input while editing */}
                  {isEditing && (
                    <div className="mt-3 flex gap-1 items-center bg-slate-50 border border-slate-200 rounded-md p-1">
                      <input
                        type="text"
                        placeholder="Add core feature..."
                        className="bg-transparent border-none text-[11px] px-2 py-1 focus:outline-none w-full text-slate-800 font-semibold outline-none"
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeatureInput(); } }}
                      />
                      <button
                        type="button"
                        onClick={addFeatureInput}
                        className="p-1 px-2 bg-[#3b82f6] hover:bg-blue-600 text-white rounded cursor-pointer transition-colors"
                      >
                        <ListPlus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Enterprise customization prompt card */}
              {plan.name === PlanType.Enterprise && (
                <div className="mt-5 bg-indigo-950/40 border border-indigo-900/50 rounded px-3 py-2.5 flex items-center justify-between text-xs text-indigo-300 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Integrates CRM AI auto-categorization model</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-indigo-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Analytics Dashboards - Matches Screenshot 5 & 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Left widget: Top Performing Plans (8 columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-850 pb-2.5">
            <BarChart3 className="h-4.5 w-4.5 text-indigo-500" />
            <h4 className="font-bold text-slate-200 text-sm">Top Performing Plans</h4>
          </div>
          <p className="text-[11px] text-slate-500 mb-5">
            Pricing package yield breakdown, contributing to Monthly Recurring Revenue (MRR).
          </p>

          <div className="space-y-4">
            {/* Enterprise Pack */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Enterprise SaaS Custom
                </span>
                <span className="font-mono">₹1,32,450 <span className="text-[10px] text-slate-500 font-normal">(49.8%)</span></span>
              </div>
              <div className="w-full bg-[#111827] h-2 rounded overflow-hidden">
                <div className="bg-indigo-500 h-full rounded" style={{ width: '49.8%' }} />
              </div>
            </div>

            {/* Professional Pack */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Professional growth
                </span>
                <span className="font-mono">₹89,230 <span className="text-[10px] text-slate-500 font-normal">(33.6%)</span></span>
              </div>
              <div className="w-full bg-[#111827] h-2 rounded overflow-hidden">
                <div className="bg-blue-500 h-full rounded" style={{ width: '33.6%' }} />
              </div>
            </div>

            {/* Starter Pack */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" /> Starter bundle Pack
                </span>
                <span className="font-mono">₹44,100 <span className="text-[10px] text-slate-500 font-normal">(16.6%)</span></span>
              </div>
              <div className="w-full bg-[#111827] h-2 rounded overflow-hidden">
                <div className="bg-[#a855f7] h-full rounded" style={{ width: '16.6%' }} />
              </div>
            </div>

            {/* Free Tier */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> Free / Trial accounts
                </span>
                <span className="font-mono">₹0 <span className="text-[10px] text-slate-500 font-normal">(0.0%)</span></span>
              </div>
              <div className="w-full bg-[#111827] h-2 rounded overflow-hidden">
                <div className="bg-slate-500 h-full rounded" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right widget: Conversion Funnel (4 columns) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-850 pb-2.5">
              <span className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">Conversion Funnel</span>
              <select className="bg-[#111827] border border-slate-800 text-[10px] font-bold uppercase text-slate-400 px-2 py-0.5 rounded focus:outline-none shrink-0 cursor-pointer">
                <option>This Period</option>
                <option>Last Month</option>
                <option>All Time</option>
              </select>
            </div>

            <div className="space-y-3">
              {/* Step 1 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-200 mb-1">
                  <span>Visitors</span>
                  <span className="font-mono font-black">24,890 <span className="text-slate-500 font-medium">100%</span></span>
                </div>
                <div className="w-full bg-[#111827] h-3 rounded-md overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-md" style={{ width: '100%' }} />
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-200 mb-1">
                  <span>Signups</span>
                  <span className="font-mono font-black">3,842 <span className="text-slate-500 font-medium">15.4%</span></span>
                </div>
                <div className="w-full bg-[#111827] h-3 rounded-md overflow-hidden">
                  <div className="bg-[#a855f7] h-full rounded-md" style={{ width: '15.4%' }} />
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-200 mb-1">
                  <span>Active Trials</span>
                  <span className="font-mono font-black">1,248 <span className="text-slate-500 font-medium">5.0%</span></span>
                </div>
                <div className="w-full bg-[#111827] h-3 rounded-md overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-md" style={{ width: '5.0%' }} />
                </div>
              </div>

              {/* Step 4 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-200 mb-1">
                  <span>Paid Conversions</span>
                  <span className="font-mono font-black">856 <span className="text-slate-500 font-medium">3.4%</span></span>
                </div>
                <div className="w-full bg-[#111827] h-3 rounded-md overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-md" style={{ width: '3.4%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-850 flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-500">Overall Conversion Rate:</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              3.4% <span className="text-[9px] text-[#34d399]/70 animate-pulse">&uarr; 0.6%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Create New Plan Modal */}
      {showAddPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowAddPlanModal(false)} />
          <div className="bg-white border border-slate-200 rounded-lg w-full max-w-md p-6 relative z-10 text-slate-850 shadow-2xl">
            <h3 className="text-sm font-extrabold text-slate-900 mb-1">Create Custom Subscriptions Plan</h3>
            <p className="text-xs text-slate-500 mb-4">Introduce custom tier pricing thresholds and features matrices.</p>

            <form onSubmit={submitNewPlan} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Plan Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Growth Elite, Scale Pro"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 font-bold focus:bg-white focus:border-[#3b82f6] outline-none"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-455 font-mono">Price / Month * (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-right font-mono text-emerald-600 font-bold focus:bg-white focus:border-[#3b82f6] outline-none"
                    value={newPlanPrice}
                    onChange={(e) => setNewPlanPrice(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-455 font-mono">Max User Seats *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-right font-mono text-slate-800 font-bold focus:bg-white focus:border-[#3b82f6] outline-none"
                    value={newPlanMaxUsers}
                    onChange={(e) => setNewPlanMaxUsers(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Billing Iteration Cycle</label>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-755 font-bold cursor-pointer"
                  value={newPlanBillingCycle}
                  onChange={(e) => setNewPlanBillingCycle(e.target.value as any)}
                >
                  <option value="monthly">Monthly Recurring</option>
                  <option value="yearly">Yearly Prepaid</option>
                </select>
              </div>

              {/* Feature Tags List */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider flex justify-between">
                  <span>Included Service Features</span>
                  <span className="text-slate-400 font-mono">({newPlanFeatures.length} active tags)</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Advanced AI, API gates"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-800 font-medium focus:bg-white focus:border-[#3b82f6] outline-none"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddNewPlanFeatures();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddNewPlanFeatures}
                    className="px-3 bg-slate-100 hover:bg-slate-200 border border-slate-205 text-slate-700 text-xs font-bold rounded cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="max-h-24 overflow-y-auto space-y-1 bg-slate-50 border border-slate-200/60 rounded p-2 text-xs">
                  {newPlanFeatures.length === 0 ? (
                    <span className="text-slate-450 text-[11px] italic">Add feature benefits list above</span>
                  ) : (
                    newPlanFeatures.map((ft, fi) => (
                      <div key={fi} className="flex justify-between items-center text-xs text-slate-700 bg-white border border-slate-150 px-2.5 py-1 rounded">
                        <span className="truncate">{ft}</span>
                        <button
                          type="button"
                          onClick={() => removeNewPlanFeatureAt(fi)}
                          className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer"
                        >
                          &times;
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPlanModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 px-4 py-2 rounded text-xs font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded text-xs font-bold cursor-pointer transition-colors shadow-sm animate-pulse"
                >
                  Activate & Launch Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
