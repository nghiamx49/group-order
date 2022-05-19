FROM node:12.13.0-alpine as build

WORKDIR /app


COPY . /app


ENV REACT_APP_API=/api

RUN yarn 
RUN yarn build

FROM nginx:1.17.0-alpine

COPY --from=build /app/build /var/www

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]