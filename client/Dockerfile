FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_PUBLIC_URL=http://localhost:5173
ARG VITE_SERVER_URL=http://localhost:8080
ARG VITE_SOCKET_SERVER=localhost:8080
ENV VITE_PUBLIC_URL=$VITE_PUBLIC_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL
ENV VITE_SOCKET_SERVER=$VITE_SOCKET_SERVER

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
