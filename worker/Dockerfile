FROM node:20-slim
WORKDIR /usr/src/worker
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["node", "dist/worker.js"]
