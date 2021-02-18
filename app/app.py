from starlette.applications import Starlette
from starlette.staticfiles import StaticFiles
from starlette.responses import HTMLResponse
from starlette.responses import JSONResponse
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

# Data base connection
import databases
from databases import DatabaseURL
from starlette.config import Config

import uvicorn

from tables import Gifs

# Database
config = Config(".env")
conString = "postgresql://postgres:postgres@localhost:5432/vectorai"
costring = "postgresql://localhost.vectorai"
# conn = await asyncpg.connect(user='dev_user', password='vai_dev',database='vectorai', host='127.0.0.1')
DATABASE_URL = config(
    "DATABASE_URL", cast=DatabaseURL, default=conString
)
print(DATABASE_URL)

database = databases.Database(DATABASE_URL)


middleware = [
    Middleware(CORSMiddleware, allow_origins=['*'])
]


app = Starlette(debug=True,
                middleware=middleware,
                on_startup=[database.connect],
                on_shutdown=[database.disconnect])
app.mount('/static', StaticFiles(directory='statics'), name='static')


@app.route('/')
async def homepage(request):
    return JSONResponse({'data': 'Home Page'})


@app.route('/api/get')
async def test(request):
    query = Gifs.select()
    results = await database.fetch_all(query)
    ls = []
    for i in results:
        ls.append({
            'title': i['title'],
            'position': i['position'],
            'type_name': i['type_name']
        })
    return JSONResponse({'detail': ls})


@app.route('/api/add')
async def test(request):
    query = Gifs.insert().values(
        position=1,
        type_name="bank-draft-2",
        title="Bank Draft"
    )
    await database.execute(query)
    return JSONResponse({
        "position": 1,
        "type_name": "bank-draft-2",
        "title": "Bank Draft"
    })


@app.route('/error')
async def error(request):
    """
    An example error. Switch the `debug` setting to see either tracebacks or 500 pages.
    """
    raise RuntimeError("Oh no")


@app.exception_handler(404)
async def not_found(request, exc):
    """
    Return an HTTP 404 page.
    """
    return JSONResponse({'detail': 'Error 404', 'request': request})


@app.exception_handler(500)
async def server_error(request, exc):
    """
    Return an HTTP 500 page.
    """
    return JSONResponse({'detail': 'Error 500', 'request': request})


if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=8000)
