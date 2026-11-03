/**
 * Article: Choosing Between a Website and a Custom Web Application
 * Author: KodMates Technical Team
 */

export const websiteVsWebAppArticle = {
  id: 'art-004',
  slug: 'website-vs-custom-web-application',
  title: 'Choosing Between a Website and a Custom Web Application',
  summary: 'A clear commercial and technical framework for founders and product teams to choose between marketing web presences and complex transactional web applications.',
  category: 'Software Engineering',
  author: {
    name: 'KodMates Technical Team',
    role: 'Product & Engineering'
  },
  publishedAt: '2026-10-04',
  updatedAt: '2026-10-05',
  readTime: '5 min read',
  featured: false,
  tags: ['Software Engineering', 'Web Development', 'Business Automation', 'Product Strategy'],
  coverGradient: 'linear-gradient(135deg, rgba(254, 239, 184, 0.14) 0%, rgba(16, 22, 22, 0.9) 100%)',
  accentColor: '#FEEFB8',
  sections: [
    {
      id: 'fundamental-distinction',
      title: '1. The Core Functional Distinction',
      content: `
        <p>While both technologies run inside web browsers and render HTML, CSS, and JavaScript, their architectural intent is entirely divergent:</p>
        <ul>
          <li><strong>Content Website:</strong> Designed to inform, persuade, and educate visitors. The dominant data flow is unidirectional (server to reader), with minimal mutations beyond form submissions or email captures.</li>
          <li><strong>Web Application:</strong> Designed to process workflows, manage state, enforce complex access boundaries, and transform data. The user interaction is continuous, bi-directional, and stateful.</li>
        </ul>
      `
    },
    {
      id: 'decision-matrix',
      title: '2. The Five-Point Technical Decision Matrix',
      content: `
        <div class="article-comparison-table-wrapper">
          <table class="article-table">
            <thead>
              <tr>
                <th>Criterion</th>
                <th>Traditional Website</th>
                <th>Custom Web Application</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Primary Goal</strong></td>
                <td>Brand communication, customer education, SEO discovery</td>
                <td>Automating manual business operations, workflow execution</td>
              </tr>
              <tr>
                <td><strong>State Complexity</strong></td>
                <td>Stateless or ephemeral session storage</td>
                <td>Complex multi-screen relational state, caching, undo/redo</td>
              </tr>
              <tr>
                <td><strong>Authentication</strong></td>
                <td>None, or standard subscriber gate</td>
                <td>Multi-tenant RBAC, SSO, MFA, team invitations</td>
              </tr>
              <tr>
                <td><strong>Integration Depth</strong></td>
                <td>Analytics, newsletter triggers, CRM forms</td>
                <td>Core database transactions, background workers, external APIs</td>
              </tr>
              <tr>
                <td><strong>Maintenance Cost</strong></td>
                <td>Low, largely static updates</td>
                <td>Continuous CI/CD, regression testing, database migrations</td>
              </tr>
            </tbody>
          </table>
        </div>
      `
    },
    {
      id: 'hybrid-architectures',
      title: '3. Pragmatic Hybrid Approaches',
      content: `
        <p>In modern digital ecosystems, successful software businesses rarely pick one in total isolation. The recommended architecture separates marketing touchpoints from authenticated application shells:</p>
        <p>Host marketing documentation and blog insights on a high-speed, edge-cached static or SSR system (such as KodMates web properties), while mounting authenticated operations at <code>app.yourdomain.com</code>.</p>
        <div class="article-callout">
          <div class="article-callout__title">Strategic Advice</div>
          <p>Never encumber your marketing pages with heavy stateful application dependencies, and never attempt to build enterprise operational workflows inside a rigid marketing CMS. Founders evaluating this decision can <a href="/contact">reach out to KodMates engineers</a> for an architectural scoping discussion.</p>
        </div>
      `
    }
  ]
};
