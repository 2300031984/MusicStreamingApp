# Troubleshooting Guide

## Common Issues and Solutions

### 1. MySQL Pod Stuck in Pending State

**Symptoms:**
```
NAME        STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS
mysql-pvc   Pending                                      standard
```

**Cause:** The storage class specified in `mysql-pvc.yaml` doesn't exist in your cluster.

**Solution:**
1. Check available storage classes:
   ```bash
   kubectl get storageclass
   ```

2. Update `mysql-pvc.yaml` with the correct storage class:
   ```yaml
   storageClassName: hostpath  # or your cluster's default storage class
   ```

3. Delete and recreate the PVC:
   ```bash
   kubectl delete pvc mysql-pvc -n music-app
   kubectl apply -f k8s/mysql-pvc.yaml
   ```

### 2. Backend Cannot Connect to MySQL

**Symptoms:**
```
Communications link failure
The last packet sent successfully to the server was 0 milliseconds ago
```

**Causes and Solutions:**

#### a) MySQL Not Ready
- **Check:** `kubectl get pods -n music-app`
- **Solution:** Wait for MySQL pod to be in `Running` state with `1/1 Ready`

#### b) Wrong Connection String
- **Check:** Verify the connection string in `backend-deployment.yaml`
- **Solution:** Use the full DNS name: `mysql.music-app.svc.cluster.local:3306`

#### c) MySQL Service Not Created
- **Check:** `kubectl get svc mysql -n music-app`
- **Solution:** Ensure MySQL service exists and has the correct selector

#### d) Network Policy Blocking
- **Check:** `kubectl get networkpolicies -n music-app`
- **Solution:** Remove or update network policies to allow traffic

### 3. Init Container Failing

**Symptoms:**
```
Init:0/1    Error
```

**Causes:**
- Init container waiting for MySQL but MySQL isn't ready
- DNS resolution issues
- Network connectivity problems

**Solution:**
1. Check init container logs:
   ```bash
   kubectl logs <pod-name> -c wait-for-mysql -n music-app
   ```

2. Verify MySQL service:
   ```bash
   kubectl get svc mysql -n music-app
   kubectl describe svc mysql -n music-app
   ```

3. Test DNS resolution from a pod:
   ```bash
   kubectl run -it --rm test --image=busybox:1.35 --restart=Never -- nslookup mysql.music-app.svc.cluster.local
   ```

### 4. PVC Not Binding

**Symptoms:**
```
PVC Status: Pending
```

**Solutions:**
1. Check storage class exists:
   ```bash
   kubectl get storageclass
   ```

2. Check PVC events:
   ```bash
   kubectl describe pvc mysql-pvc -n music-app
   ```

3. For testing, you can use `emptyDir` instead (data will be lost on pod restart):
   ```yaml
   volumes:
   - name: mysql-storage
     emptyDir: {}
   ```

### 5. Backend Pods Restarting

**Symptoms:**
```
RESTARTS: 3
STATUS: CrashLoopBackOff
```

**Causes:**
- Application errors
- Resource limits too low
- Health check failures

**Solution:**
1. Check logs:
   ```bash
   kubectl logs <pod-name> -n music-app --previous
   ```

2. Check resource usage:
   ```bash
   kubectl top pod <pod-name> -n music-app
   ```

3. Adjust resource limits in `backend-deployment.yaml` if needed

### 6. Frontend Cannot Reach Backend

**Symptoms:**
- Frontend loads but API calls fail
- 502 Bad Gateway errors

**Solutions:**
1. Verify nginx ConfigMap is applied:
   ```bash
   kubectl get configmap frontend-nginx-config -n music-app
   ```

2. Check nginx logs:
   ```bash
   kubectl logs <frontend-pod> -n music-app
   ```

3. Verify backend service:
   ```bash
   kubectl get svc backend -n music-app
   ```

4. Test backend connectivity from frontend pod:
   ```bash
   kubectl exec -it <frontend-pod> -n music-app -- wget -O- http://backend:8084/user/1
   ```

### 7. Image Pull Errors

**Symptoms:**
```
ErrImagePull
ImagePullBackOff
```

**Solutions:**

#### For Minikube:
```bash
# Use minikube's Docker daemon
eval $(minikube docker-env)
docker build -t music-backend:latest ./MusicBackend-main/MusicBackend-main
docker build --build-arg VITE_BASE_API_URL=/api -t music-frontend:latest ./TuneUp-frontEnd-main/TuneUp-frontEnd-main
```

#### For Remote Registry:
1. Tag and push images:
   ```bash
   docker tag music-backend:latest your-registry/music-backend:latest
   docker push your-registry/music-backend:latest
   ```

2. Update image names in deployments
3. Create imagePullSecrets if needed:
   ```bash
   kubectl create secret docker-registry regcred \
     --docker-server=your-registry \
     --docker-username=your-username \
     --docker-password=your-password \
     -n music-app
   ```

### 8. Health Check Failures

**Symptoms:**
```
Readiness probe failed
Liveness probe failed
```

**Solutions:**
1. Check if the endpoint is correct:
   ```bash
   kubectl exec -it <pod-name> -n music-app -- wget -O- http://localhost:8084/user/1
   ```

2. Adjust probe timing in deployment YAML:
   ```yaml
   readinessProbe:
     initialDelaySeconds: 90  # Increase if app takes longer to start
     periodSeconds: 10
     timeoutSeconds: 5
   ```

### 9. Port Forwarding Not Working

**Symptoms:**
- Cannot access application via port-forward

**Solution:**
1. Check service exists:
   ```bash
   kubectl get svc -n music-app
   ```

2. Use correct port mapping:
   ```bash
   kubectl port-forward -n music-app service/frontend 3000:80
   ```

3. Check if port is already in use:
   ```bash
   netstat -ano | findstr :3000  # Windows
   lsof -i :3000  # Linux/Mac
   ```

## Useful Debugging Commands

```bash
# Get all resources in namespace
kubectl get all -n music-app

# Describe a resource
kubectl describe pod <pod-name> -n music-app

# View logs
kubectl logs -f deployment/backend -n music-app

# Execute command in pod
kubectl exec -it <pod-name> -n music-app -- sh

# Check events
kubectl get events -n music-app --sort-by='.lastTimestamp'

# Check service endpoints
kubectl get endpoints -n music-app

# Test DNS resolution
kubectl run -it --rm test --image=busybox:1.35 --restart=Never -- nslookup mysql.music-app.svc.cluster.local

# Test connectivity
kubectl run -it --rm test --image=busybox:1.35 --restart=Never -- nc -zv mysql.music-app.svc.cluster.local 3306
```

## Quick Reset

If everything is broken and you want to start fresh:

```bash
# Delete everything
kubectl delete -f k8s/

# Or delete namespace (removes everything)
kubectl delete namespace music-app

# Recreate
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/frontend-nginx-configmap.yaml
kubectl apply -f k8s/mysql-pvc.yaml
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/mysql-service.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml
```

