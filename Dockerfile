# Use official Node.js LTS image as base
FROM node:18-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json package-lock.json ./

# Install dependencies (only production dependencies)
RUN npm ci --omit=dev

# Copy the entire Next.js project (excluding files in .dockerignore)
COPY . .

# Build the Next.js app
RUN npm run build

# Use a lightweight Node.js image for runtime
FROM node:18-alpine AS runner

# Copy the custom nginx.conf to the correct location
COPY nginx.conf /etc/nginx/nginx.conf

# Change permissions of nginx.conf
RUN chmod 644 /etc/nginx/nginx.conf

# Set working directory for runtime
WORKDIR /app

# Copy required files from builder stage
COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/src src
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/next.config.mjs next.config.mjs

# Set environment variable for production
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]

# Start Next.js app
CMD ["npm", "run", "start"]
