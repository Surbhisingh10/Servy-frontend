# Restaurant SaaS Frontend

Production-ready Next.js frontend for multi-tenant restaurant management SaaS.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Framer Motion animations
- ✅ Zustand state management
- ✅ React Hook Form with Zod validation
- ✅ Responsive mobile-first design
- ✅ JWT authentication
- ✅ Multi-tenant support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and helpers
│   └── api.ts             # API client
└── store/                 # Zustand stores
    └── auth-store.ts      # Authentication store
```

## Features Overview

### Authentication
- Login/Register pages
- JWT token management
- Protected routes
- Auto-redirect on unauthorized

### Dashboard
- Overview statistics
- Order management
- Booking management
- Customer CRM
- QR code management

### UI Components
- Button (with loading states)
- Input (with validation)
- Card (with hover effects)
- Modal (animated)

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check without building

## Production Deployment

1. Set environment variables
2. Build the application: `npm run build`
3. Start with: `npm run start`

Or deploy to Vercel/Netlify for automatic deployments.
