/**
 * Article: REST APIs Explained for Practical Software Projects
 * Author: KodMates Technical Team
 */

export const restApisGuideArticle = {
  id: 'art-002',
  slug: 'rest-apis-explained-practical-software',
  title: 'REST APIs Explained for Practical Software Projects',
  summary: 'A practitioner’s guide to designing predictable, resilient RESTful interfaces: resource naming, idempotency semantics, structured error contracts, and API versioning strategies.',
  category: 'APIs & Backend',
  author: {
    name: 'KodMates Technical Team',
    role: 'Backend Engineering'
  },
  publishedAt: '2026-09-22',
  updatedAt: '2026-09-25',
  readTime: '6 min read',
  featured: false,
  tags: ['APIs & Backend', 'REST', 'System Design', 'Backend Engineering'],
  coverGradient: 'linear-gradient(135deg, rgba(254, 239, 184, 0.15) 0%, rgba(18, 22, 22, 0.9) 100%)',
  accentColor: '#FEEFB8',
  sections: [
    {
      id: 'resource-oriented-urls',
      title: '1. True Resource Orientation vs RPC Mimicry',
      content: `
        <p>A frequent anti-pattern in modern backend design is dressing RPC (Remote Procedure Call) patterns as REST endpoints. URLs should represent discrete resources—nouns—and HTTP verbs must communicate the intended action.</p>
        <div class="article-comparison-table-wrapper">
          <table class="article-table">
            <thead>
              <tr>
                <th>Anti-Pattern (RPC in Disguise)</th>
                <th>Idiomatic RESTful Design</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>POST /api/v1/createUserAccount</code></td>
                <td><code>POST /api/v1/users</code></td>
              </tr>
              <tr>
                <td><code>POST /api/v1/updateInvoiceStatus?id=12</code></td>
                <td><code>PATCH /api/v1/invoices/12</code></td>
              </tr>
              <tr>
                <td><code>GET /api/v1/deleteSubscription</code></td>
                <td><code>DELETE /api/v1/subscriptions/45</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'idempotency-and-verbs',
      title: '2. Respecting HTTP Verb Semantics and Idempotency',
      content: `
        <p>Understanding idempotency is essential for reliable distributed communication, especially when mobile clients or webhook retries encounter network drops.</p>
        <ul>
          <li><strong>GET, HEAD, OPTIONS:</strong> Safe and idempotent. Reading a resource must never produce state mutations or side-effects.</li>
          <li><strong>PUT:</strong> Idempotent replacement. Sending the exact payload 10 times results in the identical system state as sending it once.</li>
          <li><strong>DELETE:</strong> Idempotent removal. Subsequent calls should return <code>404 Not Found</code> or <code>204 No Content</code> without erroring the server pipeline.</li>
          <li><strong>POST:</strong> Non-idempotent creation. Protect non-idempotent operations using an <code>Idempotency-Key</code> HTTP header stored in a short-lived Redis lock.</li>
        </ul>
      `
    },
    {
      id: 'structured-error-contracts',
      title: '3. Predictable Error Contracts (RFC 7807 Pattern)',
      content: `
        <p>Clients consume APIs much faster when failure payloads follow a uniform schema across all services.</p>
        <pre class="code-block" data-language="json"><code>{
  "type": "https://api.kodmates.com/errors/validation-failed",
  "title": "Unprocessable Entity",
  "status": 422,
  "detail": "The payload contains 2 invalid fields.",
  "instance": "/api/v1/deployments/dep-9402",
  "errors": [
    {
      "field": "clusterRegion",
      "code": "INVALID_REGION",
      "message": "Region 'ap-south-1' is currently under maintenance."
    },
    {
      "field": "instanceCount",
      "code": "OUT_OF_BOUNDS",
      "message": "Instance count must be between 1 and 16."
    }
  ]
}</code></pre>
        <p>A unified error structure allows client applications to automatically bind errors to specific form fields without fragile ad-hoc parsing.</p>
      `
    },
    {
      id: 'versioning-and-evolution',
      title: '4. Pragmatic API Versioning and Evolution',
      content: `
        <p>Breaking changes in production APIs break consumer trust. URL path versioning (<code>/api/v1/</code>) remains the most transparent approach for public and partner integrations, while header-based content negotiation suits internal microservices.</p>
        <p>Always announce deprecations using standard HTTP headers:</p>
        <pre class="code-block" data-language="http"><code>Deprecation: @1767225600
Sunset: Wed, 31 Dec 2026 23:59:59 GMT
Link: &lt;https://docs.kodmates.com/api/v2/migration&gt;; rel="successor-version"</code></pre>
        <div class="article-callout">
          <div class="article-callout__title">API & Backend Architecture</div>
          <p>Designing high-scale RESTful APIs or transitioning monolithic endpoints to microservices? <a href="/contact">Schedule an architectural consultation</a> with the KodMates engineering team.</p>
        </div>
      `
    }
  ]
};
