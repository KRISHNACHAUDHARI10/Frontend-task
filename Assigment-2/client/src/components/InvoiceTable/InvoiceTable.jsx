import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PrintIcon from '@mui/icons-material/Print';
import './InvoiceTable.scss';

const InvoiceTable = ({
  invoices,
  sortField,
  sortOrder,
  onSort,
  selectedIds,
  onSelectOne,
  onSelectAll,
  role,
  onMarkPaid,
  onUpdateStatus,
  onEdit,
  onDelete,
}) => {
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.action-dropdown-wrapper')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };
  return (
    <div style={{ overflow: 'visible', minHeight: '380px' }}>
      <table className="custom-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={invoices.length > 0 && selectedIds.length === invoices.length}
                onChange={onSelectAll}
              />
            </th>
            <th onClick={() => onSort('id')} style={{ cursor: 'pointer' }}>
              Invoice ID {sortField === 'id' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
  
            <th onClick={() => onSort('clientName')} style={{ cursor: 'pointer' }}>
              Client {sortField === 'clientName' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
            
            <th onClick={() => onSort('date')} style={{ cursor: 'pointer' }}>
  
              Date {sortField === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th> 

            <th onClick={() => onSort('dueDate')} style={{ cursor: 'pointer' }}>
              Due Date {sortField === 'dueDate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
  
            <th onClick={() => onSort('amount')} style={{ cursor: 'pointer' }}>
              Amount (₹) {sortField === 'amount' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
  
            <th onClick={() => onSort('status')} style={{ cursor: 'pointer' }}>
              Status {sortField === 'status' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </th>
  
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                No invoices found.
              </td>
            </tr>
          ) : (
            invoices.map((inv, index) => {
              const isLowerRow = index >= Math.max(3, invoices.length - 3);
              return (
                <tr key={inv.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(inv.id)}
                      onChange={() => onSelectOne(inv.id)}
                    />
                  </td>
                  <td>
                    <Link to={`/invoices/${inv.id}`} style={{ color: '#4338ca', fontWeight: 'bold' }}>
                      {inv.id}
                    </Link>
                  </td>
                  <td>{inv.clientName}</td>
                  <td>{inv.date}</td>
                  <td>{inv.dueDate}</td>
                  <td><strong>₹{inv.amount}</strong></td>
                  <td>
                    <span className={`badge badge-${inv.status.toLowerCase()}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ position: 'relative' }}>
                    <div className="action-dropdown-wrapper">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(inv.id);
                        }}
                        className={`action-dropdown-btn ${openMenuId === inv.id ? 'active' : ''}`}
                      >
                        <span>Actions</span>
                        <ArrowDropDownIcon sx={{ fontSize: 18 }} />
                      </button>

                      {openMenuId === inv.id && (
                        <div className={`action-dropdown-menu ${isLowerRow ? 'drop-up' : ''}`}>
                          {/* Section 1: ACTIONS */}
                          <div className="dropdown-section-title">Actions</div>

                          {/* View Data */}
                          <Link
                            to={`/invoices/${inv.id}`}
                            className="dropdown-item"
                            onClick={() => setOpenMenuId(null)}
                          >
                            <VisibilityIcon sx={{ fontSize: 18 }} />
                            <span>View Data</span>
                          </Link>

                          {/* Edit (Admin only) */}
                          {role === 'Admin' && (
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => {
                                setOpenMenuId(null);
                                onEdit(inv);
                              }}
                            >
                              <EditIcon sx={{ fontSize: 18 }} />
                              <span>Edit</span>
                            </button>
                          )}

                          {/* Status Submenu: Hover shows Paid, Pending, Overdue (Admin only) */}
                          {role === 'Admin' && (
                            <div className="dropdown-item has-submenu">
                              <span className="submenu-label">
                                <CheckCircleIcon sx={{ fontSize: 18 }} />
                                <span>Status</span>
                              </span>
                              <ChevronRightIcon sx={{ fontSize: 16 }} />

                              {/* Flyout Submenu Panel for Status */}
                              <div className="dropdown-submenu">
                                <button
                                  type="button"
                                  className={`dropdown-item ${inv.status === 'Paid' ? 'active-status' : ''}`}
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    if (onUpdateStatus) onUpdateStatus(inv.id, 'Paid');
                                  }}
                                >
                                  <span className="status-dot dot-paid" />
                                  <span>Paid</span>
                                  {inv.status === 'Paid' && <span className="status-check">✓</span>}
                                </button>
                                <button
                                  type="button"
                                  className={`dropdown-item ${inv.status === 'Pending' ? 'active-status' : ''}`}
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    if (onUpdateStatus) onUpdateStatus(inv.id, 'Pending');
                                  }}
                                >
                                  <span className="status-dot dot-pending" />
                                  <span>Pending</span>
                                  {inv.status === 'Pending' && <span className="status-check">✓</span>}
                                </button>
                                <button
                                  type="button"
                                  className={`dropdown-item ${inv.status === 'Overdue' ? 'active-status' : ''}`}
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    if (onUpdateStatus) onUpdateStatus(inv.id, 'Overdue');
                                  }}
                                >
                                  <span className="status-dot dot-overdue" />
                                  <span>Overdue</span>
                                  {inv.status === 'Overdue' && <span className="status-check">✓</span>}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Section 2: DANGER ZONE */}
                          {role === 'Admin' && (
                            <>
                              <div className="dropdown-divider" />
                              <div className="dropdown-section-title">Danger Zone</div>
                              <button
                                type="button"
                                className="dropdown-item danger"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onDelete(inv.id);
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 18 }} />
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
