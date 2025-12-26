@echo off
REM Kubernetes Deployment Script for Music Application (Windows)

echo 🎵 Music Application Kubernetes Deployment
echo ==========================================

REM Check if kubectl is installed
where kubectl >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ kubectl is not installed. Please install kubectl first.
    exit /b 1
)

REM Check if cluster is accessible
kubectl cluster-info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig.
    exit /b 1
)

echo ✓ Kubernetes cluster is accessible

REM Apply manifests in order
echo.
echo 📦 Applying Kubernetes manifests...
echo Creating namespace...
kubectl apply -f namespace.yaml
timeout /t 2 /nobreak >nul

echo Creating configmaps and secrets...
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml
kubectl apply -f frontend-nginx-configmap.yaml
kubectl apply -f mysql-init-configmap.yaml

echo Creating MySQL resources...
kubectl apply -f mysql-pvc.yaml
kubectl apply -f mysql-deployment.yaml
kubectl apply -f mysql-service.yaml

echo Creating backend resources...
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

echo Creating frontend resources...
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

echo Creating ingress...
kubectl apply -f ingress.yaml

echo.
echo ✓ All manifests applied successfully
echo.
echo ⏳ Waiting for pods to be ready...
timeout /t 10 /nobreak >nul

echo.
echo 📊 Deployment Status:
echo ====================
kubectl get pods -n music-app
echo.
kubectl get svc -n music-app
echo.

echo 🌐 Access Information:
echo =====================
echo Frontend Service: Use port-forward to access
echo   kubectl port-forward -n music-app service/frontend 3000:80
echo   Then access at: http://localhost:3000
echo.

echo ✅ Deployment complete!
echo.
echo Useful commands:
echo   View pods:     kubectl get pods -n music-app
echo   View logs:     kubectl logs -f deployment/backend -n music-app
echo   Delete all:    kubectl delete -f .
echo   Port forward:  kubectl port-forward -n music-app service/frontend 3000:80

pause

