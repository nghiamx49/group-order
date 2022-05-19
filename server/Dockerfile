FROM node:16.13.0-alpine as build

WORKDIR /server

ARG DB_URL PORT SECRET SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS
ENV DB_URL={DB_URL} PORT={PORT} SECRET={SECRET} SMTP_HOST={SMTP_HOST} SMTP_PORT={SMTP_PORT} SMTP_USER={SMTP_USER} SMTP_PASS={SMTP_PASS}

COPY . /server
RUN npm install html-pdf -g
RUN npm link html-pdf
RUN npm link phantomjs-prebuilt
RUN npm install
CMD npm start