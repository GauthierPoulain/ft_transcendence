FROM node:17.5.0-alpine3.15 AS build
WORKDIR /app
RUN npm config set update-notifier false
COPY package*.json ./
RUN npm ci --slient
COPY . .
RUN touch .env
RUN npm run build
FROM node:17.5.0-alpine3.15 as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
RUN npm config set update-notifier false
COPY package*.json ./
RUN npm ci --slient --only=production
COPY . .
COPY --from=build /app/dist ./dist
RUN touch .env
CMD ["node", "dist/main"]