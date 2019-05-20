GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
USER=$(shell whoami)
STAGING_URL="https://docs-mongodborg-staging.corp.mongodb.com"
STAGING_BUCKET=docs-mongodb-org-staging
PROJECT=guides

.PHONY: stage static

stage:
	mut-publish public ${STAGING_BUCKET} --prefix=${PROJECT} --stage ${ARGS}
	@echo "Hosted at ${STAGING_URL}/${PROJECT}/${USER}/${GIT_BRANCH}/"

static:
	-rm -r ./static/
	-rm -r ./docs-tools/
	git submodule add --force https://github.com/mongodb/docs-tools
	-mkdir -p ./static/images
	mv ./docs-tools/themes/mongodb/static ./static/static/
	mv ./docs-tools/themes/guides/static/images/bg-accent.svg ./static/static/images/bg-accent.svg
