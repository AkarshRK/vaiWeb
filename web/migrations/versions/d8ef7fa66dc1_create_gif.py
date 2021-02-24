"""Create gif

Revision ID: d8ef7fa66dc1
Revises: 
Create Date: 2021-02-20 22:42:13.299818

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd8ef7fa66dc1'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('Gifs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('position', sa.Integer(), nullable=False),
    sa.Column('type_name', sa.String(), nullable=True),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('gif_url', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('Gifs')