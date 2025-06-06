import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# Make sure the models and Base are accessible
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import Base  # This is your declarative_base
import models  # This MUST import Pessoa and Consumo classes

# Read config and set up logging
config = context.config
fileConfig(config.config_file_name)

# Tell Alembic where to find the metadata
target_metadata = Base.metadata

def run_migrations_offline():
    """Run migrations without a DB connection."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations with a DB connection."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
