# Inbound Carrier Sales Automation POC

## Overview

This proof of concept demonstrates an automated inbound carrier sales system for freight brokerages. The system handles carrier calls, verifies MC numbers, matches loads, tracks negotiations, and provides comprehensive analytics.

**Live Demo:**
- **Frontend**: [https://freight.angeloyo.com](https://freight.angeloyo.com)
- **Backend API**: [https://api.freight.angeloyo.com](https://api.freight.angeloyo.com)

---

## Architecture

### Backend (Python FastAPI)
- **Framework**: FastAPI with PostgreSQL
- **Authentication**: API key based security
- **Deployment**: Railway
- **Key Features**:
  - FMCSA API integration for MC number verification
  - Allow search for loads
  - Call logging with sentiment analysis
  - Booking tracking and metrics

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with App Router
- **UI**: TailwindCSS + ShadCN/UI Components
- **Deployment**: Vercel
- **Key Features**:
  - Dashboard with key metrics
    - Call Sentiment
    - Success Rate
    - Load Booking Rate
    - Rate Negotiation
  - Load management interface

<img width="1847" height="1513" alt="freight-arch" src="https://github.com/user-attachments/assets/dfe2c647-d468-4634-a4bb-5ac63acbf085" />

---

## Quick Start

### Local Deployment with Docker

The easiest way to run the complete application locally is using Docker Compose:

#### Prerequisites
- Docker and Docker Compose
- FMCSA API key

#### Setup
1. **Clone the repository and create environment file:**
```bash
cp .env.example .env
# Edit .env with your API keys:
# FMCSA_API_KEY=your_fmcsa_api_key
# PROJECT_API_KEY=your_secure_api_key
```

2. **Run the complete stack:**
```bash
docker-compose up --build -d
```

3. **Access the application:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000

#### What this includes:
- PostgreSQL database (pre-populated with demo data)
- FastAPI backend with all endpoints
- Next.js frontend with dashboard

#### Useful commands:
```bash
# Run in background
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Reset with fresh data
docker-compose down -v && docker-compose up --build
```


---

## API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `POST /loads` - Create new load
- `GET /loads` - Retrieve all loads
- `GET /loads/search` - Search loads by criteria
- `DELETE /loads/{load_id}` - Delete load

### Carrier Management
- `GET /verify-mc?mc_number={number}` - Verify MC number via FMCSA
- `POST /call-logs` - Log carrier calls
- `GET /call-logs-full` - Get calls with load details

### Authentication
All endpoints require `X-API-Key` header with valid API key.


---

## Production Deployment

### Backend Deployment (Railway)

1. **Create Railway Project:**
   - Connect GitHub repository to Railway
   - Set **Root Directory** to `backend` in project settings

2. **Configure Domain:**
   - Set up custom domain (e.g., `api.freight.angeloyo.com`)

3. **Environment Variables:**
   Add the following variables in Railway dashboard:
   ```
   FMCSA_API_KEY=your_fmcsa_api_key
   PROJECT_API_KEY=your_secure_api_key
   ```

4. **PostgreSQL Setup:**
   - Add PostgreSQL service to Railway project
   - Copy database variables from PostgreSQL service to API service:
     - `DB_HOST` ← `PGHOST`
     - `DB_NAME` ← `PGDATABASE`
     - `DB_PASSWORD` ← `PGPASSWORD`
     - `DB_PORT` ← `PGPORT`
     - `DB_USER` ← `PGUSER`

5. **Database Schema:**
   ```bash
   # Connect to Railway database using provided connection command
   PGPASSWORD=xxx psql -h xxx.proxy.rlwy.net -U postgres -p xxxxx -d railway

   # Create tables
   \i backend/db/schema.sql
   ```

### Frontend Deployment (Vercel)

1. **Create Vercel Project:**
   - Connect GitHub repository to Vercel
   - Set **Root Directory** to `frontend`

2. **Environment Variables:**
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://api.freight.angeloyo.com
   ```

3. **Redeploy:**
   - Trigger redeploy after adding environment variables
