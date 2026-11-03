/**
 * KoroCraft Project Data
 * Verified source: KodeMates Client Project & Multi-Channel E-Commerce Architecture
 * Website: https://korocraft.com
 */
export const korocraft = {
  slug: 'korocraft',
  title: 'KoroCraft',
  category: 'E-Commerce & Automation',
  tagline: 'Automated Dropshipping & Multi-Channel Sourcing Platform',
  shortDescription:
    'An automated e-commerce operations and fulfillment platform integrating supplier APIs, real-time inventory tracking, and dynamic order dispatching.',
  fullDescription:
    'KoroCraft is an enterprise-grade automated dropshipping and multi-channel fulfillment engine designed for high-throughput online merchants. Built to eliminate manual order management and inventory sync delays, the platform connects digital storefronts directly with global manufacturing and dropshipping networks (including CJ Dropshipping API). It features automated SKU mapping, real-time stock and pricing synchronization, sub-second webhook-driven order ingestion, and automated tracking dispatch back to end consumers.',
  featured: false,
  technologies: [
    'Node.js',
    'TypeScript',
    'React',
    'RESTful API',
    'CJ Dropshipping API',
    'PostgreSQL',
    'Redis',
    'Webhooks',
    'Docker'
  ],
  platforms: ['Web', 'Merchant Dashboard', 'Automated Background Workers'],
  services: [
    'Supplier API Integration',
    'Automated Order Fulfillment',
    'Real-Time Inventory Engine'
  ],
  industry: 'Cross-Border E-Commerce & Supply Chain Logistics',
  problem:
    'Growing e-commerce businesses face severe operational bottlenecks when scaling dropshipping models: inventory counts desynchronize between suppliers and sales channels resulting in costly out-of-stock orders, manual order routing creates 24-48 hour fulfillment delays, and fragmented multi-supplier tracking numbers lead to poor customer satisfaction.',
  solution:
    'KodeMates engineered an event-driven middleware and automated dispatch engine that establishes continuous, programmatic integration with supplier APIs. The platform automatically polls and syncs inventory levels, ingests customer orders via authenticated webhooks, verifies payment confirmation, routes line-item purchase orders directly to supplier fulfillment lines, and updates shipping tracking codes across all storefronts without human intervention.',
  features: [
    'Automated Multi-Channel Supplier Token Authentication & Store Verification',
    'Real-Time Two-Way Inventory & Price Adjustment Synchronization',
    'Sub-Second Webhook Order Ingestion & Automatic Supplier Dispatch',
    'Dynamic Currency Conversion & Automated Profit Margin Rule Engine',
    'Intelligent SKU Aliasing & Multi-Variant Product Catalog Normalization',
    'Automated Package Tracking Code Aggregation & Customer SMS/Email Dispatch',
    'Centralized Merchant Operations Dashboard with Real-Time Fulfillment Telemetry',
    'Fault-Tolerant Background Job Queue with Exponential Retry Backoff'
  ],
  architecture: {
    summary:
      'KoroCraft employs an event-driven microservices architecture: a React/TypeScript merchant control portal communicating over high-speed RESTful endpoints; a high-concurrency Node.js API gateway; a Redis-backed asynchronous worker queue executing supplier API handshakes and webhook ingestion; and a robust relational PostgreSQL database storing normalized order states, vendor credentials, and immutable synchronization audit logs.',
    layers: [
      {
        title: 'Merchant Portal',
        items: ['React', 'TypeScript', 'Tailwind CSS', 'Vite']
      },
      {
        title: 'Automation & Integration Engine',
        items: ['Node.js', 'Express', 'Redis Queue (BullMQ)', 'Supplier API Adapters']
      },
      {
        title: 'Data & Persistence',
        items: ['PostgreSQL', 'Prisma ORM', 'Redis Cache', 'Docker']
      }
    ]
  },
  screenshots: [],
  devices: ['Desktop Web', 'Merchant Tablet', 'Mobile Operations'],
  contribution: {
    role: 'Lead Full-Stack & Integration Engineer',
    contributor: 'KodeMates Engineering Team',
    summary:
      'Architected and implemented the end-to-end supplier API integration engine, authenticated merchant store connection flows, resilient webhook queue handlers, and responsive operations dashboard; engineered automated failover and retry logic for high-volume supplier API rate-limiting; and designed the normalized relational product-variant data schemas.',
    items: [
      'Supplier API integration architecture',
      'Event-driven order routing workers',
      'Inventory synchronization engine',
      'Merchant management dashboard',
      'Resilient webhook queueing with Redis',
      'Automated tracking dispatch integration'
    ]
  },
  results: [],
  links: {
    live: 'https://korocraft.com',
    app: null,
    repository: 'https://github.com/Harisankar-Panigrahi/korocraft'
  },
  seo: {
    title: 'KoroCraft — Automated Dropshipping & Fulfillment Platform',
    description:
      'Enterprise automated e-commerce operations, supplier API integration, and real-time inventory synchronization engine.',
    image: ''
  }
};

export default korocraft;
