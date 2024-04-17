# Remove make's default rules.
.SUFFIXES:

SHELL := bash -O globstar

# Tool setup

eslint_opts := --format unix
eslint_strict_opts := --rule 'no-console: 1'

all: pretty lint

pretty:
	prettier --write 'projects/**/*.js' 'projects/**/*.css' 'projects/**/*.json'

lint:
	npx eslint $(eslint_opts) projects/**/*.js

lint_version:
	npx eslint --version

strict_lint:
	npx eslint $(eslint_opts) $(eslint_strict_opts) *.js modules/*.js

quick_lint:
	npx eslint $(eslint_opts) --fix $(shell git diff --name-only | grep '.js$$')

pristine:
	git clean -fdx


.PHONY: setup pretty tidy lint fixmes ready strict_lint serve publish clean pristine
