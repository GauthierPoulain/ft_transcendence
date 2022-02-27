FROM node:17.5.0-alpine3.15 AS build
ARG REACT_APP_API42UID
ENV REACT_APP_API42UID ${REACT_APP_API42UID}
WORKDIR /app
RUN npm config set update-notifier false
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN touch .env
RUN npm run build
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]