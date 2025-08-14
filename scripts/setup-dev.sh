#!/bin/bash
echo "🔧 Configurando ambiente de desenvolvimento..."

# Criar diretórios necessários
mkdir -p logs data/mongodb data/redis

# Copiar arquivo de ambiente se não existir
if [ ! -f .env ]; then
  cp .env.example .env
  echo "📝 Arquivo .env criado. Configure suas variáveis!"
fi

# Instalar dependências
npm install

# Build inicial
npm run build

echo "✅ Setup concluído! Execute 'npm run start:dev' para iniciar"
