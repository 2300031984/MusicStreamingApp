#!/bin/bash

# Kubernetes Deployment Script for Music Application

set -e

echo "🎵 Music Application Kubernetes Deployment"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

echo -e "${GREEN}✓${NC} Kubernetes cluster is accessible"

# Apply manifests
echo ""
echo "📦 Applying Kubernetes manifests..."
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml
kubectl apply -f frontend-nginx-configmap.yaml
kubectl apply -f mysql-init-configmap.yaml
kubectl apply -f mysql-pvc.yaml
kubectl apply -f mysql-deployment.yaml
kubectl apply -f mysql-service.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f ingress.yaml

echo ""
echo -e "${GREEN}✓${NC} All manifests applied successfully"
echo ""
echo "⏳ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=mysql -n music-app --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=backend -n music-app --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=frontend -n music-app --timeout=300s || true

echo ""
echo "📊 Deployment Status:"
echo "===================="
kubectl get pods -n music-app
echo ""
kubectl get svc -n music-app
echo ""

# Get access information
echo "🌐 Access Information:"
echo "====================="

FRONTEND_SVC=$(kubectl get svc frontend -n music-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
if [ -z "$FRONTEND_SVC" ]; then
    echo "Frontend Service: Use port-forward to access"
    echo "  kubectl port-forward -n music-app service/frontend 3000:80"
    echo "  Then access at: http://localhost:3000"
else
    echo "Frontend: http://$FRONTEND_SVC"
fi

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Useful commands:"
echo "  View pods:     kubectl get pods -n music-app"
echo "  View logs:     kubectl logs -f deployment/backend -n music-app"
echo "  Delete all:    kubectl delete -f ."
echo "  Port forward:  kubectl port-forward -n music-app service/frontend 3000:80"

