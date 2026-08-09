# Збірка статики і роздача її nginx. Node на сервері не потрібен —
# у контейнері лишається тільки готовий dist.

FROM node:22-alpine AS build
WORKDIR /app

# SITE впливає на canonical і og:url. BASE_PATH лишається '/',
# бо в контейнері сайт роздається з кореня домену.
ARG SITE=https://lfrecruiting.mil.gov.ua
ENV SITE=$SITE

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
