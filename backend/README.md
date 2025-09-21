# RFP Management System - Backend

Backend API for the RFP Management System built with Node.js, TypeScript, Express.js, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **RESTful API**: Clean and well-documented API endpoints
- **Database Management**: PostgreSQL with Prisma ORM
- **Validation**: Comprehensive input validation with Joi
- **Security**: Rate limiting, CORS, Helmet.js protection
- **Testing**: Jest test suite
- **TypeScript**: Full TypeScript support

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **Joi** - Validation
- **Jest** - Testing
- **Docker** - Containerization

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/    # API controllers
│   ├── services/       # Business logic
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── config/         # Configuration
├── prisma/             # Database schema and migrations
├── tests/              # Test files
├── dist/               # Compiled JavaScript
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp env.example .env
```

3. **Configure database**
```bash
# Create database
createdb rfpdb

# Run migrations
npx prisma migrate dev --name init
```

4. **Start development server**
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Projects
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `GET /api/projects/dashboard` - Dashboard data
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Products
- `POST /api/projects/:projectId/products` - Create product
- `GET /api/projects/:projectId/products` - List products
- `GET /api/projects/:projectId/products/:id` - Get product details
- `PUT /api/projects/:projectId/products/:id` - Update product
- `DELETE /api/projects/:projectId/products/:id` - Delete product

### RFPs
- `POST /api/projects/:projectId/rfps` - Create RFP
- `GET /api/projects/:projectId/rfps` - List RFPs
- `GET /api/projects/:projectId/rfps/:id` - Get RFP details
- `PUT /api/projects/:projectId/rfps/:id` - Update RFP
- `PUT /api/projects/:projectId/rfps/:id/toggle` - Toggle RFP status
- `DELETE /api/projects/:projectId/rfps/:id` - Delete RFP
- `GET /api/rfps/active` - Get active RFPs (Public)

### Proposals
- `POST /api/proposals` - Create proposal
- `GET /api/proposals` - List proposals
- `GET /api/proposals/:id` - Get proposal details
- `PUT /api/proposals/:id` - Update proposal
- `PUT /api/proposals/:id/withdraw` - Withdraw proposal
- `GET /api/proposals/customer/:id` - Get proposal for customer
- `PUT /api/proposals/customer/:id/status` - Update proposal status by customer

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🐳 Docker

```bash
# Build image
docker build -t rfp-backend .

# Run container
docker run -p 3001:3001 rfp-backend
```

## 📝 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database studio
npm run studio
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet.js security headers
- Input validation with Joi
- SQL injection protection with Prisma
- XSS protection

## 📄 License

This project is licensed under the MIT License.