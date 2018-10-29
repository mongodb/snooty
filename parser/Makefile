.PHONY: lint run

run:
	pipenv run mypy --strict snooty
	pipenv run python -m snooty watch 'mongodb://localhost/test?retryWrites=true' source

lint:
	pipenv run mypy --strict snooty
	pipenv run flake8 --max-line-length=100 snooty
