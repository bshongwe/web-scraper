# Fullstack Web Scraper — Complete Runnable Starter Repo

This is a complete fullstack web scraper application that includes **everything**: Backend (TypeScript + Express + Prisma), Worker (BullMQ), Scraper (Python + Playwright), Frontend (Next.js), `docker-compose.yml`, and CI skeleton. The setup is opinionated but practical for local development and can be hardened for production.

## Features

- **Backend API**: TypeScript + Express + Prisma with JWT authentication
- **Worker Service**: Bull queue processing for async scraping jobs
- **Scraper Service**: Python + Playwright for web scraping with FastAPI
- **Frontend**: Next.js React application with simple UI
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: Redis for job queuing
- **Docker**: Complete containerization with docker-compose
- **CI/CD**: Complete GitHub Actions pipeline with security scanning, testing, and deployments

## Quickstart

1. Clone this repository
2. Copy `.env.example` files into actual `.env` files where indicated and fill secrets:
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your values
   ```
3. Run the complete stack:
   ```bash
   docker compose up --build
   ```
4. Access the applications:
   - Frontend: http://localhost:3000
   - API: http://localhost:4000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

## Project Structure

```
web-scraper/
├─ backend/                 # TypeScript Express API
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ prisma/
│  │  └─ schema.prisma     # Database schema
│  ├─ src/
│  │  ├─ index.ts          # Entry point
│  │  ├─ app.ts            # Express app setup
│  │  ├─ routes/
│  │  │  ├─ auth.ts        # Authentication routes
│  │  │  └─ jobs.ts        # Job scheduling routes
│  │  ├─ auth/
│  │  │  └─ jwt.ts         # JWT utilities
│  │  └─ db.ts             # Prisma client
│  └─ .env.example

├─ worker/                  # Bull queue worker
│  ├─ Dockerfile
│  ├─ package.json
│  └─ src/
│     └─ worker.ts         # Worker process

├─ scraper/                 # Python Playwright scraper
│  ├─ Dockerfile
│  ├─ pyproject.toml
│  └─ src/
│     └─ main.py           # FastAPI scraper service

├─ frontend/                # Next.js React frontend
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ next.config.js
│  └─ pages/
│     └─ index.tsx         # Main page

├─ docker-compose.yml      # Complete stack orchestration
├─ .github/workflows/      # Complete CI/CD pipeline
│  ├─ ci.yml              # Main CI/CD workflow
│  ├─ security.yml        # Security auditing
│  ├─ performance.yml     # Performance testing
│  ├─ deployment.yml      # Production deployment
│  └─ README.md           # Workflow documentation
└─ README.md
```

## Development

### Local Development Without Docker

1. **Start PostgreSQL and Redis:**
   ```bash
   # Using Homebrew (macOS)
   brew services start postgresql
   brew services start redis

   # Or using Docker
   docker run -d --name postgres -p 5432:5432 -e POSTGRES_USER=app -e POSTGRES_PASSWORD=password -e POSTGRES_DB=scraper postgres:15
   docker run -d --name redis -p 6379:6379 redis:7
   ```

2. **Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with local database URL
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

3. **Worker:**
   ```bash
   cd worker
   npm install
   npm run dev
   ```

4. **Scraper:**
   ```bash
   cd scraper
   pip install poetry
   poetry install
   python -m playwright install
   python src/main.py
   ```

5. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/jobs/schedule` - Schedule scraping job
- `GET /api/jobs/results` - Get scraping results

### Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```env
DATABASE_URL=postgres://app:password@localhost:5432/scraper
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
FRONTEND_ORIGIN=http://localhost:3000
```

## Production Deployment

### Security Checklist

- [ ] Replace dev secrets with production secrets from a secrets manager
- [ ] Enable TLS with proper certificates (Let's Encrypt recommended)
- [ ] Set `secure: true` on cookies and enable proper SameSite policies
- [ ] Configure Content Security Policy (CSP) headers
- [ ] Implement refresh token rotation and revocation
- [ ] Add structured logging and audit trails
- [ ] Set up monitoring with Prometheus + Grafana
- [ ] Configure alerts for worker failures and queue lag
- [ ] Implement rate limiting per user/IP
- [ ] Add input validation and sanitization
- [ ] Configure proper CORS policies
- [ ] Set up database connection pooling
- [ ] Implement graceful shutdown handling

### Docker Production Build

```bash
# Build production images
docker compose -f docker-compose.prod.yml build

# Run in production mode
docker compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Architecture Notes

### Data Flow

1. User submits URL via frontend
2. Frontend calls backend API to schedule job
3. Backend adds job to Redis queue
4. Worker picks up job from queue
5. Worker calls scraper service via HTTP
6. Scraper uses Playwright to fetch content
7. Worker saves results to PostgreSQL
8. Frontend can retrieve results via API

### Technology Choices

- **TypeScript**: Type safety for backend and frontend
- **Express**: Lightweight, flexible web framework
- **Prisma**: Type-safe database ORM with migrations
- **Bull**: Robust job queue with Redis
- **Playwright**: Modern web scraping with full browser support
- **FastAPI**: High-performance Python web framework
- **Next.js**: React with SSR/SSG capabilities
- **PostgreSQL**: Reliable relational database
- **Redis**: High-performance in-memory store for queues

### Scaling Considerations

- **Horizontal scaling**: Add more worker instances
- **Database**: Consider read replicas and connection pooling
- **Queue**: Redis Cluster for high availability
- **Caching**: Add Redis caching layer for API responses
- **Load balancing**: Use nginx or cloud load balancer
- **Storage**: Consider object storage for large scraped content

## Troubleshooting

### Common Issues

1. **Permission denied on Playwright**: Run `playwright install` in scraper container
2. **Database connection failed**: Check PostgreSQL is running and credentials are correct
3. **Worker not processing jobs**: Verify Redis connection and queue configuration
4. **CORS errors**: Check FRONTEND_ORIGIN environment variable

### Logs

View logs for specific services:
```bash
docker compose logs api
docker compose logs worker
docker compose logs scraper
docker compose logs frontend
```
