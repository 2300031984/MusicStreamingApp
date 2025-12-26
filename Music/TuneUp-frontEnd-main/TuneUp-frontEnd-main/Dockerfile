# -------- Stage 1: Build with Vite --------
FROM node:24 AS builder
WORKDIR /app

# Build arguments
ARG VITE_BASE_API_URL=http://localhost:8085
ARG VITE_BASE_PATH=/
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL
ENV VITE_BASE_PATH=$VITE_BASE_PATH

COPY package*.json ./
RUN npm install
COPY . .

# Override vite.config.js base path for Docker (replace with sed since env vars don't work in vite.config.js at build time)
RUN if [ "$VITE_BASE_PATH" = "/" ]; then \
      sed -i 's|base: '\''/MusicStreamingForntend/'\''|base: '\''/'\''|g' vite.config.js || \
      sed -i "s|base: \"/MusicStreamingForntend/\"|base: \"/\"|g" vite.config.js; \
    fi

RUN npm run build

# -------- Stage 2: Serve with Nginx --------
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]