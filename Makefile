.PHONY: static

static:
	-rm -r ./static/
	-rm -r ./docs-tools/
	git submodule add --force https://github.com/mongodb/docs-tools
	-mkdir -p ./static/images
	mv ./docs-tools/themes/mongodb/static ./static/static/