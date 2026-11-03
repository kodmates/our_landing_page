/**
 * Article: Common Database Design Mistakes and How to Avoid Them
 * Author: KodMates Technical Team
 */

export const databaseDesignMistakesArticle = {
  id: 'art-003',
  slug: 'common-database-design-mistakes',
  title: 'Common Database Design Mistakes and How to Avoid Them',
  summary: 'From premature indexing to unconstrained string fields and connection pool exhaustion: practical lessons in maintaining relational integrity and high write throughput.',
  category: 'Databases',
  author: {
    name: 'KodMates Technical Team',
    role: 'Database Systems'
  },
  publishedAt: '2026-09-28',
  updatedAt: '2026-10-02',
  readTime: '8 min read',
  featured: false,
  tags: ['Databases', 'SQL', 'PostgreSQL', 'Performance', 'Software Engineering'],
  coverGradient: 'linear-gradient(135deg, rgba(254, 239, 184, 0.16) 0%, rgba(14, 20, 20, 0.9) 100%)',
  accentColor: '#FEEFB8',
  sections: [
    {
      id: 'missing-or-misplaced-indexes',
      title: '1. Misunderstanding Indexing Costs and Selectivity',
      content: `
        <p>Indexes are not free performance accelerators; each B-tree index incurs disk storage and write amplification during every <code>INSERT</code>, <code>UPDATE</code>, and <code>DELETE</code>. Creating an index on columns with low cardinality (such as a boolean status flag) often forces query planners to default to sequential table scans anyway.</p>
        <div class="article-callout">
          <div class="article-callout__title">Optimal Practice: Partial & Composite Indexes</div>
          <p>Index specifically for high-frequency filter paths. For example, if 98% of your records are marked as "ARCHIVED" and you frequently query the remaining 2% active items, use a partial index:</p>
        </div>
        <pre class="code-block" data-language="sql"><code>-- Instead of indexing all 10,000,000 rows:
CREATE INDEX idx_orders_active_unfulfilled 
ON orders (customer_id, created_at DESC) 
WHERE status IN ('PENDING', 'PROCESSING');</code></pre>
      `
    },
    {
      id: 'null-soup-and-enum-drift',
      title: '2. The Danger of Permissive Nullability and Free-Text Enums',
      content: `
        <p>Allowing columns to be nullable without strict operational necessity creates conditional edge cases throughout backend business logic. If an attribute is only applicable under a certain parent state, consider whether the design warrants a 1-to-1 extension table or a well-validated JSONB column with schema validation.</p>
        <p>Similarly, storing core domain statuses as generic <code>VARCHAR(255)</code> invites spelling discrepancies, encoding mismatches, and data drift. Utilize native database ENUM types or checked foreign-key lookup tables to guarantee integrity at the storage layer.</p>
      `
    },
    {
      id: 'anti-pattern-entity-attribute-value',
      title: '3. Overusing Entity-Attribute-Value (EAV) Modeling',
      content: `
        <p>Software teams striving for extreme generic flexibility frequently adopt the Entity-Attribute-Value (EAV) pattern. While tempting, EAV destroys relational joins, complicates aggregation queries, and bypasses native type safety.</p>
        <p>In contemporary relational engines such as PostgreSQL, JSONB with GIN indexing offers flexible schema capability while retaining strict transactional ACID guarantees on parent tables.</p>
      `
    },
    {
      id: 'connection-pooling-and-idle-transactions',
      title: '4. Connection Pool Starvation and Unbounded Transactions',
      content: `
        <p>A database query does not fail only when the SQL is poorly constructed; it often degrades because backend workers hold transactions open across external HTTP operations.</p>
        <pre class="code-block" data-language="javascript"><code>// ANTI-PATTERN: Holding database lock during external network call
await db.transaction(async (trx) => {
  await trx('accounts').where({ id }).decrement('balance', amount);
  // DANGER: If Stripe API delays for 3.5 seconds, this DB connection is locked!
  await stripe.charges.create({ ... });
  await trx('ledger').insert({ ... });
});

// RESILIENT PATTERN: Isolate network calls outside transactional boundaries
const reservation = await db('accounts').where({ id }).decrement('balance', amount);
const payment = await stripe.charges.create({ ... });
await db('ledger').insert({ ... });</code></pre>
        <div class="article-callout">
          <div class="article-callout__title">Engineering Consultation</div>
          <p>Navigating database migration risks or optimizing query performance under heavy write loads? <a href="/contact">Consult with KodMates database engineers</a> to review your schema architecture.</p>
        </div>
      `
    }
  ]
};
