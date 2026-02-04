# Stymie’s Painting Solutions (MERN Website)

Marketing website + admin dashboard for **Stymie’s Painting Solutions**, a local painting company serving **Richmond County & Columbia County, GA**.  
Built with a MERN stack (React + Node/Express + MongoDB) to showcase services, display project photos, collect leads, and manage submissions through an admin dashboard.

**Core goals**

- Generate and track customer leads (with email notifications on new submissions)
- Build trust with reviews and a before/after gallery
- Provide a simple admin workflow for managing leads and approving reviews

## Tech Stack

**Frontend**

- React (Vite)
- React Router
- Custom SEO utilities (meta titles, descriptions, canonical paths)

**Backend**

- Node.js
- Express
- JWT-based authentication with refresh flow
- Cookie-based session handling

**Database**

- MongoDB Atlas
- Mongoose ODM

**Email**

- Automated email notifications on new lead submissions

**Hosting / Deployment**

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Features

### Public Website

- Service pages for residential and light commercial painting
- Before-and-after project gallery
- Customer reviews display
- Review submission form (admin approval required before publishing)
- Lead/contact form with automatic email notifications on submission
- Local SEO optimization for Richmond & Columbia County, GA

### Admin Dashboard

- Secure admin authentication
- View and manage incoming leads
- Automatic email alerts when new leads are submitted
- Review moderation (approve or reject before public display)

## Project Structure

This project is organized as a standard MERN application with separate frontend and backend directories.

### Frontend (`/client`)

- `src/components` – Reusable UI components
- `src/pages` – Public pages and admin views
- `src/utils` – Shared utilities (API helpers, SEO hooks, etc.)
- `src/assets` – Images and static assets
- `src/data` – Seed and placeholder data for the frontend

### Backend (`/server`)

- `src/routes` – Express route definitions
- `src/controllers` – Request handling logic
- `src/models` – Mongoose models
- `src/middleware` – Auth, validation, and error handling
- `src/config` – Database and app configuration
- `src/utils` – Helper functions (email, tokens, etc.)

## Requirements & Prerequisites

To run this project locally or deploy it, you will need:

- Node.js (v18 or newer recommended)
- npm or yarn
- A MongoDB Atlas account and connection string
- Access to an email service account for lead notifications
- A Vercel account (frontend hosting)
- A Render account (backend hosting)

Basic familiarity with:

- React
- Express APIs
- Environment variables
- Git and GitHub

## Environment Variables

This project relies on environment variables for configuration.  
**Do not commit actual secret values to the repository.**

### Server (`/server/.env`)

The backend requires the following variables:

- `MONGO_URI`  
  MongoDB Atlas connection string

- `JWT_SECRET`  
  Secret used to sign access tokens

- `JWT_REFRESH_SECRET`  
  Secret used to sign refresh tokens

- `CLIENT_URL`  
  Frontend URL used for CORS configuration

- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASS`  
  Email service credentials used to send notifications when new leads are submitted

### Client (`/client/.env`)

The frontend requires:

- `VITE_API_URL`  
  Base URL of the backend API (Render deployment or local server)

## Local Development

This project is designed to be run locally with the frontend and backend as separate processes.

### General Workflow

1. Install dependencies for both the client and server.
2. Create local `.env` files for the client and server using the required environment variable names.
3. Start the backend server.
4. Start the frontend development server.
5. Access the frontend in a browser and confirm API connectivity.

### Notes

- The frontend communicates with the backend using the API base URL defined in `VITE_API_URL`.
- Cookies and authentication rely on proper CORS configuration.
- Email notifications for new leads will only function if valid email environment variables are present.

## Deployment Notes

### Backend (Render)

- The backend is deployed as a Node.js service on Render.
- Environment variables must be configured in the Render dashboard.
- The server must allow CORS requests from the frontend domain.
- Cookie-based authentication requires `credentials: true` and a matching `CLIENT_URL`.

### Frontend (Vercel)

- The frontend is deployed on Vercel.
- The `VITE_API_URL` environment variable must point to the Render backend URL.
- Rebuild the frontend after any environment variable changes.

### Common Issues

- CORS errors caused by mismatched frontend URLs
- Incorrect API base URL values
- Cookies not being sent due to missing `credentials` settings
- Email notifications failing when email environment variables are missing or incorrect

## API Overview

This project exposes a REST API used by the frontend and admin dashboard.

### Authentication

- Admin login
- Token refresh
- Logout

### Leads

- Submit new leads from the public contact form
- Retrieve leads for admin review
- Update lead status and notes

### Reviews

- Submit reviews from the public site
- Retrieve approved reviews for display
- Approve or reject reviews via the admin dashboard

> Note: Most admin routes are protected and require authentication.

## Security & Access Control

- Admin routes are protected and require authentication.
- Authentication uses JWT-based access and refresh tokens.
- Tokens are handled via HTTP-only cookies.
- CORS is configured to allow requests only from approved frontend origins.
- Sensitive configuration values are managed through environment variables and are not committed to the repository.

## Roadmap & Notes

Planned or potential future improvements include:

- Spam protection for public forms
- Enhanced admin filtering and reporting
- Analytics and conversion tracking
- Performance and accessibility refinements

### Notes

- This project is actively maintained.
- Deployment configurations may vary between local and production environments.
- Environment variables should be reviewed whenever deployment targets change.
