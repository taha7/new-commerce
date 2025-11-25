FROM node:24-alpine

# Install OpenSSL and other dependencies for Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy source code and env file
COPY . .

# Set Prisma binary target for Alpine Linux
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x

# Expose port
EXPOSE 3001

# Create startup script that generates Prisma client and starts the app
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'npx prisma generate' >> /app/start.sh && \
    echo 'npx prisma migrate deploy || echo "Migration failed, continuing..."' >> /app/start.sh && \
    echo 'pnpm run start:dev' >> /app/start.sh && \
    chmod +x /app/start.sh

# Start the application
CMD ["/app/start.sh"]
