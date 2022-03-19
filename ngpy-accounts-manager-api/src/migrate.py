import sys

sys.path.append('./site-packages')

import alembic.config

if __name__ == '__main__':
    alembic_args = [
        '--raiseerr',
        'upgrade', 'head',
    ]
    alembic.config.main(argv=alembic_args)
