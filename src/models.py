import sqlite3
import os

def init_db(db_path="data/expenses.db"):
    """
    Initializes the SQLite database with the required schema.
    """
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    
    cur.executescript("""
    PRAGMA foreign_keys=ON;

    CREATE TABLE IF NOT EXISTS categories(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        parent TEXT
    );

    CREATE TABLE IF NOT EXISTS transactions(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tx_date TEXT, -- ISO date string (YYYY-MM-DD)
        description TEXT,
        amount REAL, -- Negative for expense, positive for income
        currency TEXT DEFAULT 'INR',
        account TEXT, -- e.g., 'HDFC', 'ICICI', 'Cash'
        category_id INTEGER,
        raw_source TEXT,
        tags TEXT,
        UNIQUE(tx_date, description, amount, account),
        FOREIGN KEY(category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS budgets(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month TEXT, -- 'YYYY-MM'
        category_name TEXT,
        limit_amount REAL
    );
    """)
    
    # Pre-seed some basic categories
    base_categories = [
        ('Groceries', None),
        ('Food & Dining', None),
        ('Transport', None),
        ('Bills & Utilities', None),
        ('Shopping', None),
        ('Entertainment', None),
        ('Income', None),
        ('Uncategorized', None)
    ]
    
    cur.executemany("INSERT OR IGNORE INTO categories (name, parent) VALUES (?, ?)", base_categories)
    
    con.commit()
    con.close()
    print(f"Database initialized at {db_path}")

if __name__ == "__main__":
    init_db()
