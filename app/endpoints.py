
from starlette.exceptions import HTTPException
from starlette.responses import RedirectResponse, Response, JSONResponse
from tables import Gifs
from resources import database


async def get_gifs(request):
    query = Gifs.select()
    results = await database.fetch_all(query)
    ls = []
    for i in results:
        ls.append({
            'title': i['title'],
            'position': i['position'],
            'type_name': i['type_name'],
            'gif_url': i['gif_url'],
            'id': i['id']
        })
    return JSONResponse({'data': ls})


async def add_gif(request):

    if request.method == "POST":

        query = Gifs.insert().values(
            position=body['position'],
            type_name=body['type_name'],
            title=body['title'],
            gif_url=body['gif_url']
        )
        await database.execute(query)
        return JSONResponse({
            "Success": "true"
        })

    raise HTTPException(status_code=400)


async def delete_gif(request):

    if request.method == "POST":
        path_params = request.path_params
        print("Path params", path_params)
        query = Gifs.delete().where(
            Gifs.c.id == int(path_params['id'])
        )
        await database.execute(query)
        return JSONResponse({
            "Success": "true"
        })

    raise HTTPException(status_code=400)
