
from starlette.exceptions import HTTPException
from starlette.responses import RedirectResponse, Response, JSONResponse
from tables import Gifs
from resources import database


async def get_gifs(request):
    query = Gifs.select().order_by("position")
    results = await database.fetch_all(query)
    ls = []
    for i in results:
        ls.append({
            'title': i['title'],
            'type_name': i['type_name'],
            'gif_url': i['gif_url'],
            'id': i['id']
        })
    return JSONResponse({'data': ls})


async def add_gif(request):

    if request.method == "POST":
        body = await request.body
        query = Gifs.insert().values(
            position=body['position'],
            type_name=body['type_name'],
            title=body['title'],
            gif_url=body['gif_url']
        )
        await database.execute(query)
        return JSONResponse({
            "success": "true"
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
            "success": "true"
        })

    raise HTTPException(status_code=400)


async def update_positions(request):

    if request.method == "POST":
        body = await request.json()
        print(body)
        if(body['updateList']):
            for gif in body['updateList']:
                query = Gifs.update().values(position=gif['position']).where(
                    Gifs.c.id == int(gif['id'])
                )
                await database.execute(query)
        return JSONResponse({
            "success": "true"
        })

    raise HTTPException(status_code=400)
