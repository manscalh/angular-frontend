FROM node:14.17.6 as node
WORKDIR /app
COPY . .
RUN npm i -g @angular/cli
RUN npm install --force

CMD ["npm", "run", "dev"]

EXPOSE 4201
