
# Doctor Booking System

This is a full-stack doctor booking system built with **Next.js**, **TypeScript**, and **Tailwind CSS**. It features secure OTP authentication, demo login flows, mock API endpoints, and a mobile-first responsive UI based on Figma designs.

## Features

- Patient and doctor login with OTP verification
- Demo login for quick access (bypass OTP for demo numbers)
- Book, view, and manage appointments
- Doctor availability management
- Patient and doctor dashboards
- Mock RESTful API endpoints for development
- Mobile-first, modern UI with Tailwind CSS

## Tech Stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Custom authentication (OTP, demo login)
- Mock API (in `src/app/api/`)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Login

- Use demo patient: `9042222856`
- Use demo doctors: `9876543210` to `9876543214`
- Demo logins bypass OTP and go directly to the dashboard.

## Project Structure

- `src/app/` — Pages and API routes (App Router)
- `components/` — Reusable UI components
- `lib/` — Utilities and hooks
- `types/` — TypeScript types and interfaces

## Deployment

Deploy easily on [Vercel](https://vercel.com/) or your preferred platform. Ensure the correct branch is selected and redeploy after code changes.

---
For more details, see the `.github/copilot-instructions.md` and in-code comments.
