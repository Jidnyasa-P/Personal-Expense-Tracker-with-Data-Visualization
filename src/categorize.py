import re
import sqlite3
import pandas as pd

# Keywords for rule-based categorization
RULES = {
    "Groceries": [r"big bazaar", r"reliance fresh", r"d-mart", r"grocery", r"supermart", r"blinkit", r"instamart"],
    "Food & Dining": [r"swiggy", r"zomato", r"restaurant", r"cafe", r"coffee", r"starbucks", r"mcdonalds"],
    "Transport": [r"uber", r"ola", r"metro", r"fuel", r"petrol", r"diesel", r"bus", r"rapido"],
    "Bills & Utilities": [r"electric", r"water", r"wifi", r"broadband", r"mobile recharge", r"dth", r"jio", r"airtel"],
    "Shopping": [r"amazon", r"flipkart", r"myntra", r"ajio", r"zara", r"h&m"],
    "Entertainment": [r"netflix", r"amazon prime", r"spotify", r"cinema", r"bookmyshow", r"pvr"],
    "Income": [r"salary", r"payout", r"refund", r"reimbursement", r"interest"]
}

def classify(description):
    """
    Classifies a transaction description based on regex rules.
    """
    desc = description.lower()
    for cat, patterns in RULES.items():
        if any(re.search(p, desc) for p in patterns):
            return cat
    return "Uncategorized"

def run_categorization(db_path="data/expenses.db"):
    """
    Updates unassigned transactions with categories.
    """
    con = sqlite3.connect(db_path)
    
    # 1. Fetch transactions without a category
    df = pd.read_sql_query("SELECT id, description, amount FROM transactions WHERE category_id IS NULL", con)
    
    if df.empty:
        con.close()
        return

    # 2. Get category mapping
    cats = pd.read_sql_query("SELECT id, name FROM categories", con)
    name_to_id = dict(zip(cats["name"], cats["id"]))
    
    # 3. Apply classification and update DB
    for row in df.itertuples():
        # Income is based on positive amount
        if row.amount > 0:
            cat_name = "Income"
        else:
            cat_name = classify(row.description)
            
        cat_id = name_to_id.get(cat_name, name_to_id.get("Uncategorized"))
        
        con.execute("UPDATE transactions SET category_id=? WHERE id=?", (cat_id, row.id))
    
    con.commit()
    con.close()
    print("Categorization complete.")

if __name__ == "__main__":
    run_categorization()
