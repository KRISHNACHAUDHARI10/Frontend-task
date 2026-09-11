// Centralized API Service for all HTTP requests to backend
const BASE_URL = 'http://localhost:3000/api/invoices';

export const fetchInvoices = async () => {

  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch invoices: ${response.statusText}`);
  }
  return await response.json();

};

export const fetchInvoiceById = async (id) => {

  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Invoice ${id} not found`);
  }
  return await response.json();

};


export const createInvoice = async (invoiceData) => {

  const response = await fetch(BASE_URL, {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(invoiceData),
  
});

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create invoice');
  }
  return data;
};

export const updateInvoice = async (id, updates) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update invoice');
  }
  return data;
};

export const deleteInvoice = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete invoice');
  }
  return data;
};

