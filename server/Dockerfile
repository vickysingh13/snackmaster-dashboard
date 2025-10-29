FROM node:22-alpine

WORKDIR /app

# Install deps first (cacheable)
COPY package*.json ./
RUN npm ci

# Copy app sources
COPY . .

EXPOSE 5000

# Use dev command by default (compose overrides allowed)
CMD ["npm", "run", "dev"]