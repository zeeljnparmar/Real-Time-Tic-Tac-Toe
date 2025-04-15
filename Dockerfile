# Stage 1: Build the client
FROM node:14 AS client-build

# Set the working directory for the client
WORKDIR /client

# Copy the client package.json and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy the rest of the client code and build the app (assuming you are using React/Vue/Angular)
COPY client/ ./
RUN npm run build

# Stage 2: Build the backend
FROM node:14 AS backend-build

# Set the working directory for the backend
WORKDIR /backend

# Copy the backend package.json and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY backend/ ./

# Expose port for backend (if it's a web server, e.g., port 3000)
EXPOSE 3000

# Stage 3: Combine frontend and backend into the final image
FROM node:14

# Set working directory
WORKDIR /app

# Copy backend from the backend build stage
COPY --from=backend-build /backend /backend

# Copy frontend build from the client build stage
COPY --from=client-build /client/build /client/build

# Expose port for backend (if it's a web server, e.g., port 3000)
EXPOSE 5000

# Set environment variable (if needed for backend)
ENV NODE_ENV=production \
    DB=mongodb://localhost:27017/Tic-Tac-Toe \
    SECRET=zeel \
    PORT=5000


# Command to run the backend app
CMD ["npm", "start", "--prefix", "/app/backend"]
