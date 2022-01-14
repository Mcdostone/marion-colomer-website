.DEFAULT_GOAL=help
.PHONY: help clean build deploy
NPROC := $(shell nproc)
HOST ?= 127.0.0.1

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

_site/index.html: node_modules
	npm run build
	find _site -type f -name *.svg.*.js -exec rm {} \;
	find _site -type f -iname  "*.html" -print0 | xargs -0 -P$(NPROC) -I%  bash -c 'npx html-minifier-terser \
	--remove-tag-whitespace \
	--sort-attributes \
	--collapse-whitespace "%" -o "%"'
	find _site -type f -iname  "*.jpg" -print0 | xargs -0 -P$(NPROC) -I%  bash -c 'npx @squoosh/cli -d $$(dirname %) --avif "{}" %'
	find _site -type f -iname  "*.jpg" -print0 | xargs -0 -P$(NPROC) -I%  bash -c 'npx @squoosh/cli -d $$(dirname %) --mozjpeg "{}" %'
	find _site -type f -iname  "*.svg" | xargs npx svgo

dev: node_modules ## Start the dev server
	HOST=$(HOST) npm run dev

check: _site/index.html ## Make sure HTML is correct and URLs are up
	npx w3c-html-validator _site
	@echo "php -S 127.0.0.1:8000 -t _site/"
	npx broken-link-checker http://127.0.0.1:8000 -rfo

build: _site/index.html ## Build the website

purgecss: ## Make sure the CSS doesn't contain unused rules
	mkdir -p tmp
	npm run build
	cp _site/assets/css/style*.css tmp/original.css
	npx purgecss --css tmp/original.css --content $$(find _site/ -type f -regex ".*.html") -s "turbo-progress-bar" -o tmp/purge.css
	npx cssbeautify-cli -f tmp/original.css | sed -e 1d > tmp/style.css
	npx cssbeautify-cli -f tmp/purge.css | sed -e 1d > tmp/purged.css
	diff --color=always tmp/style.css tmp/purged.css || true
	rm tmp/original.css tmp/purge.css

clean: ## Clean _site
	rm -rf _site tmp

help: ## Show this help
	@echo "Variables:"
	@make -pn | grep -A1 "^# makefile (" | grep -v "^#\|^--\|^MAKEFILE_LIST" | sort | uniq | awk 'BEGIN {FS = ":?= "}; {printf "  \033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@echo "\nTargets:"
	@grep -E '^[/a-zA-Z0-9_-]+: .*?## .*$$' $(MAKEFILE_LIST) | sort | awk  'BEGIN {FS = ": .*?## "}; {printf "  \033[36m%-30s\033[0m %s\n", $$1, $$2}'
