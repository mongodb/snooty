.PHONY: lint run test nuitka

run:
	pipenv run mypy --strict snooty
	pipenv run python -m snooty watch source 'mongodb://localhost/test?retryWrites=true'

lint:
	pipenv run mypy --strict snooty
	pipenv run flake8 --max-line-length=100 snooty

test: lint
	pipenv run pytest --cov=snooty

nuitka:
	echo 'from snooty import main; main.main()' > snooty.py
	nuitka3 --lto --standalone --python-flag=no_site --remove-output snooty.py
	rm snooty.py
