# Stage 1: Build frontend
FROM node:18 AS client-build
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup backend
FROM node:18 AS backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

ENV NODE_ENV=production
ENV DB=postgresql://demo_owner:Yx0hk1lubLBa@ep-purple-paper-a5a1imqv.us-east-2.aws.neon.tech/demo?sslmode=require
ENV SECRET=zeel
ENV PORT=5000

EXPOSE 5000
CMD ["npm", "start"]
