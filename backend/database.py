import psycopg
import os
from dotenv import load_dotenv

load_dotenv(".env")

def get_db_connection():
    """Get PostgreSQL database connection"""
    return psycopg.connect(
        host=os.getenv("DB_HOST"),
        dbname=os.getenv("DB_NAME"), 
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT")
    )
