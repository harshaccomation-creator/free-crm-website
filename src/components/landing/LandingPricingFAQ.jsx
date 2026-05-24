import { useState } from 'react';
import '../../styles/landingPricingFAQ.css';

const pricingPlans = [
  {
    name: 'Free Trial',
    price: '₹0',
    label: '7 days free',
    text: 'A simple way to explore SalesFlow before setting up your full CRM workflow.',
    features: ['Lead capture preview', 'Follow-up reminders', 'Basic sales dashboard'],
    action: 'Start Free Trial',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '₹999',
    label: 'per month',
    text: 'For small teams that need a clean CRM to manage leads, tasks and daily follow-ups.',
    features: ['Lead pipeline', 'Activity notes', 'Task board', 'Reports preview'],
    action: 'Choose Starter Plan',
    highlight: true,
  },
  {
    name: 'Business',
    price: 'Custom',
    label: 'team plan',
    text: 'For growing teams that need admin control, custom modules and priority setup support.',
    features: ['Admin controls', 'Super admin module', 'Custom workflows', 'Priority support'],
    action: 'Contact Sales',
    highlight: false,
  },
];

const faqs = [
  {
    question: 'What is SalesFlow CRM?',
    answer: 'SalesFlow is a SaaS CRM workspace designed to help sales teams manage leads, follow-ups, deals, tasks and reporting from one clean, organized system.',
  },
  {
    question: 'How long is the free trial?',
    answer: 'SalesFlow includes a 7-day free trial so teams can explore the CRM experience before moving to a paid plan. Final subscription rules can be connected with billing later.',
  },
  {
    question: 'How does lead follow-up tracking work?',
    answer: 'Every lead can be connected with calls, notes, reminders, tasks and activity history, so your team always knows the next step and nothing gets missed.',
  },
  {
    question: 'What is the difference between Admin and Super Admin?',
    answer: 'Admins manage team users, CRM settings and daily operations. Super Admins manage company-level controls such as plans, tenants, billing and global permissions.',
  },
  {
    question: 'Is customer data secure?',
    answer: 'SalesFlow is structured for role-based access, protected customer records and secure activity history. Final security rules will be implemented with the backend setup.',
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

      <div id="faq" className="faq-block pro-faq-block">
        <div className="faq-copy">
          <span>FAQ</span>
          <h2>Questions before you get started.</h2>
          <p>Clear answers for teams evaluating SalesFlow for lead management, follow-ups and sales operations.</p>
          <button className="btn btn-primary" onClick={() => openModal('Contact Sales')}>Talk to Sales</button>
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
