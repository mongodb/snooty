GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
USER=$(shell whoami)
STAGING_URL="https://docs-mongodborg-staging.corp.mongodb.com"
STAGING_BUCKET=docs-mongodb-org-staging
PLATFORM=$(shell printf '%s_%s' "$$(uname -s | tr '[:upper:]' '[:lower:]')" "$$(uname -m)")
PACKAGE_NAME=snooty-preview-${VERSION}-${PLATFORM}.zip
VERSION=$(shell git describe --tags)
-include .env.production

.PHONY: stage static

# To stage a specific build, include the commit hash as environment variable when staging
# 	example: COMMIT_HASH=123456 make stage
# Here, generate path prefix according to environment variables
prefix:
ifdef COMMIT_HASH
PREFIX = $(COMMIT_HASH)/$(GATSBY_PARSER_BRANCH)/$(GATSBY_SITE)
else
PREFIX = $(GATSBY_PARSER_BRANCH)/$(GATSBY_SITE)
endif

package-preview:
	zip -9r --symlinks ${PACKAGE_NAME} src node_modules preview preview-start.js static webpack.config.js index.html package.json package-lock.json
	echo "::set-output name=package_filename::${PACKAGE_NAME}"

stage: prefix
	@if [ -z "${GATSBY_SNOOTY_DEV}" ]; then \
		echo "To stage changes to the Snooty frontend, ensure that GATSBY_SNOOTY_DEV=true in your production environment."; exit 1; \
	else \
		mut-publish public ${STAGING_BUCKET} --prefix=${PREFIX} --stage ${ARGS}; \
		echo "Hosted at ${STAGING_URL}/${PREFIX}/${USER}/${GIT_BRANCH}/"; \
	fi

static:
	-rm -r ./static/images/
	-rm -r ./static/docs-tools/
	-rm -r ./docs-tools/
	git submodule add --force https://github.com/mongodb/docs-tools
	-mkdir -p ./static/images
	-mkdir -p ./static/docs-tools
	cp -a ./docs-tools/themes/mongodb/static/fonts ./static/docs-tools/
	cp ./docs-tools/themes/mongodb/static/guides.css ./static/docs-tools/
	cp ./docs-tools/themes/mongodb/static/mongodb-docs.css ./static/docs-tools/
	cp ./docs-tools/themes/mongodb/static/navbar.min.js ./static/docs-tools/
	cp ./docs-tools/themes/mongodb/static/css/navbar.min.css ./static/docs-tools/
	cp ./docs-tools/themes/guides/static/images/bg-accent.svg ./static/images/
