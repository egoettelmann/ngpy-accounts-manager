"""adding category color

Revision ID: 2401539a8718
Revises: 3b9d3dcad544
Create Date: 2020-01-12 07:35:34.503017

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2401539a8718'
down_revision = '3b9d3dcad544'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'categories',
        sa.Column(
            'color',
            sa.String()
        )
    )
    pass


def downgrade():
    pass
