.DEFAULT_GOAL=help
.PHONY: dev help
HUGO = hugo
OS_NAME :=
ifeq ($(OS),Windows_NT)
	OS_NAME=windows
	ifeq ($(PROCESSOR_ARCHITECTURE),AMD64)
		OS_NAME:=$(OS_NAME)-64bit
	endif
	ifeq ($(PROCESSOR_ARCHITECTURE),x86)
		OS_NAME:=$(OS_NAME)-32bit
	endif
else
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		OS_NAME=linux
	endif
	ifeq ($(UNAME_S),Darwin)
		OS_NAME=macOS
	endif
	UNAME_P := $(shell uname -p)
	ifeq ($(UNAME_P),x86_64)
		OS_NAME:=$(OS_NAME)-64bit
	endif
	ifneq ($(filter %86,$(UNAME_P)),)
		OS_NAME:=$(OS_NAME)-32bit
	endif
endif


$(HUGO): ## Download the binary hugo
	curl -s https://api.github.com/repos/gohugoio/hugo/releases/latest \
	| grep "$(OS_NAME)" \
	| cut -d : -f 2,3 \
	| tr -d \" \
	| tail -1 \
	| wget -qi - -O hugo.tar.gz
	tar -zxvf hugo.tar.gz hugo
	rm hugo.tar.gz


dev: $(HUGO) ## Runs the dev server
	hugo server -D


help: ## Show this help !
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
