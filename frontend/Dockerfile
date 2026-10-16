FROM node As build
WORKDIR /frontendapp
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm install build
FROM nginx
COPY --from=build /frontendapp/build /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx","-g","daemon off" ]
