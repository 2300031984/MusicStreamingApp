# Docker Setup Instructions

This guide will help you build and run the Music Streaming Application using Docker.

## Prerequisites

- Docker Desktop installed and running
- At least 4GB of available RAM
- Ports 3000, 3306, and 8084 available

## Quick Start

### 1. Build and Start All Services

```bash
# From the project root directory
docker-compose up -d --build
```

This will:
- Build the frontend and backend images
- Start MySQL database
- Start the backend service
- Start the frontend service

### 2. Check Service Status

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8085 (external port, internal is 8084)
- **MySQL**: localhost:3307 (external port, internal is 3306)

### 4. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data)
docker-compose down -v
```

## Building Individual Images

### Build Backend Only

```bash
cd MusicBackend-main/MusicBackend-main
docker build -t music-backend:latest .
```

### Build Frontend Only

```bash
cd TuneUp-frontEnd-main/TuneUp-frontEnd-main
docker build -t music-frontend:latest --build-arg VITE_BASE_API_URL=http://localhost:8084 .
```

## Environment Variables

### Backend Environment Variables

You can override these in `docker-compose.yml`:

- `SPRING_DATASOURCE_URL`: Database connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `SERVER_PORT`: Backend server port (default: 8084)

### Frontend Build Arguments

- `VITE_BASE_API_URL`: Backend API URL (default: http://localhost:8084)

## Troubleshooting

### Database Connection Issues

If the backend can't connect to MySQL:

1. Check if MySQL is healthy:
   ```bash
   docker-compose ps mysql
   ```

2. Wait for MySQL to be ready (can take 30-60 seconds on first start)

3. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

### Port Already in Use

If ports are already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "3001:80"  # Change frontend port
  - "8085:8084"  # Change backend port
  - "3307:3306"  # Change MySQL port
```

### Rebuild After Code Changes

```bash
# Rebuild and restart specific service
docker-compose up -d --build backend

# Rebuild everything
docker-compose up -d --build
```

### View Database

```bash
# Connect to MySQL container
docker-compose exec mysql mysql -u root -p

# Password: Saivarun@123
```

## Production Deployment

For production, consider:

1. Using environment-specific configuration files
2. Setting up proper secrets management
3. Using a reverse proxy (nginx/traefik)
4. Enabling HTTPS
5. Setting up proper database backups
6. Using Docker secrets for sensitive data

## Clean Up

```bash
# Remove all containers, networks, and volumes
docker-compose down -v

# Remove images
docker rmi music-backend music-frontend

# Full cleanup (be careful!)
docker system prune -a --volumes
```

