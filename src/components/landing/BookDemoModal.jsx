import { useState } from 'react';
import { isBackendConfigured, supabase } from '../../lib/supabaseClient.js';

const blankDemoForm = {
  fullName: '',
  email: '',
  mobile: '',
  companyName: '',
  teamSize: '',
  requirement: '',
  preferredTime: '',
};

export default function BookDemoModal({ onClose }) {
  const [form, setForm] = useState(blankDemoForm);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function submitDemo(event) {
    event.preventDefault();
    setMessage('');

    const cleanEmail = form.email.trim().toLowerCase();
    const cleanMobile = form.mobile.replace(/\D/g, '').slice(-10);

    if (!form.fullName.trim()) return setMessage('Please enter your full name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return setMessage('Please enter a valid business email.');
    if (!/^\d{10}$/.test(cleanMobile)) return setMessage('Please enter a valid 10 digit mobile number.');
    if (!form.companyName.trim()) return setMessage('Please enter your company name.');
    if (!form.teamSize) return setMessage('Please select your team size.');
    if (!form.requirement) return setMessage('Please select what you want to manage.');
    if (!form.preferredTime) return setMessage('Please select your preferred demo time.');
    if (!isBackendConfigured || !supabase) return setMessage('Backend is not configured. Please contact support.');

    try {
      setLoading(true);
      const { error } = await supabase.from('demo_requests').insert({
        full_name: form.fullName.trim(),
        email: cleanEmail,
        mobile: cleanMobile,
        company_name: form.companyName.trim(),
        team_size: form.teamSize,
        requirement: form.requirement,
        preferred_time: form.preferredTime,
        status: 'new',
      });

      if (error) throw error;
      setMessage('Demo request received. Our team will contact you shortly.');
      setForm(blankDemoForm);
    } catch (error) {
      setMessage(error.message || 'Unable to save demo request.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="action-modal demo-booking-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Book a Live Demo</h2>
        <p>Tell us a few details and our team will contact you to schedule your SalesFlow Hub demo.</p>
        <form onSubmit={submitDemo} className="demo-booking-form">
          <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Full Name" />
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="Business Email" />
          <input value={form.mobile} onChange={(e) => update('mobile', e.target.value)} placeholder="Mobile Number" />
          <input value={form.companyName} onChange={(e) => update('companyName', e.target.value)} placeholder="Company Name" />
          <select value={form.teamSize} onChange={(e) => update('teamSize', e.target.value)}>
            <option value="">Select Team Size</option>
            <option value="1-5">1–5</option>
            <option value="6-20">6–20</option>
            <option value="21-50">21–50</option>
            <option value="50+">50+</option>
          </select>
          <select value={form.requirement} onChange={(e) => update('requirement', e.target.value)}>
            <option value="">What do you want to manage?</option>
            <option value="Leads">Leads</option>
            <option value="Follow-ups">Follow-ups</option>
            <option value="Employee Activity">Employee Activity</option>
            <option value="Reports">Reports</option>
            <option value="Payments">Payments</option>
          </select>
          <select value={form.preferredTime} onChange={(e) => update('preferredTime', e.target.value)}>
            <option value="">Preferred Demo Time</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
          {message && <div className="demo-form-message">{message}</div>}
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Request Demo'}</button>
        </form>
      </div>
    </div>
  );
}
