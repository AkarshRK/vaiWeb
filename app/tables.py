import sqlalchemy


metadata = sqlalchemy.MetaData()


Gifs = sqlalchemy.Table(
    "Gifs",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("position", sqlalchemy.Integer),
    sqlalchemy.Column("type_name", sqlalchemy.String),
    sqlalchemy.Column("title", sqlalchemy.String),
    sqlalchemy.Column("gif_url", sqlalchemy.String)
)
