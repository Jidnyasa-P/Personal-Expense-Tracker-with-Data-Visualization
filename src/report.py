import pandas as pd
import sqlite3
import os

def export_month(month, path=None, db_path="data/expenses.db"):
    """
    Exports a monthly summary report to Excel.
    """
    if path is None:
        os.makedirs("reports", exist_ok=True)
        path = f"reports/report_{month}.xlsx"
        
    con = sqlite3.connect(db_path)
    
    # Query transactions for the specified month
    query = """
        SELECT t.tx_date, t.description, t.amount, t.account, c.name AS category
        FROM transactions t
        LEFT JOIN categories c ON c.id = t.category_id
        WHERE strftime('%Y-%m', t.tx_date) = ?
        ORDER BY t.tx_date ASC
    """
    tx_df = pd.read_sql_query(query, con, params=[month])
    con.close()
    
    if tx_df.empty:
        return None

    # Summary by Category (Pivot)
    summary_df = (
        tx_df[tx_df["amount"] < 0]
        .pivot_table(index="category", values="amount", aggfunc="sum")
        .assign(amount=lambda x: -x.amount)
        .sort_values("amount", ascending=False)
    )

    # Write to Excel with multiple sheets
    with pd.ExcelWriter(path, engine="xlsxwriter") as writer:
        tx_df.to_excel(writer, sheet_name="Transactions", index=False)
        summary_df.to_excel(writer, sheet_name="Category Summary")
        
    return path
