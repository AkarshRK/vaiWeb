import sqlalchemy


metadata = sqlalchemy.MetaData()

# Gif table schema with id as primary key
Gifs = sqlalchemy.Table(
    "Gifs",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("position", sqlalchemy.Integer),
    sqlalchemy.Column("type_name", sqlalchemy.String),
    sqlalchemy.Column("title", sqlalchemy.String),
    sqlalchemy.Column("gif_url", sqlalchemy.String)
)
