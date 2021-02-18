from pathlib import Path
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from settings import STATIC_DIR

static = StaticFiles(directory=str(STATIC_DIR))

routes = [
    Mount("/static", static, name="static"),
]