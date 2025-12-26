# 🎵 MusicStreamingApp — Full Stack Deployment Guide

A full-stack **music streaming application** built with a **React (Vite) frontend** and a **Spring Boot backend**.  
This project supports **local development**, **Docker Compose**, and **production-grade Kubernetes deployment**, automated with **Ansible**.

---

## 📁 Project Structure

```text
Music/
├── MusicBackend-main/                 # Spring Boot Backend
│   └── MusicBackend-main/
│       ├── pom.xml
│       ├── src/
│       └── mvnw.cmd
│
├── TuneUp-frontEnd-main/              # React + Vite Frontend
│   └── TuneUp-frontEnd-main/
│       ├── package.json
│       ├── vite.config.js
│       ├── Dockerfile
│       └── src/

🚀 Part 1: Local Development Setup
✅ Prerequisites

Backend

Java 17+

Maven (or Maven Wrapper mvnw)

Frontend

Node.js 18+

npm

Optional / Deployment

Docker & Docker Desktop

Kubernetes (kubectl, Minikube or Docker Desktop)

Python 3.8+

Ansible

🖥️ Running Frontend Locally
cd TuneUp-frontEnd-main/TuneUp-frontEnd-main

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview


📍 Frontend URL:
http://localhost:5173

⚙️ Running Backend Locally
cd MusicBackend-main/MusicBackend-main

# Build project
./mvnw.cmd clean install

# Run Spring Boot app
./mvnw.cmd spring-boot:run


Or run the JAR directly:

java -jar target/demo-0.0.1-SNAPSHOT.jar


📍 Backend URL:
http://localhost:8080

🐳 Part 2: Docker Compose Deployment
▶️ Run with Docker Compose

Create a docker-compose.yml in the root directory, then:

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v

🔗 Access Services

Frontend: http://localhost:3000

Backend: http://localhost:8080

MySQL: localhost:3306

☸️ Part 3: Kubernetes Deployment
🔧 Prerequisites
# Start Minikube
minikube start --cpus=4 --memory=8192


Or enable Kubernetes in Docker Desktop.

🚀 Quick Kubernetes Deploy
Build Docker Images
# Backend
cd MusicBackend-main/MusicBackend-main
docker build -t music-backend:latest .
cd ../../

# Frontend
cd TuneUp-frontEnd-main/TuneUp-frontEnd-main
docker build -t music-frontend:latest .
cd ../../

Load Images into Minikube
minikube image load music-backend:latest
minikube image load music-frontend:latest

Deploy to Kubernetes
kubectl apply -f k8s/

Check Status
kubectl get pods -n music-app
kubectl get svc -n music-app

Port Forwarding
kubectl port-forward -n music-app svc/frontend-service 3000:3000 &
kubectl port-forward -n music-app svc/backend-service 8080:8080 &

🤖 Part 4: Ansible Automation Deployment
📦 Installation
pip install ansible
ansible-galaxy collection install community.general community.kubernetes

▶️ Run Automated Deployment
ansible-playbook -i ansible/hosts.ini ansible/deploy.yml


Verbose mode (debugging):

ansible-playbook -i ansible/hosts.ini ansible/deploy.yml -vvv

⚡ Quick Start Commands
1️⃣ Local Development (Fastest)

Frontend

cd TuneUp-frontEnd-main/TuneUp-frontEnd-main
npm install && npm run dev


Backend

cd MusicBackend-main/MusicBackend-main
./mvnw.cmd spring-boot:run


Frontend: http://localhost:5173

Backend: http://localhost:8080

2️⃣ Docker Compose (Simple)
docker-compose up -d


Frontend: http://localhost:3000

Backend: http://localhost:8080

3️⃣ Kubernetes (Production)
ansible-playbook -i ansible/hosts.ini ansible/deploy.yml
