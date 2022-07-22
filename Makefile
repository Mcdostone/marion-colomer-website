.DEFAULT_GOAL=help
.PHONY: help clean build deploy
NPROC := $(shell nproc)
HOST ?= 127.0.0.1 ## test
BASE_URL ?= /


node_modules: package.json
	npm install

_site: clean node_modules
	npm run eleventy
	npm run vite
	npx ts-node modules/build/post-processor.ts _site/ $(BASE_URL)

%:
	npm run $*

dev: node_modules ## Start the dev serve
	$(MAKE) -j2 dev-eleventy dev-vite

preview: node_modules
	$(MAKE) _site NODE_ENV=$@
	php -S localhost:8000 -t _site/

production: node_modules
	$(MAKE) _site NODE_ENV=$@

build: production

purgecss: build ## Make sure the CSS doesn't contain unused rules
	mkdir -p tmp
	cp _site/assets/css/style*.css tmp/original.css
	npx purgecss --css tmp/original.css --content $$(find _site/ -type f -regex ".*.html") -s "turbo-progress-bar" -o tmp/purge.css
	npx cssbeautify-cli -f tmp/original.css | sed -e 1d > tmp/style.css
	npx cssbeautify-cli -f tmp/purge.css | sed -e 1d > tmp/purged.css
	diff tmp/style.css tmp/purged.css || true
	rm tmp/original.css tmp/purge.css

clean: ## Clean _site
	rm -rf _site

help: ## Show this help
	@echo "Variables:"
	@make -pn | awk '/^# (makefile |command)/{getline; print}' | grep -v "^MAKEFILE_LIST" | sort | uniq | awk 'BEGIN {FS = ":?= "}; {printf "  \033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo "\nTargets:"
	@grep -E '^[/a-zA-Z0-9_-]+: .*?## .*$$' $(MAKEFILE_LIST) | sort | awk  'BEGIN {FS = ": .*?## "}; {printf "  \033[36m%-30s\033[0m %s\n", $$1, $$2}'
