# Maid To Clean - Product Requirements Document

## Original Problem Statement
Finish building a cleaning service website "Maid To Clean" deployed through Vercel with Supabase and Stripe integration. User requested futuristic design, service cards grid, CTAs throughout, and specific About page content. Added email notifications for bookings.

## Architecture
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (static site)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Payments**: Stripe Checkout
- **Email**: Resend (transactional emails)
- **Deployment**: Vercel (static hosting + serverless functions)
- **Icons**: Phosphor Icons
- **Fonts**: Syne (headings) + Inter (body)

## User Personas
1. **Customers**: Homeowners/businesses seeking cleaning services
2. **Admin**: Business owner (stephanie.maidtoclean@gmail.com) managing bookings, customers, billing

## Core Requirements
- [x] Public marketing pages (Home, About, Services, Contact)
- [x] User authentication (Login/Register)
- [x] Customer dashboard (Overview, Schedule, Payments, Settings)
- [x] Admin panel (Dashboard, Customers, Messages, Billing)
- [x] Stripe payment integration
- [x] Supabase database schema
- [x] Email notifications (booking, approval, payment)

## What's Been Implemented (March 2026)

### Design System
- Futuristic "Clinical Luxury" theme
- Glassmorphism navbar and cards
- Color palette: Deep Space Blue (#0F172A), Cyan accent (#06B6D4)
- Responsive mobile-first design

### Public Pages
- **Homepage**: Hero with clean background, services preview, why us section, CTAs
- **About**: Tagline, core values (People Over Profit, Integrity, Community, Stephanie Standard)
- **Services**: 6 service cards in grid layout with pricing
- **Contact**: Form + contact info

### Authentication
- Login/Register forms with Supabase Auth
- Role-based access (customer/admin)
- Dashboard protection

### Customer Dashboard
- Dashboard overview with stats
- Schedule cleaning appointments
- Payment history with Stripe integration
- Account settings

### Admin Panel
- Overview with revenue stats
- Customer management
- Message system (individual + broadcast)
- Billing & revenue tracking

### Email Notifications (NEW)
- **New Booking**: Customer receives confirmation, Admin receives notification
- **Booking Approved**: Customer notified to complete payment
- **Payment Confirmed**: Customer and Admin notified

### Database
- Users, Services, Add-ons, Appointments, Payments, Messages tables
- Row Level Security policies
- Seed data for services and add-ons

## Configuration
- Supabase URL: https://lihyhtcjrmkivmbvgnqp.supabase.co
- Stripe Public Key: pk_test_51T6671Gq9xS4z8Cj...
- Admin Email: stephanie.maidtoclean@gmail.com

## Vercel Environment Variables Required
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PUBLIC_KEY
- RESEND_API_KEY
- SENDER_EMAIL (or use default: onboarding@resend.dev)
- ADMIN_EMAIL (stephanie.maidtoclean@gmail.com)
- BASE_URL (https://maid-to-clean.vercel.app)

## Prioritized Backlog

### P0 (Critical)
- [x] Deploy updated files to Vercel
- [ ] Run Supabase schema migration
- [ ] Run seed data
- [ ] Set up Resend API key in Vercel

### P1 (Important)
- [ ] Custom email domain (notifications@maidtoclean.com)
- [ ] SMS reminders via Twilio
- [ ] Real-time booking calendar

### P2 (Nice to Have)
- [ ] Customer reviews/testimonials
- [ ] Referral system
- [ ] Staff assignment
- [ ] Analytics dashboard

## Next Tasks
1. Push code to GitHub to trigger Vercel deployment
2. Add Resend API key to Vercel environment variables
3. Run schema.sql in Supabase SQL Editor
4. Run seed.sql to populate services/add-ons
5. Test full booking + payment + email flow
6. Create admin user in database
