.PHONY: lint run test

run:
	pipenv run mypy --strict snooty
	pipenv run python -m snooty watch source 'mongodb://localhost/test?retryWrites=true'

lint:
	pipenv run mypy --strict snooty
	pipenv run flake8 --max-line-length=100 snooty

test: lint
	pipenv run pytest
