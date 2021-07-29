.DEFAULT_GOAL=help
.PHONY: help clean build deploy

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

build: _site ## Build the website

clean: ## Clean _site
	rm -r _site

help: ## Show this help !
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
