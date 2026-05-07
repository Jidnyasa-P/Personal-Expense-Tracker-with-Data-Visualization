import sqlite3
import pandas as pd

def fetch_frame(db_path="data/expenses.db"):
    """
    Fetches the full transaction list with joined categories.
    """
    con = sqlite3.connect(db_path)
    query = """
        SELECT t.tx_date, t.description, t.amount, t.account, c.name AS category
        FROM transactions t
        LEFT JOIN categories c ON c.id = t.category_id
    """
    df = pd.read_sql_query(query, con, parse_dates=["tx_date"])
    con.close()
    
    # Add helper columns
    df["month"] = df["tx_date"].dt.to_period("M").astype(str)
    return df

def calculate_kpis(df):
    """
    Calculates key performance indicators from the dataframe.
    """
    # Filter expenses (amount < 0)
    expenses = df[df["amount"] < 0]
    income = df[df["amount"] > 0]
    
    total_spend = -expenses["amount"].sum()
    total_income = income["amount"].sum()
    savings = total_income - total_spend
    
    top_cats = (
        -expenses.groupby("category")["amount"].sum()
        .sort_values(ascending=False).head(5)
    )
    
    return {
        "total_spend": total_spend,
        "total_income": total_income,
        "savings": savings,
        "top_categories": top_cats
    }

def monthly_trends(df):
    """
    Groups spending by month.
    """
    expenses = df[df["amount"] < 0]
    return -expenses.groupby("month")["amount"].sum().reset_index()
