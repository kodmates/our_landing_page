/**
 * Contact Configuration Module
 * Client-First Optimization: Real business options, flexible budgets, and honest discovery steps.
 */

export const CONTACT_CONFIG = {
  // Verified channels from design specification
  contactDetails: {
    email: 'hello@kodmates.dev',
    phone: '+91 98765 43210',
    location: 'Bhubaneswar, India',
    officeLabel: 'Our office',
    phoneLabel: 'Call us anytime',
    emailLabel: 'Send us an email'
  },

  socialLinks: [
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
    { name: 'X', href: 'https://x.com', icon: 'x' },
    { name: 'GitHub', href: 'https://github.com', icon: 'github' },
    { name: 'YouTube', href: 'https://youtube.com', icon: 'youtube' }
  ],

  // Form options: Software engineering disciplines
  services: [
    { value: 'web', label: 'Custom Web Application' },
    { value: 'mobile', label: 'Mobile App (Android & Cross-Platform)' },
    { value: 'backend-api', label: 'API & Backend Architecture' },
    { value: 'database-cloud', label: 'Database & Cloud Infrastructure' },
    { value: 'full-cycle', label: 'Full-Cycle Product Development' },
    { value: 'consulting', label: 'Technical Consulting & System Audit' }
  ],

  // Flexible budget ranges (Optional for client)
  budgetRanges: [
    { value: 'flexible', label: 'Flexible / To be estimated' },
    { value: '5l-10l', label: '₹5 Lakh – ₹10 Lakh ($6K – $12K)' },
    { value: '10l-25l', label: '₹10 Lakh – ₹25 Lakh ($12K – $30K)' },
    { value: '25l-50l', label: '₹25 Lakh – ₹50 Lakh ($30K – $60K)' },
    { value: '50l-plus', label: '₹50 Lakh+ ($60K+)' }
  ],

  timelines: [
    { value: 'flexible', label: 'Flexible / Standard Milestones' },
    { value: 'immediate', label: 'Target Launch in 1 – 2 Months' },
    { value: 'quarterly', label: 'Target Launch in 3 – 5 Months' },
    { value: 'long-term', label: 'Multi-Phase Long-Term Engagement' }
  ],

  // Credible, un-hyped response expectation
  responseNotice: 'Share your project details and our engineering team will review your inquiry.',

  // Explaining the next steps (What happens after submitting)
  nextSteps: [
    {
      step: '01',
      title: 'Technical Review',
      desc: 'Our engineers review your requirements, domain complexity, and architecture options.'
    },
    {
      step: '02',
      title: 'Discovery Discussion',
      desc: 'We arrange an introductory technical call to align on scope, deliverables, and team fit.'
    },
    {
      step: '03',
      title: 'Scoping & Roadmap',
      desc: 'We share transparent architecture recommendations, milestone breakdowns, and cost estimates.'
    }
  ],

  // Backend Integration status
  backendIntegration: {
    isAvailable: false,
    endpointUrl: null, // Configurable for project lead (e.g. '/api/contact' or email service webhook)
    integrationNotice: 'No backend API endpoint or external email dispatch service is currently configured in this codebase repository. Submissions are client-side validated and prepared for API transmission.'
  }
};
