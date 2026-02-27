<p align="center">
  <a href="https://fooz-gaming.com" target="blank"><img src="https://fooz-gaming.com/logo.png" width="200" alt="Fooz Gaming Logo" /></a>
</p>

<h1 align="center">Fooz Gaming Backend API</h1>

<p align="center">
  Modern GraphQL API built with <a href="https://nestjs.com/" target="blank">NestJS</a>, 
  <a href="https://www.apollographql.com/docs/apollo-server/" target="blank">Apollo Server</a>, 
  and <a href="https://www.prisma.io/" target="blank">Prisma ORM</a>
</p>

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)

## ✨ Features

- **GraphQL API** - Built with Apollo Server for flexible data querying
- **Type-Safe** - Full TypeScript support with strict type checking
- **Database** - PostgreSQL with Prisma ORM and automatic migrations
- **Authentication** - JWT-based auth with Passport.js
- **Authorization** - Role-based access control (RBAC)
- **Security** - Helmet, CORS, request validation, rate limiting
- **File Uploads** - Multer integration for media management
- **Error Handling** - Comprehensive error handling and logging
- **Testing** - Jest unit and e2e testing setup
- **Code Quality** - ESLint, Prettier, and TypeScript strict mode

## 🔧 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 12

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/fooz-gaming/backend.git
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration
```

## ⚙️ Configuration

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/fooz_db?schema=public

# API
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000

# JWT
JWT_SECRET=your-secret-key-here

# Admin
ADMIN_EMAIL=admin@fooz.com
ADMIN_DEFAULT_PASSWORD=SecurePassword123!

# Telegram (Optional)
TELEGRAM_BOT_TOKEN=your-token
GROUP_CHAT_ID=-1234567890
```

## 🚀 Running the Application

```bash
# Development with watch mode
npm run start:dev

# Production
npm run build
npm run start:prod

# Prisma Studio (Database UI)
npm run db:studio
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Code coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## 📝 Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## 📚 Database Management

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes to database
npm run db:push

# Run database seed
npm run db:seed

# Add admin user
npm run db:admin

# Sync media files
npm run db:media

# Reset database (caution: deletes all data)
npm run db:reset
```

## 🔒 Security

This project implements industry-standard security practices:

- **Helmet**: Secure HTTP headers
- **CORS**: Configured for production domains
- **Input Validation**: Global validation pipes with class-validator
- **Rate Limiting**: Throttle decorator for API endpoints
- **JWT Auth**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **HTTPS**: Enforced in production
- **CSP**: Content Security Policy headers
- **HSTS**: HTTP Strict Transport Security

## 📛 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NODE_ENV` | ❌ | development or production |
| `PORT` | ❌ | Server port (default: 3000) |
| `APP_URL` | ❌ | Application URL |
| `JWT_SECRET` | ✅ | Secret for JWT signing |
| `ADMIN_EMAIL` | ❌ | Default admin email |
| `ADMIN_DEFAULT_PASSWORD` | ❌ | Default admin password |
| `TELEGRAM_BOT_TOKEN` | ❌ | Telegram bot token |
| `GROUP_CHAT_ID` | ❌ | Telegram group chat ID |

## 🏗️ Project Structure

```
src/
├── auth/               # Authentication & Authorization
├── accessories/        # Accessories module
├── banners/           # Banners management
├── categories/        # Product categories
├── colors/            # Color management
├── coupons/           # Discount coupons
├── faq/               # FAQ module
├── media/             # File upload & media
├── notifications/     # Telegram notifications
├── order/             # Orders management
├── prisma/            # Database service
├── products/          # Products module
├── app.module.ts      # Root module
└── main.ts            # Entry point
```

## 📖 Documentation

- [NestJS Docs](https://docs.nestjs.com)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server)
- [Prisma Docs](https://www.prisma.io/docs)
- [GraphQL Best Practices](https://graphql.org/learn)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is private and licensed under UNLICENSED.

## 👥 Support

For support, email support@fooz-gaming.com or open an issue on GitHub.

---

Made with ❤️ by Fooz Gaming Team

