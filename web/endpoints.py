
from starlette.exceptions import HTTPException
from starlette.responses import RedirectResponse, Response, JSONResponse
from tables import Gifs
from resources import database


async def get_gifs(request):
    """
        Returns a list of all the gif from the database ordered in ascending order of 
        position value
    """
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
    """
        Adds  a gif to database and returns success token as true
    """

    if request.method == "POST":
        body = await request.json()
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
    """
        Deletes the gif correspoding to id mentioned in the path param of the api url
    """

    if request.method == "POST":
        path_params = request.path_params
        query = Gifs.delete().where(
            Gifs.c.id == int(path_params['id'])
        )
        await database.execute(query)
        return JSONResponse({
            "success": "true"
        })

    raise HTTPException(status_code=400)


async def update_positions(request):
    """
        Bulk update on sort of cards 
    """

    if request.method == "POST":
        body = await request.json()
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


async def edit_gif(request):
    """
        Api to save the edit details of a gif to database and returns success token as true
    """

    if request.method == "POST":
        body = await request.json()
        if(body):
            query = Gifs.update().values(
                type_name=body['type_name'],
                title=body['title'],
                gif_url=body['gif_url']
            ).where(
                Gifs.c.id == int(body['id'])
            )
            await database.execute(query)
        return JSONResponse({
            "success": "true"
        })

    raise HTTPException(status_code=400)
