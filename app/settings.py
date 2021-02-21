from pathlib import Path
from starlette.config import Config
import databases

config = Config(".env")


DEBUG = config("DEBUG", cast=bool, default=False)

BASE_DIR = Path(__file__).parent

TESTING = config("TESTING", cast=bool, default=False)
HTTPS_ONLY = config("HTTPS_ONLY", cast=bool, default=False)



TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "statics"

DATABASE_URL = config(
    "DATABASE_URL",
    cast=databases.DatabaseURL,
    default="postgresql://postgres:postgres@localhost:5432/vectorai",
)
if DATABASE_URL.dialect == "postgres":
    DATABASE_URL = DATABASE_URL.replace(dialect="postgresql")  # pragma: nocover
