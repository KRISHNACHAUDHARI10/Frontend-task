import React from 'react';
import './InvoiceFilters.scss';

const InvoiceFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onReset,
}) => {
  return (
    <div className="filters-card">
      <div className="filter-group">
        <label>Search:</label>
        <input
          type="text"
          placeholder="Client name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div className="filter-group">
        <label>From Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>To Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="filter-group" style={{ alignSelf: 'flex-end' }}>
        <button onClick={onReset} className="btn btn-secondary">
          Reset
        </button>
      </div>
    </div>
  );
};

export default InvoiceFilters;
