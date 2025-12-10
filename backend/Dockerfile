# Use a slim Node image
FROM node:18-alpine

WORKDIR /app

# Install dependencies (copy package.json first for layer caching)
COPY package*.json ./
RUN npm ci --production=false

# Copy app code
COPY . .

# Build step if you have any build (optional)
# RUN npm run build

# Ensure the app listens on process.env.PORT (backend should do this)
ENV NODE_ENV=production

# Start command (should match package.json "start")
CMD ["npm", "start"]
