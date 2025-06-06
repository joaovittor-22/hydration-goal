import sqlite3

conn = sqlite3.connect("test.db")
cursor = conn.cursor()

cursor.execute("PRAGMA foreign_keys = OFF;")

cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
tables = cursor.fetchall()

for (table_name,) in tables:
    cursor.execute(f'DELETE FROM "{table_name}";')

conn.commit()
cursor.execute("PRAGMA foreign_keys = ON;")
conn.close()
