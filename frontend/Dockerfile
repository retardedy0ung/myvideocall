FROM node:24 As build
WORKDIR /app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm install build
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
