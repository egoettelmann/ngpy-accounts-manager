"""create budget tables

Revision ID: 3b9d3dcad544
Revises: 
Create Date: 2019-11-27 22:41:16.948779

"""
from alembic import op
from sqlalchemy.sql.schema import Column, ForeignKey
from sqlalchemy.sql.sqltypes import Integer, String, Numeric


# revision identifiers, used by Alembic.
revision = '3b9d3dcad544'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():

    # Creating 'budgets' table
    op.create_table(
        'budgets',
        Column('id', Integer, primary_key=True),
        Column('name', String(50), unique=True),
        Column('description', String(250)),
        Column('period', String(50)),
        Column('amount', Numeric(precision=2))
    )

    # Creating 'budgets_accounts table'
    op.create_table(
        'budgets_accounts',
        Column('budget_id', Integer, ForeignKey('budgets.id'), primary_key=True),
        Column('account_id', Integer, ForeignKey('accounts.id'), primary_key=True)
    )

    # Creating 'budgets_labels table'
    op.create_table(
        'budgets_labels',
        Column('budget_id', Integer, ForeignKey('budgets.id'), primary_key=True),
        Column('label_id', Integer, ForeignKey('labels.id'), primary_key=True)
    )
    pass


def downgrade():
    op.drop_table('budgets_accounts')
    op.drop_table('budgets_labels')
    op.drop_table('budgets')
    pass
