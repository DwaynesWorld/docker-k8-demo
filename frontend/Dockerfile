FROM node:12-alpine as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN yarn global add react-scripts@3.0.1 
RUN yarn
COPY . /app
RUN yarn build

FROM nginx:1.16.0-alpine
# Update nginx configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY frontend.conf /etc/nginx/conf.d

# Serve index.html
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]