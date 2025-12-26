#!/bin/bash
# Apply all Kubernetes manifests (excluding kustomization.yaml)

cd "$(dirname "$0")"

echo "Applying all Kubernetes manifests..."
echo

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

echo
echo "Done!"

