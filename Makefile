.DEFAULT_GOAL=help
.PHONY: help clean build deploy
NPROC=$(shell nproc)

node_modules:
	npm install

deploy: clean build ## Deploy the website
	git clone git@github.com:Mcdostone/mcdostone.github.io.git website --depth 1
	rm -r website/*
	cp -r _site/* website/
	git -C website add .
	git -C website commit -m "new update"
	git -C website push
	rm -rf website

_site: node_modules
	npm run build
	find _site -type f -name *.svg.*.js -exec rm {} \;
	find _site -type f -iname  "*.jpg" -print0 | xargs -0 -P$(NPROC) -I%  bash -c 'npx @squoosh/cli -d $$(dirname %) --mozjpeg "{}" %'

check-links: _site
	@echo "php -S 127.0.0.1:8000 -t _site/"
	npx broken-link-checker http://127.0.0.1:8000 -rfo

build: _site ## Build the website

clean: ## Clean _site
	rm -rf _site

help: ## Show this help !
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
