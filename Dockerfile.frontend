# Используем базовый образ Node.js с нужной версией
FROM node:alpine

# Устанавливаем рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json (если есть) для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта в рабочую директорию контейнера
COPY . .

# Собираем приложение
RUN npm run build

# Install a static file server
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
CMD ["npm", "run", "preview"]
