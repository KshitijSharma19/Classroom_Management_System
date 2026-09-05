import os
import shutil
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
original_db = os.path.join(BASE_DIR, 'cms.db')
tmp_db = '/tmp/cms.db'

# Vercel's filesystem is read-only. We must copy the DB to /tmp to read/write it.
if os.environ.get('VERCEL') or os.environ.get('VERCEL_ENV') or not os.access(BASE_DIR, os.W_OK):
    if not os.path.exists(tmp_db):
        try:
            shutil.copy2(original_db, tmp_db)
        except Exception:
            pass
    db_path = tmp_db
else:
    db_path = original_db

SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
