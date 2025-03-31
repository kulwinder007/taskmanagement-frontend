# Step 1: Build the React app
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./ 

# Install dependencies
RUN npm install


# Copy the rest of the application
COPY . . 

# Build the React app
RUN npm run build

# Install only production dependencies
RUN npm ci --omit=dev

# Use a lightweight Node.js image for runtime
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/public public
COPY --from=builder /app/package.json package.json

# Set environment variable for production
ENV NODE_ENV=production

# Expose port 3000
EXPOSE 3000

# Start Next.js app
CMD ["npm", "run", "start"]
