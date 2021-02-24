# React.js, Starlette and PostgreSQL application 
## _Dockerized application_

## Requirements:
- Docker
- Docker Compose
- NodeJS and npm

## Application Features

- Add a gif card (type, title, gif url)
- Drag and drop gif card to sort the cards
- Edit and save gif card 
- View the gif card as overlay on clicking
- Delete a gif card
- Last saved time 

## Additional Features

- Used browser's local storage to store the data to ensure data permanence even on reloads
- Runs a check every 5 seconds on the gif array list to check whether it's dirty and saves it to the backend
>Note: Every drag and drop sort action in grid does not save to backend instead checks for the same every 5 second__

# Tech Stack

__React.js__( react-bootstrap, react-sortablejs)
__Node.js__
__Starlette__
__Docker__
__PostgreSQL__

## Installation

Clone the above repo:
```sh
git clone https://github.com/AkarshRK/vaiWeb.git
cd vaiWeb
```

Install the react packages...

```sh
npm install --prefix ./web/reactcode/
```

Build static build files (css,js,media) from react code...

```sh
npm run build --prefix ./web/reactcode/
```

Docker compose to create docker containers...

```sh
docker-compose up -d --build
```

Once when the docker containers are built, migrate the database schema using alembic...

```sh
docker-compose exec web alembic upgrade head 
```

Run the frontend code!
```sh
docker-compose exec web npm start --prefix ./reactcode/
```

The back end code will be running by default at: 
```sh
0.0.0.0:8000
```

## My thoughts during the application development: 

It is a small app with cute little cat gifs!

Front End Code structure:
- Made resuable react components 
- Used lodash functions for efficient use of javascript functions
- Use of browser localstorage to avoid redundant/unnecessary api calls 

Back end code structure:
- Easy folder structured (endpoint functions, resources, settings, tables..)

Challenges/Debugging:
- Right way to tell the UI when the data is dirty and update local storage accordingly.
- Use of callback function using setInterval wasn't very straightforward and had to research and use a custom hook.
- As it was my first time using Docker, it took me a little long to dockerize the application.


>__Overall, it was very fun working with cat gifs!__
