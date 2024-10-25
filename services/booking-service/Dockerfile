FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files
COPY . .

# Environment variables for the service
ENV PORT=5003

# Expose the port
EXPOSE 5003

# Start the service
CMD ["node", "server.js"]