GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
USER=$(shell whoami)
STAGING_URL="https://docs-mongodborg-staging.corp.mongodb.com"
STAGING_BUCKET=docs-mongodb-org-staging
include .env.production

.PHONY: stage static

# To stage a specific build, include the commit hash/patch ID as environment variables when staging
# 	example: COMMIT_HASH=123456 make stage
# Here, generate path prefix according to environment variables
prefix:
ifdef PATCH_ID
PREFIX = $(COMMIT_HASH)/$(PATCH_ID)/$(GATSBY_PARSER_BRANCH)/$(GATSBY_SITE)
else
ifdef COMMIT_HASH
PREFIX = $(COMMIT_HASH)/$(GATSBY_PARSER_BRANCH)/$(GATSBY_SITE)
else
PREFIX = $(GATSBY_PARSER_BRANCH)/$(GATSBY_SITE)
endif
endif


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
	mv ./docs-tools/themes/mongodb/static ./static/docs-tools/
	mv ./docs-tools/themes/guides/static/images/bg-accent.svg ./static/docs-tools/images/bg-accent.svg
