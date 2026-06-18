import { useState } from 'react';
import { Headphones, Mail, Send, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient.js';

const issueTypes = ['OTP not received', 'Invalid login', 'Account access issue', 'Trial or payment activation', 'Other'];

export default function PublicSupportPage() {
  const [form, setForm] = useState({ name: '', email: '', category: 'OTP not received', subject: '', message: '' });
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setNotice('');
    if (!form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setNotice('Email, subject, and message are required.');
      return;
    }

    setLoading(true);
    const ticket = {
      email: form.email.trim().toLowerCase(),
      requester_name: form.name.trim() || 'SalesFlow User',
      subject: form.subject.trim(),
      category: form.category,
      priority: 'High',
      message: form.message.trim(),
      status: 'Open',
      agent_name: 'SalesFlow Support Team',
      zoho_ticket_id: null,
    };

    if (supabase) {
      await supabase.from('support_tickets').insert(ticket);
    }

    setNotice('Your support request has been submitted. Our team will reply to your registered email.');
    setForm({ name: '', email: '', category: 'OTP not received', subject: '', message: '' });
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-900">
      <section className="mx-auto max-w-5xl rounded-[32px] bg-white p-6 shadow-2xl md:p-8">
        <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-500">SalesFlow Hub Support</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Support Center</h1>
            <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-500">Get help with OTP, invalid login, account access, trial activation, or payment activation issues.</p>
          </div>
          <button onClick={() => { window.history.pushState({}, '', '/login'); window.dispatchEvent(new Event('salesflow:navigate')); }} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">Back to Login</button>
        </div>

        {notice && <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{notice}</div>}

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
          <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <div className="flex items-center gap-3 pb-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-orange-600"><Headphones className="h-5 w-5" /></div>
              <div><h2 className="text-lg font-black">Create Support Request</h2><p className="text-sm font-semibold text-slate-500">Use the email address registered with your SalesFlow Hub account.</p></div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">Name</span><input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200" /></label>
              <label className="space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">Registered Email</span><input value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="email@example.com" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200" /></label>
            </div>

            <label className="mt-4 block space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">Issue Type</span><select value={form.category} onChange={(e) => update('category', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200">{issueTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="mt-4 block space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">Subject</span><input value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="Example: OTP not received" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-200" /></label>
            <label className="mt-4 block space-y-2"><span className="text-xs font-black uppercase tracking-wider text-slate-500">Message</span><textarea value={form.message} onChange={(e) => update('message', e.target.value)} rows={6} placeholder="Describe the issue, the email you are using, and any error shown on the login page..." className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-200" /></label>
            <button type="submit" disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/25 disabled:opacity-60"><Send className="h-4 w-4" />{loading ? 'Submitting...' : 'Submit Support Request'}</button>
          </form>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><Mail className="h-5 w-5 text-orange-500" /><h3 className="mt-3 font-black">Email support</h3><p className="mt-1 text-sm font-semibold text-slate-500">Our team will reply to your registered email address. Add clear details for faster resolution.</p></div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><ShieldCheck className="h-5 w-5 text-blue-500" /><h3 className="mt-3 font-black">Secure support</h3><p className="mt-1 text-sm font-semibold text-slate-500">Never share your password or OTP. SalesFlow Support will never ask for your OTP.</p></div>
          </aside>
        </div>
      </section>
    </main>
  );
}
