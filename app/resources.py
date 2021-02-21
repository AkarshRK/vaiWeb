from settings import DATABASE_URL
import databases

database = databases.Database(DATABASE_URL)