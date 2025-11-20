# Database Structure Analysis

## 📊 Current Database Schema

The web scraper uses **PostgreSQL** with **Prisma ORM** for type-safe database operations. Here's the complete structure:

### 🏗️ **Database Tables**

#### 1. **Users Table**
```sql
CREATE TABLE "User" (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  role       TEXT DEFAULT 'user',
  createdAt  TIMESTAMP DEFAULT NOW()
);
```

**Purpose**: Stores user accounts for authentication
- `id`: Primary key using CUID (collision-resistant unique identifier)
- `email`: Unique user identifier for login
- `password`: Bcrypt hashed password
- `role`: User role (default: 'user', could be 'admin', 'premium', etc.)
- `createdAt`: Account creation timestamp

#### 2. **Sessions Table**
```sql
CREATE TABLE "Session" (
  id        TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  userId    TEXT REFERENCES "User"(id),
  token     TEXT UNIQUE NOT NULL,
  revoked   BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

**Purpose**: JWT session management and token revocation
- `id`: Primary key
- `userId`: Foreign key to User table
- `token`: JWT refresh token (unique)
- `revoked`: Flag to invalidate sessions
- `createdAt`: Session creation time

#### 3. **ScrapeResult Table**
```sql
CREATE TABLE "ScrapeResult" (
  id        TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  url       TEXT NOT NULL,
  content   TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

**Purpose**: Stores scraped web content
- `id`: Primary key
- `url`: The scraped website URL
- `content`: Full HTML content (stored as TEXT for large content)
- `createdAt`: When the scrape was completed

### 🔗 **Relationships**

```
User (1) ←→ (many) Session
    ↑
    └── One user can have multiple active sessions
    
ScrapeResult (standalone)
    └── No direct user relationship (could be extended)
```

### 📈 **Potential Improvements & Extensions**

Here are some database enhancements you might consider:

#### 1. **Link ScrapeResults to Users**
```prisma
model ScrapeResult {
  id        String   @id @default(cuid())
  url       String
  content   String   @db.Text
  createdAt DateTime @default(now())
  
  // New fields
  userId    String?  // Optional: allow anonymous scraping
  user      User?    @relation(fields: [userId], references: [id])
  status    String   @default("completed") // pending, completed, failed
  metadata  Json?    // Store additional scrape info
}

model User {
  // ... existing fields
  scrapeResults ScrapeResult[]
}
```

#### 2. **Add Job Tracking**
```prisma
model ScrapeJob {
  id          String   @id @default(cuid())
  url         String
  status      String   // pending, processing, completed, failed
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  result      ScrapeResult? @relation(fields: [resultId], references: [id])
  resultId    String?
  error       String?
  createdAt   DateTime @default(now())
  completedAt DateTime?
}
```

#### 3. **Add Rate Limiting & Usage Tracking**
```prisma
model UserUsage {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  dailyCount  Int      @default(0)
  monthlyCount Int     @default(0)
  lastReset   DateTime @default(now())
}
```

### 🛠️ **Database Management Commands**

You can explore and manage the database using these commands:

```bash
# Navigate to backend directory
cd backend

# Generate Prisma client (required after schema changes)
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name add_new_feature

# View database in Prisma Studio (Visual Database Browser)
npx prisma studio

# Reset database (development only - DESTRUCTIVE!)
npx prisma migrate reset

# Seed database with sample data
npx prisma db seed

# Explore current database content
npm run db:explore

# Connect to database directly (if PostgreSQL client installed)
psql postgres://app:password@localhost:5432/scraper
```

### 🔍 **Database Exploration Tools**

#### 1. **Prisma Studio** (Recommended)
```bash
cd backend && npx prisma studio
```
- Visual interface at http://localhost:5555
- Browse, edit, and manage data
- No SQL knowledge required

#### 2. **Custom Explorer Script**
```bash
cd backend && npm run db:explore
```
- Shows record counts, recent entries, and statistics
- Great for quick database overview

#### 3. **Direct SQL Queries**
Use the queries in `database_queries.sql` for detailed analysis:
```bash
# Copy queries from database_queries.sql and run in psql or Prisma Studio
psql postgres://app:password@localhost:5432/scraper -f ../database_queries.sql
```

### 📊 **Sample Data Structure**

After running `npm run prisma:seed`, you'll have:

**Users:**
- `admin@example.com` (role: admin)  
- `user@example.com` (role: user)
- Both with password: `password123`

**Scrape Results:**
- Example.com sample page
- HTTPBin HTML test page  
- JSONPlaceholder API homepage

**Sessions:**
- No initial sessions (created when users log in)
