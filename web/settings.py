from pathlib import Path
from starlette.config import Config
import databases
import os

config = Config(".env")


DEBUG = config("DEBUG", cast=bool, default=False)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

REACT_APP_DIR = os.path.join(BASE_DIR, 'reactcode')

STATIC_DIR = os.path.join(REACT_APP_DIR, 'build', 'static')

DATABASE_URL = config(
    "DATABASE_URL",
    cast=databases.DatabaseURL,
    default="postgresql://postgres:postgres@db:5432/vectorai",
)
if DATABASE_URL.dialect == "postgres":
    DATABASE_URL = DATABASE_URL.replace(dialect="postgresql")  # pragma: nocover
