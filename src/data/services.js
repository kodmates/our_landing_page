/**
 * KodMates Services Data
 * 
 * Central data architecture for the refined, visual Services Page.
 * Strictly grounded in verified engineering capabilities and active projects (GatePass, KoroCraft, ASUTI).
 */

export const servicesData = {
  hero: {
    eyebrow: 'DIGITAL SOLUTIONS FOR AMBITIOUS BUSINESSES',
    headline: 'Technology Built Around Your Business.',
    supportingCopy:
      'We design and develop digital products, web experiences, mobile applications, and intelligent business systems that solve real problems and help businesses grow.',
    primaryCta: {
      label: 'Discuss Your Project',
      href: '#contact'
    },
    secondaryCta: {
      label: 'Explore Our Services',
      href: '#services-offerings'
    }
  },

  // 6 Core Services with Collapsed, Expandable Detail & Visual Showcase Mapping
  coreServices: [
    {
      id: 'web-development',
      number: '01',
      title: 'Web Development',
      badge: 'Core Service',
      icon: 'web',
      shortDescription:
        'High-performance web applications, modern storefronts, and client portals built for speed, conversion, and long-term maintainability.',
      keyCapabilities: [
        'Single Page Applications (SPAs)',
        'E-Commerce & D2C Storefronts',
        'Sub-second Core Web Vitals'
      ],
      showcaseHighlight: 'RESPONSIVE WEB PLATFORMS',
      showcaseTagline: 'Engineered for sub-second Core Web Vitals, conversion velocity, and effortless scaling.',
      expandedDetails: {
        problem:
          'Slow loading times, brittle architectures, and template bloat lead to high bounce rates, low search visibility, and accumulating technical debt.',
        deliverables: [
          'Custom web apps & responsive administrative portals',
          'Fast D2C e-commerce storefronts with dynamic cart flows',
          'Clean, componentized design systems with zero lock-in'
        ],
        technologies: ['React', 'TypeScript', 'Vanilla ESNext', 'Vite', 'Modern CSS3'],
        outcomes:
          'Fast, lightweight web platforms that engage users, cut infrastructure overhead, and scale predictably.',
        ctaLabel: 'Plan Your Web Application'
      }
    },
    {
      id: 'mobile-app-development',
      number: '02',
      title: 'Mobile App Development',
      badge: 'Native & Hybrid',
      icon: 'mobile',
      shortDescription:
        'Native Android applications with hardware-integrated optical QR scanning, offline caching, and responsive touch ergonomics.',
      keyCapabilities: [
        'Native Android (Kotlin / Jetpack Compose)',
        'CameraX Optical QR & Barcode Scanning',
        'Offline Caching & Automatic Sync'
      ],
      showcaseHighlight: 'NATIVE ANDROID & CAMERAX SCANNING',
      showcaseTagline: 'Hardware-integrated optical verification and robust offline-first synchronization.',
      expandedDetails: {
        problem:
          'Field personnel and customers struggle when forced to use fragile mobile web pages over fluctuating networks or physical checkpoints.',
        deliverables: [
          'Native Android clients utilizing modern Jetpack Compose',
          'CameraX optical scanners for sub-second badge validation',
          'Encrypted local SQLite caching for seamless offline routines'
        ],
        technologies: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'CameraX', 'Push Alerts'],
        outcomes:
          'Reliable mobile tools guards, warehouse staff, and customers can operate effortlessly in demanding field conditions.',
        ctaLabel: 'Discuss Mobile Requirements'
      }
    },
    {
      id: 'ui-ux-design',
      number: '03',
      title: 'UI/UX Design',
      badge: 'User-Centered',
      icon: 'design',
      shortDescription:
        'Restrained design systems, clear token hierarchies, and ergonomic user journeys that balance editorial luxury with strict accessibility.',
      keyCapabilities: [
        'Design Systems & Semantic Tokens',
        'Low-Friction Checkout & Form Flows',
        'WCAG 2.1 AA Accessibility'
      ],
      showcaseHighlight: 'DESIGN SYSTEMS & ERGONOMIC FLOWS',
      showcaseTagline: 'Precision tokens, fluid typography, and accessible high-conversion checkout flows.',
      expandedDetails: {
        problem:
          'Generic templates look interchangeable, while cluttered interfaces generate user confusion, friction, and abandonment at key workflow stages.',
        deliverables: [
          'Modular design token systems (color, typography, fluid grids)',
          'Interactive, testable prototypes with rapid iteration loops',
          'High-contrast accessible components certified to WCAG AA'
        ],
        technologies: ['Design Tokens', 'Figma Specs', 'Ergonomic Workflows', 'WCAG Auditing'],
        outcomes:
          'Trustworthy, elegant visual systems that represent your brand and guide users through tasks without friction.',
        ctaLabel: 'Refine Your Product UX'
      }
    },
    {
      id: 'backend-api-development',
      number: '04',
      title: 'Backend & API Development',
      badge: 'High Concurrency',
      icon: 'backend',
      shortDescription:
        'Deterministic RESTful APIs, multi-tenant middleware, and token-based authentication engineered for high-concurrency data integrity.',
      keyCapabilities: [
        'RESTful API Contracts & Routing',
        'Stateless Token Auth (Sanctum / JWT)',
        'Multi-Tenant Data Isolation'
      ],
      showcaseHighlight: 'HIGH-THROUGHPUT API ENGINES',
      showcaseTagline: 'Deterministic REST contracts, multi-tenant middleware, and signed JWT/Sanctum security.',
      expandedDetails: {
        problem:
          'Fragmented databases and unvalidated endpoints lead to data collisions, security vulnerabilities, and system stalls during traffic surges.',
        deliverables: [
          'High-throughput API backends in Node.js, Express, and Laravel 11',
          'Isolated multi-tenant access control and forensic audit trails',
          'High-volume webhook ingestion engines with signature checks'
        ],
        technologies: ['Node.js', 'Express', 'Laravel 11', 'PHP', 'Sanctum', 'JWT Tokens'],
        outcomes:
          'A secure, deterministic backend foundation that handles mission-critical transactions with complete reliability.',
        ctaLabel: 'Architect Your Backend'
      }
    },
    {
      id: 'cloud-deployment',
      number: '05',
      title: 'Cloud & Deployment',
      badge: 'Infrastructure',
      icon: 'cloud',
      shortDescription:
        'Relational database architecture, Redis queue workers, and containerized deployment pipelines built for zero-downtime stability.',
      keyCapabilities: [
        'Relational Schemas (PostgreSQL / MySQL)',
        'Redis Caching & Asynchronous Queues',
        'Docker Containerized Environments'
      ],
      showcaseHighlight: 'FAULT-TOLERANT CLOUD ARCHITECTURE',
      showcaseTagline: 'Relational data modeling, Redis asynchronous queues, and automated Docker rollouts.',
      expandedDetails: {
        problem:
          'Unindexed database queries, memory leaks, and single-point-of-failure hosting cause sudden downtime, sluggish latency, and lost revenue.',
        deliverables: [
          'Relational database schemas with foreign key integrity',
          'Redis-backed BullMQ job queues for asynchronous background tasks',
          'Isolated Docker production configurations with automated rollback'
        ],
        technologies: ['PostgreSQL', 'MySQL', 'Redis', 'BullMQ', 'Docker', 'Linux/cPanel'],
        outcomes:
          'Fault-tolerant infrastructure that keeps your operations running uninterrupted around the clock.',
        ctaLabel: 'Strengthen Your Infrastructure'
      }
    },
    {
      id: 'business-software-automation',
      number: '06',
      title: 'Business Software & Automation',
      badge: 'Operational Tools',
      icon: 'automation',
      shortDescription:
        'Operational platforms, perimeter visitor management, and supplier API synchronization that replace fragmented manual routines.',
      keyCapabilities: [
        'Role-Based Access Control (RBAC)',
        'Supplier API & Order Synchronization',
        'Tamper-Evident QR Code Verification'
      ],
      showcaseHighlight: 'OPERATIONAL PLATFORMS & AUTOMATION',
      showcaseTagline: 'Perimeter access gates, supplier order sync, and real-time forensic audit logging.',
      expandedDetails: {
        problem:
          'Manual phone verifications, paper logs, and spreadsheet inventory tracking cause operational delays, security blindspots, and hundreds of lost labor hours.',
        deliverables: [
          'Perimeter security & visitor authorization systems with optical QR passes',
          'Automated supplier API sync engines with webhook order listeners',
          'Real-time facility muster rolls and immutable audit logging'
        ],
        technologies: ['RBAC Systems', 'Supplier API Sync', 'Cryptographic QR', 'Audit Logging'],
        outcomes:
          'Automated operational tools that eradicate administrative delays, tighten physical security, and free up team bandwidth.',
        ctaLabel: 'Automate Your Operations'
      }
    }
  ],

  // 6 Structured Technology Categories
  technologies: [
    {
      category: 'Frontend & UI',
      items: ['React', 'TypeScript', 'Vanilla ESNext', 'Vite', 'Tailwind CSS', 'CSS3 Grid/Flex']
    },
    {
      category: 'Backend & APIs',
      items: ['Node.js', 'Express', 'Laravel 11', 'PHP', 'RESTful APIs', 'Webhook Pipelines']
    },
    {
      category: 'Mobile Engineering',
      items: ['Kotlin', 'Jetpack Compose', 'Android SDK', 'CameraX API', 'Encrypted Storage', 'Push Notifications']
    },
    {
      category: 'Databases & Caching',
      items: ['PostgreSQL', 'MySQL', 'Redis', 'BullMQ Queues', 'Prisma ORM', 'Relational Schemas']
    },
    {
      category: 'Architecture & Security',
      items: ['RBAC Permissions', 'Laravel Sanctum', 'JWT Token Auth', 'Multi-Tenant Isolation', 'Cryptographic Validation', 'Audit Logging']
    },
    {
      category: 'DevOps & Deployment',
      items: ['Docker Containers', 'Linux Servers', 'GitHub Workflows', 'Edge CDN Caching', 'SSL / TLS Security', 'Environment Parity']
    }
  ],

  // Seven-Stage Engineering Lifecycle with Client Checkpoints
  process: [
    {
      step: '01',
      title: 'Discovery',
      icon: 'discovery',
      description: 'Review operational bottlenecks, technical constraints, and measurable business goals before coding.',
      checkpoint: 'Requirements Clarification & Scope Alignment'
    },
    {
      step: '02',
      title: 'Planning',
      icon: 'planning',
      description: 'Define relational database schemas, REST API contracts, and deliverable milestones to prevent scope creep.',
      checkpoint: 'Architecture Blueprint & Milestone Sign-Off'
    },
    {
      step: '03',
      title: 'Design',
      icon: 'design',
      description: 'Craft responsive wireframes, token hierarchies, and interactive component prototypes tailored to your users.',
      checkpoint: 'Interactive Prototype & Design Review'
    },
    {
      step: '04',
      title: 'Development',
      icon: 'development',
      description: 'Implement frontend, backend, and mobile applications in focused sprints with strict code standards.',
      checkpoint: 'Sprint Milestone Demos & Progress Reviews'
    },
    {
      step: '05',
      title: 'Testing',
      icon: 'testing',
      description: 'Validate responsive rendering (320px–4K), offline states, API contracts, and zero layout shift.',
      checkpoint: 'Acceptance Testing & Security Audits'
    },
    {
      step: '06',
      title: 'Deployment',
      icon: 'deployment',
      description: 'Provision secure servers, databases, SSL certificates, and release with real-time telemetry.',
      checkpoint: 'Production Rollout & System Handover'
    },
    {
      step: '07',
      title: 'Support',
      icon: 'support',
      description: 'Provide post-launch continuity, monitoring, dependency maintenance, and enhancements as agreed.',
      checkpoint: 'Post-Launch Continuity & Retainer SLA'
    }
  ],

  // 3 High-Impact Value Proposition Cards
  whyChooseUs: [
    {
      number: '01',
      title: 'Business-Focused Engineering',
      description:
        'We do not write code for novelty. Every architectural and UI choice is made to solve a tangible operational challenge, accelerate user workflows, or protect business revenue.'
    },
    {
      number: '02',
      title: 'Direct Access & Zero Lock-In',
      description:
        'Communicate directly with the engineers building your software. We build on industry-standard open technologies with clean code that your organization fully owns.'
    },
    {
      number: '03',
      title: 'Performance & Reliability by Default',
      description:
        'Sub-second page speeds, keyboard accessibility, and deterministic uptime are built into every release, ensuring smooth performance across budget mobile devices and desktop workstations.'
    }
  ],

  // Proven Execution in Production (Featured Case Studies with Visual Preview Data)
  featuredCaseStudies: [
    {
      slug: 'gatepass',
      title: 'GatePass',
      category: 'Business Software',
      tagline: 'Visitor & Gate Management System',
      description:
        'Perimeter security platform uniting a Laravel 11 REST API, administrative web portal, and native Android app with CameraX QR validation.',
      tech: ['Laravel 11', 'React', 'Kotlin', 'CameraX', 'Sanctum'],
      route: '/projects/gatepass',
      previewType: 'gatepass'
    },
    {
      slug: 'korocraft',
      title: 'KoroCraft',
      category: 'E-Commerce & Automation',
      tagline: 'Automated Dropshipping Platform',
      description:
        'Automated fulfillment engine integrating supplier APIs, real-time two-way stock synchronization, and sub-second webhook order ingestion.',
      tech: ['Node.js', 'TypeScript', 'React', 'Redis Queues', 'PostgreSQL'],
      route: '/projects/korocraft',
      previewType: 'korocraft'
    },
    {
      slug: 'asuti',
      title: 'ASUTI',
      category: 'Digital Products & D2C',
      tagline: 'Minimalist D2C Skincare Experience',
      description:
        'High-performance direct-to-consumer digital storefront engineered with serene editorial aesthetics, sub-second page loads, and a dynamic cart.',
      tech: ['Vanilla ESNext', 'Modular CSS', 'Headless E-Commerce', 'Core Web Vitals'],
      route: '/projects/asuti',
      previewType: 'asuti'
    }
  ],

  // 7 Accessible FAQs
  faqs: [
    {
      id: 'faq-1',
      question: 'What types of projects does KodMates work on?',
      answer:
        'We build custom web applications, native Android mobile apps, RESTful backend APIs, high-performance D2C storefronts, and tailored operational platforms such as perimeter visitor management and fulfillment automation.'
    },
    {
      id: 'faq-2',
      question: 'Can projects be fully customized to our business requirements?',
      answer:
        'Yes. We engineer software tailored to your specific workflows, database models, and brand identity. We do not force your business into rigid, cookie-cutter templates.'
    },
    {
      id: 'faq-3',
      question: 'How does the development process work?',
      answer:
        'We follow a structured seven-stage lifecycle: Discovery, Planning, Design, Development, Testing, Deployment, and Support. You receive transparent milestone reviews and direct engineering communication throughout.'
    },
    {
      id: 'faq-4',
      question: 'How is a project timeline determined?',
      answer:
        'Timelines are calculated during the Discovery and Planning phases based on technical scope, required integrations, and testing specifications. We do not make arbitrary delivery promises without analyzing architecture requirements first.'
    },
    {
      id: 'faq-5',
      question: 'Can KodMates work with an existing application or codebase?',
      answer:
        'Yes. We frequently audit, refactor, and extend existing web applications and API backends, whether you need performance optimization, new feature modules, third-party API integrations, or architectural modernization.'
    },
    {
      id: 'faq-6',
      question: 'Is ongoing maintenance and support available after launch?',
      answer:
        'Yes. We offer structured post-launch support and maintenance agreements tailored to your application, covering security patches, dependency updates, server monitoring, and continuous enhancements.'
    },
    {
      id: 'faq-7',
      question: 'How can someone request a proposal or start a project?',
      answer:
        'You can reach out through our contact form or project inquiry button. We will schedule an initial discovery discussion to evaluate technical feasibility and prepare a detailed architectural proposal.'
    }
  ],

  // Final Contact CTA
  finalCta: {
    headline: 'Have an Idea Worth Building?',
    supportingCopy:
      'Tell us what you want to achieve. Let’s explore the right technology, approach, and next steps for your project.',
    primaryCta: {
      label: 'Start a Project',
      href: '#contact'
    },
    secondaryCta: {
      label: 'Contact KodMates',
      href: '#contact'
    }
  }
};

export default servicesData;
