from fastapi import FastAPI, Query
from playwright.async_api import async_playwright
import asyncio

app = FastAPI()

@app.get('/fetch')
async def fetch(url: str = Query(...)):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, wait_until='networkidle')
        content = await page.content()
        await browser.close()
        return { 'content': content }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
