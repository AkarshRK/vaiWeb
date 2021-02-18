import sqlalchemy


metadata = sqlalchemy.MetaData()


Gifs = sqlalchemy.Table(
    "Gifs",
    metadata,
    sqlalchemy.Column("position", sqlalchemy.Integer),
    sqlalchemy.Column("type_name", sqlalchemy.String),
    sqlalchemy.Column("title", sqlalchemy.String)
)
