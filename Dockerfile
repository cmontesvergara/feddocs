# Etapa 1: Build
FROM public.ecr.aws/docker/library/node:20 AS build
ARG CACHEBUST=1

WORKDIR /app

# Instalar git (necesario para sync-docs.js)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Sincronizar docs + build de producción
RUN npm run build

# Etapa 2: Servidor
FROM public.ecr.aws/nginx/nginx:stable-alpine

# Limpiar HTML por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiar build de VitePress
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html

# Configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
