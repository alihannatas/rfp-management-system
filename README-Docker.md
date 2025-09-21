# RFP Management System - Docker Setup

Bu proje Docker Compose ile kolayca ayağa kaldırılabilir. Tüm servisler (PostgreSQL, Backend API, Frontend) tek komutla çalışır.

## 🚀 Hızlı Başlangıç

### 1. Otomatik Kurulum (Önerilen)

```bash
# Kurulum scriptini çalıştır
./scripts/setup.sh
```

### 2. Manuel Kurulum

```bash
# 1. SSL sertifikalarını oluştur
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/ssl/key.pem \
    -out nginx/ssl/cert.pem \
    -subj "/C=TR/ST=Istanbul/L=Istanbul/O=RFP Management/CN=localhost"

# 2. Environment dosyalarını kopyala
cp docker.env backend/.env
echo "VITE_API_URL=http://localhost:3001/api" > frontend/.env

# 3. Servisleri başlat
docker-compose up --build -d

# 4. Veritabanı migration'larını çalıştır
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma generate
```

## 📋 Servisler

| Servis | Port | Açıklama |
|--------|------|----------|
| Frontend | 3000 | React uygulaması |
| Backend API | 3001 | Node.js API |
| PostgreSQL | 5432 | Veritabanı |
| Nginx | 80/443 | Reverse proxy |

## 🛠️ Komutlar

### Temel Komutlar

```bash
# Servisleri başlat
docker-compose up -d

# Servisleri durdur
docker-compose down

# Logları görüntüle
docker-compose logs -f

# Belirli servisin loglarını görüntüle
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Geliştirme Komutları

```bash
# Development modunda çalıştır
docker-compose -f docker-compose.dev.yml up -d

# Servisleri yeniden başlat
docker-compose restart

# Belirli servisi yeniden başlat
docker-compose restart backend
```

### Veritabanı Komutları

```bash
# Veritabanına bağlan
docker-compose exec postgres psql -U rfp_user -d rfp_management

# Migration çalıştır
docker-compose exec backend npx prisma migrate dev

# Prisma Studio aç
docker-compose exec backend npx prisma studio
```

## 🔧 Konfigürasyon

### Environment Variables

Backend için `backend/.env`:
```env
DATABASE_URL="postgresql://rfp_user:rfp_password@postgres:5432/rfp_management?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3001
NODE_ENV="production"
```

Frontend için `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

### Veritabanı

- **Host**: localhost
- **Port**: 5432
- **Database**: rfp_management
- **Username**: rfp_user
- **Password**: rfp_password

## 🌐 Erişim

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health
- **Prisma Studio**: `docker-compose exec backend npx prisma studio`

## 🐛 Sorun Giderme

### Servisler Başlamıyor

```bash
# Tüm servisleri durdur ve temizle
docker-compose down -v
docker system prune -f

# Tekrar başlat
docker-compose up --build -d
```

### Veritabanı Bağlantı Hatası

```bash
# PostgreSQL loglarını kontrol et
docker-compose logs postgres

# Veritabanı durumunu kontrol et
docker-compose exec postgres pg_isready -U rfp_user -d rfp_management
```

### Port Çakışması

Eğer portlar kullanımdaysa, `docker-compose.yml` dosyasındaki port numaralarını değiştirin:

```yaml
ports:
  - "3001:3001"  # Backend
  - "3000:80"    # Frontend
  - "5432:5432"  # PostgreSQL
```

## 📁 Dosya Yapısı

```
rfp-management-system/
├── docker-compose.yml          # Production Docker Compose
├── docker-compose.dev.yml      # Development Docker Compose
├── docker.env                  # Environment variables template
├── .dockerignore              # Docker ignore file
├── scripts/
│   └── setup.sh               # Setup script
├── nginx/
│   └── nginx.conf             # Nginx configuration
├── backend/
│   ├── Dockerfile             # Backend production image
│   ├── Dockerfile.dev         # Backend development image
│   └── prisma/
│       └── init.sql           # Database initialization
└── frontend/
    ├── Dockerfile             # Frontend production image
    ├── Dockerfile.dev         # Frontend development image
    └── nginx.conf             # Frontend nginx config
```

## 🔒 Güvenlik

### Production için Önemli Notlar

1. **JWT Secret**: `docker.env` dosyasındaki `JWT_SECRET`'ı güçlü bir değerle değiştirin
2. **Database Password**: `rfp_password`'ı güçlü bir şifreyle değiştirin
3. **SSL Certificates**: Production için gerçek SSL sertifikaları kullanın
4. **Environment Variables**: Hassas bilgileri environment variables olarak geçin

### SSL Sertifikaları

Development için self-signed sertifikalar otomatik oluşturulur. Production için:

```bash
# Let's Encrypt ile SSL sertifikası al
certbot certonly --standalone -d yourdomain.com

# Sertifikaları nginx/ssl/ klasörüne kopyala
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
```

## 📊 Monitoring

### Health Checks

```bash
# Tüm servislerin durumunu kontrol et
docker-compose ps

# Health check sonuçlarını görüntüle
docker-compose exec backend curl -f http://localhost:3001/health
```

### Logs

```bash
# Tüm logları takip et
docker-compose logs -f

# Belirli servisin loglarını filtrele
docker-compose logs -f backend | grep ERROR
```

## 🚀 Deployment

### Production Deployment

1. Environment variables'ları production değerleriyle güncelleyin
2. SSL sertifikalarını gerçek sertifikalarla değiştirin
3. Docker Compose ile deploy edin:

```bash
docker-compose -f docker-compose.yml up -d
```

### Scaling

```bash
# Backend servisini scale et
docker-compose up -d --scale backend=3

# Nginx load balancer ile çalışır
```

Bu Docker setup ile RFP Management System'i kolayca ayağa kaldırabilir ve yönetebilirsiniz! 🎉


