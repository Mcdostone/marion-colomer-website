.DEFAULT_GOAL=help
.PHONY: dev help clean build

vendor: 
	bundle config set path vendor/bundle
	bundle install

node_modules: package.json
	npm install

dev: vendor node_modules ## Runs the dev server
	bundle exec jekyll serve --trace

_site: build

build: vendor
	bundle exec jekyll build

clean:
	bundle exec jekyll clean

help: ## Show this help !
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
