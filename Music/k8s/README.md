# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying the Music Application.

## Prerequisites

1. Kubernetes cluster (minikube, kind, or cloud provider)
2. kubectl configured to access your cluster
3. Docker images built and pushed to a registry (or use local images with minikube)

## Architecture

- **MySQL**: Database service
- **Backend**: Spring Boot application
- **Frontend**: React application served by Nginx
- **Ingress**: Optional external access (requires ingress controller)

## Quick Start

### 1. Build and Push Docker Images

First, build your Docker images:

```bash
# Build backend image
cd MusicBackend-main/MusicBackend-main
docker build -t music-backend:latest .

# Build frontend image (use /api as the base URL - nginx will proxy to backend)
cd ../../TuneUp-frontEnd-main/TuneUp-frontEnd-main
docker build --build-arg VITE_BASE_API_URL=/api -t music-frontend:latest .
```

#### For Minikube (using local images):

```bash
# Set Docker environment to use minikube's Docker daemon
eval $(minikube docker-env)

# Build images (they'll be available in minikube)
docker build -t music-backend:latest ./MusicBackend-main/MusicBackend-main
docker build --build-arg VITE_BASE_API_URL=/api -t music-frontend:latest ./TuneUp-frontEnd-main/TuneUp-frontEnd-main
```

#### For Cloud/Remote Registry:

```bash
# Tag and push to your registry
docker tag music-backend:latest your-registry/music-backend:latest
docker tag music-frontend:latest your-registry/music-frontend:latest
docker push your-registry/music-backend:latest
docker push your-registry/music-frontend:latest

# Update image names in backend-deployment.yaml and frontend-deployment.yaml
```

### 2. Deploy to Kubernetes

#### Option A: Using kubectl (apply all files)

**Note:** When using `kubectl apply -f .`, it will try to apply `kustomization.yaml` which will fail. Use one of these approaches:

**Recommended: Apply files individually (in order):**
```bash
cd k8s
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml
kubectl apply -f frontend-nginx-configmap.yaml
kubectl apply -f mysql-pvc.yaml
kubectl apply -f mysql-deployment.yaml
kubectl apply -f mysql-service.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f ingress.yaml
```

**Or exclude kustomization.yaml:**
```bash
cd k8s
kubectl apply -f namespace.yaml -f configmap.yaml -f secrets.yaml -f frontend-nginx-configmap.yaml -f mysql-pvc.yaml -f mysql-deployment.yaml -f mysql-service.yaml -f backend-deployment.yaml -f backend-service.yaml -f frontend-deployment.yaml -f frontend-service.yaml -f ingress.yaml
```

#### Option B: Using kustomize

```bash
kubectl apply -k k8s/
```

### 3. Verify Deployment

```bash
# Check pods
kubectl get pods -n music-app

# Check services
kubectl get svc -n music-app

# Check deployments
kubectl get deployments -n music-app

# View logs
kubectl logs -f deployment/backend -n music-app
kubectl logs -f deployment/frontend -n music-app
kubectl logs -f deployment/mysql -n music-app
```

### 4. Access the Application

#### Using Service (LoadBalancer):

```bash
# Get external IP
kubectl get svc frontend -n music-app

# Access frontend at http://<EXTERNAL-IP>
# Access backend at http://<EXTERNAL-IP>:8084 (if exposed)
```

#### Using Ingress:

1. Install an Ingress Controller (if not already installed):

```bash
# For minikube
minikube addons enable ingress

# For other clusters, install nginx-ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

2. Update `ingress.yaml` with your domain or use port-forward:

```bash
# Port forward to access via ingress
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8080:80
```

3. Add to `/etc/hosts` (or `C:\Windows\System32\drivers\etc\hosts` on Windows):
```
127.0.0.1 music.local
```

4. Access at `http://music.local`

#### Using Port Forwarding (for testing):

```bash
# Forward frontend
kubectl port-forward -n music-app service/frontend 3000:80

# Forward backend
kubectl port-forward -n music-app service/backend 8085:8084

# Access at http://localhost:3000
```

## Configuration

### Update Secrets

**Important**: The secrets.yaml file contains sensitive information. For production:

1. Use Kubernetes secrets management (e.g., Sealed Secrets, External Secrets Operator)
2. Or create secrets manually:

```bash
kubectl create secret generic music-secrets \
  --from-literal=MYSQL_ROOT_PASSWORD='your-password' \
  --from-literal=MYSQL_PASSWORD='your-password' \
  --from-literal=SPRING_DATASOURCE_PASSWORD='your-password' \
  --from-literal=SPRING_MAIL_PASSWORD='your-password' \
  -n music-app
```

### Update ConfigMap

Edit `configmap.yaml` or update via kubectl:

```bash
kubectl edit configmap music-config -n music-app
```

### Storage Class

Update `mysql-pvc.yaml` with your cluster's storage class:

```bash
# Check available storage classes
kubectl get storageclass

# Update mysql-pvc.yaml with the correct storageClassName
```

## Scaling

Scale deployments:

```bash
# Scale backend
kubectl scale deployment backend --replicas=3 -n music-app

# Scale frontend
kubectl scale deployment frontend --replicas=3 -n music-app
```

## Troubleshooting

### Pods not starting:

```bash
# Describe pod
kubectl describe pod <pod-name> -n music-app

# Check events
kubectl get events -n music-app --sort-by='.lastTimestamp'
```

### Database connection issues:

```bash
# Check MySQL pod
kubectl logs deployment/mysql -n music-app

# Test connection from backend pod
kubectl exec -it deployment/backend -n music-app -- wget -O- http://mysql:3306
```

### Image pull errors:

- Ensure images are built and available
- For minikube, use `eval $(minikube docker-env)` before building
- For remote registry, ensure imagePullSecrets are configured if needed

## Cleanup

```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete namespace (removes everything)
kubectl delete namespace music-app
```

## Production Considerations

1. **Secrets Management**: Use proper secrets management (not plain text in YAML)
2. **Resource Limits**: Adjust resource requests/limits based on your needs
3. **High Availability**: Consider using StatefulSet for MySQL
4. **Backup**: Set up database backups
5. **Monitoring**: Add monitoring and logging (Prometheus, Grafana, ELK)
6. **TLS/HTTPS**: Configure TLS certificates for Ingress
7. **Network Policies**: Add network policies for security
8. **Health Checks**: Fine-tune liveness and readiness probes
9. **Image Registry**: Use private registry with proper authentication
10. **Persistent Storage**: Use appropriate storage class for production workloads

