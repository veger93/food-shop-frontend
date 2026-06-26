# Этап 1 — сборка React приложения
FROM node:20-alpine AS builder

WORKDIR /app

# Сначала копируем только package.json
# Это позволяет Docker кэшировать слой с npm install
# и не переустанавливать пакеты если изменился только код
COPY package.json package-lock.json ./
RUN npm ci

# Копируем код и собираем
COPY . .
RUN npm run build

# Этап 2 — раздаём статику через nginx
FROM nginx:alpine

# Копируем собранные файлы в nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Конфиг nginx для React Router (все пути → index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80