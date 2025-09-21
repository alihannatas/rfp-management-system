# RFP Management System

A comprehensive fullstack application for managing RFP (Request for Proposal) processes between customers and suppliers.

## 🚀 Features

### Customer Features
- ✅ Project creation and management
- ✅ Product catalog creation (7 different categories)
- ✅ RFP creation and management
- ✅ Activate/deactivate RFP processes
- ✅ View proposals from suppliers
- ✅ Project-based RFP comparison dashboard
- ✅ Comprehensive dashboard and reporting

### Supplier Features
- ✅ View active RFPs
- ✅ Submit proposals to RFPs
- ✅ Manage and update proposals
- ✅ Withdraw proposals
- ✅ Track proposal status

### General Features
- ✅ JWT-based authentication
- ✅ Role-based authorization
- ✅ Modern and responsive design
- ✅ Real-time notifications
- ✅ Comprehensive validation
- ✅ Rate limiting and security
- ✅ PostgreSQL database
- ✅ TypeScript support

## 🛠️ Technologies

### Backend
- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **Joi** - Validation
- **Jest** - Testing

### Frontend
- **React** - UI library
- **TypeScript** - Programming language
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router** - Routing
- **TanStack Query** - Data fetching
- **Axios** - HTTP client

## 📁 Project Structure

```
rfp-management-system/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration
│   ├── prisma/             # Database schema
│   └── package.json
├── frontend/               # Frontend React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   └── lib/            # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env
```

Edit the `.env` file:
```env
DATABASE_URL="postgresql://1314:1314@localhost:5432/rfpdb?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
```

4. **Start PostgreSQL**
```bash
brew services start postgresql@14
```

5. **Create database and run migrations**
```bash
# Create database
createdb rfpdb

# Run migrations
npx prisma migrate dev --name init
```

6. **Start backend**
```bash
npm run dev
```

Backend will run at http://localhost:3001

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start frontend**
```bash
npm run dev
```

Frontend will run at http://localhost:5173

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Profile information
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Projects (Customer)
- `POST /api/projects` - Create project
- `GET /api/projects` - List projects
- `GET /api/projects/dashboard` - Dashboard data
- `GET /api/projects/:projectId` - Project details
- `PUT /api/projects/:projectId` - Update project
- `DELETE /api/projects/:projectId` - Delete project

### Products (Customer)
- `POST /api/projects/:projectId/products` - Create product
- `GET /api/projects/:projectId/products` - List products
- `GET /api/projects/:projectId/products/category` - Products by category
- `GET /api/projects/:projectId/products/:productId` - Product details
- `PUT /api/projects/:projectId/products/:productId` - Update product
- `DELETE /api/projects/:projectId/products/:productId` - Delete product

### RFPs (Customer)
- `POST /api/projects/:projectId/rfps` - Create RFP
- `GET /api/projects/:projectId/rfps` - List RFPs
- `GET /api/projects/:projectId/rfps/comparison` - RFP comparison
- `GET /api/projects/:projectId/rfps/:rfpId` - RFP details
- `PUT /api/projects/:projectId/rfps/:rfpId` - Update RFP
- `PUT /api/projects/:projectId/rfps/:rfpId/toggle` - Toggle RFP status
- `DELETE /api/projects/:projectId/rfps/:rfpId` - Delete RFP
- `GET /api/rfps/active` - Active RFPs (Public)

### Proposals (Supplier)
- `POST /api/proposals` - Create proposal
- `GET /api/proposals` - List proposals
- `GET /api/proposals/:proposalId` - Proposal details
- `PUT /api/proposals/:proposalId` - Update proposal
- `PUT /api/proposals/:proposalId/withdraw` - Withdraw proposal
- `GET /api/proposals/rfp/:rfpId` - Proposals for RFP
- `PUT /api/proposals/:proposalId/status` - Update proposal status

### Proposals (Customer)
- `GET /api/proposals/customer/:proposalId` - View proposal as customer
- `PUT /api/proposals/customer/:proposalId/status` - Accept/reject proposal

## 🎨 UI/UX Features

- **Modern Design**: Modern, clean interface with Shadcn UI and Tailwind CSS
- **Responsive**: Perfect appearance on all devices
- **Dark/Light Mode**: Theme switching based on user preference
- **Accessibility**: Compliant with accessibility standards
- **Loading States**: Loading indicators for better user experience
- **Error Handling**: Comprehensive error handling and user notifications

## 🔒 Security

- JWT token-based authentication
- Password hashing (bcrypt)
- Rate limiting
- CORS protection
- Helmet.js security middleware
- Input validation (Joi)
- SQL injection protection (Prisma)
- XSS protection

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 Development

```bash
# Backend development
cd backend
npm run dev

# Frontend development
cd frontend
npm run dev

# Database studio
cd backend
npm run studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

For questions about the project, please create an issue.

---

**Note**: This project is developed for educational purposes and additional security measures should be taken before using in production.

---

# RFP Yönetim Sistemi

Müşteri ve tedarikçi arasında RFP (Request for Proposal) süreçlerini yönetmek için geliştirilmiş tam kapsamlı bir fullstack uygulamadır.

## 🚀 Özellikler

### Müşteri Özellikleri
- ✅ Proje oluşturma ve yönetme
- ✅ Ürün kataloğu oluşturma (7 farklı kategori)
- ✅ RFP oluşturma ve yönetme
- ✅ RFP süreçlerini aktif/deaktif hale getirme
- ✅ Tedarikçilerden gelen teklifleri görüntüleme
- ✅ Proje bazında RFP karşılaştırma dashboard'u
- ✅ Kapsamlı dashboard ve raporlama

### Tedarikçi Özellikleri
- ✅ Aktif RFP'leri görüntüleme
- ✅ RFP'lere teklif verme
- ✅ Tekliflerini yönetme ve güncelleme
- ✅ Tekliflerini geri çekme
- ✅ Teklif durumu takibi

### Genel Özellikler
- ✅ JWT tabanlı kimlik doğrulama
- ✅ Rol tabanlı yetkilendirme
- ✅ Modern ve responsive tasarım
- ✅ Real-time bildirimler
- ✅ Kapsamlı validasyon
- ✅ Rate limiting ve güvenlik
- ✅ PostgreSQL veritabanı
- ✅ TypeScript desteği

## 🛠️ Teknolojiler

### Backend
- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **Joi** - Validation
- **Jest** - Testing

### Frontend
- **React** - UI library
- **TypeScript** - Programming language
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router** - Routing
- **TanStack Query** - Data fetching
- **Axios** - HTTP client

## 📁 Proje Yapısı

```
rfp-management-system/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration
│   ├── prisma/             # Database schema
│   └── package.json
├── frontend/               # Frontend React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   └── lib/            # Utility functions
│   └── package.json
└── README.md
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v18 veya üzeri)
- PostgreSQL (v13 veya üzeri)
- npm veya yarn

### Backend Kurulumu

1. **Backend klasörüne gidin**
```bash
cd backend
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın**
```bash
cp env.example .env
```

`.env` dosyasını düzenleyin:
```env
DATABASE_URL="postgresql://1314:1314@localhost:5432/rfpdb?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
```

4. **PostgreSQL'i başlatın**
```bash
brew services start postgresql@14
```

5. **Veritabanını oluşturun ve migration'ları çalıştırın**
```bash
# Veritabanı oluştur
createdb rfpdb

# Migration'ları çalıştır
npx prisma migrate dev --name init
```

6. **Backend'i başlatın**
```bash
npm run dev
```

Backend http://localhost:3001 adresinde çalışacak.

### Frontend Kurulumu

1. **Frontend klasörüne gidin**
```bash
cd frontend
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Frontend'i başlatın**
```bash
npm run dev
```

Frontend http://localhost:5173 adresinde çalışacak.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Giriş
- `GET /api/auth/profile` - Profil bilgileri
- `PUT /api/auth/profile` - Profil güncelleme
- `PUT /api/auth/change-password` - Şifre değiştirme

### Projects (Müşteri)
- `POST /api/projects` - Proje oluşturma
- `GET /api/projects` - Projeleri listeleme
- `GET /api/projects/dashboard` - Dashboard verileri
- `GET /api/projects/:projectId` - Proje detayı
- `PUT /api/projects/:projectId` - Proje güncelleme
- `DELETE /api/projects/:projectId` - Proje silme

### Products (Müşteri)
- `POST /api/projects/:projectId/products` - Ürün oluşturma
- `GET /api/projects/:projectId/products` - Ürünleri listeleme
- `GET /api/projects/:projectId/products/category` - Kategoriye göre ürünler
- `GET /api/projects/:projectId/products/:productId` - Ürün detayı
- `PUT /api/projects/:projectId/products/:productId` - Ürün güncelleme
- `DELETE /api/projects/:projectId/products/:productId` - Ürün silme

### RFPs (Müşteri)
- `POST /api/projects/:projectId/rfps` - RFP oluşturma
- `GET /api/projects/:projectId/rfps` - RFP'leri listeleme
- `GET /api/projects/:projectId/rfps/comparison` - RFP karşılaştırma
- `GET /api/projects/:projectId/rfps/:rfpId` - RFP detayı
- `PUT /api/projects/:projectId/rfps/:rfpId` - RFP güncelleme
- `PUT /api/projects/:projectId/rfps/:rfpId/toggle` - RFP durumu değiştirme
- `DELETE /api/projects/:projectId/rfps/:rfpId` - RFP silme
- `GET /api/rfps/active` - Aktif RFP'ler (Public)

### Proposals (Tedarikçi)
- `POST /api/proposals` - Teklif oluşturma
- `GET /api/proposals` - Teklifleri listeleme
- `GET /api/proposals/:proposalId` - Teklif detayı
- `PUT /api/proposals/:proposalId` - Teklif güncelleme
- `PUT /api/proposals/:proposalId/withdraw` - Teklif geri çekme
- `GET /api/proposals/rfp/:rfpId` - RFP'ye ait teklifler
- `PUT /api/proposals/:proposalId/status` - Teklif durumu güncelleme

### Proposals (Müşteri)
- `GET /api/proposals/customer/:proposalId` - Teklifi müşteri olarak görüntüleme
- `PUT /api/proposals/customer/:proposalId/status` - Teklifi kabul etme/reddetme

## 🎨 UI/UX Özellikleri

- **Modern Tasarım**: Shadcn UI ve Tailwind CSS ile modern, temiz arayüz
- **Responsive**: Tüm cihazlarda mükemmel görünüm
- **Dark/Light Mode**: Kullanıcı tercihine göre tema değişimi
- **Accessibility**: Erişilebilirlik standartlarına uygun
- **Loading States**: Kullanıcı deneyimi için loading göstergeleri
- **Error Handling**: Kapsamlı hata yönetimi ve kullanıcı bildirimleri

## 🔒 Güvenlik

- JWT token tabanlı kimlik doğrulama
- Şifre hash'leme (bcrypt)
- Rate limiting
- CORS koruması
- Helmet.js güvenlik middleware'i
- Input validation (Joi)
- SQL injection koruması (Prisma)
- XSS koruması

## 🧪 Test

```bash
# Backend testleri
cd backend
npm test

# Frontend testleri
cd frontend
npm test
```

## 📝 Geliştirme

```bash
# Backend development
cd backend
npm run dev

# Frontend development
cd frontend
npm run dev

# Database studio
cd backend
npm run studio
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje hakkında sorularınız için issue oluşturabilirsiniz.

---

**Not**: Bu proje eğitim amaçlı geliştirilmiştir ve production ortamında kullanılmadan önce ek güvenlik önlemleri alınmalıdır.