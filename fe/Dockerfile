# Base image
FROM node:20-alpine as build-stage

# Set working directory
WORKDIR /app

# Install dependencies and build
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Nginx ile servis et
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Nginx config opsiyonel
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
