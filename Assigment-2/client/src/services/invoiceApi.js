// this is my initial invoices data
export const initialInvoices = [
  {
    id: 'INV-101',
    clientName: 'Rahul Sharma',
    clientEmail: 'rahul@gmail.com',
    date: '2026-09-01',
    dueDate: '2026-09-15',
    status: 'Paid',
    amount: 15000,
    items: [
      { name: 'Website Design', qty: 1, price: 10000 },
      { name: 'Hosting Setup', qty: 1, price: 5000 },
    ],
    },
    {
    id: 'INV-102',
    clientName: 'Pooja Verma',
    clientEmail: 'pooja@gmail.com',
    date: '2026-09-02',
    dueDate: '2026-09-16',
    status: 'Pending',
    amount: 25000,
    items: [
      { name: 'E-commerce App', qty: 1, price: 25000 },
  
    ],
  },
  {
    id: 'INV-103',
    clientName: 'Amit Patel',
    clientEmail: 'amit@gmail.com',
    date: '2026-08-20',
    dueDate: '2026-09-05',
    status: 'Overdue',
    amount: 12000,
    items: [
      { name: 'Logo & Branding', qty: 1, price: 12000 },
    ],
  },
  {
    id: 'INV-104',
    clientName: 'Neha Gupta',
    clientEmail: 'neha@gmail.com',
    date: '2026-09-03',
    dueDate: '2026-09-17',
    status: 'Paid',
    amount: 8000,
    items: [
      { name: 'Bug Fixes', qty: 2, price: 4000 },
    ],
  },
  {
    id: 'INV-105',
    clientName: 'Vikas Kumar',
    clientEmail: 'vikas@gmail.com',
    date: '2026-09-04',
    dueDate: '2026-09-18',
    status: 'Pending',
    amount: 30000,
    items: [
      { name: 'Mobile App API', qty: 1, price: 30000 },
    ],
  },
  {
    id: 'INV-106',
    clientName: 'Suresh Reddy',
    clientEmail: 'suresh@gmail.com',
    date: '2026-08-15',
    dueDate: '2026-08-30',
    status: 'Overdue',
    amount: 18000,
    items: [
      { name: 'SEO Optimization', qty: 1, price: 18000 },
    ],
  },
];
