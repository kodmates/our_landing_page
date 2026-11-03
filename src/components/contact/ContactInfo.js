/**
 * ContactInfo Component
 * Left column of the 3-column contact section: Contact Information, Direct Channels & Social Links.
 * Matches reference image layout, typography, icons, and subtle background topographic wave.
 */

import { CONTACT_CONFIG } from './ContactConfig.js';

export function createContactInfo() {
  const { contactDetails } = CONTACT_CONFIG;

  return `
    <div class="contact-info-col" aria-label="Direct Contact Channels">
      <!-- Animated Background Gold Topographic Wave behind lower portion -->
      <div class="contact-info-wave" aria-hidden="true">
        <svg viewBox="0 0 400 320" fill="none" class="contact-info-wave-svg" preserveAspectRatio="none">
          <path d="M40,320 C120,300 160,200 240,160 C300,130 350,90 400,70" stroke="#F4D779" stroke-width="1.2" stroke-opacity="0.32" fill="none"/>
          <path d="M20,320 C105,290 150,190 230,150 C290,120 340,80 400,60" stroke="#F4D779" stroke-width="1" stroke-opacity="0.26" fill="none"/>
          <path d="M0,320 C90,280 140,180 220,140 C280,110 330,70 400,50" stroke="#F4D779" stroke-width="0.9" stroke-opacity="0.22" fill="none"/>
          <path d="M0,295 C80,265 130,170 210,130 C270,100 320,60 400,40" stroke="#F4D779" stroke-width="0.8" stroke-opacity="0.18" fill="none"/>
          <path d="M0,270 C70,250 120,160 200,120 C260,90 310,50 400,30" stroke="#F4D779" stroke-width="0.8" stroke-opacity="0.15" fill="none"/>
          <path d="M0,245 C60,235 110,150 190,110 C250,80 300,40 400,20" stroke="#F4D779" stroke-width="0.7" stroke-opacity="0.12" fill="none"/>
          <path d="M0,220 C50,220 100,140 180,100 C240,70 290,30 400,10" stroke="#F4D779" stroke-width="0.6" stroke-opacity="0.09" fill="none"/>
          <path d="M0,195 C40,205 90,130 170,90 C230,60 280,20 400,0" stroke="#F4D779" stroke-width="0.6" stroke-opacity="0.06" fill="none"/>
        </svg>
      </div>

      <div class="contact-info__header">
        <span class="contact-info__eyebrow">CONTACT INFORMATION</span>
        <h2 class="contact-info__heading">Let’s Connect</h2>
        <p class="contact-info__subtext">
          Have a project in mind or just want to say hello? We’re here and ready to help.
        </p>
      </div>

      <!-- Contact Channels with Clean Outlined Gold Icons -->
      <div class="contact-methods-list">
        <a href="mailto:${contactDetails.email}" class="contact-method-row" id="contact-method-email">
          <div class="contact-method-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </div>
          <div class="contact-method-details">
            <span class="contact-method-value">${contactDetails.email}</span>
            <span class="contact-method-label">${contactDetails.emailLabel}</span>
          </div>
        </a>

        <a href="tel:${contactDetails.phone.replace(/\s+/g, '')}" class="contact-method-row" id="contact-method-phone">
          <div class="contact-method-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </div>
          <div class="contact-method-details">
            <span class="contact-method-value">${contactDetails.phone}</span>
            <span class="contact-method-label">${contactDetails.phoneLabel}</span>
          </div>
        </a>

        <div class="contact-method-row contact-method-row--static" id="contact-method-office">
          <div class="contact-method-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="#F4D779" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div class="contact-method-details">
            <span class="contact-method-value">${contactDetails.location}</span>
            <span class="contact-method-label">${contactDetails.officeLabel}</span>
          </div>
        </div>
      </div>

      <!-- Social Links Row with subtle top divider -->
      <div class="contact-social-wrap">
        <span class="contact-social-label">Follow us</span>
        <div class="contact-social-icons">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6c0-.89-.72-1.6-1.6-1.6Z"/></svg>
          </a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="X (Twitter)">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"/></svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="YouTube">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
      </div>
    </div>
  `;
}
