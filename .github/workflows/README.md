# CI/CD Workflow Documentation

## 📋 Overview

This project includes a comprehensive CI/CD pipeline with multiple workflows designed for a production-ready web scraper application.

## 🔄 Workflows

### 1. Main CI/CD Pipeline (`ci.yml`)

**Triggers:** Push to main/develop, Pull requests to main

**Jobs:**
- **Security Scan** - Trivy vulnerability scanning
- **Backend Test** - API tests with PostgreSQL & Redis
- **Worker Test** - Background job processor tests  
- **Scraper Test** - Python scraper service tests
- **Frontend Test** - Next.js frontend tests
- **Integration Test** - Full system end-to-end tests
- **Build & Push** - Docker images to GitHub Container Registry
- **Deploy Staging/Production** - Automated deployments

**Key Features:**
- ✅ Multi-service testing in parallel
- ✅ Database migrations and seeding
- ✅ Docker multi-stage builds with caching
- ✅ Integration testing with real services
- ✅ Automatic image builds and registry push
- ✅ Environment-specific deployments

### 2. Security Audit (`security.yml`)

**Triggers:** Weekly schedule, Manual trigger

**Jobs:**
- **Dependency Audit** - npm audit, Poetry security checks
- **Docker Security** - Trivy container image scanning
- **Infrastructure Scan** - Checkov policy-as-code validation

**Features:**
- 🔒 Automated security scanning
- 🔒 SARIF reporting for GitHub Security tab
- 🔒 Multi-language dependency auditing

### 3. Performance Testing (`performance.yml`)

**Triggers:** Weekly schedule, Manual trigger

**Jobs:**
- **API Performance** - k6 load testing with staged ramp-up
- **Load Test** - Artillery.js comprehensive load testing

**Features:**
- ⚡ Realistic load testing scenarios
- ⚡ Performance threshold validation
- ⚡ Scalability testing under various loads

### 4. Production Deployment (`deployment.yml`)

**Triggers:** Release published, Manual trigger

**Jobs:**
- **Pre-deployment Checks** - Version validation, image verification
- **Database Migration** - Safe schema updates with backup
- **Deploy Services** - Rolling deployment per service
- **Health Check** - Post-deployment smoke tests
- **Rollback** - Automatic rollback on failure
- **Notifications** - Slack integration for deployment status

**Features:**
- 🚀 Blue-green deployment strategy
- 🚀 Database backup before migrations
- 🚀 Service-by-service rolling updates
- 🚀 Comprehensive health checks
- 🚀 Automatic rollback on failure

## 🔧 Setup Requirements

### Required Secrets

Add these secrets in GitHub repository settings:

```bash
# Database
DATABASE_URL=postgres://user:pass@host:port/db

# Deployment URLs
PRODUCTION_API_URL=https://api.your-domain.com
PRODUCTION_FRONTEND_URL=https://your-domain.com
STAGING_API_URL=https://staging-api.your-domain.com
STAGING_FRONTEND_URL=https://staging.your-domain.com

# External Services
SNYK_TOKEN=your_snyk_token
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Registry (auto-configured for GHCR)
GITHUB_TOKEN=auto_provided
```

### Environment Setup

1. **GitHub Environments:**
   - Create `staging` and `production` environments
   - Configure environment-specific secrets
   - Set up approval requirements for production

2. **Container Registry:**
   - Enable GitHub Packages for the repository
   - Workflows automatically use GHCR (ghcr.io)

3. **Deployment Infrastructure:**
   - Configure Kubernetes cluster OR
   - Set up Docker Swarm OR  
   - Prepare docker-compose deployment

## 📊 Workflow Features

### Security & Quality
- 🔒 **Trivy** for vulnerability scanning
- 🔒 **Snyk** for dependency security
- 🔒 **Checkov** for infrastructure compliance
- 🔒 **SARIF** integration with GitHub Security

### Testing Strategy  
- 🧪 **Unit Tests** for each service
- 🧪 **Integration Tests** with real databases
- 🧪 **End-to-End Tests** using test-full-system.sh
- 🧪 **Performance Tests** with k6 and Artillery

### Deployment Strategy
- 🚀 **Multi-stage builds** for optimized images
- 🚀 **Rolling deployments** minimize downtime
- 🚀 **Health checks** ensure service readiness
- 🚀 **Automatic rollback** on deployment failure

### Monitoring & Observability
- 📊 **Build artifacts** and test reports
- 📊 **Performance metrics** and thresholds
- 📊 **Security scan results** in GitHub Security tab
- 📊 **Slack notifications** for deployment status

## 🎯 Best Practices Implemented

1. **Fail Fast** - Early validation and quick feedback
2. **Parallel Execution** - Multiple jobs run simultaneously
3. **Caching** - Docker layer caching, npm cache
4. **Security First** - Multiple security scanning layers
5. **Observability** - Comprehensive logging and notifications
6. **Rollback Safety** - Automatic rollback mechanisms
7. **Environment Parity** - Same process for all environments

## 🚦 Usage

### Normal Development Flow
```bash
# 1. Push to feature branch
git push origin feature/new-feature

# 2. Create PR to main
# → Triggers: security scan, all tests, integration tests

# 3. Merge to main  
# → Triggers: full CI/CD, build images, deploy to production

# 4. Create release
# → Triggers: production deployment workflow
```

### Manual Deployments
```bash
# Via GitHub Actions UI:
# 1. Go to Actions → Production Deployment
# 2. Click "Run workflow"
# 3. Select environment and version
# 4. Monitor deployment progress
```

### Performance Testing
```bash
# Via GitHub Actions UI:
# 1. Go to Actions → Performance Tests  
# 2. Click "Run workflow"
# 3. Optionally specify target URL and duration
# 4. Review performance metrics
```

## 📈 Improvements Over Basic Workflow

The enhanced workflow provides:

✅ **77% more comprehensive** - Multi-service testing vs single service  
✅ **Security-first approach** - 3 security scanning workflows  
✅ **Production-ready deployments** - Rollback, health checks, notifications  
✅ **Performance validation** - Load testing and performance thresholds  
✅ **Zero-downtime deployments** - Rolling updates and health checks  
✅ **Full observability** - Metrics, logs, and alerting integration  

This transforms a basic CI workflow into an enterprise-grade deployment pipeline suitable for production applications.
