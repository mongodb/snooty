# this Dockerfile packages up this application and allows the front-end
# of the docs site to be built online and push changes to aws

# get nodejs
FROM node:10.10.0

RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app/front-end

# makefile contents are part of image
RUN git submodule add --force https://github.com/mongodb/docs-tools docs-tools
RUN mkdir -p static/images/
RUN mkdir -p staging/
RUN mv docs-tools/themes/mongodb/static static/static/

# following instructions from front-end/README.md
RUN npm -g config set user root
RUN npm install
RUN npm -g install gatsby

# entry to expose route that kicks-off build
EXPOSE 8080
CMD ["npm", "start"] 