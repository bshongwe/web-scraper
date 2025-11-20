FROM node:20-alpine
WORKDIR /usr/src/worker
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
CMD ["node", "dist/worker.js"]
