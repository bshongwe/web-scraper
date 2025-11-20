FROM python:3.11-slim
WORKDIR /usr/src/scraper
COPY pyproject.toml ./
RUN pip install --no-cache-dir poetry && poetry config virtualenvs.create false
COPY . .
RUN poetry install --only=main
# Install Playwright browsers
RUN python -m playwright install --with-deps
EXPOSE 8000
CMD ["python", "src/main.py"]
