FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código da aplicação
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

EXPOSE 3000

# Rodar a aplicação
CMD ["node", "src/app.js"]