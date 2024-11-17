# Etap 1: Budowanie aplikacji
FROM node:18-alpine as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

# Etap 2: Serwowanie aplikacji za pomocą Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
# Jeśli masz plik nginx.conf, skopiuj go
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
