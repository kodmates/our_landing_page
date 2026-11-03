import servicesData from '../data/services.js';
import { updateServicesSEO } from '../components/services/ServicesSEO.js';

/**
 * Inline SVG Icon Provider for Service Offerings & Engineering Lifecycle
 * Matches the warm champagne/gold (#FEEFB8) brand palette.
 */
function getServiceIconSvg(iconName) {
  switch (iconName) {
    case 'web':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="2.5" y="4" width="19" height="15" rx="3" stroke="currentColor" stroke-width="1.6"/>
          <path d="M2.5 9H21.5" stroke="currentColor" stroke-width="1.4" stroke-opacity="0.6"/>
          <circle cx="6" cy="6.5" r="1" fill="currentColor"/>
          <circle cx="9" cy="6.5" r="1" fill="currentColor" fill-opacity="0.6"/>
          <circle cx="12" cy="6.5" r="1" fill="currentColor" fill-opacity="0.3"/>
          <path d="M6 13H11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          <path d="M6 16H14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.7"/>
        </svg>
      `;
    case 'mobile':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="6" y="3" width="12" height="18" rx="2.5" stroke="currentColor" stroke-width="1.6"/>
          <path d="M10 6H14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.7"/>
          <circle cx="12" cy="18" r="1" fill="currentColor"/>
          <path d="M9 10L15 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.5"/>
          <path d="M9 13L13 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.5"/>
        </svg>
      `;
    case 'design':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="currentColor" stroke-width="1.6"/>
          <path d="M3.5 10.5H20.5" stroke="currentColor" stroke-width="1.4" stroke-opacity="0.6"/>
          <path d="M10.5 10.5V20.5" stroke="currentColor" stroke-width="1.4" stroke-opacity="0.6"/>
          <circle cx="7" cy="7" r="1" fill="currentColor"/>
          <circle cx="10" cy="7" r="1" fill="currentColor" fill-opacity="0.6"/>
        </svg>
      `;
    case 'backend':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 6C6 4.89543 6.89543 4 8 4H16C17.1046 4 18 4.89543 18 6V8C18 9.10457 17.1046 10 16 10H8C6.89543 10 6 9.10457 6 8V6Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M6 16C6 14.8954 6.89543 14 8 14H16C17.1046 14 18 14.8954 18 16V18C18 19.1046 17.1046 20 16 20H8C6.89543 20 6 19.1046 6 18V16Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 10V14" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          <path d="M3 8L6 8M18 8L21 8M3 16L6 16M18 16L21 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `;
    case 'cloud':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17.5 19H6.5C4.01472 19 2 16.9853 2 14.5C2 12.1564 3.79151 10.2313 6.07999 10.0243C6.56271 6.64165 9.47506 4 13 4C16.9765 4 20.2199 7.11327 20.4795 11.0421C21.9422 11.6441 23 13.0645 23 14.75C23 17.0972 21.0972 19 18.75 19H17.5Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 12V16M12 16L10 14M12 16L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    case 'automation':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>
          <path d="M19.4 15A7.97 7.97 0 0 0 20 12c0-.68-.09-1.35-.25-2l-2.05-.33a5.95 5.95 0 0 0-.8-1.92l1.24-1.68a8.03 8.03 0 0 0-2.83-2.83l-1.68 1.24a5.95 5.95 0 0 0-1.92-.8L11.38 1.6A8.04 8.04 0 0 0 8.6 1.6l-.33 2.05a5.95 5.95 0 0 0-1.92.8L4.67 3.21a8.03 8.03 0 0 0-2.83 2.83l1.24 1.68a5.95 5.95 0 0 0-.8 1.92L0.23 10c-.16.65-.25 1.32-.25 2s.09 1.35.25 2l2.05.33a5.95 5.95 0 0 0 .8 1.92l-1.24 1.68a8.03 8.03 0 0 0 2.83 2.83l1.68-1.24a5.95 5.95 0 0 0 1.92.8l.33 2.05c.65.16 1.32.25 2 .25s1.35-.09 2-.25l.33-2.05a5.95 5.95 0 0 0 1.92-.8l1.68 1.24a8.03 8.03 0 0 0 2.83-2.83l-1.24-1.68a5.95 5.95 0 0 0 .8-1.92l2.05-.33Z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      `;
    default:
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `;
  }
}

/**
 * Inline SVG Icon Provider for the Engineering Lifecycle Stages
 */
function getProcessIconSvg(iconName) {
  switch (iconName) {
    case 'discovery':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.6"/>
          <path d="M20 20L16 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M11 8V11L13 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      `;
    case 'planning':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" stroke-width="1.6"/>
          <path d="M8 8H16M8 12H16M8 16H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `;
    case 'design':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 3L2 12H7V21H17V12H22L12 3Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          <circle cx="12" cy="15" r="2" stroke="currentColor" stroke-width="1.4"/>
        </svg>
      `;
    case 'development':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7 8L3 12L7 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17 8L21 12L17 16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 4L10 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `;
    case 'testing':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 3L4 7V13C4 17.5 7.5 21 12 22C16.5 21 20 17.5 20 13V7L12 3Z" stroke="currentColor" stroke-width="1.6"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    case 'deployment':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 7V17M12 7L7 10M12 7L17 10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
      `;
    case 'support':
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M3 12H5M19 12H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `;
    default:
      return `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      `;
  }
}

/**
 * Returns authentic CSS/SVG interface mockups for the 6 core services.
 * Communicates technical capability cleanly without heavy graphics.
 */
function getServiceMockupHtml(serviceId) {
  switch (serviceId) {
    case 'web-development':
      return `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <!-- Browser Frame Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid rgba(254, 239, 184, 0.1);">
            <div style="display: flex; gap: 5px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #FF5F56;"></span>
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #FFBD2E;"></span>
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #27C93F;"></span>
            </div>
            <span style="font-size: 10px; font-family: monospace; color: rgba(254, 239, 184, 0.7);">app.enterprise.io/dashboard</span>
            <span style="font-size: 9px; font-weight: 700; color: #34D399; background: rgba(52, 211, 153, 0.12); padding: 2px 6px; border-radius: 4px;">LIGHTHOUSE: 99</span>
          </div>
          <!-- Dashboard Metric Cards -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
            <div style="background: rgba(22, 28, 28, 0.7); border: 1px solid rgba(254, 239, 184, 0.08); border-radius: 6px; padding: 8px;">
              <div style="font-size: 9px; color: rgba(240, 242, 238, 0.5); text-transform: uppercase;">P95 Latency</div>
              <div style="font-size: 14px; font-weight: 800; color: #FEEFB8;">142ms</div>
            </div>
            <div style="background: rgba(22, 28, 28, 0.7); border: 1px solid rgba(254, 239, 184, 0.08); border-radius: 6px; padding: 8px;">
              <div style="font-size: 9px; color: rgba(240, 242, 238, 0.5); text-transform: uppercase;">Core Vitals LCP</div>
              <div style="font-size: 14px; font-weight: 800; color: #34D399;">0.6s</div>
            </div>
            <div style="background: rgba(22, 28, 28, 0.7); border: 1px solid rgba(254, 239, 184, 0.08); border-radius: 6px; padding: 8px;">
              <div style="font-size: 9px; color: rgba(240, 242, 238, 0.5); text-transform: uppercase;">Build Size</div>
              <div style="font-size: 14px; font-weight: 800; color: #FEEFB8;">38.4 KB</div>
            </div>
          </div>
          <!-- Visual Chart Canvas Simulation -->
          <div style="background: rgba(14, 18, 18, 0.9); border: 1px solid rgba(254, 239, 184, 0.08); border-radius: 6px; padding: 10px; display: flex; align-items: flex-end; gap: 8px; height: 60px;">
            <div style="flex: 1; height: 35%; background: rgba(254, 239, 184, 0.2); border-radius: 2px;"></div>
            <div style="flex: 1; height: 55%; background: rgba(254, 239, 184, 0.3); border-radius: 2px;"></div>
            <div style="flex: 1; height: 45%; background: rgba(254, 239, 184, 0.35); border-radius: 2px;"></div>
            <div style="flex: 1; height: 75%; background: rgba(254, 239, 184, 0.5); border-radius: 2px;"></div>
            <div style="flex: 1; height: 60%; background: rgba(254, 239, 184, 0.4); border-radius: 2px;"></div>
            <div style="flex: 1; height: 95%; background: var(--km-accent-primary, #FEEFB8); border-radius: 2px;"></div>
          </div>
        </div>
      `;
    case 'mobile-app-development':
      return `
        <div style="display: flex; gap: 14px; justify-content: center; align-items: center;">
          <!-- Phone Chassis 1 -->
          <div style="width: 120px; background: #080A0A; border: 1.5px solid rgba(254, 239, 184, 0.2); border-radius: 14px; padding: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.6);">
            <div style="width: 28px; height: 3px; background: rgba(254, 239, 184, 0.2); border-radius: 2px; margin: 0 auto 6px;"></div>
            <div style="background: rgba(22, 28, 28, 0.9); border-radius: 8px; padding: 6px; text-align: center; border: 1px solid rgba(254, 239, 184, 0.1);">
              <div style="font-size: 8px; color: #34D399; font-weight: 700; margin-bottom: 4px;">CAMERAX ACTIVE</div>
              <div style="width: 38px; height: 38px; margin: 0 auto 4px; border: 1px dashed rgba(254, 239, 184, 0.4); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #FEEFB8;">⛶</div>
              <div style="font-size: 7.5px; color: rgba(240, 242, 238, 0.7);">Sub-sec QR Scan</div>
            </div>
          </div>
          <!-- Phone Chassis 2 (Pass view) -->
          <div style="width: 120px; background: #080A0A; border: 1.5px solid rgba(254, 239, 184, 0.2); border-radius: 14px; padding: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.6);">
            <div style="width: 28px; height: 3px; background: rgba(254, 239, 184, 0.2); border-radius: 2px; margin: 0 auto 6px;"></div>
            <div style="background: rgba(22, 28, 28, 0.9); border-radius: 8px; padding: 6px; text-align: center; border: 1px solid rgba(254, 239, 184, 0.1);">
              <div style="font-size: 8px; color: #FEEFB8; font-weight: 700; margin-bottom: 2px;">OFFLINE CACHED</div>
              <div style="font-size: 11px; font-weight: 800; color: #FFFFFF; margin-bottom: 2px;">PASS #8492</div>
              <div style="font-size: 7px; color: #34D399; background: rgba(52, 211, 153, 0.1); padding: 2px 4px; border-radius: 3px; display: inline-block;">Auto Sync OK</div>
            </div>
          </div>
        </div>
      `;
    case 'ui-ux-design':
      return `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: rgba(254, 239, 184, 0.7); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
            <span>DESIGN TOKENS // FOUNDATIONS</span>
            <span style="color: #34D399;">WCAG 2.1 AA PASS</span>
          </div>
          <!-- Color Swatch Row -->
          <div style="display: flex; gap: 6px;">
            <div style="flex: 1; height: 26px; background: #060808; border: 1px solid rgba(254, 239, 184, 0.2); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #FEEFB8;">Obsidian</div>
            <div style="flex: 1; height: 26px; background: #121818; border: 1px solid rgba(254, 239, 184, 0.2); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #FEEFB8;">Graphite</div>
            <div style="flex: 1; height: 26px; background: #FEEFB8; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 800; color: #080A0A;">Champagne</div>
            <div style="flex: 1; height: 26px; background: rgba(254, 239, 184, 0.1); border: 1px dashed rgba(254, 239, 184, 0.3); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 8px; color: #FEEFB8;">Border 10%</div>
          </div>
          <!-- Typography Scale & Component Pill -->
          <div style="display: flex; gap: 8px; align-items: center; background: rgba(22, 28, 28, 0.6); padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(254, 239, 184, 0.08);">
            <div style="font-family: serif; font-size: 15px; color: #FFFFFF; font-weight: 700;">Editorial Aa</div>
            <div style="height: 16px; width: 1px; background: rgba(254, 239, 184, 0.2);"></div>
            <div style="font-family: monospace; font-size: 10px; color: #FEEFB8;">clamp(1.8rem, 4vw, 3rem)</div>
            <div style="margin-left: auto; font-size: 9px; background: #FEEFB8; color: #080A0A; font-weight: 700; padding: 2px 8px; border-radius: 4px;">Primary CTA</div>
          </div>
        </div>
      `;
    case 'backend-api-development':
      return `
        <div style="display: flex; flex-direction: column; gap: 6px; font-family: monospace;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px; padding-bottom: 4px; border-bottom: 1px solid rgba(254, 239, 184, 0.1);">
            <span style="color: #34D399; font-weight: 700;">● RESTful CONTRACT // JSON</span>
            <span style="color: rgba(254, 239, 184, 0.6);">LATENCY: 34ms</span>
          </div>
          <div style="background: rgba(10, 14, 14, 0.85); border: 1px solid rgba(254, 239, 184, 0.1); border-radius: 6px; padding: 8px 10px; font-size: 10.5px; line-height: 1.5;">
            <div><span style="color: #60A5FA; font-weight: 700;">GET</span> <span style="color: #FEEFB8;">/api/v1/gatepass/entries</span> <span style="color: #34D399;">200 OK</span></div>
            <div style="color: rgba(240, 242, 238, 0.45); font-size: 9px; margin: 3px 0;">Authorization: Bearer sanctum_token_valid</div>
            <div style="color: rgba(240, 242, 238, 0.75); font-size: 9.5px;">
              {<br>
              &nbsp;&nbsp;<span style="color: #FEEFB8;">"status"</span>: <span style="color: #34D399;">"authorized"</span>,<br>
              &nbsp;&nbsp;<span style="color: #FEEFB8;">"tenant_id"</span>: <span style="color: #60A5FA;">"kp_772"</span>,<br>
              &nbsp;&nbsp;<span style="color: #FEEFB8;">"turnstile"</span>: <span style="color: #34D399;">true</span><br>
              }
            </div>
          </div>
        </div>
      `;
    case 'cloud-deployment':
      return `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: rgba(254, 239, 184, 0.7); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
            <span>DEPLOYMENT TOPOLOGY</span>
            <span style="color: #34D399;">ZERO-DOWNTIME ROLLOUT</span>
          </div>
          <!-- Pipeline Stages -->
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(18, 24, 24, 0.7); border: 1px solid rgba(254, 239, 184, 0.08); border-radius: 6px; padding: 8px 12px;">
            <div style="text-align: center;">
              <div style="font-size: 11px; color: #FEEFB8;">📦</div>
              <div style="font-size: 8px; color: rgba(240, 242, 238, 0.7);">Docker</div>
            </div>
            <span style="color: rgba(254, 239, 184, 0.3); font-size: 10px;">→</span>
            <div style="text-align: center;">
              <div style="font-size: 11px; color: #34D399;">⚡</div>
              <div style="font-size: 8px; color: rgba(240, 242, 238, 0.7);">Redis Q</div>
            </div>
            <span style="color: rgba(254, 239, 184, 0.3); font-size: 10px;">→</span>
            <div style="text-align: center;">
              <div style="font-size: 11px; color: #60A5FA;">🛡️</div>
              <div style="font-size: 8px; color: rgba(240, 242, 238, 0.7);">PostgreSQL</div>
            </div>
            <span style="color: rgba(254, 239, 184, 0.3); font-size: 10px;">→</span>
            <div style="text-align: center;">
              <div style="font-size: 11px; color: #FEEFB8;">🌐</div>
              <div style="font-size: 8px; color: #34D399; font-weight: 700;">Live Prod</div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 9px; color: rgba(240, 242, 238, 0.6); padding: 0 4px;">
            <span>Queue Workers: 4 Active</span>
            <span style="color: #34D399;">Health Check: 100% OK</span>
          </div>
        </div>
      `;
    case 'business-software-automation':
      return `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px; color: rgba(254, 239, 184, 0.7); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
            <span>OPERATIONAL WORKFLOW ENGINE</span>
            <span style="color: #34D399;">AUTOPILOT RUNNING</span>
          </div>
          <div style="background: rgba(14, 18, 18, 0.9); border: 1px solid rgba(254, 239, 184, 0.1); border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 9.5px;">
              <span style="color: #FFFFFF; font-weight: 600;">Supplier Webhook Sync</span>
              <span style="color: #34D399; font-weight: 700;">1,420 Items Synced</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 9.5px;">
              <span style="color: #FFFFFF; font-weight: 600;">Perimeter Gatepass Verifier</span>
              <span style="color: #FEEFB8; font-weight: 700;">Turnstile Relayed</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 9.5px;">
              <span style="color: #FFFFFF; font-weight: 600;">Forensic Audit Logging</span>
              <span style="color: rgba(240, 242, 238, 0.6);">Immutable DB Record</span>
            </div>
          </div>
        </div>
      `;
    default:
      return '';
  }
}

/**
 * Returns authentic, high-fidelity visual representations for the 3 featured projects.
 * Realistically represents their actual features (GatePass QR, KoroCraft sync, ASUTI D2C).
 */
function renderProjectVisual(previewType) {
  switch (previewType) {
    case 'gatepass':
      return `
        <div class="project-card-visual-canvas" aria-label="GatePass visitor management interface preview">
          <div class="project-visual-header">
            <span class="project-visual-code">GATEPASS // SECURE ACCESS CONSOLE</span>
            <span class="project-visual-status">
              <span class="hero-log-item__dot"></span>
              <span>LIVE CAMERAX</span>
            </span>
          </div>
          <div class="project-visual-body">
            <div style="background: rgba(20, 26, 26, 0.9); border: 1px solid rgba(254, 239, 184, 0.14); border-radius: 8px; padding: 10px; display: flex; gap: 10px; align-items: center;">
              <!-- QR Code Mockup Graphic -->
              <div style="width: 44px; height: 44px; background: rgba(8, 10, 10, 0.9); border: 1px solid rgba(254, 239, 184, 0.3); border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #FEEFB8; font-size: 16px; flex-shrink: 0;">
                ⛶
              </div>
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <div style="font-size: 8px; font-weight: 800; letter-spacing: 0.08em; color: #34D399; text-transform: uppercase;">VERIFIED VISITOR PASS</div>
                <div style="font-size: 11px; font-weight: 700; color: #FFFFFF;">PASS #GP-8492</div>
                <div style="font-size: 8.5px; color: rgba(240, 242, 238, 0.6);">Terminal 02 // North Turnstile</div>
              </div>
            </div>
          </div>
        </div>
      `;
    case 'korocraft':
      return `
        <div class="project-card-visual-canvas" aria-label="KoroCraft catalog and webhook sync engine preview">
          <div class="project-visual-header">
            <span class="project-visual-code">KOROCRAFT // FULFILLMENT ENGINE</span>
            <span class="project-visual-status">
              <span class="hero-log-item__dot"></span>
              <span>2-WAY SYNC</span>
            </span>
          </div>
          <div class="project-visual-body">
            <div style="background: rgba(20, 26, 26, 0.9); border: 1px solid rgba(254, 239, 184, 0.14); border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px;">
                <span style="color: rgba(240, 242, 238, 0.6);">Supplier Ingest API</span>
                <span style="color: #FEEFB8; font-weight: 700;">140ms Latency</span>
              </div>
              <div style="display: flex; gap: 4px;">
                <div style="flex: 1; height: 16px; background: rgba(254, 239, 184, 0.1); border-radius: 3px; display: flex; align-items: center; padding: 0 6px; font-size: 7.5px; color: #FEEFB8;">SKU #9941 Synced</div>
                <div style="flex: 1; height: 16px; background: rgba(52, 211, 153, 0.15); border-radius: 3px; display: flex; align-items: center; padding: 0 6px; font-size: 7.5px; color: #34D399;">Stock: 48 in Hub</div>
              </div>
            </div>
          </div>
        </div>
      `;
    case 'asuti':
      return `
        <div class="project-card-visual-canvas" aria-label="ASUTI luxury minimalist e-commerce storefront preview">
          <div class="project-visual-header">
            <span class="project-visual-code">ASUTI // EDITORIAL STOREFRONT</span>
            <span class="project-visual-status">
              <span class="hero-log-item__dot"></span>
              <span>0.6s LCP SPEED</span>
            </span>
          </div>
          <div class="project-visual-body">
            <div style="background: rgba(20, 26, 26, 0.9); border: 1px solid rgba(254, 239, 184, 0.14); border-radius: 8px; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 8px; letter-spacing: 0.12em; color: var(--km-accent-primary, #FEEFB8); text-transform: uppercase;">D2C BEAUTY RITUALS</div>
                <div style="font-size: 11.5px; font-weight: 700; color: #FFFFFF;">Botanical Hydration Mist</div>
                <div style="font-size: 8.5px; color: rgba(240, 242, 238, 0.55);">Dynamic Cart & Fast Checkout</div>
              </div>
              <div style="background: rgba(254, 239, 184, 0.12); border: 1px solid rgba(254, 239, 184, 0.25); border-radius: 6px; padding: 4px 8px; font-size: 8.5px; font-weight: 700; color: #FEEFB8;">
                BAG (2)
              </div>
            </div>
          </div>
        </div>
      `;
    default:
      return '';
  }
}

/**
 * Streamlined ServicesPage Component
 * Compact 8-section layout with interactive expandable service cards,
 * interactive service showcase tabs, visual portfolio cards, and connected timeline.
 */
export class ServicesPage {
  constructor(options = {}) {
    this.target = options.target || document.getElementById('main-content');
    this.pageEl = null;
    this.currentShowcaseIndex = 0;
    this._cardExpandButtons = [];
    this._faqButtons = [];
    this._anchorLinks = [];
    this._showcaseTabs = [];
    this._handleCardToggle = this._handleCardToggle.bind(this);
    this._handleFaqClick = this._handleFaqClick.bind(this);
    this._handleFaqKeyDown = this._handleFaqKeyDown.bind(this);
    this._handleAnchorClick = this._handleAnchorClick.bind(this);
    this._handleTabClick = this._handleTabClick.bind(this);
    this._handleTabKeyDown = this._handleTabKeyDown.bind(this);
  }

  /**
   * Generates the semantic HTML for all 8 consolidated sections of the Services Page.
   */
  renderHTML() {
    const { hero, coreServices, technologies, process, whyChooseUs, featuredCaseStudies, faqs, finalCta } = servicesData;

    // SECTION 1: Dual-Device Product Showcase Hero
    const heroMarkup = `
      <section class="services-hero" aria-labelledby="services-hero-headline">
        <div class="services-container">
          <div class="services-hero__grid">
            <div class="services-hero__content">
              <span class="services-eyebrow">
                <span class="services-hero__status-dot" aria-hidden="true"></span>
                ${hero.eyebrow}
              </span>
              <h1 class="services-hero__title" id="services-hero-headline">
                Technology Built Around <span class="services-hero__title-accent">Your Business.</span>
              </h1>
              <p class="services-hero__copy">
                ${hero.supportingCopy}
              </p>
              <div class="services-hero__actions">
                <a href="${hero.primaryCta.href}" class="services-btn-primary services-anchor-link">
                  <span>${hero.primaryCta.label}</span>
                  <span aria-hidden="true">→</span>
                </a>
                <a href="${hero.secondaryCta.href}" class="services-btn-secondary services-anchor-link">
                  <span>${hero.secondaryCta.label}</span>
                  <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>

            <!-- Dual-Device Hero Showcase -->
            <div class="services-hero__visual" aria-label="KodMates software platform and mobile preview">
              <div class="services-hero__showcase">
                <!-- Desktop Application Window -->
                <div class="hero-desktop-shell">
                  <div class="hero-desktop-shell__titlebar">
                    <div class="hero-desktop-shell__dots" aria-hidden="true">
                      <span class="hero-desktop-shell__dot"></span>
                      <span class="hero-desktop-shell__dot"></span>
                      <span class="hero-desktop-shell__dot"></span>
                    </div>
                    <span class="hero-desktop-shell__address">kodmates.internal/console/ops</span>
                    <span class="hero-desktop-shell__status">
                      <span class="hero-log-item__dot"></span>
                      ACTIVE SYSTEM
                    </span>
                  </div>
                  <div class="hero-desktop-shell__body">
                    <!-- Metric Tiles (Balanced 2-column layout so nothing is obscured by the mobile preview) -->
                    <div class="hero-desktop-metrics">
                      <div class="hero-metric-tile">
                        <div class="hero-metric-tile__label">SYSTEM UPTIME</div>
                        <div class="hero-metric-tile__value">99.98%</div>
                      </div>
                      <div class="hero-metric-tile">
                        <div class="hero-metric-tile__label">P95 API LATENCY</div>
                        <div class="hero-metric-tile__value">140ms</div>
                      </div>
                    </div>
                    <!-- Real-Time Activity Log -->
                    <div class="hero-desktop-log">
                      <div class="hero-log-item">
                        <span class="hero-log-item__event">
                          <span class="hero-log-item__dot"></span>
                          <span>Visitor QR Pass Verified — Gate 02</span>
                        </span>
                        <span class="hero-log-item__time">Just now</span>
                      </div>
                      <div class="hero-log-item">
                        <span class="hero-log-item__event">
                          <span class="hero-log-item__dot"></span>
                          <span>Supplier Webhook Batch Ingested (48 items)</span>
                        </span>
                        <span class="hero-log-item__time">2m ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Overlapping Smartphone Application Mockup -->
                <div class="hero-mobile-shell" aria-hidden="true">
                  <div class="hero-mobile-shell__notch"></div>
                  <div class="hero-mobile-shell__card">
                    <div class="hero-mobile-shell__qr">⛶</div>
                    <div class="hero-mobile-shell__tag">PASS #GP-8492 // VERIFIED</div>
                    <div class="hero-mobile-shell__sub">Turnstile Relayed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // SECTION 2: Core Service Offerings + Interactive Service Showcase
    const defaultService = coreServices[this.currentShowcaseIndex];

    const serviceTabsMarkup = coreServices
      .map(
        (srv, idx) => `
        <button
          type="button"
          class="services-tab-btn"
          role="tab"
          id="tab-${srv.id}"
          aria-selected="${idx === this.currentShowcaseIndex ? 'true' : 'false'}"
          aria-controls="services-tabpanel"
          data-index="${idx}"
        >
          <span style="font-size: 11px; color: var(--km-accent-primary, #FEEFB8);">${srv.number}</span>
          <span>${srv.title}</span>
        </button>
      `
      )
      .join('');

    const serviceCardsMarkup = coreServices
      .map(
        (card) => `
        <article class="services-card" id="card-${card.id}" aria-labelledby="card-title-${card.id}">
          <div class="services-card__top">
            <div class="services-card__icon-box">
              ${getServiceIconSvg(card.icon)}
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="services-card__number">${card.number}</span>
              <span class="services-card__badge">${card.badge}</span>
            </div>
          </div>
          <h3 class="services-card__title" id="card-title-${card.id}">${card.title}</h3>
          <p class="services-card__description">${card.shortDescription}</p>
          
          <ul class="services-card__capabilities-list" aria-label="${card.title} key highlights">
            ${card.keyCapabilities
              .map(
                (cap) => `
              <li class="services-card__capability-item">
                <span class="services-card__capability-bullet" aria-hidden="true"></span>
                <span>${cap}</span>
              </li>
            `
              )
              .join('')}
          </ul>

          <div class="services-card__footer">
            <button
              type="button"
              class="services-card__expand-btn"
              id="service-trigger-${card.id}"
              aria-expanded="false"
              aria-controls="service-details-${card.id}"
              data-service-id="${card.id}"
            >
              <span class="services-card__expand-btn-text">View Details</span>
              <span class="services-card__expand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </button>
          </div>

          <!-- Expandable Detail Drawer -->
          <div
            class="services-card__drawer"
            id="service-details-${card.id}"
            role="region"
            aria-labelledby="service-trigger-${card.id}"
          >
            <div class="services-card__drawer-inner">
              <div class="services-card__drawer-content">
                <div class="services-card__detail-block">
                  <div class="services-card__detail-label">THE PROBLEM ADDRESSED</div>
                  <p class="services-card__problem-text">${card.expandedDetails.problem}</p>
                </div>

                <div class="services-card__detail-block">
                  <div class="services-card__detail-label">WHAT WE DELIVER</div>
                  <ul class="services-card__deliverables-list">
                    ${card.expandedDetails.deliverables
                      .map(
                        (d) => `
                      <li class="services-card__deliverable-item">
                        <span class="services-card__deliverable-check" aria-hidden="true">✓</span>
                        <span>${d}</span>
                      </li>
                    `
                      )
                      .join('')}
                  </ul>
                </div>

                <div class="services-card__detail-block">
                  <div class="services-card__detail-label">TECHNOLOGY & STACK</div>
                  <div class="services-card__tech-pills">
                    ${card.expandedDetails.technologies
                      .map(
                        (t) => `
                      <span class="services-card__tech-pill">${t}</span>
                    `
                      )
                      .join('')}
                  </div>
                </div>

                <div class="services-card__outcome-box">
                  <div style="font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: var(--km-accent-primary, #FEEFB8); margin-bottom: 4px; text-transform: uppercase;">
                    EXPECTED OUTCOME
                  </div>
                  <div>${card.expandedDetails.outcomes}</div>
                </div>

                <a href="#contact" class="services-card__drawer-cta services-anchor-link">
                  <span>${card.expandedDetails.ctaLabel}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </article>
      `
      )
      .join('');

    const offeringsSectionMarkup = `
      <section class="services-offerings-section" id="services-offerings" aria-labelledby="services-offerings-heading">
        <div class="services-container">
          <div class="services-section-header services-section-header--center">
            <span class="services-eyebrow">CORE CAPABILITIES</span>
            <h2 class="services-section-title" id="services-offerings-heading">Core Service Offerings</h2>
            <p class="services-section-subtitle">
              Comprehensive software engineering tailored to modern business requirements. Select a service tab to inspect dynamic architecture previews or expand the cards below for granular deliverables.
            </p>
          </div>

          <!-- Phase 4: Interactive Service Showcase Unit -->
          <div class="services-showcase-unit" aria-labelledby="services-showcase-heading">
            <div class="services-tablist" role="tablist" aria-label="Interactive Service Showcase Categories">
              ${serviceTabsMarkup}
            </div>

            <div
              class="services-tab-panel"
              id="services-tabpanel"
              role="tabpanel"
              aria-labelledby="tab-${defaultService.id}"
            >
              <div class="services-showcase__info">
                <span class="services-showcase__tag" id="showcase-highlight">${defaultService.showcaseHighlight}</span>
                <h3 class="services-showcase__title" id="showcase-title">${defaultService.title}</h3>
                <p class="services-showcase__tagline" id="showcase-tagline">${defaultService.showcaseTagline}</p>
                <ul class="services-showcase__features" id="showcase-features">
                  ${defaultService.keyCapabilities
                    .map(
                      (cap) => `
                    <li class="services-showcase__feature-item">
                      <span class="services-showcase__feature-check">✓</span>
                      <span>${cap}</span>
                    </li>
                  `
                    )
                    .join('')}
                </ul>
                <div>
                  <a href="#card-${defaultService.id}" id="showcase-spec-link" class="services-btn-secondary services-anchor-link" style="height: 38px; padding: 0 16px; font-size: 12.5px;">
                    <span>View Technical Specifications</span>
                    <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>

              <!-- Dedicated Visual Mockup Area -->
              <div class="services-showcase__mockup" id="showcase-mockup" aria-live="polite">
                ${getServiceMockupHtml(defaultService.id)}
              </div>
            </div>
          </div>

          <!-- 6 Expandable Service Cards Grid -->
          <div class="services-cards-grid">
            ${serviceCardsMarkup}
          </div>
        </div>
      </section>
    `;

    // SECTION 3: Technology & Capabilities (Grouped Grid)
    const techCardsMarkup = technologies
      .map(
        (cat) => `
        <div class="services-tech__card">
          <h3 class="services-tech__category">
            <span class="services-tech__category-dot" aria-hidden="true"></span>
            ${cat.category}
          </h3>
          <div class="services-tech__tags">
            ${cat.items
              .map(
                (item) => `
              <span class="services-tech__tag">${item}</span>
            `
              )
              .join('')}
          </div>
        </div>
      `
      )
      .join('');

    const techSectionMarkup = `
      <section class="services-tech-section" aria-labelledby="services-tech-heading">
        <div class="services-container">
          <div class="services-section-header services-section-header--center">
            <span class="services-eyebrow">ENGINEERING STACK</span>
            <h2 class="services-section-title" id="services-tech-heading">Technology & Capabilities</h2>
            <p class="services-section-subtitle">
              Organized into battle-tested categories. We select the most resilient, modern tools tailored to each system requirement.
            </p>
          </div>
          <div class="services-tech__grid">
            ${techCardsMarkup}
          </div>
        </div>
      </section>
    `;

    // SECTION 4: Seven-Stage Engineering Lifecycle (Connected Timeline)
    const processStepsMarkup = process
      .map(
        (st) => `
        <div class="services-timeline-node">
          <div class="services-timeline-node__head">
            <span class="services-timeline-node__num-badge">${st.step}</span>
            <div class="services-timeline-node__icon-box">
              ${getProcessIconSvg(st.icon)}
            </div>
          </div>
          <div class="services-timeline-node__body">
            <h3 class="services-timeline-node__title">${st.title}</h3>
            <p class="services-timeline-node__desc">${st.description}</p>
            ${st.checkpoint ? `
              <div class="services-timeline-node__checkpoint">
                <span class="services-timeline-node__checkpoint-dot" aria-hidden="true"></span>
                <span>${st.checkpoint}</span>
              </div>
            ` : ''}
          </div>
        </div>
      `
      )
      .join('');

    const processSectionMarkup = `
      <section class="services-process-section" id="process" aria-labelledby="services-process-heading">
        <div class="services-container">
          <div class="services-section-header services-section-header--center">
            <span class="services-eyebrow">HOW WE WORK</span>
            <h2 class="services-section-title" id="services-process-heading">Seven-Stage Engineering Lifecycle</h2>
            <p class="services-section-subtitle">
              A disciplined, transparent delivery framework that eliminates guesswork from discovery through post-launch continuity.
            </p>
          </div>
          <!-- Connected Timeline Track -->
          <div class="services-timeline-track">
            ${processStepsMarkup}
          </div>
          <p class="services-process__notice">
            * Note: Ongoing support, monitoring, and enhancement retainers depend upon the agreed engagement scope. Project delivery timelines are calculated strictly against technical architecture specifications during Planning.
          </p>
        </div>
      </section>
    `;

    // SECTION 5: Why Choose KodMates (3 Concise Cards)
    const whyCardsMarkup = whyChooseUs
      .map(
        (why) => `
        <div class="services-why__card">
          <div class="services-why__number">${why.number} // PRINCIPLE</div>
          <h3 class="services-why__title">${why.title}</h3>
          <p class="services-why__desc">${why.description}</p>
        </div>
      `
      )
      .join('');

    const whySectionMarkup = `
      <section class="services-why-section" aria-labelledby="services-why-heading">
        <div class="services-container">
          <div class="services-section-header services-section-header--center">
            <span class="services-eyebrow">OUR COMMITMENT</span>
            <h2 class="services-section-title" id="services-why-heading">Why Choose KodMates</h2>
            <p class="services-section-subtitle">
              Ground-level principles guiding every architectural decision, line of code, and client interaction.
            </p>
          </div>
          <div class="services-why__grid">
            ${whyCardsMarkup}
          </div>
        </div>
      </section>
    `;

    // SECTION 6: Proven Execution in Production (Visual Portfolio Cards)
    const featuredCardsMarkup = featuredCaseStudies
      .map(
        (proj) => `
        <a href="${proj.route}" class="services-featured__card" aria-label="View case study for ${proj.title}">
          ${renderProjectVisual(proj.previewType)}
          <span class="services-featured__category">${proj.category}</span>
          <h3 class="services-featured__title">${proj.title}</h3>
          <div class="services-featured__tagline">${proj.tagline}</div>
          <p class="services-featured__desc">${proj.description}</p>
          <div class="services-featured__tech-row">
            ${proj.tech
              .map(
                (t) => `
              <span class="services-featured__tech-tag">${t}</span>
            `
              )
              .join('')}
          </div>
          <div class="services-featured__action">
            <span>Read Case Study</span>
            <span aria-hidden="true">→</span>
          </div>
        </a>
      `
      )
      .join('');

    const featuredSectionMarkup = `
      <section class="services-featured-section" aria-labelledby="services-featured-heading">
        <div class="services-container">
          <div class="services-section-header services-section-header--center">
            <span class="services-eyebrow">VERIFIED WORK</span>
            <h2 class="services-section-title" id="services-featured-heading">Proven Execution in Production</h2>
            <p class="services-section-subtitle">
              Explore real-world software platforms engineered and delivered by the KodMates team.
            </p>
          </div>
          <div class="services-featured__grid">
            ${featuredCardsMarkup}
          </div>
        </div>
      </section>
    `;

    // SECTION 7: Frequently Asked Questions (Compact Accordion)
    const faqsMarkup = faqs
      .map(
        (faq, idx) => `
        <div class="services-faq__item" id="faq-item-${idx}">
          <button
            type="button"
            class="services-faq__trigger"
            id="faq-btn-${idx}"
            aria-expanded="false"
            aria-controls="faq-panel-${idx}"
            data-faq-index="${idx}"
          >
            <span>${faq.question}</span>
            <span class="services-faq__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </button>
          <div
            class="services-faq__panel"
            id="faq-panel-${idx}"
            role="region"
            aria-labelledby="faq-btn-${idx}"
          >
            <div class="services-faq__panel-inner">
              <p class="services-faq__answer">${faq.answer}</p>
            </div>
          </div>
        </div>
      `
      )
      .join('');

    const faqSectionMarkup = `
      <section class="services-faq-section" id="faq" aria-labelledby="services-faq-heading">
        <div class="services-container services-faq__container">
          <div class="services-section-header services-section-header--center">
            <span class="services-eyebrow">COMMON QUESTIONS</span>
            <h2 class="services-section-title" id="services-faq-heading">Frequently Asked Questions</h2>
            <p class="services-section-subtitle">
              Straightforward answers about our engagement workflows, technical approach, timelines, and ongoing support.
            </p>
          </div>
          <div class="services-faq__accordion" role="region" aria-label="Frequently Asked Questions Accordion">
            ${faqsMarkup}
          </div>
        </div>
      </section>
    `;

    // SECTION 8: Final Contact CTA
    const finalCtaMarkup = `
      <section class="services-cta-section" id="contact" aria-labelledby="services-cta-headline">
        <div class="services-container">
          <div class="services-cta__banner">
            <span class="services-eyebrow" style="margin-bottom: 10px;">LET’S COLLABORATE</span>
            <h2 class="services-cta__headline" id="services-cta-headline">${finalCta.headline}</h2>
            <p class="services-cta__copy">
              ${finalCta.supportingCopy}
            </p>
            <div class="services-cta__actions">
              <a href="${finalCta.primaryCta.href}" class="services-btn-primary services-anchor-link">
                <span>${finalCta.primaryCta.label}</span>
                <span aria-hidden="true">→</span>
              </a>
              <a href="${finalCta.secondaryCta.href}" class="services-btn-secondary services-anchor-link">
                <span>${finalCta.secondaryCta.label}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    `;

    return `
      <div class="services-page" id="services-page">
        ${heroMarkup}
        ${offeringsSectionMarkup}
        ${techSectionMarkup}
        ${processSectionMarkup}
        ${whySectionMarkup}
        ${featuredSectionMarkup}
        ${faqSectionMarkup}
        ${finalCtaMarkup}
      </div>
    `;
  }

  /**
   * Mounts the component into the container element and binds listeners.
   */
  mount(container = null) {
    const parent = container || this.target;
    if (!parent) return null;

    const existing = document.getElementById('services-page');
    if (existing) {
      this.pageEl = existing;
      this.bindEvents();
      return this.pageEl;
    }

    const temp = document.createElement('div');
    temp.innerHTML = this.renderHTML().trim();
    this.pageEl = temp.firstElementChild;
    parent.appendChild(this.pageEl);

    this.bindEvents();
    updateServicesSEO();
    return this.pageEl;
  }

  /**
   * Attaches event listeners for interactive tabs, expandable service cards, FAQs, and anchor smooth scrolling.
   */
  bindEvents() {
    if (!this.pageEl) return;

    // 1. Interactive Service Showcase Tabs
    this._showcaseTabs = Array.from(this.pageEl.querySelectorAll('.services-tab-btn'));
    this._showcaseTabs.forEach((tab) => {
      tab.addEventListener('click', this._handleTabClick);
      tab.addEventListener('keydown', this._handleTabKeyDown);
    });

    // 2. Expandable Service Cards
    this._cardExpandButtons = Array.from(this.pageEl.querySelectorAll('.services-card__expand-btn'));
    this._cardExpandButtons.forEach((btn) => {
      btn.addEventListener('click', this._handleCardToggle);
    });

    // 3. FAQ Accordion
    this._faqButtons = Array.from(this.pageEl.querySelectorAll('.services-faq__trigger'));
    this._faqButtons.forEach((btn) => {
      btn.addEventListener('click', this._handleFaqClick);
      btn.addEventListener('keydown', this._handleFaqKeyDown);
    });

    // 4. Anchor Links Smooth Scrolling
    this._anchorLinks = Array.from(this.pageEl.querySelectorAll('.services-anchor-link'));
    this._anchorLinks.forEach((link) => {
      link.addEventListener('click', this._handleAnchorClick);
    });
  }

  /**
   * Updates the interactive service showcase display when a tab is selected.
   */
  _switchShowcaseTab(targetIndex) {
    if (targetIndex < 0 || targetIndex >= servicesData.coreServices.length) return;
    this.currentShowcaseIndex = targetIndex;

    const selectedService = servicesData.coreServices[targetIndex];

    // Update Tab states
    this._showcaseTabs.forEach((tab, idx) => {
      const isSelected = idx === targetIndex;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    // Update Panel content
    const panel = this.pageEl.querySelector('#services-tabpanel');
    const highlightEl = this.pageEl.querySelector('#showcase-highlight');
    const titleEl = this.pageEl.querySelector('#showcase-title');
    const taglineEl = this.pageEl.querySelector('#showcase-tagline');
    const featuresEl = this.pageEl.querySelector('#showcase-features');
    const mockupEl = this.pageEl.querySelector('#showcase-mockup');
    const specLinkEl = this.pageEl.querySelector('#showcase-spec-link');

    if (panel) {
      panel.setAttribute('aria-labelledby', `tab-${selectedService.id}`);
    }
    if (highlightEl) {
      highlightEl.textContent = selectedService.showcaseHighlight;
    }
    if (titleEl) {
      titleEl.textContent = selectedService.title;
    }
    if (taglineEl) {
      taglineEl.textContent = selectedService.showcaseTagline;
    }
    if (specLinkEl) {
      specLinkEl.setAttribute('href', `#card-${selectedService.id}`);
    }
    if (featuresEl) {
      featuresEl.innerHTML = selectedService.keyCapabilities
        .map(
          (cap) => `
        <li class="services-showcase__feature-item">
          <span class="services-showcase__feature-check">✓</span>
          <span>${cap}</span>
        </li>
      `
        )
        .join('');
    }
    if (mockupEl) {
      mockupEl.innerHTML = getServiceMockupHtml(selectedService.id);
    }
  }

  /**
   * Click handler for showcase tabs.
   */
  _handleTabClick(event) {
    const btn = event.currentTarget;
    if (!btn) return;
    const targetIndex = parseInt(btn.getAttribute('data-index'), 10);
    this._switchShowcaseTab(targetIndex);
  }

  /**
   * Accessible keyboard navigation for showcase tabs (ArrowLeft, ArrowRight, Home, End).
   */
  _handleTabKeyDown(event) {
    const btn = event.currentTarget;
    const currentIndex = this._showcaseTabs.indexOf(btn);
    if (currentIndex === -1) return;

    let targetIndex = null;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      targetIndex = (currentIndex + 1) % this._showcaseTabs.length;
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      targetIndex = (currentIndex - 1 + this._showcaseTabs.length) % this._showcaseTabs.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      targetIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      targetIndex = this._showcaseTabs.length - 1;
    }

    if (targetIndex !== null && this._showcaseTabs[targetIndex]) {
      this._showcaseTabs[targetIndex].focus();
      this._switchShowcaseTab(targetIndex);
    }
  }

  /**
   * Toggles the expandable service card details.
   */
  _handleCardToggle(event) {
    const btn = event.currentTarget;
    if (!btn) return;

    const card = btn.closest('.services-card');
    if (!card) return;

    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const nextState = !isExpanded;

    btn.setAttribute('aria-expanded', String(nextState));
    card.classList.toggle('is-expanded', nextState);

    const btnText = btn.querySelector('.services-card__expand-btn-text');
    if (btnText) {
      btnText.textContent = nextState ? 'Hide Details' : 'View Details';
    }
  }

  /**
   * Toggles the clicked FAQ question accordion state.
   */
  _handleFaqClick(event) {
    const btn = event.currentTarget;
    if (!btn) return;

    const item = btn.closest('.services-faq__item');
    if (!item) return;

    const isExpanded = btn.getAttribute('aria-expanded') === 'true';
    const nextState = !isExpanded;

    btn.setAttribute('aria-expanded', String(nextState));
    item.classList.toggle('is-open', nextState);
  }

  /**
   * Accessible keyboard navigation for the FAQ accordion.
   * Supports ArrowUp, ArrowDown, Home, End navigation between questions.
   */
  _handleFaqKeyDown(event) {
    const btn = event.currentTarget;
    const currentIndex = this._faqButtons.indexOf(btn);
    if (currentIndex === -1) return;

    let targetIndex = null;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      targetIndex = (currentIndex + 1) % this._faqButtons.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      targetIndex = (currentIndex - 1 + this._faqButtons.length) % this._faqButtons.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      targetIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      targetIndex = this._faqButtons.length - 1;
    }

    if (targetIndex !== null && this._faqButtons[targetIndex]) {
      this._faqButtons[targetIndex].focus();
    }
  }

  /**
   * Smoothly scrolls to on-page anchor targets.
   */
  _handleAnchorClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const targetElement = document.querySelector(href);
    if (targetElement) {
      event.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Lifecycle cleanup to prevent memory leaks and dangling listeners.
   */
  destroy() {
    if (this._showcaseTabs) {
      this._showcaseTabs.forEach((tab) => {
        tab.removeEventListener('click', this._handleTabClick);
        tab.removeEventListener('keydown', this._handleTabKeyDown);
      });
      this._showcaseTabs = [];
    }

    if (this._cardExpandButtons) {
      this._cardExpandButtons.forEach((btn) => {
        btn.removeEventListener('click', this._handleCardToggle);
      });
      this._cardExpandButtons = [];
    }

    if (this._faqButtons) {
      this._faqButtons.forEach((btn) => {
        btn.removeEventListener('click', this._handleFaqClick);
        btn.removeEventListener('keydown', this._handleFaqKeyDown);
      });
      this._faqButtons = [];
    }

    if (this._anchorLinks) {
      this._anchorLinks.forEach((link) => {
        link.removeEventListener('click', this._handleAnchorClick);
      });
      this._anchorLinks = [];
    }

    if (this.pageEl && this.pageEl.parentNode) {
      this.pageEl.parentNode.removeChild(this.pageEl);
    }
    this.pageEl = null;
  }
}

/**
 * Convenience initializer for the Services Page
 */
export function initServicesPage(options = {}) {
  const page = new ServicesPage(options);
  page.mount();
  return page;
}

export default ServicesPage;
