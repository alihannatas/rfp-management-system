# RFP Management System - Frontend

Modern React frontend for the RFP Management System built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern UI**: Clean and responsive design with Shadcn UI components
- **TypeScript**: Full TypeScript support for type safety
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: React Query for server state management
- **Routing**: React Router for client-side routing
- **Authentication**: JWT-based authentication with context
- **Role-based Access**: Different views for customers and suppliers
- **Real-time Updates**: Automatic data refetching and caching

## 🛠️ Tech Stack

- **React** - UI library
- **TypeScript** - Programming language
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Component library
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client
- **Lucide React** - Icon library

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── charts/     # Chart components
│   │   ├── forms/      # Form components
│   │   └── layout/     # Layout components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── types/          # TypeScript types
│   ├── lib/            # Utility functions
│   └── assets/         # Static assets
├── public/             # Public assets
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Pages

### Customer Pages
- **Dashboard** - Overview of projects, RFPs, and proposals
- **Projects** - Project management and creation
- **Project Detail** - Individual project details and management
- **Products** - Product catalog management
- **RFPs** - RFP creation and management
- **RFP Detail** - Individual RFP details and comparison
- **Proposal Detail** - View and manage proposals

### Supplier Pages
- **Dashboard** - Overview of active RFPs and proposals
- **Active RFPs** - Browse and filter available RFPs
- **Proposals** - Manage submitted proposals
- **Proposal Detail** - View and update individual proposals

## 🎨 UI Components

### Layout Components
- **Header** - Navigation and user menu
- **Sidebar** - Navigation menu
- **Layout** - Main layout wrapper

### Form Components
- **LoginForm** - User authentication
- **RegisterForm** - User registration
- **ProjectForm** - Project creation/editing
- **ProductForm** - Product creation/editing
- **RFPForm** - RFP creation/editing
- **ProposalForm** - Proposal creation/editing

### Chart Components
- **DashboardCharts** - Dashboard analytics
- **ProposalComparisonChart** - RFP comparison charts

### Data Components
- **DataTable** - Reusable data table
- **ResponsiveContainer** - Responsive wrapper

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Type checking
npm run type-check   # Run TypeScript compiler
```

## 🎨 Styling

The project uses Tailwind CSS for styling with a custom configuration:

- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Mode**: Built-in dark mode support
- **Custom Components**: Shadcn UI components with custom styling
- **Consistent Spacing**: Tailwind's spacing scale
- **Typography**: Custom font configuration

## 🔐 Authentication

The frontend handles authentication through:

- **AuthContext**: Global authentication state
- **Protected Routes**: Route protection based on user roles
- **Token Management**: Automatic token refresh and storage
- **Role-based Access**: Different UI based on user role (CUSTOMER/SUPPLIER)

## 📊 State Management

- **React Query**: Server state management and caching
- **React Context**: Global application state
- **Local State**: Component-level state with useState/useReducer

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# The build output will be in the 'dist' directory
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎯 Performance

- **Code Splitting**: Automatic code splitting with Vite
- **Lazy Loading**: Lazy loading of components and routes
- **Caching**: React Query caching for API calls
- **Optimized Images**: Optimized asset loading

## 📄 License

This project is licensed under the MIT License.