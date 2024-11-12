from typing import Any

import uvicorn
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from loguru import logger


app = FastAPI()


@app.get("/ping", response_class=PlainTextResponse)
async def ping(q: str | None = None) -> Any:
    logger.debug("start ", q=q)
    logger.info("start ", q=q)
    name = "Vova"
    logger.error(f"start check {name}", q=q)
    return "pong"


if __name__ == "__main__":
    uvicorn.run(app)
