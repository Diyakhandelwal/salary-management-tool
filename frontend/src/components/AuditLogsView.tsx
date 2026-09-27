import React, { useState, useEffect } from 'react';
import { AuditLog } from '../types';
import { api } from '../services/api';
import { ShieldCheck, RefreshCw, ChevronLeft, ChevronRight, Activity, Clock, UserCheck } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (page = 0) => {
    try {
      setLoading(true);
      const res = await api.getAuditLogs(page, 15);
      setLogs(res.content || []);
      setTotalElements(res.totalElements || 0);
      setTotalPages(res.totalPages || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(0);
  }, []);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'UPDATE_SALARY':
        return <span className="badge badge-active">SALARY REVISION</span>;
      case 'CREATE_EMPLOYEE':
        return <span className="badge badge-indigo">CREATE EMPLOYEE</span>;
      case 'UPDATE_PROFILE':
        return <span className="badge badge-cyan">PROFILE UPDATE</span>;
      case 'DELETE_EMPLOYEE':
        return <span className="badge badge-terminated">DELETE</span>;
      default:
        return <span className="badge badge-indigo">{action}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Panel */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: 'rgba(250, 204, 21, 0.25)',
            color: '#a16207',
          }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Audit & Compliance Trail
              </h1>
              <span className="badge badge-indigo">Immutable Log</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Chronological log of all compensation modifications, profile updates, and authorized HR interventions.
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchLogs(currentPage)}
          disabled={loading}
          className="btn btn-secondary btn-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Log
        </button>
      </div>

      {/* Main Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fefce8',
        }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#713f12' }}>
            System Audit Events ({totalElements} total entries)
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Showing page {currentPage + 1} of {Math.max(totalPages, 1)}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading audit records...
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No audit records found.
          </div>
        ) : (
          <div className="data-table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '180px' }}>Timestamp</th>
                  <th>Action Type</th>
                  <th>Authorized Actor</th>
                  <th>Summary</th>
                  <th>Modification Diff / Payload</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} color="var(--text-muted)" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td>{getActionBadge(log.action)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        <UserCheck size={14} color="#059669" />
                        <span>{log.actor}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                      {log.summary}
                    </td>
                    <td style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      maxWidth: '420px',
                    }}>
                      <div style={{
                        background: '#fffdf0',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #fef08a',
                        color: '#713f12',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }} title={log.details}>
                        {log.details || '—'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fefce8',
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Page <strong style={{ color: 'var(--text-primary)' }}>{currentPage + 1}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => fetchLogs(currentPage - 1)}
                disabled={currentPage === 0}
                className="btn btn-secondary btn-sm"
                style={{ opacity: currentPage === 0 ? 0.4 : 1 }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                onClick={() => fetchLogs(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="btn btn-secondary btn-sm"
                style={{ opacity: currentPage >= totalPages - 1 ? 0.4 : 1 }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
