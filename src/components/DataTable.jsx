import React, { useState, useMemo } from 'react';
import Skeleton from './Skeleton';

export default function DataTable({
  columns = [],
  data = [],
  gridTemplate = 'repeat(auto-fit, minmax(120px, 1fr))',
  searchPlaceholder = 'Search records...',
  loading = false,
  error = false,
  emptyMessage = 'No records found.'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  // Search filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val || '').toLowerCase().includes(lowerSearch)
      )
    );
  }, [data, searchTerm]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Pagination
  const totalEntries = sortedData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentRows = sortedData.slice(startIndex, startIndex + entriesPerPage);

  const handleSort = (key) => {
    if (sortColumn === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Top Controls Toolbar */}
      <div className="table-toolbar">
        {/* Entries per page dropdown */}
        <div className="table-entries-selector">
          <span>Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="table-entries-dropdown"
          >
            <option value={8}>8</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>

        {/* Search Input Box */}
        <div className="table-search-box">
          <svg className="table-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="table-search-input"
          />
        </div>
      </div>

      {/* Table Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Column Header Row */}
        <div className="table-header-row" style={{ gridTemplateColumns: gridTemplate }}>
          {columns.map((col) => (
            <div
              key={col.key}
              className={`table-header-cell ${col.sortable !== false ? 'sortable' : ''}`}
              onClick={() => col.sortable !== false && handleSort(col.key)}
            >
              {col.label}
              {col.sortable !== false && (
                <span className="table-sort-indicator">
                  {sortColumn === col.key ? (sortDirection === 'asc' ? ' ⌃' : ' ⌄') : ' ⌄'}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Shimmer Skeleton Loading State */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} height="64px" borderRadius="10px" />
            ))}
          </div>
        ) : error ? (
          /* Error State Card (Generalized message) */
          <div className="state-card">
            <div className="state-icon error">⚠️</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-md)', color: 'var(--text-main)', marginBottom: '4px' }}>
              Unable to Load Records
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
              We encountered a problem fetching data from the server. Please refresh or try again shortly.
            </p>
          </div>
        ) : currentRows.length === 0 ? (
          /* Empty State Card */
          <div className="state-card">
            <div className="state-icon empty">📋</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-md)', color: 'var(--text-main)', marginBottom: '4px' }}>
              No Data Available
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
              {emptyMessage}
            </p>
          </div>
        ) : (
          /* Floating Row Cards List */
          currentRows.map((row, idx) => (
            <div key={row.id || idx} className="table-row-card" style={{ gridTemplateColumns: gridTemplate }}>
              {columns.map((col) => (
                <div key={col.key} className="table-row-cell">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? 'N/A')}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer Controls */}
      {!loading && !error && totalEntries > 0 && (
        <div className="table-pagination-bar">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} entries
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              &lt; Previous
            </button>

            <span className="pagination-page-indicator">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
