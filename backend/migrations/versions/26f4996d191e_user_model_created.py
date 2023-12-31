"""User model created

Revision ID: 26f4996d191e
Revises: 37f33ce8388b
Create Date: 2023-09-29 13:08:38.782229

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '26f4996d191e'
down_revision = '37f33ce8388b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=25), nullable=False),
    sa.Column('email', sa.String(length=50), nullable=False),
    sa.Column('password', sa.Text(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    # ### end Alembic commands ###
