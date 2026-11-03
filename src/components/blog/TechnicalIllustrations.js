/**
 * TechnicalIllustrations.js
 * Centralized, reusable technical illustrations for KodMates Blog.
 * Implements code-based SVG vector artwork with dark surfaces, 
 * champagne-gold highlights, and isometric/architectural motifs.
 * Zero hardcoded external images or stock photographs.
 */

/**
 * Hero Isometric 3D Architecture Platform
 * Represents cloud infrastructure, microservices, databases, and code systems.
 */
export function createHeroIsometricIllustration() {
  return `
    <div class="hero-isometric-art" aria-label="Software Ecosystem Isometric Illustration" role="img">
      <svg viewBox="50 40 375 235" fill="none" xmlns="http://www.w3.org/2000/svg" class="hero-isometric-svg">
        <defs>
          <!-- Ambient Radial Gold Glow -->
          <radialGradient id="heroAmbientGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#E5B955" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#E5B955" stop-opacity="0"/>
          </radialGradient>

          <!-- Bottom Layer Inner Gold Glow -->
          <radialGradient id="heroBottomGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FEEFB8" stop-opacity="0.3"/>
            <stop offset="60%" stop-color="#E5B955" stop-opacity="0.12"/>
            <stop offset="100%" stop-color="#0A0E0E" stop-opacity="0"/>
          </radialGradient>

          <!-- Middle Slab Top Surface -->
          <linearGradient id="heroSlabTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#141C1C"/>
            <stop offset="100%" stop-color="#070A0A"/>
          </linearGradient>

          <!-- Middle Slab Left Edge -->
          <linearGradient id="heroSlabLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1F2A2A"/>
            <stop offset="100%" stop-color="#0B1010"/>
          </linearGradient>

          <!-- Middle Slab Right Edge -->
          <linearGradient id="heroSlabRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#101717"/>
            <stop offset="100%" stop-color="#050707"/>
          </linearGradient>

          <!-- Top Glass Plate Surface -->
          <linearGradient id="heroTopGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FEEFB8" stop-opacity="0.18"/>
            <stop offset="50%" stop-color="#141C1C" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#070A0A" stop-opacity="0.75"/>
          </linearGradient>

          <!-- Card / Module Surface -->
          <linearGradient id="heroModuleGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#151E1E"/>
            <stop offset="100%" stop-color="#080C0D"/>
          </linearGradient>

          <!-- 3D Cloud Gradient -->
          <linearGradient id="heroCloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2D3A3A"/>
            <stop offset="100%" stop-color="#101516"/>
          </linearGradient>

          <!-- Soft Golden Glow Filter -->
          <filter id="heroGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>

        <!-- Ambient Golden Atmosphere Pools -->
        <circle cx="230" cy="165" r="110" fill="url(#heroAmbientGold)"/>
        <circle cx="365" cy="180" r="60" fill="url(#heroAmbientGold)"/>

        <!-- Background Diagonal & Orthogonal Circuit Grid Lines -->
        <g stroke="#FEEFB8" stroke-opacity="0.22" stroke-width="1">
          <!-- Top diagonal trace to sparkle -->
          <path d="M230,55 L325,110 L370,110"/>
          <!-- Circuit line from left to stack -->
          <path d="M60,135 L60,178 L118,178 M118,178 L155,178 L170,169"/>
          <!-- Circuit under stack to bottom right platform -->
          <path d="M135,165 L135,210 L185,238"/>
          <path d="M230,238 L275,263 L340,263"/>
          <path d="M285,190 L345,225 L345,263"/>
          <!-- Far right circuit loop -->
          <path d="M396,183 L396,215 L425,215"/>
        </g>

        <!-- Glowing Circuit Junction Points -->
        <circle cx="60" cy="135" r="2.8" fill="#FEEFB8" filter="url(#heroGoldGlow)"/>
        <circle cx="155" cy="178" r="2.8" fill="#FEEFB8" filter="url(#heroGoldGlow)"/>
        <circle cx="275" cy="263" r="3" fill="#FEEFB8" filter="url(#heroGoldGlow)"/>
        <circle cx="345" cy="225" r="3" fill="#FEEFB8" filter="url(#heroGoldGlow)"/>
        <circle cx="396" cy="215" r="3" fill="#FEEFB8" filter="url(#heroGoldGlow)"/>

        <!-- 1. Central Isometric Stack: Bottom Layer (Glowing Amber Grid Plate) -->
        <g>
          <!-- Bottom Plate Top Surface -->
          <polygon points="230,145 325,200 230,255 135,200" fill="url(#heroBottomGlow)" stroke="#E5B955" stroke-opacity="0.6" stroke-width="1.2"/>
          <!-- Internal Grid Pattern Lines -->
          <path d="M182,172 L278,228 M278,172 L182,228" stroke="#FEEFB8" stroke-opacity="0.25" stroke-width="0.9"/>
          <path d="M206,159 L254,186 M254,214 L206,241" stroke="#FEEFB8" stroke-opacity="0.2" stroke-width="0.8"/>
        </g>

        <!-- 2. Central Isometric Stack: Middle Layer (3D Solid Slate Extrusion Slab) -->
        <g>
          <!-- Front-Left Thickness Face (18px extrusion) -->
          <polygon points="135,165 230,220 230,238 135,183" fill="url(#heroSlabLeft)" stroke="#FEEFB8" stroke-opacity="0.25" stroke-width="1"/>
          <!-- Front-Right Thickness Face (18px extrusion) -->
          <polygon points="230,220 325,165 325,183 230,238" fill="url(#heroSlabRight)" stroke="#FEEFB8" stroke-opacity="0.18" stroke-width="1"/>
          <!-- Slab Top Surface -->
          <polygon points="230,110 325,165 230,220 135,165" fill="url(#heroSlabTop)" stroke="#FEEFB8" stroke-opacity="0.32" stroke-width="1.2"/>
        </g>

        <!-- 3. Central Isometric Stack: Top Layer (Suspended Glass Plate with </> Code Symbol) -->
        <g>
          <!-- Top Glass Surface -->
          <polygon points="230,80 325,135 230,190 135,135" fill="url(#heroTopGlass)" stroke="#FEEFB8" stroke-width="1.4"/>
          <!-- Top Edge Inner Glow Line -->
          <path d="M142,135 L230,84 L318,135" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="0.9"/>
          
          <!-- Glowing </> Code Symbol on Top Plate -->
          <g filter="url(#heroGoldGlow)">
            <path d="M214,127 L200,135 L214,143" stroke="#FEEFB8" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M234,121 L226,149" stroke="#FEEFB8" stroke-width="2.8" stroke-linecap="round"/>
            <path d="M246,127 L260,135 L246,143" stroke="#FEEFB8" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </g>

        <!-- 4. Upper Wireframe Outline Guide (Floating High) -->
        <polygon points="230,55 310,101 230,147 150,101" fill="none" stroke="#FEEFB8" stroke-opacity="0.22" stroke-width="0.8" stroke-dasharray="3 3"/>

        <!-- 5. Left Floating Node (Standing Architecture / Settings Module) -->
        <g>
          <rect x="66" y="145" width="52" height="64" rx="8" fill="url(#heroModuleGlass)" stroke="#FEEFB8" stroke-opacity="0.35" stroke-width="1.2"/>
          <!-- Top Header Strip & Control Dots -->
          <line x1="74" y1="157" x2="110" y2="157" stroke="#FEEFB8" stroke-opacity="0.25" stroke-width="1"/>
          <circle cx="75" cy="152" r="1.5" fill="#FEEFB8" fill-opacity="0.6"/>
          <circle cx="80" cy="152" r="1.5" fill="#FEEFB8" fill-opacity="0.4"/>
          
          <!-- Golden Engineering Gear Symbol -->
          <g transform="translate(92, 180) scale(0.9)" filter="url(#heroGoldGlow)">
            <circle cx="0" cy="0" r="5" fill="none" stroke="#FEEFB8" stroke-width="1.8"/>
            <path d="M-2,-9 h4 v3 h-4 z M-2,6 h4 v3 h-4 z M-9,-2 v4 h3 v-4 z M6,-2 v4 h3 v-4 z M-7,-7 l2.8,2.8 l-2.1,2.1 l-2.8,-2.8 z M4.2,4.2 l2.8,2.8 l-2.1,2.1 l-2.8,-2.8 z M-7,5 l2.8,-2.8 l2.1,2.1 l-2.8,2.8 z M4.2,-6.2 l2.8,-2.8 l2.1,2.1 l-2.8,2.8 z" fill="#FEEFB8"/>
          </g>
        </g>

        <!-- 6. Right Floating Modules -->
        <!-- 6A. Top-Right: Glass Module with 3D Cloud -->
        <g>
          <rect x="344" y="60" width="56" height="56" rx="10" fill="url(#heroModuleGlass)" stroke="#FEEFB8" stroke-opacity="0.32" stroke-width="1.2"/>
          <!-- 3D Cloud Icon -->
          <path d="M358,92 C354,92 351,88.5 351,84.5 C351,80.8 354,77.5 358,77.2 C359,73.5 363.2,70.5 368,70.5 C373.8,70.5 378.2,74.5 379,79.8 C382.2,80 385,82.8 385,86 C385,89.5 382,92 378.5,92 Z" 
                fill="url(#heroCloudGrad)" stroke="#FEEFB8" stroke-width="1.2" stroke-linejoin="round"/>
        </g>

        <!-- 6B. Middle-Right: 3D Isometric Database Cylinder -->
        <g transform="translate(378, 140)">
          <!-- Cylinder Body -->
          <path d="M0,8 L0,32 C0,36 8,39 18,39 C28,39 36,36 36,32 L36,8 Z" fill="#0C1213" stroke="#FEEFB8" stroke-width="1.2"/>
          <!-- Top Oval Cap -->
          <ellipse cx="18" cy="8" rx="18" ry="6.5" fill="#1B2525" stroke="#FEEFB8" stroke-width="1.2"/>
          <!-- Middle Ring Groove -->
          <path d="M0,16 C0,20 8,23 18,23 C28,23 36,20 36,16" stroke="#FEEFB8" stroke-width="1.1" fill="none"/>
          <!-- Lower Ring Groove -->
          <path d="M0,24 C0,28 8,31 18,31 C28,31 36,28 36,24" stroke="#FEEFB8" stroke-width="1.1" fill="none"/>
          <!-- Base Curve -->
          <path d="M0,32 C0,36 8,39 18,39 C28,39 36,36 36,32" stroke="#FEEFB8" stroke-width="1.2" fill="none"/>
        </g>

        <!-- 6C. Bottom-Right: Floating Isometric Ground Platform -->
        <g>
          <polygon points="345,190 405,225 345,260 285,225" fill="rgba(254, 239, 184, 0.04)" stroke="#FEEFB8" stroke-opacity="0.28" stroke-width="1"/>
          <!-- Inner platform cross -->
          <path d="M315,208 L375,242 M375,208 L315,242" stroke="#FEEFB8" stroke-opacity="0.15" stroke-width="0.8"/>
        </g>

        <!-- 7. Four-Point Star Glints / Lens Flares on Vertices -->
        <!-- Star at top-right of main stack -->
        <g transform="translate(325, 135)" filter="url(#heroGoldGlow)">
          <path d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z" fill="#FFFFFF"/>
        </g>
        <!-- Star at top vertex of stack -->
        <g transform="translate(230, 80)" filter="url(#heroGoldGlow)">
          <path d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5 Z" fill="#FFF5D6"/>
        </g>
        <!-- Star at bottom-right floor platform -->
        <g transform="translate(345, 260)" filter="url(#heroGoldGlow)">
          <path d="M0,-7 L1.8,-1.8 L7,0 L1.8,1.8 L0,7 L-1.8,1.8 L-7,0 L-1.8,-1.8 Z" fill="#FFF5D6"/>
        </g>
      </svg>
    </div>
  `;
}

/**
 * Featured Article Technical Artwork
 * Editor / IDE window with code structure, circuit flow, database cylinders, and active signals.
 */
/**
 * Central Blueprint Architecture Illustration for Featured Card
 * Faithfully matches Reference Image 2:
 * - Ambient gold glow pool & circuit matrix
 * - Left document / chip node
 * - Left-center window with window control dots & file explorer tree
 * - Central elevated </> badge with glowing champagne-gold border and symbols
 * - Right code editor with golden metallic header bar, control dots, and syntax lines
 * - Bottom-right 3D isometric database cylinder with metallic champagne-gold shading and disk separation rings
 * - Orthogonal circuit traces with glowing junction pads
 */
export function createFeaturedCardIllustration() {
  return `
    <div class="featured-illustration-panel" aria-label="Application Architecture Blueprint" role="img">
      <svg viewBox="0 0 460 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="featured-illustration-svg">
        <defs>
          <!-- Metallic Gold Header Gradient -->
          <linearGradient id="windowGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F2CF77"/>
            <stop offset="100%" stop-color="#B28526"/>
          </linearGradient>

          <!-- Translucent Dark Glass Surface -->
          <linearGradient id="windowGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#121819"/>
            <stop offset="100%" stop-color="#080C0D"/>
          </linearGradient>

          <!-- Elevated Badge Surface -->
          <linearGradient id="badgeSurfaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#141C1D"/>
            <stop offset="100%" stop-color="#070A0A"/>
          </linearGradient>

          <!-- 3D Gold Database Cylinder Shading -->
          <linearGradient id="dbGoldBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFECA0"/>
            <stop offset="28%" stop-color="#E5B955"/>
            <stop offset="68%" stop-color="#9E731B"/>
            <stop offset="100%" stop-color="#3A2808"/>
          </linearGradient>

          <!-- Database Top Ellipse Cap -->
          <linearGradient id="dbGoldTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFF8DC"/>
            <stop offset="50%" stop-color="#E5B955"/>
            <stop offset="100%" stop-color="#9E731B"/>
          </linearGradient>

          <!-- Ambient Radial Gold Glow -->
          <radialGradient id="ambientGoldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#E5B955" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="#E5B955" stop-opacity="0"/>
          </radialGradient>

          <!-- Soft Glow Filter -->
          <filter id="goldGlowSm" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>

          <!-- Deep Drop Shadow for Badge Elevation -->
          <filter id="badgeShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#000000" flood-opacity="0.85"/>
          </filter>
        </defs>

        <!-- Ambient Golden Glow Pools -->
        <circle cx="232" cy="120" r="90" fill="url(#ambientGoldGlow)"/>
        <circle cx="410" cy="175" r="70" fill="url(#ambientGoldGlow)"/>

        <!-- Background Orthogonal Circuit Traces -->
        <g stroke="#FEEFB8" stroke-opacity="0.22" stroke-width="1">
          <!-- Top Horizontal Route -->
          <path d="M170,50 L170,22 L310,22 L310,34"/>
          <!-- Trace from Left Chip to Window -->
          <path d="M72,112 L115,112"/>
          <!-- Loop under Left Window -->
          <path d="M170,175 L170,205 L232,205 L232,162"/>
          <!-- Bus line from center to Database -->
          <path d="M232,205 L366,205 L366,172"/>
          <!-- Sub-bus below Database -->
          <path d="M366,205 L366,226 L425,226"/>
          <!-- Top-right expansion trace -->
          <path d="M370,22 L440,22 L440,34"/>
        </g>

        <!-- Subtle Matrix Plus Crosses -->
        <g stroke="#FEEFB8" stroke-opacity="0.28" stroke-width="1">
          <path d="M255,20 v4 M253,22 h4"/>
          <path d="M88,55 v4 M86,57 h4"/>
          <path d="M278,218 v4 M276,220 h4"/>
        </g>

        <!-- Glowing Circuit Junction Pads -->
        <circle cx="240" cy="22" r="3" fill="#FEEFB8" filter="url(#goldGlowSm)"/>
        <circle cx="170" cy="50" r="3" fill="#FEEFB8" filter="url(#goldGlowSm)"/>
        <circle cx="94" cy="112" r="2.8" fill="#FEEFB8" filter="url(#goldGlowSm)"/>
        <circle cx="200" cy="205" r="3" fill="#FEEFB8" filter="url(#goldGlowSm)"/>
        <circle cx="366" cy="172" r="3" fill="#FEEFB8" filter="url(#goldGlowSm)"/>
        <circle cx="411" cy="226" r="2.8" fill="#FEEFB8" filter="url(#goldGlowSm)"/>

        <!-- 1. Leftmost Document / Chip Node -->
        <rect x="28" y="86" width="44" height="52" rx="10" fill="url(#windowGlassGrad)" stroke="#FEEFB8" stroke-opacity="0.32" stroke-width="1.2"/>
        <!-- Document outline with folded ear -->
        <path d="M40,98 L51,98 L57,104 L57,124 L40,124 Z" fill="rgba(254, 239, 184, 0.06)" stroke="#FEEFB8" stroke-width="1.1"/>
        <path d="M51,98 L51,104 L57,104" stroke="#FEEFB8" stroke-width="1" fill="none"/>
        <!-- Mini code syntax lines inside node -->
        <line x1="44" y1="110" x2="53" y2="110" stroke="#FEEFB8" stroke-width="1.1" stroke-linecap="round"/>
        <line x1="44" y1="114" x2="50" y2="114" stroke="#A7ADAB" stroke-width="1" stroke-linecap="round" stroke-opacity="0.6"/>
        <line x1="44" y1="118" x2="52" y2="118" stroke="#A7ADAB" stroke-width="1" stroke-linecap="round" stroke-opacity="0.6"/>

        <!-- 2. Left-Center Window (Background Panel) -->
        <rect x="115" y="50" width="115" height="125" rx="8" fill="url(#windowGlassGrad)" stroke="#FEEFB8" stroke-opacity="0.22" stroke-width="1.2"/>
        <!-- Window control dots -->
        <circle cx="126" cy="62" r="2.5" fill="#FEEFB8" fill-opacity="0.5"/>
        <circle cx="133" cy="62" r="2.5" fill="#FEEFB8" fill-opacity="0.3"/>
        <circle cx="140" cy="62" r="2.5" fill="#FEEFB8" fill-opacity="0.3"/>
        <line x1="115" y1="70" x2="230" y2="70" stroke="#FEEFB8" stroke-opacity="0.1" stroke-width="1"/>
        <!-- Explorer / Tree structure lines -->
        <line x1="130" y1="76" x2="130" y2="158" stroke="#FEEFB8" stroke-opacity="0.12" stroke-dasharray="2 2"/>
        <rect x="136" y="78" width="28" height="3" rx="1.5" fill="#FEEFB8" fill-opacity="0.4"/>
        <rect x="136" y="88" width="40" height="3" rx="1.5" fill="#A7ADAB" fill-opacity="0.3"/>
        <rect x="136" y="98" width="32" height="3" rx="1.5" fill="#A7ADAB" fill-opacity="0.3"/>
        <rect x="136" y="108" width="45" height="3" rx="1.5" fill="#FEEFB8" fill-opacity="0.35"/>
        <rect x="136" y="118" width="24" height="3" rx="1.5" fill="#A7ADAB" fill-opacity="0.3"/>
        <rect x="136" y="128" width="36" height="3" rx="1.5" fill="#A7ADAB" fill-opacity="0.3"/>
        <rect x="136" y="138" width="30" height="3" rx="1.5" fill="#A7ADAB" fill-opacity="0.3"/>
        <rect x="136" y="148" width="38" height="3" rx="1.5" fill="#FEEFB8" fill-opacity="0.3"/>

        <!-- 3. Right Main Code Editor Window -->
        <rect x="285" y="34" width="155" height="155" rx="10" fill="url(#windowGlassGrad)" stroke="#FEEFB8" stroke-opacity="0.3" stroke-width="1.2"/>
        <!-- Distinctive Metallic Gold Header Bar -->
        <path d="M285,44 A10,10 0 0,1 295,34 L430,34 A10,10 0 0,1 440,44 L440,62 L285,62 Z" fill="url(#windowGoldGrad)"/>
        <!-- Window control dots on gold header -->
        <circle cx="300" cy="48" r="3.2" fill="#1B1506"/>
        <circle cx="310" cy="48" r="3.2" fill="#1B1506"/>
        <circle cx="320" cy="48" r="3.2" fill="#1B1506"/>
        <!-- Code line number indicators -->
        <g fill="#C89B38" opacity="0.5">
          <rect x="296" y="74" width="6" height="3" rx="1.5"/>
          <rect x="296" y="86" width="6" height="3" rx="1.5"/>
          <rect x="296" y="98" width="6" height="3" rx="1.5"/>
          <rect x="296" y="110" width="6" height="3" rx="1.5"/>
          <rect x="296" y="122" width="6" height="3" rx="1.5"/>
          <rect x="296" y="134" width="6" height="3" rx="1.5"/>
          <rect x="296" y="146" width="6" height="3" rx="1.5"/>
          <rect x="296" y="158" width="6" height="3" rx="1.5"/>
          <rect x="296" y="170" width="6" height="3" rx="1.5"/>
        </g>
        <!-- Editor Code Syntax Lines -->
        <rect x="312" y="74" width="24" height="3.5" rx="1.5" fill="#FEEFB8" fill-opacity="0.8"/>
        <rect x="340" y="74" width="46" height="3.5" rx="1.5" fill="#A7ADAB" fill-opacity="0.45"/>
        <rect x="320" y="86" width="60" height="3.5" rx="1.5" fill="#A7ADAB" fill-opacity="0.4"/>
        <rect x="320" y="98" width="82" height="3.5" rx="1.5" fill="#FEEFB8" fill-opacity="0.6"/>
        <rect x="328" y="110" width="42" height="3.5" rx="1.5" fill="#A7ADAB" fill-opacity="0.4"/>
        <rect x="328" y="122" width="68" height="3.5" rx="1.5" fill="#C89B38" fill-opacity="0.55"/>
        <rect x="320" y="134" width="52" height="3.5" rx="1.5" fill="#A7ADAB" fill-opacity="0.4"/>
        <rect x="312" y="146" width="32" height="3.5" rx="1.5" fill="#FEEFB8" fill-opacity="0.7"/>
        <rect x="312" y="158" width="46" height="3.5" rx="1.5" fill="#A7ADAB" fill-opacity="0.4"/>

        <!-- 4. Central Elevated </> Badge (Overlaps Between Panels) -->
        <g filter="url(#badgeShadow)">
          <rect x="185" y="78" width="94" height="84" rx="12" fill="url(#badgeSurfaceGrad)" stroke="#E5B955" stroke-width="1.8"/>
          <!-- Inner subtle border highlight -->
          <rect x="187" y="80" width="90" height="80" rx="10" fill="none" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="1"/>
          <!-- Glowing </> Vector Symbols -->
          <path d="M216,108 L204,120 L216,132" stroke="#FEEFB8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#goldGlowSm)"/>
          <path d="M236,102 L226,138" stroke="#FEEFB8" stroke-width="3" stroke-linecap="round" filter="url(#goldGlowSm)"/>
          <path d="M246,108 L258,120 L246,132" stroke="#FEEFB8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#goldGlowSm)"/>
        </g>

        <!-- 5. 3D Isometric Gold Database Cylinder (Bottom Right Foreground) -->
        <g>
          <!-- Disk 3 (Bottom Segment) -->
          <path d="M384,188 L384,204 C384,213 396,219 411,219 C426,219 438,213 438,204 L438,188 C438,196 426,202 411,202 C396,202 384,196 384,188 Z" fill="url(#dbGoldBody)"/>
          <!-- Disk 2 (Middle Segment) -->
          <path d="M384,166 L384,184 C384,192 396,198 411,198 C426,198 438,192 438,184 L438,166 C438,174 426,180 411,180 C396,180 384,174 384,166 Z" fill="url(#dbGoldBody)"/>
          <!-- Disk 1 (Top Segment Body) -->
          <path d="M384,148 L384,163 C384,171 396,177 411,177 C426,177 438,171 438,163 L438,148 C438,156 426,162 411,162 C396,162 384,156 384,148 Z" fill="url(#dbGoldBody)"/>
          
          <!-- Top Oval Cap -->
          <ellipse cx="411" cy="148" rx="27" ry="9" fill="url(#dbGoldTop)" stroke="#FFECA0" stroke-width="0.8"/>
          
          <!-- Disk Groove Separator Rings -->
          <path d="M384,165 C384,173 396,179 411,179 C426,179 438,173 438,165" stroke="#1F1505" stroke-width="1.8" fill="none"/>
          <path d="M384,187 C384,195 396,201 411,201 C426,201 438,195 438,187" stroke="#1F1505" stroke-width="1.8" fill="none"/>
          <path d="M384,165.5 C384,173.5 396,179.5 411,179.5 C426,179.5 438,173.5 438,165.5" stroke="#FFECA0" stroke-width="0.7" fill="none" opacity="0.55"/>
          <path d="M384,187.5 C384,195.5 396,201.5 411,201.5 C426,201.5 438,195.5 438,187.5" stroke="#FFECA0" stroke-width="0.7" fill="none" opacity="0.55"/>
        </g>
      </svg>
    </div>
  `;
}

/**
 * Reusable Topic Illustrations for Article Cards
 * Tailored vector SVGs reflecting each engineering discipline without hardcoded images.
 */
export function createTopicCardIllustration(category, slug = '') {
  const normCat = (category || '').toLowerCase();
  const normSlug = (slug || '').toLowerCase();

  // 1. Android Development
  if (normCat.includes('android') || normSlug.includes('android')) {
    return `
      <div class="topic-illustration topic-illustration--android" aria-label="Android Development Illustration" role="img">
        <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Ambient Glow -->
          <circle cx="100" cy="60" r="45" fill="#FEEFB8" fill-opacity="0.06"/>

          <!-- Orbiting Rings -->
          <ellipse cx="100" cy="60" rx="72" ry="26" stroke="#FEEFB8" stroke-width="0.9" stroke-dasharray="3 3" stroke-opacity="0.6"/>
          <ellipse cx="100" cy="60" rx="84" ry="16" stroke="#FEEFB8" stroke-width="0.7" stroke-opacity="0.3" transform="rotate(-15, 100, 60)"/>

          <!-- Smartphone Shell Frame -->
          <rect x="76" y="20" width="48" height="80" rx="8" fill="#0A0E0E" stroke="#FEEFB8" stroke-width="1.4"/>
          <!-- Speaker notch -->
          <line x1="94" y1="26" x2="106" y2="26" stroke="#FEEFB8" stroke-width="1" stroke-linecap="round"/>
          <!-- Screen surface -->
          <rect x="80" y="32" width="40" height="56" rx="4" fill="#121818" stroke="#1F2828" stroke-width="0.8"/>

          <!-- Android Mascot Head / Icon Inside Screen -->
          <g transform="translate(100, 56) scale(0.9)">
            <!-- Head Semi-circle -->
            <path d="M-12,0 A12,12 0 0,1 12,0 Z" fill="#FEEFB8"/>
            <!-- Antennae -->
            <line x1="-8" y1="-3" x2="-12" y2="-8" stroke="#FEEFB8" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="8" y1="-3" x2="12" y2="-8" stroke="#FEEFB8" stroke-width="1.5" stroke-linecap="round"/>
            <!-- Eyes -->
            <circle cx="-5" cy="-5" r="1.5" fill="#0A0E0E"/>
            <circle cx="5" cy="-5" r="1.5" fill="#0A0E0E"/>
            <!-- Torso / UI indicator -->
            <rect x="-12" y="3" width="24" height="14" rx="2" fill="#FEEFB8" fill-opacity="0.2" stroke="#FEEFB8" stroke-width="1"/>
          </g>

          <!-- Orbiting Nodes -->
          <circle cx="32" cy="56" r="3" fill="#FEEFB8"/>
          <circle cx="168" cy="64" r="3" fill="#FEEFB8"/>
          <circle cx="120" cy="36" r="2" fill="#FFFFFF"/>
        </svg>
      </div>
    `;
  }

  // 2. Software Engineering (Stacked Isometric Architecture Plates)
  if (normCat.includes('software') || normSlug.includes('website-vs-custom')) {
    return `
      <div class="topic-illustration topic-illustration--software" aria-label="Software Architecture Illustration" role="img">
        <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Stacked Isometric 3D Plates -->
          <!-- Base Plate 3 -->
          <polygon points="100,56 160,86 100,114 40,86" fill="#070A0A" stroke="#1D2626" stroke-width="1"/>
          <polygon points="100,50 160,80 100,108 40,80" fill="#0C1212" stroke="#FEEFB8" stroke-width="0.9" stroke-opacity="0.5"/>

          <!-- Middle Plate 2 -->
          <polygon points="100,34 160,64 100,92 40,64" fill="#0E1616" stroke="#FEEFB8" stroke-width="1.2" stroke-opacity="0.8"/>
          
          <!-- Top Plate 1 -->
          <polygon points="100,18 160,48 100,76 40,48" fill="#141E1E" stroke="#FEEFB8" stroke-width="1.4"/>
          
          <!-- Inner Core Glow Symbol -->
          <g transform="translate(100, 47)">
            <ellipse cx="0" cy="0" rx="14" ry="7" fill="#FEEFB8" fill-opacity="0.25"/>
            <circle cx="0" cy="0" r="2.5" fill="#FEEFB8"/>
          </g>

          <!-- Vertical Interconnecting Data Beams -->
          <line x1="100" y1="18" x2="100" y2="76" stroke="#FEEFB8" stroke-width="1" stroke-dasharray="2 2" stroke-opacity="0.7"/>
          <line x1="60" y1="58" x2="60" y2="74" stroke="#FEEFB8" stroke-width="0.8" stroke-dasharray="2 2" stroke-opacity="0.4"/>
          <line x1="140" y1="58" x2="140" y2="74" stroke="#FEEFB8" stroke-width="0.8" stroke-dasharray="2 2" stroke-opacity="0.4"/>
        </svg>
      </div>
    `;
  }

  // 3. Databases (3D Cylinders with Orbiting Relational Nodes)
  if (normCat.includes('database') || normSlug.includes('database')) {
    return `
      <div class="topic-illustration topic-illustration--database" aria-label="Database Systems Illustration" role="img">
        <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Ambient Glow -->
          <circle cx="100" cy="60" r="40" fill="#FEEFB8" fill-opacity="0.05"/>

          <!-- Orbiting Data Path -->
          <ellipse cx="100" cy="62" rx="76" ry="24" stroke="#FEEFB8" stroke-width="0.8" stroke-dasharray="2 2" stroke-opacity="0.5"/>

          <!-- Main Center 3D Cylinder -->
          <g transform="translate(76, 26)">
            <!-- Body -->
            <path d="M0,12 C0,5 11,0 24,0 C37,0 48,5 48,12 L48,56 C48,63 37,68 24,68 C11,68 0,63 0,56 Z" fill="#0A0E0E" stroke="#FEEFB8" stroke-width="1.3"/>
            <!-- Top Lid -->
            <ellipse cx="24" cy="12" rx="24" ry="8" fill="#141E1E" stroke="#FEEFB8" stroke-width="1.3"/>
            <!-- Segment Ring 1 -->
            <path d="M0,26 C0,33 11,38 24,38 C37,38 48,33 48,26" stroke="#FEEFB8" stroke-width="1" stroke-opacity="0.8"/>
            <!-- Segment Ring 2 -->
            <path d="M0,41 C0,48 11,53 24,53 C37,53 48,48 48,41" stroke="#FEEFB8" stroke-width="1" stroke-opacity="0.8"/>
            <!-- Status LED -->
            <circle cx="24" cy="27" r="1.8" fill="#FEEFB8"/>
            <circle cx="24" cy="42" r="1.8" fill="#FEEFB8"/>
          </g>

          <!-- Orbiting Relational Nodes -->
          <g transform="translate(32, 60)">
            <circle cx="0" cy="0" r="9" fill="#0A0E0E" stroke="#FEEFB8" stroke-width="1"/>
            <circle cx="0" cy="0" r="2.5" fill="#FEEFB8"/>
          </g>
          <g transform="translate(168, 64)">
            <circle cx="0" cy="0" r="9" fill="#0A0E0E" stroke="#FEEFB8" stroke-width="1"/>
            <circle cx="0" cy="0" r="2.5" fill="#FEEFB8"/>
          </g>
        </svg>
      </div>
    `;
  }

  // 4. APIs & Backend (Central API Chip with Microservice Flow)
  if (normCat.includes('api') || normCat.includes('backend') || normSlug.includes('rest-api')) {
    return `
      <div class="topic-illustration topic-illustration--api" aria-label="API Architecture Illustration" role="img">
        <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Circuit Trace Grid -->
          <g stroke="#FEEFB8" stroke-width="1" stroke-opacity="0.5">
            <line x1="25" y1="60" x2="68" y2="60"/>
            <line x1="132" y1="60" x2="175" y2="60"/>
            <line x1="100" y1="20" x2="100" y2="40"/>
            <line x1="100" y1="80" x2="100" y2="100"/>
          </g>

          <!-- Direction Arrows / Terminals -->
          <polygon points="68,57 73,60 68,63" fill="#FEEFB8"/>
          <polygon points="170,57 175,60 170,63" fill="#FEEFB8"/>

          <!-- Client Node (Left) -->
          <rect x="14" y="48" width="24" height="24" rx="4" fill="#0A0E0E" stroke="#FEEFB8" stroke-width="1"/>
          <text x="26" y="63" fill="#A7ADAB" font-size="6" font-family="'JetBrains Mono', monospace" text-anchor="middle">CLI</text>

          <!-- Central API Gateway Chip -->
          <rect x="74" y="40" width="52" height="40" rx="6" fill="#0C1212" stroke="#FEEFB8" stroke-width="1.4"/>
          <text x="100" y="65" fill="#FEEFB8" font-size="13" font-family="'JetBrains Mono', monospace" font-weight="800" text-anchor="middle">API</text>

          <!-- Cloud / Service Node (Top) -->
          <rect x="88" y="10" width="24" height="18" rx="3" fill="#0A0E0E" stroke="#FEEFB8" stroke-width="0.9"/>
          <circle cx="100" cy="19" r="3" fill="#FEEFB8" fill-opacity="0.4"/>

          <!-- DB / Store Node (Right) -->
          <rect x="162" y="48" width="24" height="24" rx="4" fill="#0A0E0E" stroke="#FEEFB8" stroke-width="1"/>
          <text x="174" y="63" fill="#FEEFB8" font-size="6" font-family="'JetBrains Mono', monospace" text-anchor="middle">DB</text>

          <!-- Worker / Queue Node (Bottom) -->
          <rect x="88" y="92" width="24" height="18" rx="3" fill="#0A0E0E" stroke="#FEEFB8" stroke-width="0.9"/>
          <text x="100" y="104" fill="#A7ADAB" font-size="5" font-family="'JetBrains Mono', monospace" text-anchor="middle">MSG</text>
        </svg>
      </div>
    `;
  }

  // 5. Default / Web Development Architecture Illustration
  return `
    <div class="topic-illustration topic-illustration--web" aria-label="Web Architecture Illustration" role="img">
      <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="44" width="38" height="32" rx="4" fill="#0A0E0E" stroke="#FEEFB8" stroke-width="1.2"/>
        <text x="44" y="63" fill="#FEEFB8" font-size="7" font-family="'JetBrains Mono', monospace" text-anchor="middle">Browser</text>
        
        <path d="M63 60H88" stroke="#FEEFB8" stroke-width="1" stroke-dasharray="2 2"/>
        <polygon points="88,58 92,60 88,62" fill="#FEEFB8"/>

        <rect x="92" y="38" width="46" height="44" rx="4" fill="#0E1616" stroke="#FEEFB8" stroke-width="1.3"/>
        <text x="115" y="61" fill="#FFFFFF" font-size="7" font-family="'JetBrains Mono', monospace" text-anchor="middle" font-weight="600">Gateway</text>
        <text x="115" y="71" fill="#FEEFB8" font-size="6" font-family="'JetBrains Mono', monospace" text-anchor="middle">Auth &amp; SSL</text>

        <path d="M138 60H160" stroke="#FEEFB8" stroke-width="1"/>
        <polygon points="160,58 164,60 160,62" fill="#FEEFB8"/>

        <rect x="164" y="44" width="28" height="32" rx="4" fill="#0A0E0E" stroke="#FEEFB8" stroke-width="1.2"/>
        <text x="178" y="63" fill="#FEEFB8" font-size="7" font-family="'JetBrains Mono', monospace" text-anchor="middle">Cluster</text>
      </svg>
    </div>
  `;
}

/**
 * 4-Step Process Architecture Diagram
 * Used in Section 1 of the article detail page:
 * [Problem & Goals] -> [Architecture & Data Flow] -> [Technology & Integrations] -> [Development & Launch]
 */
export function createArticleProcessDiagram() {
  return `
    <div class="article-process-diagram" aria-label="End-to-end Web Application Lifecycle Diagram" role="region">
      <div class="article-process-diagram__track">
        <!-- Step 1: Problem & Goals -->
        <div class="article-process-step">
          <div class="article-process-step__icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="process-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span class="article-process-step__label">Problem<br>&amp; Goals</span>
        </div>

        <!-- Connector Arrow 1 -->
        <div class="article-process-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>

        <!-- Step 2: Architecture & Data Flow -->
        <div class="article-process-step">
          <div class="article-process-step__icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="process-icon">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <span class="article-process-step__label">Architecture<br>&amp; Data Flow</span>
        </div>

        <!-- Connector Arrow 2 -->
        <div class="article-process-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>

        <!-- Step 3: Technology & Integrations -->
        <div class="article-process-step">
          <div class="article-process-step__icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="process-icon">
              <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z"/>
              <circle cx="12" cy="11" r="3"/>
            </svg>
          </div>
          <span class="article-process-step__label">Technology<br>&amp; Integrations</span>
        </div>

        <!-- Connector Arrow 3 -->
        <div class="article-process-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.5">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>

        <!-- Step 4: Development & Launch -->
        <div class="article-process-step">
          <div class="article-process-step__icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="#FEEFB8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="process-icon">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <span class="article-process-step__label">Development<br>&amp; Launch</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Topic Header Background Art
 * Elegant champagne gold wave lines for Category listing hero (View 3).
 */
export function createTopicHeaderBackgroundArt() {
  return `
    <div class="topic-header-ambient" aria-hidden="true">
      <svg viewBox="0 0 1200 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="topic-header-wave-svg" preserveAspectRatio="none">
        <path d="M0,180 C300,120 600,240 900,140 C1050,90 1150,110 1200,120" stroke="#FEEFB8" stroke-width="1" stroke-opacity="0.18"/>
        <path d="M0,150 C320,80 580,220 880,110 C1020,60 1140,80 1200,90" stroke="#FEEFB8" stroke-width="1.2" stroke-opacity="0.25"/>
        <path d="M0,200 C340,160 620,260 920,170 C1060,130 1160,140 1200,150" stroke="#FEEFB8" stroke-width="0.8" stroke-opacity="0.12"/>
      </svg>
    </div>
  `;
}
