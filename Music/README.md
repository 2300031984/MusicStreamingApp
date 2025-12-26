# MusicStreamingApp - Full Stack Deployment Guide

A complete music streaming application with React frontend and Spring Boot backend. This guide covers local development, Docker containerization, and Kubernetes deployment with Ansible automation.

## Project Structure

```
Music/
 MusicBackend-main/           # Spring Boot Backend
    MusicBackend-main/
        pom.xml
        src/
        mvnw.cmd
 TuneUp-frontEnd-main/        # React/Vite Frontend
     TuneUp-frontEnd-main/
         package.json
         vite.config.js
         Dockerfile
         src/
```

---

## Part 1: Local Development Setup

### Prerequisites

- **Backend**: Java 17+, Maven (or use mvnw wrapper)
- **Frontend**: Node.js 18+, npm
- **Docker**: Docker Desktop (for containerization)
- **Kubernetes**: kubectl, Kubernetes cluster (local minikube or remote)
- **Ansible**: For automation (Python 3.8+)

### Running Frontend Locally

```bash
cd TuneUp-frontEnd-main/TuneUp-frontEnd-main

# Install dependencies
npm install

# Start development server (port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

**Frontend runs at**: \http://localhost:5173\

### Running Backend Locally

```bash
cd MusicBackend-main/MusicBackend-main

# Build with Maven wrapper
./mvnw.cmd clean install

# Run Spring Boot application (port 8080)
./mvnw.cmd spring-boot:run

# Or run the JAR directly after build
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

**Backend runs at**: \http://localhost:8080\

---

## Part 2: Docker Compose Deployment

### Running with Docker Compose

Create \docker-compose.yml\ in the root directory, then:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

**Access**:
- Frontend: \http://localhost:3000\
- Backend: \http://localhost:8080\
- MySQL: \localhost:3306\

---

## Part 3: Kubernetes Deployment

### Prerequisites

```bash
# Start minikube (local Kubernetes)
minikube start --cpus=4 --memory=8192

# Or use Docker Desktop Kubernetes
# Enable in Docker Desktop Settings > Kubernetes
```

### Quick Kubernetes Deploy

```bash
# Build images for Kubernetes
cd MusicBackend-main/MusicBackend-main
docker build -t music-backend:latest .
cd ../../

cd TuneUp-frontEnd-main/TuneUp-frontEnd-main
docker build -t music-frontend:latest .
cd ../../

# If using minikube, load images
minikube image load music-backend:latest
minikube image load music-frontend:latest

# Deploy all services
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n music-app
kubectl get svc -n music-app

# Port forward for access
kubectl port-forward -n music-app svc/frontend-service 3000:3000 &
kubectl port-forward -n music-app svc/backend-service 8080:8080 &
```

---

## Part 4: Ansible Automation Deployment

### Installation

```bash
# Install Ansible
pip install ansible

# Install required collections
ansible-galaxy collection install community.general community.kubernetes
```

### Run Automated Deployment

```bash
# Full automated deployment
ansible-playbook -i ansible/hosts.ini ansible/deploy.yml

# Verbose output
ansible-playbook -i ansible/hosts.ini ansible/deploy.yml -vvv
```

---

## Quick Start Commands

### 1. Local Development (Fastest)
```bash
# Terminal 1: Frontend
cd TuneUp-frontEnd-main/TuneUp-frontEnd-main
npm install && npm run dev

# Terminal 2: Backend
cd MusicBackend-main/MusicBackend-main
./mvnw.cmd spring-boot:run

# Access: 
#   Frontend: http://localhost:5173
#   Backend: http://localhost:8080
```

### 2. Docker Compose (Simple)
```bash
docker-compose up -d

# Access: 
#   Frontend: http://localhost:3000
#   Backend: http://localhost:8080
```

### 3. Kubernetes (Production)
```bash
# See Part 3 above
ansible-playbook -i ansible/hosts.ini ansible/deploy.yml
```

---

## Troubleshooting

### Frontend Issues
```bash
# Port 5173 already in use
npm run dev -- --port 5174

# Clear cache
Remove-Item -Recurse node_modules
npm install
```

### Backend Issues
```bash
# Build cache issues
./mvnw.cmd clean install -U

# Run with more memory
java -Xmx1024m -jar target/demo-0.0.1-SNAPSHOT.jar
```

### Kubernetes Issues
```bash
# Check pod status
kubectl get pods -n music-app -o wide

# View logs
kubectl logs -f deployment/music-backend -n music-app
kubectl logs -f deployment/music-frontend -n music-app

# Delete and redeploy
kubectl delete namespace music-app
kubectl apply -f k8s/
```

---

**Last Updated**: November 28, 2025
**Version**: 1.0.0
