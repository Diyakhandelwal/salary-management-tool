import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Layers, 
  ArrowRight, 
  Zap,
  Server
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Document Header */}
      <div className="glass-panel" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)',
        border: '1px solid #fef08a',
        boxShadow: '0 4px 20px -2px rgba(202, 138, 4, 0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-indigo">Official Assessment Submission Deliverable</span>
          <span style={{ fontSize: '0.8rem', color: '#854d0e' }}>Date: September 2026</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#713f12', letterSpacing: '-0.02em' }}>
          Salary Management Tool — Requirements & System Design Specification
        </h1>
        <p style={{ color: '#854d0e', fontSize: '0.95rem', maxWidth: '850px', marginTop: '6px' }}>
          Comprehensive architectural blueprint, domain model definitions, and documented scope trade-offs based on recruiter alignment with Sandli Srivastava.
        </p>
      </div>

      {/* Section 1: Executive Summary & Persona */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={20} color="#ca8a04" />
          1. Product Summary & Persona Definition
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          <div style={{ background: '#fffdf5', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid #fef08a' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#b45309', marginBottom: '6px' }}>Primary User Persona</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>Elena Vance — Head of People & Total Rewards (HR Manager)</strong>. The primary persona responsible for understanding how the organization pays its global workforce, executing merit revisions, analyzing compensation equity across departments and geographies, and generating executive reports.
            </p>
          </div>

          <div style={{ background: '#fffdf5', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid #fef08a' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#059669', marginBottom: '6px' }}>Core Problem Statement</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Organizations need a centralized, auditable system to oversee global employee compensation structures, plan salary revisions with real-time percentage simulations, track revision histories, and gain instant visibility into total payroll expenditure by region and department.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Architecture Diagram (HLD) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={20} color="#ca8a04" />
          2. High-Level Architecture (HLD Implementation)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Implemented directly following the architectural design submitted in the whiteboard specification:
        </p>

        {/* Visual Architecture Map */}
        <div style={{
          background: '#fffdf0',
          border: '1px solid #fef08a',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}>
          
          {/* Top Layer: Client & API Gateway */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>HR User (Client)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>React TypeScript UI (Vite)</div>
            </div>

            <ArrowRight size={20} color="#ca8a04" />

            <div style={{
              background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
              border: '1px solid #facc15',
              borderRadius: 'var(--radius-md)',
              padding: '14px 24px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(234, 179, 8, 0.15)',
            }}>
              <div style={{ fontWeight: 700, color: '#713f12', fontSize: '0.95rem' }}>API GATEWAY LAYER</div>
              <div style={{ fontSize: '0.75rem', color: '#854d0e', marginTop: '2px' }}>
                • Authentication (HR Persona Token)<br />
                • Rate Limiting (Sliding Window 180 req/min)<br />
                • Cross-Origin Resource Sharing (CORS)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '2px', height: '20px', background: '#eab308' }} />
          </div>

          {/* Middle Layer: 4 Micro-Services / Domain Modules */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}>
            <div style={{ background: '#ffffff', border: '1px solid #fef08a', borderRadius: 'var(--radius-md)', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontWeight: 700, color: '#0284c7', fontSize: '0.9rem', marginBottom: '6px' }}>
                Employee Profile Management
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Manages employee CRUD, department/country assignments, status lifecycle, and profile metadata.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #fef08a', borderRadius: 'var(--radius-md)', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.9rem', marginBottom: '6px' }}>
                Data Fetching / Search / Audit
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Multi-attribute search query, pagination, salary range filter, and immutable audit logging of modifications.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #fef08a', borderRadius: 'var(--radius-md)', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontWeight: 700, color: '#d97706', fontSize: '0.9rem', marginBottom: '6px' }}>
                Salary Updation Service
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Computes percentage deltas, updates base/variable pay, appends chronological revision history records.
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #fef08a', borderRadius: 'var(--radius-md)', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              <div style={{ fontWeight: 700, color: '#9333ea', fontSize: '0.9rem', marginBottom: '6px' }}>
                Report Generation Service
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Aggregates department budget allocations, country distributions, salary band histograms, and CSV exports.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '2px', height: '20px', background: '#eab308' }} />
          </div>

          {/* Bottom Layer: Data & Persistence */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{
              background: '#ffffff',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 24px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Repository & ORM Layer</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Spring Data JPA / Hibernate</div>
            </div>

            <ArrowRight size={20} color="#ca8a04" />

            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: 'var(--radius-md)',
              padding: '14px 28px',
              textAlign: 'center',
            }}>
              <div style={{ fontWeight: 700, color: '#065f46', fontSize: '0.95rem' }}>SQL Database</div>
              <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                H2 (In-memory local) / PostgreSQL (Production cloud on Render)
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Section 3: Scope Decisions & Deliberate Exclusions */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={20} color="#059669" />
          3. Scope Decisions & Deliberate Trade-offs (As Requested by Recruiter)
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
          The recruiter specifically requested documentation of what features were intentionally left out and the product reasoning behind each choice:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <XCircle size={18} color="#e11d48" />
              <strong style={{ color: '#9f1239', fontSize: '0.95rem' }}>Deliberately Excluded: Payroll Processing & Tax Deductions</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#4c0519', lineHeight: 1.5 }}>
              <strong>Reasoning:</strong> Payroll processing involves transactional disbursements, local tax withholding (e.g. W-2, PAYE, TDS), and statutory compliance (PF, ESI, 401k). The prompt and recruiter guidance established that the core value is <em>salary management and organizational compensation insights</em>. Adding complex tax calculation engines would introduce regional tax code baggage without advancing total rewards decision-making.
            </p>
          </div>

          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <XCircle size={18} color="#e11d48" />
              <strong style={{ color: '#9f1239', fontSize: '0.95rem' }}>Deliberately Excluded: Multi-Tier Approval State Machines</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#4c0519', lineHeight: 1.5 }}>
              <strong>Reasoning:</strong> Recruiter explicitly clarified that multiple approval tiers (L1 manager &rarr; L2 director &rarr; VP &rarr; Finance) are not required and a single HR Manager persona is sufficient. Avoiding complex multi-party state machine queues ensures clean, immediate revision execution with full auditability.
            </p>
          </div>

          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <XCircle size={18} color="#e11d48" />
              <strong style={{ color: '#9f1239', fontSize: '0.95rem' }}>Deliberately Excluded: Third-Party HRMS Integrations (Workday/BambooHR)</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#4c0519', lineHeight: 1.5 }}>
              <strong>Reasoning:</strong> External REST/SOAP syncing with systems like Workday or ADP requires sandbox credentials and introduces external network dependencies. A self-contained, high-performance SQL repository provides complete autonomy for testing and evaluation.
            </p>
          </div>

          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <XCircle size={18} color="#e11d48" />
              <strong style={{ color: '#9f1239', fontSize: '0.95rem' }}>Deliberately Excluded: Multi-User Login Screen & Public Identity Gateway</strong>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#4c0519', lineHeight: 1.5 }}>
              <strong>Reasoning:</strong> The assignment specification explicitly establishes a single target persona: <em>"HR Manager of the org"</em> (Elena Vance, Head of People & Total Rewards). Introducing a multi-user login portal, user registration, and password recovery workflows would create unnecessary evaluation friction and distract from the core problem: replacing tedious 10,000-row Excel spreadsheets with real-time salary management, compensation distribution bands, and merit simulation. The system operates as an authenticated enterprise session for the HR Manager, with direct access to system audit logs as an elevated governance tool.
            </p>
          </div>

          <div style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <CheckCircle2 size={18} color="#059669" />
              <strong style={{ color: '#065f46', fontSize: '0.95rem' }}>Deliberately Included (High-Value Additions):</strong>
            </div>
            <ul style={{ fontSize: '0.85rem', color: '#047857', lineHeight: 1.6, paddingLeft: '20px' }}>
              <li><strong>Salary Revision History Timeline:</strong> Recruiter noted this as optional; we implemented it because seeing historical percentage bumps and revision rationale is essential for compensation governance.</li>
              <li><strong>Rate Limiting & Gateway Security:</strong> Implemented sliding window rate limiting (180 requests/min) to mirror the attached HLD diagram.</li>
              <li><strong>Executive Analytics & Histograms:</strong> Dynamic compensation band distributions and departmental/regional rollups.</li>
              <li><strong>CSV Roster Export:</strong> One-click downloadable export for HR reporting.</li>
            </ul>
          </div>

        </div>
      </div>

      {/* Section 4: Deployment Guide (Render & Cloud) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={20} color="#ca8a04" />
          4. Deployment Architecture (Render & Cloud Free Hosting)
        </h2>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
          The repository is configured for one-click deployment to <strong>Render</strong> (or any containerized hosting platform):
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#fffdf5', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #fef08a' }}>
            <h4 style={{ color: '#713f12', fontSize: '0.9rem', marginBottom: '6px' }}>Backend Web Service (Render)</h4>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '16px' }}>
              <li>Build Command: <code style={{ background: '#fef9c3', padding: '2px 6px', borderRadius: '4px', color: '#713f12' }}>./gradlew bootJar -x test</code></li>
              <li>Start Command: <code style={{ background: '#fef9c3', padding: '2px 6px', borderRadius: '4px', color: '#713f12' }}>java -jar build/libs/salary-management-backend-1.0.0.jar</code></li>
              <li>Environment: Java 21 / Gradle / Docker</li>
              <li>Database: PostgreSQL add-on or zero-config embedded H2</li>
            </ul>
          </div>

          <div style={{ background: '#fffdf5', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #fef08a' }}>
            <h4 style={{ color: '#713f12', fontSize: '0.9rem', marginBottom: '6px' }}>Frontend Static Site (Render / Vercel)</h4>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '16px' }}>
              <li>Build Command: <code style={{ background: '#fef9c3', padding: '2px 6px', borderRadius: '4px', color: '#713f12' }}>npm install && npm run build</code></li>
              <li>Publish Directory: <code style={{ background: '#fef9c3', padding: '2px 6px', borderRadius: '4px', color: '#713f12' }}>dist</code></li>
              <li>Environment Variable: <code style={{ background: '#fef9c3', padding: '2px 6px', borderRadius: '4px', color: '#713f12' }}>VITE_API_URL=&lt;backend-url&gt;/api</code></li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};
