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
ENV DB=mongodb+srv://admin:admin@cluster0.mw6ee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ENV SECRET=zeel
ENV PORT=5000

EXPOSE 5000
CMD ["npm", "start"]
