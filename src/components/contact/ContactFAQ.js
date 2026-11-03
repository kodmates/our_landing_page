/**
 * ContactFAQ Component
 * Concept 3: Human & Premium
 * Two-column FAQ with workspace photo on the left and accessible accordions on the right.
 */

export function createContactFAQ() {
  const faqs = [
    {
      id: 'faq-projects',
      question: 'What types of projects do you work on?',
      answer: 'We engineer full-stack web applications, native Android & mobile apps, cloud backend systems, and custom business automation tools designed for operational reliability.'
    },
    {
      id: 'faq-info',
      question: 'What information should I include in my inquiry?',
      answer: 'A brief overview of your business goals, target user flows, desired timeline, and any existing technical stack is plenty. We help formalize complete technical specifications.'
    },
    {
      id: 'faq-timelines',
      question: 'How do you approach project timelines?',
      answer: 'Timelines are broken into clear two-week milestone sprints with continuous staging access, automated test suites, and weekly progress walkthroughs.'
    },
    {
      id: 'faq-teams',
      question: 'Can you work with an existing engineering team?',
      answer: 'Yes. We frequently integrate with established in-house engineering squads, adapting to your git release cadences, code review standards, and CI/CD pipelines.'
    },
    {
      id: 'faq-estimates',
      question: 'How can I discuss a project estimate?',
      answer: 'Submit your project requirements using the form above. An engineering lead will review the scope and schedule an introductory 30-minute technical consultation.'
    }
  ];

  const faqItemsMarkup = faqs.map((faq, idx) => `
    <div class="faq-item" id="${faq.id}">
      <button 
        type="button" 
        class="faq-trigger" 
        id="trigger-${faq.id}" 
        aria-expanded="${idx === 0 ? 'true' : 'false'}" 
        aria-controls="panel-${faq.id}"
      >
        <span class="faq-question">${faq.question}</span>
        <span class="faq-chevron" aria-hidden="true">+</span>
      </button>
      <div 
        id="panel-${faq.id}" 
        class="faq-panel ${idx === 0 ? 'is-open' : ''}" 
        role="region" 
        aria-labelledby="trigger-${faq.id}"
      >
        <div class="faq-panel__content">
          <p>${faq.answer}</p>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <section class="contact-faq-section" id="contact-faq-section" aria-label="Frequently Asked Questions">
      <div class="contact-faq__container">
        <div class="contact-faq-grid">
          <!-- Left Column: Heading, Friendly Subtitle, and Workspace Photo -->
          <div class="contact-faq-intro-col">
            <span class="contact-faq__eyebrow">CLEAR ANSWERS</span>
            <h2 class="contact-faq__heading">Got Questions?</h2>
            <p class="contact-faq__subtext">
              Here are clear answers to common questions about our technical engagement, estimation, and engineering process.
            </p>

            <div class="contact-faq-image-card">
              <img 
                src="/assets/contact-faq-workspace.jpg" 
                alt="Engineering workspace with laptop and architectural sketchbook" 
                class="contact-faq-workspace-img" 
                loading="lazy"
              />
              <div class="contact-faq-image-overlay" aria-hidden="true"></div>
            </div>
          </div>

          <!-- Right Column: Accessible Accordion List -->
          <div class="contact-faq-accordion-col">
            <div class="faq-accordion" id="contact-faq-accordion">
              ${faqItemsMarkup}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
