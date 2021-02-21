from starlette.applications import Starlette
from starlette.staticfiles import StaticFiles
from starlette.responses import JSONResponse
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException
from routes import routes
from resources import database


import uvicorn

from tables import Gifs


middleware = [
    Middleware(CORSMiddleware, allow_origins=['*'], allow_headers=['*'], allow_methods =['*', 'DELETE'])
]


app = Starlette(debug=True,
                middleware=middleware,
                routes=routes,
                on_startup=[database.connect],
                on_shutdown=[database.disconnect])
app.mount('/static', StaticFiles(directory='statics'), name='static')


@app.route('/')
async def homepage(request):
    return JSONResponse({'data': 'Home Page'})


@app.route('/api/update')
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


@app.route('/api/{id}/position/{position}')
async def test(request):
    print(request.path_params)
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


@app.route('/api/delete')
async def test(request):
    if request.method == "DELETE":
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
    raise HTTPException(status_code=400)


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


@app.exception_handler(400)
async def not_found(request, exc):
    """
    Return an HTTP 400 page. Bad request
    """
    return JSONResponse({'detail': 'Error 400 Bad request!', 'request': request})


@app.exception_handler(500)
async def server_error(request, exc):
    """
    Return an HTTP 500 page.
    """
    return JSONResponse({'detail': 'Erro 500', 'request': request})


if __name__ == "__main__":
    uvicorn.run("app:app", host='0.0.0.0', port=8000, reload=True)
