from pathlib import Path
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from settings import STATIC_DIR
from endpoints import get_gifs, add_gif, delete_gif, update_positions, edit_gif

static = StaticFiles(directory=str(STATIC_DIR))

routes = [
    Route("/api/giflist", get_gifs, name="get_gif", methods=["GET"]),
    Route("/api/add", add_gif, name="add_gif", methods=["POST"]),
    Route("/api/delete/{id}", delete_gif, name="delete_gif", methods=["POST"]),
    Route("/api/update-positions", update_positions,
          name="update_positions", methods=["POST"]),
    Route("/api/update", edit_gif,
          name="update_edit", methods=["POST"]),
    Mount("/static", static, name="static"),
]
