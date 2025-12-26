# Quick Start Guide

## Prerequisites Check

```bash
# Check kubectl
kubectl version --client

# Check cluster access
kubectl cluster-info
```

## Step 1: Build Docker Images

### For Minikube:

```bash
# Start minikube (if not running)
minikube start

# Use minikube's Docker daemon
eval $(minikube docker-env)

# Build images
docker build -t music-backend:latest ./MusicBackend-main/MusicBackend-main
docker build --build-arg VITE_BASE_API_URL=/api -t music-frontend:latest ./TuneUp-frontEnd-main/TuneUp-frontEnd-main
```

### For Other Clusters:

```bash
# Build and tag for your registry
docker build -t your-registry/music-backend:latest ./MusicBackend-main/MusicBackend-main
docker build --build-arg VITE_BASE_API_URL=/api -t your-registry/music-frontend:latest ./TuneUp-frontEnd-main/TuneUp-frontEnd-main

# Push to registry
docker push your-registry/music-backend:latest
docker push your-registry/music-frontend:latest

# Update image names in backend-deployment.yaml and frontend-deployment.yaml
```

## Step 2: Deploy to Kubernetes

### Option A: Using the deployment script

**Windows:**
```cmd
cd k8s
deploy.bat
```

**Linux/Mac:**
```bash
cd k8s
chmod +x deploy.sh
./deploy.sh
```

### Option B: Using kubectl directly

```bash
cd k8s
kubectl apply -f .
```

### Option C: Using kustomize

```bash
cd k8s
kubectl apply -k .
```

## Step 3: Verify Deployment

```bash
# Check all resources
kubectl get all -n music-app

# Watch pods
kubectl get pods -n music-app -w

# Check logs
kubectl logs -f deployment/backend -n music-app
kubectl logs -f deployment/frontend -n music-app
kubectl logs -f deployment/mysql -n music-app
```

## Step 4: Access the Application

### Option A: Port Forwarding (Recommended for Testing)

```bash
# Forward frontend
kubectl port-forward -n music-app service/frontend 3000:80

# In another terminal, forward backend (if needed)
kubectl port-forward -n music-app service/backend 8085:8084
```

Access at: **http://localhost:3000**

### Option B: LoadBalancer Service

```bash
# Get external IP
kubectl get svc frontend -n music-app

# Access at http://<EXTERNAL-IP>
```

### Option C: Ingress

1. Install Ingress Controller (if not installed):
```bash
# Minikube
minikube addons enable ingress

# Other clusters
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

2. Update `ingress.yaml` with your domain

3. Access via the configured domain

## Troubleshooting

### Pods not starting:

```bash
# Describe pod
kubectl describe pod <pod-name> -n music-app

# Check events
kubectl get events -n music-app --sort-by='.lastTimestamp'
```

### Image pull errors:

- For minikube: Make sure you used `eval $(minikube docker-env)` before building
- For other clusters: Check image registry credentials and imagePullSecrets

### Database connection issues:

```bash
# Check MySQL logs
kubectl logs deployment/mysql -n music-app

# Test MySQL connection
kubectl run -it --rm mysql-client --image=mysql:8.0 --restart=Never -- mysql -h mysql.music-app.svc.cluster.local -u root -p
```

### Frontend can't reach backend:

- Check that nginx ConfigMap is applied: `kubectl get configmap frontend-nginx-config -n music-app`
- Verify frontend was built with `VITE_BASE_API_URL=/api`
- Check backend service: `kubectl get svc backend -n music-app`

## Cleanup

```bash
# Delete all resources
kubectl delete -f k8s/

# Or delete namespace (removes everything)
kubectl delete namespace music-app
```

## Common Commands

```bash
# Scale deployments
kubectl scale deployment backend --replicas=3 -n music-app

# Restart a deployment
kubectl rollout restart deployment/backend -n music-app

# View resource usage
kubectl top pods -n music-app

# Execute command in pod
kubectl exec -it deployment/backend -n music-app -- sh

# Copy files to/from pod
kubectl cp <local-file> music-app/<pod-name>:/path/to/destination
```

