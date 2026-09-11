# React Assignments

This repository contains two frontend assignments developed using
React.js with separate implementations for role-based navigation
and invoice management.


# Assignment 1 - Role Based Navigation System

## Problem Statement

Create a dynamic sidebar controlled by user permissions.

## Features

- Dynamic sidebar navigation
- Permission-based module visibility
- Hide unauthorized modules
- Protected routes
- Permission-based buttons/actions
- Authentication flow
- Route guards
- State management

## Tech Stack

- React.js
- React Router DOM
- Material UI
- MUI Icons
- Tailwind CSS
- Emotion

## Permission Flow

User Login
→ Authentication
→ Fetch Permissions
→ Store Permissions
→ Generate Sidebar
→ Protect Routes
→ Control Actions

---

# Assignment 2 - Invoice Management System

## Problem Statement

Build an invoice management frontend.

## Features

### Dashboard

- Total invoices
- Paid invoices
- Pending amount
- Overdue invoices

### Invoice Listing

- Table view
- Pagination
- Sorting
- Search
- Status filtering
- Date range filtering
- Reset filters

### Invoice Details

- Invoice summary
- Client information
- Line items
- Amount
- Status
- Download invoice

### Invoice Management

- Create invoice
- View invoice
- Edit invoice
- Delete invoice
- Form validation

### Bonus

- Bulk selection
- Export CSV
- Role-based actions

## Tech Stack

### Frontend

- React.js
- React Router DOM
- Material UI
- MUI Icons
- Emotion
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## API Architecture

React Frontend
        ↓
     API Request
        ↓
   Express.js
        ↓
   Controller
        ↓
    Mongoose
        ↓
    MongoDB

## Invoice API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invoices` | Get all invoices |
| GET | `/api/invoices/:id` | Get invoice by ID |
| POST | `/api/invoices` | Create invoice |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |

v
