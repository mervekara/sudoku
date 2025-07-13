# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port (Express default)
EXPOSE 5000

# Start the server
CMD ["npm", "run", "dev"]
