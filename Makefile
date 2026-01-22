GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
USER=$(shell whoami)
STAGING_BUCKET=docs-mongodb-org-stg
STAGING_URL="https://docs-mongodbcom-staging.corp.mongodb.com"
-include .env.production

.PHONY: stage

# To stage a specific build, include the commit hash as environment variable when staging
# 	example: COMMIT_HASH=123456 make stage
# Here, generate path prefix according to environment variables
prefix:
ifdef COMMIT_HASH
ifdef PATCH_ID
PREFIX = platform/$(COMMIT_HASH)/$(PATCH_ID)/$(GATSBY_PARSER_BRANCH)/$(GATSBY_SITE)
else
PREFIX = platform/$(COMMIT_HASH)/$(GATSBY_PARSER_BRANCH)/$(GATSBY_SITE)
endif
else
PREFIX = platform/$(GATSBY_PARSER_BRANCH)/$(GATSBY_SITE)
endif

stage: prefix
	@if [ -z "${GATSBY_SNOOTY_DEV}" ]; then \
		echo "To stage changes to the Snooty frontend, ensure that GATSBY_SNOOTY_DEV=true in your production environment."; exit 1; \
	else \
		mut-publish public ${STAGING_BUCKET} --prefix=${PREFIX} --stage ${ARGS}; \
		echo "Hosted at ${STAGING_URL}/${PREFIX}/${USER}/${GIT_BRANCH}/index.html"; \
	fi
