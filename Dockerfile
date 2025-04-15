# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to install dependencies
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app will run on (3000 is a common default, change if needed)
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
