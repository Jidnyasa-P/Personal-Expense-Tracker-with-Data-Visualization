import pandas as pd
import sqlite3
import os

STANDARD_COLS = ["tx_date", "description", "amount", "account", "raw_source"]

def read_bank_csv(path, account_name, date_col, desc_col, amt_col, sep=","):
    """
    Reads a bank CSV and maps it to the standard internal format.
    """
    try:
        df = pd.read_csv(path, sep=sep)
        
        # Data Cleaning & Conversion
        df["tx_date"] = pd.to_datetime(df[date_col]).dt.date.astype(str)
        df["description"] = df[desc_col].astype(str).str.strip()
        df["amount"] = pd.to_numeric(df[amt_col], errors="coerce")
        df["account"] = account_name
        df["raw_source"] = os.path.basename(path)
        
        # Standardize columns and drop rows with missing critical data
        df = df[STANDARD_COLS].dropna(subset=["amount", "tx_date"])
        
        return df
    except Exception as e:
        print(f"Error reading CSV {path}: {e}")
        return pd.DataFrame(columns=STANDARD_COLS)

def upsert_transactions(df, db_path="data/expenses.db"):
    """
    Inserts or ignores transactions into the database to prevent duplicates.
    """
    if df.empty:
        return
        
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    
    rows = df.to_records(index=False).tolist()
    
    cur.executemany("""
        INSERT OR IGNORE INTO transactions 
        (tx_date, description, amount, account, raw_source) 
        VALUES (?, ?, ?, ?, ?)
    """, rows)
    
    con.commit()
    con.close()
    print(f"Upserted {len(df)} transactions into {db_path}")
