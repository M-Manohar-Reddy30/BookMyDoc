# backend/Dockerfile
FROM node:24-alpine

WORKDIR /app

# copy package files first — cache deps
COPY package*.json ./

# install dependencies (dev deps included only for dev; adjust if you want production-only)
RUN npm ci --production=false

# copy rest of the app
COPY . .

# ensure server listens on process.env.PORT
ENV NODE_ENV=production

# start
CMD ["npm", "start"]
