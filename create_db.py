import sqlite3

connection = sqlite3.connect("wallet.db")
cursor = connection.cursor()

command = """CREATE TABLE IF NOT EXISTS users(phonenumber NUMBER, name TEXT)"""

cursor.execute(command)