/**
 * GatePass Project Data (Phase 08 - Verified Source Information)
 * 
 * Source of Truth:
 * Enterprise Gate Pass & Visitor Access Management System (STAGS)
 * Reference Repository: https://github.com/Harisankar-Panigrahi/gate_pass_application
 * Author & Lead Engineer: Harisankar Panigrahi
 * 
 * All fields populated below are strictly derived from verified source documentation,
 * architectural designs, and functional module catalogs in the reference repository.
 * Non-verified metrics, speculative numbers, and unverified live URLs remain omitted.
 */
export const gatepass = {
  slug: 'gatepass',
  title: 'GatePass',
  category: 'Business Software',
  tagline: 'Visitor & Gate Management System',
  shortDescription:
    'An enterprise-grade physical perimeter security, material transit tracking, and digital visitor authorization platform uniting a centralized REST API, web administration portal, and native Android application.',
  fullDescription:
    'The Gate Pass & Visitor Access Management System (STAGS) is a full-stack perimeter security and access control platform engineered for commercial facilities, industrial complexes, and corporate campuses. It coordinates physical gate operations across security guards, facility administrators, and host employees through digital visitor registration, one-tap mobile arrival approvals, optical QR credential scanning, and material movement tracking.',
  featured: true,
  visual3D: {
    type: 'gatepass-access'
  },
  technologies: [
    'Laravel 11',
    'PHP',
    'React',
    'TypeScript',
    'Vite',
    'Kotlin',
    'Jetpack Compose',
    'CameraX',
    'Laravel Sanctum',
    'RESTful API'
  ],
  platforms: ['Web', 'Android'],
  services: [
    'REST API Engine',
    'Role-Based Access Control',
    'Event-Driven Push Notifications'
  ],
  industry: 'Enterprise Facility Security',
  problem:
    'In commercial and industrial facilities, perimeter security frequently relies on manual paper logbooks and unverified telephone calls. This creates critical operational liabilities: identity verification blindspots, long entrance bottlenecks during peak shift changes, disconnected host approval delays, inaccurate emergency headcounts (Muster Roll), and unmonitored material transit.',
  solution:
    'Replaces fragmented paper logbooks with an automated, synchronized digital workflow: rapid digital visitor registration with ID and photo capture, instant push notification approvals dispatched to host employees, cryptographically signed optical QR code passes, sub-second camera verification at gate turnstiles, real-time on-site occupancy tracking, and multi-tier material gate pass sign-offs.',
  features: [
    'Digital Visitor Registration with Live Photo & Government ID Reference',
    'Real-Time Push Notification Approvals for Host Employees',
    'Cryptographic Optical QR Code Pass Issuance & Anti-Passback Validation',
    'Visitor Pre-Registration with Shareable Digital Invitation Credentials',
    'Virtual Employee Smart ID Badges Accessible via Native Android Client',
    'Guard Desk High-Throughput Search by Pass Number, Visitor Name, or Vehicle Plate',
    'Material Gate Pass Authorization for Returnable & Non-Returnable Equipment',
    'Emergency Lockdown Protocol with Real-Time On-Site Muster Roll Occupancy',
    'Multi-Tenant Organization Isolation with Tiered Role-Based Access Control (RBAC)',
    'Forensic Security Audit Logging of Every Entry, Departure, and Override Action'
  ],
  architecture: {
    summary:
      'The platform implements a multi-tier modular architecture: a presentation layer featuring a responsive React/TypeScript administrative portal and a native Android application built with Kotlin, Jetpack Compose, and CameraX; a central API Gateway powered by a Laravel 11 RESTful engine using Laravel Sanctum for stateless token authentication, multi-tenant middleware isolation, and RBAC authorization; and a relational database layer managing visitor logs, material authorizations, and immutable audit trails.',
    layers: [
      {
        title: 'Web Frontend',
        items: ['React', 'TypeScript', 'Vite']
      },
      {
        title: 'Backend / API',
        items: ['Laravel 11', 'PHP', 'RESTful API', 'Laravel Sanctum']
      },
      {
        title: 'Native Android Client',
        items: ['Kotlin', 'Jetpack Compose', 'CameraX']
      }
    ]
  },
  screenshots: [],
  devices: ['Desktop Web', 'Android Tablet / Phone', 'Kiosk'],
  contribution: {
    role: 'Lead Engineer',
    contributor: 'Harisankar Panigrahi',
    summary:
      'Defined end-to-end multi-tier system architecture, relational database schemas, and RESTful API specifications; implemented the core Laravel 11 REST API engine with Sanctum authentication and multi-tenant isolation middleware; engineered the native Android mobile client in Kotlin using Jetpack Compose and CameraX; designed the RBAC security state machines and cryptographic pass validation; and authored comprehensive unit, API contract, and Android test suites.',
    items: [
      'End-to-end multi-tier architecture',
      'Database schema',
      'Laravel 11 REST API engine',
      'Laravel Sanctum authentication',
      'Native Android client',
      'Kotlin / Jetpack Compose',
      'CameraX optical scanning',
      'Test suites'
    ]
  },
  results: [],
  links: {
    live: null,
    app: null,
    repository: 'https://github.com/Harisankar-Panigrahi/gate_pass_application'
  },
  seo: {
    title: 'GatePass — Visitor & Gate Management System',
    description:
      'Enterprise-grade physical perimeter security, material transit tracking, and digital visitor authorization platform.',
    image: ''
  }
};

export default gatepass;
