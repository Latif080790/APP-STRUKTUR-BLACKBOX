#!/bin/bash

# Deployment script untuk Structural Analysis System
# Script untuk deploy aplikasi ke production

set -e

echo "🚀 Starting deployment of Structural Analysis System..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is required but not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is required but not installed"
        exit 1
    fi
    
    log_success "Prerequisites checked"
}

# Environment setup
setup_environment() {
    log_info "Setting up environment..."
    
    if [ ! -f .env.production ]; then
        log_warning "Creating default .env.production file"
        cat > .env.production << EOF
NODE_ENV=production
DB_PASSWORD=secure_password_change_me
JWT_SECRET=super-secure-jwt-secret-change-me
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com
FRONTEND_PORT=3000
EOF
        log_warning "Please update .env.production with your actual values"
    fi
    
    log_success "Environment setup complete"
}

# Build applications
build_applications() {
    log_info "Building applications..."
    
    # Build frontend
    log_info "Building frontend..."
    npm run build
    
    # Build backend
    log_info "Building backend..."
    cd backend && npm run build && cd ..
    
    log_success "Applications built successfully"
}

# Deploy with Docker
deploy_docker() {
    log_info "Deploying with Docker Compose..."
    
    # Stop existing containers
    log_info "Stopping existing containers..."
    docker-compose --env-file .env.production down
    
    # Remove old images
    log_info "Cleaning up old images..."
    docker image prune -f
    
    # Build and start new containers
    log_info "Building and starting containers..."
    docker-compose --env-file .env.production up -d --build
    
    log_success "Docker deployment complete"
}

# Health check
health_check() {
    log_info "Performing health checks..."
    
    # Wait for services to start
    sleep 30
    
    # Check backend health
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        log_success "Backend health check passed"
    else
        log_error "Backend health check failed"
        exit 1
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_success "Frontend health check passed"
    else
        log_error "Frontend health check failed"
        exit 1
    fi
    
    log_success "All health checks passed"
}

# Show deployment info
show_deployment_info() {
    log_success "🎉 Deployment completed successfully!"
    echo
    echo "📊 Application URLs:"
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:3001"
    echo "Health Check: http://localhost:3001/health"
    echo
    echo "🐳 Docker containers:"
    docker-compose ps
    echo
    echo "📋 Useful commands:"
    echo "- View logs: docker-compose logs -f"
    echo "- Stop services: docker-compose down"
    echo "- Restart services: docker-compose restart"
    echo "- Update services: ./deploy.sh"
    echo
}

# Rollback function
rollback() {
    log_warning "Rolling back deployment..."
    docker-compose down
    # Restore from backup if available
    log_info "Rollback completed"
}

# Main deployment flow
main() {
    case "${1:-deploy}" in
        "deploy")
            check_prerequisites
            setup_environment
            build_applications
            deploy_docker
            health_check
            show_deployment_info
            ;;
        "rollback")
            rollback
            ;;
        "health")
            health_check
            ;;
        "logs")
            docker-compose logs -f
            ;;
        "stop")
            docker-compose down
            log_success "Services stopped"
            ;;
        "restart")
            docker-compose restart
            log_success "Services restarted"
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|health|logs|stop|restart}"
            echo "  deploy   - Full deployment (default)"
            echo "  rollback - Rollback deployment"
            echo "  health   - Health check"
            echo "  logs     - View logs"
            echo "  stop     - Stop services"
            echo "  restart  - Restart services"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"