# this Dockerfile packages up this application and allows the front-end
# of the docs site to be built online and push changes to aws

# get nodejs
FROM node:latest

COPY front-end/ .

# following instructions from front-end/README.md
RUN npm -g config set user root
RUN npm install
RUN npm -g install gatsby

# entry to expose route that kicks-off build
EXPOSE 8080
CMD ["npm", "start"]