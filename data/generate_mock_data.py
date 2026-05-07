import pandas as pd
import random
from datetime import datetime, timedelta
import os
import sys

# Add src to path if needed
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.models import init_db
from src.ingest import upsert_transactions
from src.categorize import run_categorization

def generate_sample_csv(filename="data/mock_expenses.csv"):
    """
    Generates a synthetic CSV bank statement.
    """
    os.makedirs("data", exist_ok=True)
    
    categories = {
        "Amazon": "Shopping",
        "Uber": "Transport",
        "Swiggy": "Food & Dining",
        "Zomato": "Food & Dining",
        "Big Bazaar": "Groceries",
        "Rent Payment": "Bills & Utilities",
        "Salary": "Income",
        "Electricity Bill": "Bills & Utilities",
        "Jio Recharge": "Bills & Utilities",
        "Netflix": "Entertainment",
        "Starbucks": "Food & Dining"
    }

    data = []
    start_date = datetime.now() - timedelta(days=90)
    
    for i in range(150):
        date = start_date + timedelta(days=random.randint(0, 90))
        desc = random.choice(list(categories.keys()))
        
        if desc == "Salary":
            amt = random.randint(50000, 80000)
        elif desc == "Rent Payment":
            amt = -15000
        else:
            amt = -random.randint(100, 3000)
            
        data.append({
            "Date": date.strftime("%Y-%m-%d"),
            "Narration": desc,
            "Amount": amt,
            "Mode": random.choice(["UPI", "Debit Card", "NetBanking"])
        })
        
    df = pd.DataFrame(data)
    df.to_csv(filename, index=False)
    print(f"Generated mock data: {filename}")
    return filename

if __name__ == "__main__":
    init_db()
    csv_path = generate_sample_csv()
    
    # Simulate a user ingesting this data
    from src.ingest import read_bank_csv
    df = read_bank_csv(csv_path, account_name="HDFC_Primary", date_col="Date", desc_col="Narration", amt_col="Amount")
    upsert_transactions(df)
    run_categorization()
    print("Project seeded with mock data successfully.")
