"""adding transaction creation date

Revision ID: eaba24424d59
Revises: 2401539a8718
Create Date: 2021-01-10 18:43:43.066883

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'eaba24424d59'
down_revision = '2401539a8718'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'transactions',
        sa.Column(
            'create_datetime',
            sa.DateTime()
        )
    )
    pass


def downgrade():
    pass
