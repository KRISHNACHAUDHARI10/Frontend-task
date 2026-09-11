import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import InvoiceFilters from '../../components/InvoiceFilters/InvoiceFilters';
import InvoiceTable from '../../components/InvoiceTable/InvoiceTable';
import Pagination from '../../components/Pagination/Pagination';
import EditInvoiceModal from '../../components/EditInvoiceModal/EditInvoiceModal';
import { updateInvoice, deleteInvoice } from '../../services/api';

// Helper to reliably parse date strings into Date objects
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  if (typeof dateStr !== 'string') {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  const str = dateStr.trim();
  if (!str) return null;

  // Pattern 1: YYYY-MM-DD or YYYY/MM/DD (HTML date picker standard)
  if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(str)) {
    const parts = str.split(/[-/T]/);
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d);
  }

  // Pattern 2: DD-MM-YYYY or DD/MM/YYYY (Indian/European standard)
  if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}/.test(str)) {
    const parts = str.split(/[-/]/);
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const y = parseInt(parts[2], 10);
    return new Date(y, m, d);
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const Invoices = ({ invoices, setInvoices, role }) => {
  // Filters 
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sorting state
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination (Show 7 invoices per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Auto reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, startDate, endDate]);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState([]);

  // Active invoice being edited in modal
  const [editingInvoice, setEditingInvoice] = useState(null);

  // Reset filters
  const handleReset = () => {
    setSearch('');
    setStatus('All');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Toggle sorting field and order
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 1. Filter logic
  let filtered = invoices.filter((inv) => {
    const searchLower = search.trim().toLowerCase();
    
    // Format invoice date in multiple formats for search bar matching
    const invDateObj = parseDate(inv.date);
    let dateStrFormats = inv.date || '';
    if (invDateObj) {
      const yyyy = invDateObj.getFullYear();
      const mm = String(invDateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(invDateObj.getDate()).padStart(2, '0');
      dateStrFormats = `${yyyy}-${mm}-${dd} ${dd}-${mm}-${yyyy} ${dd}/${mm}/${yyyy}`;
    }

    const matchSearch =
      !searchLower ||
      inv.clientName.toLowerCase().includes(searchLower) ||
      inv.id.toLowerCase().includes(searchLower) ||
      dateStrFormats.toLowerCase().includes(searchLower);

    const matchStatus = status === 'All' || inv.status === status;

    let matchDate = true;
    if (invDateObj) {
      if (startDate) {
        const startObj = parseDate(startDate);
        if (startObj && invDateObj < startObj) matchDate = false;
      }
      if (endDate) {
        const endObj = parseDate(endDate);
        if (endObj && invDateObj > endObj) matchDate = false;
      }
    }

    return matchSearch && matchStatus && matchDate;
  });

  // 2. Sort logic
  filtered.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === 'date' || sortField === 'dueDate') {
      valA = parseDate(valA) ? parseDate(valA).getTime() : 0;
      valB = parseDate(valB) ? parseDate(valB).getTime() : 0;
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // 3. Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvoices = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Checkbox selection
  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  const handleSelectAll = () => {

    if (selectedIds.length === currentInvoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentInvoices.map((inv) => inv.id));

    }
  };

  // Actions with Database Persistence & Toast Feedback
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateInvoice(id, { status: newStatus });
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
      );
      toast.success(`Invoice ${id} status updated to ${newStatus}!`);
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const handleMarkPaid = (id) => handleUpdateStatus(id, 'Paid');

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${id} from the database?`)) {
      return;
    }
    try {
      await deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      toast.success(`Invoice ${id} deleted from database successfully!`);
    } catch (err) {
      toast.error(err.message || 'Failed to delete invoice from database');
    }

  };

  const handleSaveEdit = async (id, updatedData) => {
    try {
      const res = await updateInvoice(id, updatedData);
      const updated = res.invoice || { ...editingInvoice, ...updatedData };
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? updated : inv))
      );
      toast.success(`Invoice ${id} updated successfully!`);
    } catch (err) {
      toast.error(err.message || 'Failed to update invoice');
    }
  };


  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} invoices from the database?`)) {
      return;
    }
    try {
      await Promise.all(selectedIds.map((id) => deleteInvoice(id)));
      setInvoices((prev) => prev.filter((inv) => !selectedIds.includes(inv.id)));
      toast.success(`${selectedIds.length} invoices deleted from database!`);
      setSelectedIds([]);
    } catch (err) {
      toast.error('Failed to delete some invoices from database');
    }
  };
  // Export to CSV
 const handleExportCSV = () => {
  const list =
    selectedIds.length > 0
      ? invoices.filter((inv) => selectedIds.includes(inv.id))
      : filtered;
  const header = "ID,Client,Date,Due Date,Amount,Status\n";
  const rows = list.map((inv) =>
    [
      inv.id,
      inv.clientName,
      inv.date,
      inv.dueDate,
      inv.amount,
      inv.status,
    ].join(",")
  );
  const csvContent = header + rows.join("\n");
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "invoices.csv";
  link.click();

  URL.revokeObjectURL(url);
};
  return (
    <div className="page">
      <div className="page-header">
        <div>
          
          <h1>Invoices</h1>
          <p>Search, filter and manage invoices</p>
        
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {role === 'Admin' && (
            <Link
              to="/invoices/create"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <AddIcon sx={{ fontSize: 18 }} /> Create Invoice
            </Link>
          )}
          <button onClick={handleExportCSV} className="btn btn-secondary">
            Export CSV {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
          </button>
        </div>
      </div>

      <InvoiceFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onReset={handleReset}
      />

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="bulk-bar">
          <span><strong>{selectedIds.length}</strong> selected</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {role === 'Admin' && (
              <button onClick={handleBulkDelete} className="btn-small btn-delete">
                Delete
              </button>
            )}                                                                 
            <button onClick={() => setSelectedIds([])} className="btn-small">
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="card" style={{ marginTop: '16px', position: 'relative', overflow: 'visible' }}>
        <InvoiceTable
          invoices={currentInvoices}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          selectedIds={selectedIds}
          onSelectOne={handleSelectOne}
          onSelectAll={handleSelectAll}
          role={role}
          onMarkPaid={handleMarkPaid}
          onUpdateStatus={handleUpdateStatus}
          onEdit={(inv) => setEditingInvoice(inv)}
          onDelete={handleDelete}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filtered.length}
        />
      </div>

      {/* Update Invoice Modal */}
      <EditInvoiceModal
        invoice={editingInvoice}
        isOpen={Boolean(editingInvoice)}
        onClose={() => setEditingInvoice(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
};
export default Invoices;
