FROM node:alpine
WORKDIR /app

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

COPY package.json ./
RUN npm install
COPY . .
RUN npm run build


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
