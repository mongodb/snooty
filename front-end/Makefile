USER=$(shell whoami)
STAGING_URL="https://docs-mongodborg-staging.corp.mongodb.com"
STAGING_BUCKET=docs-mongodb-org-staging
PROJECT=snooty

.PHONY: static

static:
	-rm -r ./static/
	-rm -r ./docs-tools/
	git submodule add --force https://github.com/mongodb/docs-tools
	mkdir -p ./static/images
	mkdir -p ./staging
	mv ./docs-tools/themes/mongodb/static ./static/static/

stage:
	mut-publish staging/guides/andrew/master ${STAGING_BUCKET} --prefix=${PROJECT} --stage ${ARGS}
	@echo "Hosted at ${STAGING_URL}/${PROJECT}/andrew/master/index.html"