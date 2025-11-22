FROM node:20-slim
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y openssl netcat-openbsd && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
COPY start.sh .
RUN chmod +x start.sh
EXPOSE 4000
CMD ["./start.sh"]
