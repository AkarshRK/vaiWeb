from starlette.applications import Starlette
from starlette.staticfiles import StaticFiles
from starlette.responses import JSONResponse
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException
from starlette.middleware.trustedhost import TrustedHostMiddleware
from routes import routes
from resources import database
import uvicorn
import os

from settings import STATIC_DIR
from tables import Gifs
"""
    Configure middleware to allow CORS headers and set allow all host 
"""
middleware = [
    Middleware(CORSMiddleware, allow_origins=[
               '*'], allow_headers=['*'], allow_methods=['*', 'DELETE']),
    Middleware(TrustedHostMiddleware, allowed_hosts=['*']),
]


app = Starlette(debug=True,
                middleware=middleware,
                routes=routes,
                on_startup=[database.connect],
                on_shutdown=[database.disconnect])

app.mount('/static', StaticFiles(directory=STATIC_DIR), name='static')

if __name__ == "__main__":
    uvicorn.run("app:app", host='0.0.0.0', port=8000, reload=True)
