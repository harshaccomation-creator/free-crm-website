import React, { useState } from 'react';
import { Company, Invoice, InvoiceItem } from '../types';
import BrandLogo from './BrandLogo';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Mail,
  CheckCircle,
  FileCheck,
  AlertTriangle,
  Send,
  Download,
  Calendar,
  Building,
  User,
  CreditCard,
  X,
  Search,
  Filter,
  Check
} from 'lucide-react';

interface InvoiceSalesFlowsProps {
  companies: Company[];
  onAddLog: (category: 'System' | 'Email' | 'Security' | 'Billing', message: string, status: 'success' | 'warning' | 'error' | 'info') => void;
}

export default function InvoiceSalesFlows({ companies, onAddLog }: InvoiceSalesFlowsProps) {
  // Tabs: 'all' to show invoice archives, 'generator' to build a live interactive one
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'generator'>('all');

  // List of invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'inv-1',
      invoiceNumber: 'INV-2026-1042',
      companyId: companies[0]?.id || '1',
      companyName: companies[0]?.name || 'Google Cloud Tenant',
      adminEmail: companies[0]?.adminEmail || 'admin@googlecloud.com',
      issueDate: '2026-06-01',
      dueDate: '2026-07-01',
      items: [
        { id: 'item-1', description: 'Enterprise SaaS Application Subscription License (Professional Model)', quantity: 1, price: 14900 },
        { id: 'item-2', description: 'Priority API Ingress Access Block & SLA Support SLA-Level B', quantity: 12, price: 1200 }
      ],
      subtotal: 29300,
      taxRate: 18,
      taxAmount: 5274,
      discountAmount: 1500,
      total: 33074,
      status: 'Paid',
      createdAt: '2026-06-01T10:00:00Z'
    },
    {
      id: 'inv-2',
      invoiceNumber: 'INV-2026-1043',
      companyId: companies[1]?.id || '2',
      companyName: companies[1]?.name || 'Microsoft Azure Partner',
      adminEmail: companies[1]?.adminEmail || 'azure_billing@microsoft.com',
      issueDate: '2026-06-10',
      dueDate: '2026-07-10',
      items: [
        { id: 'item-3', description: 'Professional SaaS License Hub Access Allocation', quantity: 1, price: 8900 },
        { id: 'item-4', description: 'Data Pipeline Sharding Integration Setup Fee', quantity: 1, price: 4500 }
      ],
      subtotal: 13400,
      taxRate: 18,
      taxAmount: 2412,
      discountAmount: 500,
      total: 15312,
      status: 'Sent',
      createdAt: '2026-06-10T12:30:00Z'
    },
    {
      id: 'inv-3',
      invoiceNumber: 'INV-2026-1044',
      companyId: companies[2]?.id || '3',
      companyName: companies[2]?.name || 'Airtel India Office',
      adminEmail: companies[2]?.adminEmail || 'superadmin@airtel.in',
      issueDate: '2026-05-18',
      dueDate: '2026-06-18',
      items: [
        { id: 'item-5', description: 'Starter Tier Base Workspace License Provisioning', quantity: 1, price: 2990 },
        { id: 'item-6', description: 'Extra Seat Surcharge (5 added users)', quantity: 5, price: 490 }
      ],
      subtotal: 5440,
      taxRate: 18,
      taxAmount: 979,
      discountAmount: 0,
      total: 6419,
      status: 'Overdue',
      createdAt: '2026-05-18T14:15:00Z'
    }
  ]);

  // Invoice Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Sent' | 'Paid' | 'Overdue'>('All');

  // Generator State
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(companies[0]?.id || '');
  const [customClientName, setCustomClientName] = useState('');
  const [customClientEmail, setCustomClientEmail] = useState('');
  const [customClientDomain, setCustomClientDomain] = useState('');
  
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  const [taxRate, setTaxRate] = useState<number>(18);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Items
  const [builderItems, setBuilderItems] = useState<Omit<InvoiceItem, 'id'>[]>([
    { description: 'SalesFlow Supercharged Workspace - Standard Monthly License', quantity: 1, price: 14900 },
    { description: 'Dedicated Multi-Tenant Database Node Routing Guard', quantity: 1, price: 3500 }
  ]);

  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemQty, setNewItemQty] = useState<number>(1);
  const [newItemPrice, setNewItemPrice] = useState<number>(1500);

  // Selected Invoice for Modal Viewing
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Live Calculations
  const calculatedSubtotal = builderItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const calculatedTaxAmount = Math.round((calculatedSubtotal * taxRate) / 100);
  const calculatedTotal = calculatedSubtotal + calculatedTaxAmount - discountAmount;

  // Sync builder client when base company selection changes
  const handleCompanySelectChange = (id: string) => {
    setSelectedCompanyId(id);
    const targetComp = companies.find(c => c.id === id);
    if (targetComp) {
      setCustomClientName(targetComp.name);
      setCustomClientEmail(targetComp.adminEmail);
      setCustomClientDomain(targetComp.domain);
      // Try to auto-populate items based on monthly spend
      setBuilderItems([
        { 
          description: `${targetComp.plan} Tier Tenancy Plan Monthly Subscription`, 
          quantity: 1, 
          price: targetComp.monthlySpend 
        },
        { 
          description: `SLA Priority Network Support and Custom Domain Integration (${targetComp.domain})`, 
          quantity: 1, 
          price: Math.round(targetComp.monthlySpend * 0.15) 
        }
      ]);
    }
  };

  // Populate first company on mount/changes
  React.useEffect(() => {
    if (companies.length > 0 && !selectedCompanyId) {
      handleCompanySelectChange(companies[0].id);
    }
  }, [companies]);

  const handleAddItem = () => {
    if (!newItemDesc.trim()) {
      alert('Specify item details.');
      return;
    }
    setBuilderItems([
      ...builderItems,
      { description: newItemDesc.trim(), quantity: newItemQty, price: newItemPrice }
    ]);
    setNewItemDesc('');
    setNewItemQty(1);
    setNewItemPrice(1500);
  };

  const handleRemoveBuilderItem = (idx: number) => {
    setBuilderItems(builderItems.filter((_, i) => i !== idx));
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (builderItems.length === 0) {
      alert('Cannot compile. Add at least one billing item lines to the invoice.');
      return;
    }

    const finalInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invoiceNumber.trim(),
      companyId: selectedCompanyId || 'custom',
      companyName: customClientName.trim() || 'Custom Client Org',
      adminEmail: customClientEmail.trim() || 'billing@client.com',
      issueDate,
      dueDate,
      items: builderItems.map((bi, i) => ({ ...bi, id: `btm-${i}` })),
      subtotal: calculatedSubtotal,
      taxRate: taxRate,
      taxAmount: calculatedTaxAmount,
      discountAmount: discountAmount,
      total: calculatedTotal,
      status: 'Sent',
      createdAt: new Date().toISOString()
    };

    setInvoices([finalInvoice, ...invoices]);
    onAddLog('Billing', `Dispatched official corporate tax invoice ${finalInvoice.invoiceNumber} (Total: ₹${finalInvoice.total.toLocaleString()}) to client ${finalInvoice.companyName}`, 'success');
    alert(`Invoice ${finalInvoice.invoiceNumber} successfully compiled, archived and dispatched via simulated SMTP mail client!`);
    
    // reset states
    setInvoiceNumber(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setBuilderItems([
      { description: 'SalesFlow Supercharged Workspace - Standard Monthly License', quantity: 1, price: 14900 }
    ]);
    setActiveSubTab('all');
  };

  const handleUpdateStatus = (invId: string, newStatus: 'Draft' | 'Sent' | 'Paid' | 'Overdue') => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invId) {
        onAddLog('Billing', `Updated status of invoice ${inv.invoiceNumber} to [${newStatus}]`, 'info');
        return { ...inv, status: newStatus };
      }
      return inv;
    }));
    // also update selected invoice modal if open
    if (selectedInvoice && selectedInvoice.id === invId) {
      setSelectedInvoice(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleDeleteInvoice = (invId: string, number: string) => {
    if (confirm(`Are you sure you want to completely retract and purge invoice ${number}?`)) {
      setInvoices(prev => prev.filter(inv => inv.id !== invId));
      onAddLog('Billing', `Purged corporate billing record: Invoice ${number}`, 'warning');
    }
  };

  // Filter logic
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.adminEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Top Welcome Title Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-lg shadow-xs text-left select-none">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#ff7a00] uppercase font-mono">FINANCE & REVENUE ENGINE</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mt-1">
            <CreditCard className="h-5.5 w-5.5 text-[#ff7a00]" />
            Invoices & Sales Flows
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Generate printable, tax-compliant invoices, track customer billing streams, and dispatch reminders with modern <span className="text-slate-900 font-bold">SalesFlow HUB</span> corporate branding.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1.5 rounded-lg border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="h-4 w-4" />
            Invoice Archives ({invoices.length})
          </button>
          <button
            onClick={() => setActiveSubTab('generator')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'generator'
                ? 'bg-[#3b82f6] text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="h-4 w-4" />
            Billing Compiler
          </button>
        </div>
      </div>

      {/* RENDER VIEW: ARCHIVES TABLE */}
      {activeSubTab === 'all' && (
        <div className="space-y-4">
          
          {/* Filtering Header Bar */}
          <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row gap-3 items-center justify-between text-left shadow-xs">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by invoice number, company tenant, or email..."
                className="w-full bg-slate-50 border border-slate-250 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1 overflow-x-auto self-start sm:self-auto shrink-0 py-0.5">
              {(['All', 'Draft', 'Sent', 'Paid', 'Overdue'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${
                    statusFilter === status
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold text-[11px] tracking-wider uppercase font-mono">
                    <th className="py-3 px-4">Invoice ID</th>
                    <th className="py-3 px-4">Client Tenant / Domain</th>
                    <th className="py-3 px-4">Timeline</th>
                    <th className="py-3 px-4 text-right">Value (Tax Incl.)</th>
                    <th className="py-3 px-4 text-center">Billing State</th>
                    <th className="py-3 px-4 text-right">Workflow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-xs text-slate-700">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400 font-bold italic">
                        No corporate invoices match the query parameters.
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          <span className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-slate-400" />
                            {inv.invoiceNumber}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{inv.companyName}</div>
                          <div className="text-[10px] text-slate-450 font-mono">{inv.adminEmail}</div>
                        </td>
                        <td className="py-3.5 px-4 font-normal">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-mono">Issue: <strong>{inv.issueDate}</strong></span>
                            <span className="text-[10px] text-rose-600 font-mono">Due: <strong>{inv.dueDate}</strong></span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900">
                          ₹{inv.total.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-full border ${
                            inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            inv.status === 'Sent' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            inv.status === 'Overdue' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                            'bg-slate-100 text-slate-600 border-slate-300'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            {/* View & Print Document */}
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="px-2 py-1 bg-slate-50 hover:bg-slate-150 border border-slate-200 text-slate-700 font-bold rounded text-[11px] cursor-pointer"
                              title="Print Invoice / View Sheet"
                            >
                              <Printer className="h-3.5 w-3.5 inline mr-1" /> View/Print
                            </button>

                            {/* State Modifier Dropdown */}
                            <select
                              value={inv.status}
                              onChange={(e) => handleUpdateStatus(inv.id, e.target.value as any)}
                              className="bg-white border border-slate-200 px-1 py-0.5 text-[10px] font-bold text-slate-700 rounded cursor-pointer hover:border-blue-500"
                            >
                              <option value="Draft">Draft</option>
                              <option value="Sent">Sent</option>
                              <option value="Paid">Paid</option>
                              <option value="Overdue">Overdue</option>
                            </select>

                            {/* Purge */}
                            <button
                              onClick={() => handleDeleteInvoice(inv.id, inv.invoiceNumber)}
                              className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                              title="Retract invoice"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RENDER VIEW: LIVE INVOICE GENERATOR */}
      {activeSubTab === 'generator' && (
        <form onSubmit={handleGenerateInvoice} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start">
          
          {/* Left panel: Build values (5 columns) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Customer Allocation card */}
            <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold text-slate-800 tracking-tight uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Building className="h-4 w-4 text-blue-600" />
                1. Target Tenancy Account
              </h3>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Select Registered Company</label>
                <select
                  value={selectedCompanyId}
                  onChange={(e) => handleCompanySelectChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.domain})</option>
                  ))}
                  <option value="">-- Non-Registered Custom Org --</option>
                </select>
              </div>

              {/* Editable client outputs */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-mono">Company Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paramount Tech"
                    className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 outline-none"
                    value={customClientName}
                    onChange={(e) => setCustomClientName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-mono">Corporate domain *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. paramount.co"
                    className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 outline-none font-mono"
                    value={customClientDomain}
                    onChange={(e) => setCustomClientDomain(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-mono">Billing Admin Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. accounts@paramount.co"
                    className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-805 outline-none font-mono"
                    value={customClientEmail}
                    onChange={(e) => setCustomClientEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Document Attributes card */}
            <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold text-slate-800 tracking-tight uppercase border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#ff7a00]" />
                2. Chronology & Metadata
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider font-mono">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 font-mono outline-none"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">GST/Tax Rate (%)</label>
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value={0}>0% (Tax Exempt)</option>
                    <option value={5}>5% GST</option>
                    <option value={12}>12% GST</option>
                    <option value={18}>18% GST (Standard SaaS)</option>
                    <option value={28}>28% GST</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Date of Issue *</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 font-mono outline-none"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Due Date Limit *</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 font-mono outline-none hover:border-red-500"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[10px] uppercase font-bold text-slate-455 tracking-wider font-mono">Special Discount Cut (₹)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-805 font-mono outline-none focus:border-[#3b82f6]"
                  value={discountAmount || ''}
                  placeholder="e.g. 500"
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Line items list input block */}
            <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
              <h3 className="text-xs font-extrabold text-slate-800 tracking-tight uppercase border-b border-slate-100 pb-2">
                3. Itemized Invoice Breakdown
              </h3>

              {/* Add Item fields */}
              <div className="space-y-3 bg-slate-50 border p-3 rounded-lg">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Service Description *</label>
                  <input
                    type="text"
                    placeholder="e.g. User Seat Surcharge Package"
                    className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 outline-none"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Qty *</label>
                    <input
                      type="number"
                      min={1}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs font-medium outline-none"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-455 tracking-wider font-mono">Unit Cost (₹) *</label>
                    <input
                      type="number"
                      min={0}
                      className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs font-mono outline-none"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-950 text-white font-bold rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Append Item Line
                </button>
              </div>

              {/* Items registered so far in form preview */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Lines Drafted</span>
                {builderItems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic font-semibold">No items. Minimum 1 required.</p>
                ) : (
                  <div className="divide-y border rounded bg-white overflow-hidden max-h-56 overflow-y-auto">
                    {builderItems.map((bi, i) => (
                      <div key={i} className="p-2.5 flex items-start gap-2.5 justify-between hover:bg-slate-50">
                        <div className="text-left">
                          <div className="font-bold text-xs text-slate-800 line-clamp-1">{bi.description}</div>
                          <div className="text-[10px] text-slate-450 font-mono mt-0.5">
                            {bi.quantity} x ₹{bi.price.toLocaleString()} = <strong className="text-slate-700">₹{(bi.quantity * bi.price).toLocaleString()}</strong>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveBuilderItem(i)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Erase row"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Print compiler triggers button */}
            <button
              type="submit"
              disabled={builderItems.length === 0}
              className={`w-full py-3 text-sm font-black tracking-wider text-white shadow-md rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                builderItems.length === 0 ? 'bg-slate-350 cursor-not-allowed' : 'bg-[#FF7A00] hover:bg-[#e06b00]'
              }`}
            >
              <Send className="h-4 w-4" /> Disseminate & Log Corporate Invoice
            </button>

          </div>

          {/* Right panel: LIVE RENDERED PRINT DOCUMENT PREVIEW SHEET (7 columns) */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#0b0f19] via-[#050811] to-[#020409] p-5 md:p-8 rounded-lg shadow-inner flex justify-center text-left max-w-full overflow-hidden border border-white/5 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent pointer-events-none" />
            <div 
              id="invoice-document-paper" 
              className="bg-invoice-paper border rounded shadow-2xl p-6 md:p-10 w-full max-w-[210mm] text-slate-900 aspect-[1/1.414] flex flex-col justify-between font-sans leading-relaxed text-[11px] select-all animate-fadeIn relative z-10"
              style={{ minHeight: '800px', boxSizing: 'border-box' }}
            >
              <div>
                {/* Modern Dark Header Card wrapping Logo, Details & Timeline together */}
                <div className="bg-[#0f172a] text-slate-100 rounded-xl p-6 md:p-8 shadow-xl border border-white/5 space-y-6 mb-6">
                  {/* Top: Logo & Designation */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-white/10">
                    <div>
                      <BrandLogo size="lg" variant="badge" />
                    </div>
                    <div className="text-right sm:text-right select-all">
                      <h1 className="text-white font-extrabold text-2xl tracking-widest leading-none font-sans uppercase">
                        TAX INVOICE
                      </h1>
                      <div className="text-slate-400 font-bold font-mono tracking-tight mt-1">
                        No: <span className="text-[#ff7a00] font-black">{invoiceNumber}</span>
                      </div>
                      <div className="text-[9px] text-slate-400 mt-1 uppercase font-semibold">
                        Digital SaaS Delivery &bull; Tax Code #29AACC
                      </div>
                    </div>
                  </div>

                  {/* Mid: Sender vs Receiver block inside dark theme */}
                  <div className="grid grid-cols-2 gap-6 pt-2">
                    {/* From (Issuer) */}
                    <div className="space-y-1.5 border-r border-white/10 pr-4">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Issuer Details</span>
                      <strong className="text-xs font-black text-white">SalesFlow HUB Systems Private Limited</strong>
                      <p className="text-slate-300 leading-snug text-[10px]">
                        Brigade Tech Park, Block B<br />
                        Whitefield, Bangalore, Karnataka<br />
                        India, Pin 560066<br />
                        Contact: <span className="text-[#ff7a00] font-semibold font-mono">billing@salesflow.hub</span>
                      </p>
                    </div>

                    {/* To (Client) */}
                    <div className="space-y-1.5 pl-2 text-[10px]">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Bill To (Recipient)</span>
                      <strong className="text-xs font-black text-white block leading-tight">{customClientName || 'Client Workspace Tenant'}</strong>
                      {customClientDomain && (
                        <span className="text-[#3b82f6] font-semibold font-mono text-[9px] block">
                          https://{customClientDomain}
                        </span>
                      )}
                      <p className="text-slate-300 leading-snug mt-1">
                        Platform Customer ID: <span className="font-mono text-white font-bold">{selectedCompanyId ? `comp-${selectedCompanyId}` : 'custom-customer'}</span><br />
                        Corporate Contact Inbox:<br />
                        <span className="text-white font-mono font-medium">{customClientEmail || 'accounting@client.com'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Timeline info block */}
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 grid grid-cols-3 gap-2.5 text-center">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Date of Issue</span>
                      <span className="text-white font-bold font-mono text-xs">{issueDate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Payment Due Date</span>
                      <span className="text-rose-400 font-bold font-mono text-xs">{dueDate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Fulfillment Status</span>
                      <div className="mt-0.5">
                        <span className="inline-block text-[9px] text-[#10b981] font-black border border-[#10b981]/40 bg-[#10b981]/10 uppercase px-2 py-0.5 rounded font-mono">
                          PAID
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main tabular grid of items */}
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 font-bold font-mono text-[9px] uppercase tracking-wider border-b">
                        <th className="py-2 px-3">SL</th>
                        <th className="py-2 px-3 w-3/5">Corporate Service Description</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3 text-right">Unit Price</th>
                        <th className="py-2 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-[10px] text-slate-700">
                      {builderItems.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-4 text-center italic text-slate-400 font-bold">
                            Empty itemized rows.
                          </td>
                        </tr>
                      ) : (
                        builderItems.map((bi, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                            <td className="py-2 px-3 font-bold text-slate-850">{bi.description}</td>
                            <td className="py-2 px-3 text-center font-mono">{bi.quantity}</td>
                            <td className="py-2 px-3 text-right font-mono">₹{bi.price.toLocaleString()}</td>
                            <td className="py-2 px-3 text-right font-bold font-mono text-slate-900">
                              ₹{(bi.quantity * bi.price).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Subtotals & Taxes breakdown summary */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-6 items-start">
                  
                  {/* Left Notes Block */}
                  <div className="sm:col-span-6 space-y-1 text-[10px] text-slate-500">
                    <strong className="text-slate-800 uppercase tracking-wider font-bold">Terms of Compliance:</strong>
                    <p className="leading-relaxed">
                      SaaS subscription values are strictly non-refundable and subject to the master software licensing terms of Bangalore jurisdiction. Interlinking systems will be temporarily suspended if invoices remain overdue beyond SLA bounds.
                    </p>
                  </div>

                  {/* Right Calculation metrics block */}
                  <div className="sm:col-span-6 space-y-1.5 text-right font-medium">
                    <div className="flex justify-between items-center text-slate-500 font-medium">
                      <span>Gross subtotal:</span>
                      <span className="font-mono text-slate-800 font-semibold">₹{calculatedSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 font-medium">
                      <span>GST Tax ({taxRate}% Rate):</span>
                      <span className="font-mono text-slate-800 font-semibold">₹{calculatedTaxAmount.toLocaleString()}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-emerald-600 font-semibold">
                        <span>Corporate Discount:</span>
                        <span className="font-mono">-₹{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-slate-200 pt-2 flex justify-between items-center text-slate-900">
                      <span className="font-black text-xs uppercase text-[#ff7a00]">Total Net Due:</span>
                      <span className="font-black font-mono text-[14px]">₹{calculatedTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure printable authorization signatory footer */}
              <div className="border-t border-slate-100 pt-6 mt-10">
                <div className="flex justify-between items-end">
                  <div className="space-y-1 text-slate-400 text-[9px] font-semibold text-left">
                    <div>Mode of Pay: UPI / IMPS Wire Transfer Block</div>
                    <div>Bank Code: FIN-IDFC-00445-983</div>
                    <div className="text-emerald-600 flex items-center gap-1.5 font-bold mt-1">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Digital Invoice Verified & Secured
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <div className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-widest mb-1">
                      Billing Department Authorized
                    </div>
                    <div className="border-b border-slate-400 w-36 h-8 flex items-center justify-center font-serif text-[10px] italic text-[#ff7a00] font-bold">
                      SalesFlow Hub Audit Staff
                    </div>
                    <span className="text-[8px] text-slate-450 mt-1 shrink-0 font-medium font-mono">
                      Security Signature Verification Block
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </form>
      )}

      {/* DETAILED PRINT PREVIEW MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop screen */}
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs" onClick={() => setSelectedInvoice(null)} />
          
          <div className="bg-slate-700 border border-slate-800 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col relative z-10 text-slate-800 shadow-2xl">
            {/* Modal Header controls */}
            <div className="bg-slate-900 text-white px-6 py-4 rounded-t-xl flex justify-between items-center select-none shrink-0 border-b border-slate-800 text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">CORPORATE REPORT CONSOLE</span>
                <h3 className="text-sm font-extrabold text-slate-100 mt-0.5 flex items-center gap-1.5">
                  <FileCheck className="h-4.5 w-4.5 text-emerald-500" />
                  Viewing Bill Record: {selectedInvoice.invoiceNumber}
                </h3>
              </div>

              {/* Right tools */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const invoiceElement = document.getElementById('selected-invoice-sheet');
                    if (invoiceElement) {
                      const printContent = invoiceElement.innerHTML;
                      const originalContent = document.body.innerHTML;
                      document.body.innerHTML = printContent;
                      window.print();
                      window.location.reload(); // Quick restore of SPA layout State
                    }
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" /> Printable Document
                </button>
                <button
                  onClick={() => {
                    alert(`Dispatched corporate electronic invoice copy to target tenant billing contact Inbox [${selectedInvoice.adminEmail}]!`);
                    onAddLog('Email', `Mail API manually triggered & broadcasted billing PDF copy: ${selectedInvoice.invoiceNumber}`, 'success');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-950 text-white border border-slate-700 font-all text-xs rounded cursor-pointer flex items-center gap-1"
                >
                  <Mail className="h-3.5 w-3.5" /> Mail PDF Remind
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="text-slate-400 hover:text-white font-extrabold text-lg p-1 w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full cursor-pointer ml-3"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Scrollable Canvas Container */}
            <div className="overflow-y-auto p-6 md:p-10 flex justify-center bg-gradient-to-br from-[#0b0f19] via-[#050811] to-[#020409] border-t border-white/5 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent pointer-events-none" />
              <div 
                id="selected-invoice-sheet" 
                className="bg-invoice-paper rounded p-8 md:p-12 w-full max-w-[210mm] text-slate-900 border font-sans text-left text-[11px] relative z-10 shadow-2xl"
                style={{ boxSizing: 'border-box' }}
              >
                <div>
                  {/* Modern Dark Header Card wrapping Logo, Details & Timeline together */}
                  <div className="bg-[#0f172a] text-slate-100 rounded-xl p-6 md:p-8 shadow-xl border border-white/5 space-y-6 mb-6">
                    {/* Top: Logo & Designation */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-white/10">
                      <div>
                        <BrandLogo size="lg" variant="badge" />
                      </div>
                      <div className="text-right sm:text-right select-all">
                        <h1 className="text-white font-extrabold text-2xl tracking-widest leading-none font-sans uppercase">
                          TAX INVOICE
                        </h1>
                        <div className="text-slate-400 font-bold font-mono tracking-tight mt-1">
                          No: <span className="text-[#ff7a00] font-black">{selectedInvoice.invoiceNumber}</span>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-1 uppercase font-semibold">
                          Digital SaaS Delivery &bull; Tax Code #29AACC
                        </div>
                      </div>
                    </div>

                    {/* Mid: Sender vs Receiver block inside dark theme */}
                    <div className="grid grid-cols-2 gap-6 pt-2">
                      {/* From (Issuer) */}
                      <div className="space-y-1.5 border-r border-white/10 pr-4">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Issuer Details</span>
                        <strong className="text-xs font-black text-white">SalesFlow HUB Systems Private Limited</strong>
                        <p className="text-slate-300 leading-snug text-[10px]">
                          Brigade Tech Park, Block B<br />
                          Whitefield, Bangalore, Karnataka<br />
                          India, Pin 560066<br />
                          Contact: <span className="text-[#ff7a00] font-semibold font-mono">billing@salesflow.hub</span>
                        </p>
                      </div>

                      {/* To (Client) */}
                      <div className="space-y-1.5 pl-2 text-[10px]">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Bill To (Recipient)</span>
                        <strong className="text-xs font-black text-white block leading-tight">{selectedInvoice.companyName}</strong>
                        <p className="text-slate-300 leading-snug mt-1">
                          Platform Customer ID: <span className="font-mono text-white font-bold">comp-{selectedInvoice.companyId}</span><br />
                          Corporate Contact Inbox:<br />
                          <span className="text-white font-mono font-medium">{selectedInvoice.adminEmail}</span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom: Timeline info block */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 grid grid-cols-3 gap-2.5 text-center">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Date of Issue</span>
                        <span className="text-white font-bold font-mono text-xs">{selectedInvoice.issueDate}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Payment Due Date</span>
                        <span className="text-rose-400 font-bold font-mono text-xs">{selectedInvoice.dueDate}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Fulfillment Status</span>
                        <div className="mt-0.5">
                          <span className={`inline-block text-[9px] font-black border uppercase px-2 py-0.5 rounded font-mono ${
                            selectedInvoice.status === 'Paid' 
                              ? 'text-[#10b981] border-[#10b981]/40 bg-[#10b981]/10' 
                              : 'text-rose-400 border-rose-400/40 bg-rose-400/10'
                          }`}>
                            {selectedInvoice.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main tabular grid of items */}
                  <div className="border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-105 bg-slate-100 text-slate-500 font-bold font-mono text-[9px] uppercase tracking-wider border-b">
                          <th className="py-2.5 px-3">SL</th>
                          <th className="py-2.5 px-3 w-3/5">Corporate Service Description</th>
                          <th className="py-2.5 px-3 text-center">Qty</th>
                          <th className="py-2.5 px-3 text-right">Unit Price</th>
                          <th className="py-2.5 px-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-[10px] text-slate-705">
                        {selectedInvoice.items.map((bi, idx) => (
                          <tr key={bi.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-850">{bi.description}</td>
                            <td className="py-2.5 px-3 text-center font-mono">{bi.quantity}</td>
                            <td className="py-2.5 px-3 text-right font-mono">₹{bi.price.toLocaleString()}</td>
                            <td className="py-2.5 px-3 text-right font-bold font-mono text-slate-900">
                              ₹{(bi.quantity * bi.price).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Subtotals & Taxes breakdown summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-6 items-start">
                    
                    {/* Left Notes Block */}
                    <div className="sm:col-span-6 space-y-1 text-[10px] text-slate-500">
                      <strong className="text-slate-855 uppercase tracking-wider font-bold">Terms of Compliance:</strong>
                      <p className="leading-relaxed">
                        SaaS subscription values are strictly non-refundable and subject to the master software licensing terms of Bangalore jurisdiction. Interlinking systems will be temporarily suspended if invoices remain overdue beyond SLA bounds.
                      </p>
                    </div>

                    {/* Right Calculation metrics block */}
                    <div className="sm:col-span-6 space-y-1.5 text-right font-medium">
                      <div className="flex justify-between items-center text-slate-500 font-medium">
                        <span>Gross subtotal:</span>
                        <span className="font-mono text-slate-800 font-semibold">₹{selectedInvoice.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500 font-medium">
                        <span>GST Tax ({selectedInvoice.taxRate}% Rate):</span>
                        <span className="font-mono text-slate-800 font-semibold">₹{selectedInvoice.taxAmount.toLocaleString()}</span>
                      </div>
                      {selectedInvoice.discountAmount > 0 && (
                        <div className="flex justify-between items-center text-emerald-600 font-semibold">
                          <span>Corporate Discount:</span>
                          <span className="font-mono">-₹{selectedInvoice.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="border-t-2 border-slate-200 pt-2 flex justify-between items-center text-slate-900">
                        <span className="font-black text-xs uppercase text-[#ff7a00]">Total Net Due:</span>
                        <span className="font-black font-mono text-[14px]">₹{selectedInvoice.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secure printable authorization signatory footer */}
                <div className="border-t border-slate-100 pt-6 mt-10">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1 text-slate-400 text-[9px] font-semibold text-left">
                      <div>Mode of Pay: UPI / IMPS Wire Transfer Block</div>
                      <div>Bank Code: FIN-IDFC-00445-983</div>
                      <div className="text-emerald-450 text-emerald-600 flex items-center gap-1.5 font-bold mt-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        Digital Invoice Verified & Secured
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <div className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-widest mb-1">
                        Billing Department Authorized
                      </div>
                      <div className="border-b border-slate-400 w-36 h-8 flex items-center justify-center font-serif text-[10px] italic text-[#ff7a00] font-bold">
                        SalesFlow Hub Audit Staff
                      </div>
                      <span className="text-[8px] text-slate-450 mt-1 shrink-0 font-medium font-mono">
                        Security Signature Verification Block
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
