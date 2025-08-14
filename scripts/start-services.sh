#!/bin/bash
echo "🐳 Iniciando serviços com Docker..."

# Parar containers existentes
docker-compose down

# Iniciar apenas os serviços (sem a aplicação)
docker-compose up -d mongodb redis prometheus grafana

echo "✅ Serviços iniciados!"
echo "📊 MongoDB: localhost:27017"
echo "🔴 Redis: localhost:6379"  
echo "📈 Prometheus: localhost:9090"
echo "📊 Grafana: localhost:3001 (admin/admin123)"
