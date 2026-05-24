import { useState } from 'react';
import '../../styles/landingPricingFAQ.css';

const pricingPlans = [
  {
    name: 'Free Trial',
    price: '₹0',
    label: '7 days free',
    text: 'Best for testing SalesFlow with landing, leads and follow-up workflow.',
    features: ['Lead capture preview', 'Follow-up reminders', 'Basic sales dashboard'],
    action: 'Start Free Trial',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '₹999',
    label: 'per month',
    text: 'For small teams who need a clean CRM to manage daily leads.',
    features: ['Lead pipeline', 'Activity notes', 'Task board', 'Reports preview'],
    action: 'Choose Starter Plan',
    highlight: true,
  },
  {
    name: 'Business',
    price: 'Custom',
    label: 'team plan',
    text: 'For growing teams that need admin, super admin and custom CRM modules.',
    features: ['Admin controls', 'Super admin module', 'Custom workflows', 'Priority support'],
    action: 'Contact Sales',
    highlight: false,
  },
];

const faqs = [
  {
    question: 'SalesFlow CRM kya hai?',
    answer: 'SalesFlow ek SaaS CRM workspace hai jisme leads, follow-ups, deals, tasks aur reporting ko clean modules me manage kiya ja sakta hai.',
  },
  {
    question: 'Free trial kitne din ka hai?',
    answer: 'Landing page par 7 days free trial show kiya gaya hai. Final pricing aur trial rules backend/subscription setup ke time lock honge.',
  },
  {
    question: 'Lead follow-up kaise track hoga?',
    answer: 'Lead ke saath calls, notes, reminders aur activity timeline connect rahegi, jisse sales team ko next action clearly dikhega.',
  },
  {
    question: 'Admin aur Super Admin me kya difference hai?',
    answer: 'Admin team/users aur CRM settings manage karega. Super Admin company-level plans, tenants, billing aur high-level controls manage karega.',
  },
  {
    question: 'Kya data secure rahega?',
    answer: 'Design me role-based access, protected records aur secure customer history ka structure rakha gaya hai. Final security backend setup ke saath implement hogi.',
  },
];

export default function LandingPricingFAQ({ openModal }) {
  const [activeFaq, setActiveFaq] = useState(0);

  return (
    <section className="landing-shell pricing-faq-section">
      <div id="pricing" className="pricing-block">
        <div className="section-center-heading">
          <span>Simple Pricing</span>
          <h2>Start small, upgrade when your CRM grows.</h2>
          <p>Choose a plan based on your team size. Final plan rules can be connected later with backend and billing.</p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <article className={`pricing-card ${plan.highlight ? 'highlight' : ''}`} key={plan.name}>
              {plan.highlight && <span className="popular-badge">Most Popular</span>}
              <h3>{plan.name}</h3>
              <div className="price-row"><strong>{plan.price}</strong><span>{plan.label}</span></div>
              <p>{plan.text}</p>
              <ul>
                {plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}
              </ul>
              <button className={plan.highlight ? 'btn btn-primary' : 'btn plan-outline'} onClick={() => openModal(plan.action)}>{plan.action}</button>
            </article>
          ))}
        </div>
      </div>

      <div id="faq" className="faq-block">
        <div className="faq-copy">
          <span>FAQ</span>
          <h2>Common questions before launch.</h2>
          <p>Ye section visitors ko quickly clear karta hai ki SalesFlow kya karega aur kaise kaam karega.</p>
          <button className="btn btn-primary" onClick={() => openModal('Contact Sales')}>Still have questions?</button>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <button className={`faq-item ${activeFaq === index ? 'active' : ''}`} key={faq.question} onClick={() => setActiveFaq(index)}>
              <div><strong>{faq.question}</strong><span>{activeFaq === index ? '−' : '+'}</span></div>
              {activeFaq === index && <p>{faq.answer}</p>}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
