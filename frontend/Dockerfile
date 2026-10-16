FROM node As build
WORKDIR /frontend
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
FROM nginx
COPY --from=build /frontend/build /usr/build/share/nginx/html
EXPOSE 80
CMD [ "nginx","-g","daemon off" ]
