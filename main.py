import os
import subprocess
import sys

def main():
    """
    Main entry point for the project.
    """
    print("--- Personal Expense Tracker ---")
    
    db_path = "data/expenses.db"
    
    # 1. Initialize DB if not exists
    if not os.path.exists(db_path):
        print("Initializing database...")
        from src.models import init_db
        init_db()
        
    # 2. Check for data
    print("Checking for existing data...")
    try:
        from src.analyze import fetch_frame
        df = fetch_frame(db_path)
        if df.empty:
            print("No data found. Generating mock data for demonstration...")
            subprocess.run([sys.executable, "data/generate_mock_data.py"])
    except Exception:
        print("Error checking data. Seeding database...")
        subprocess.run([sys.executable, "data/generate_mock_data.py"])

    print("\nProject is ready!")
    print("To launch the Streamlit dashboard, run:")
    print("  streamlit run src/app_streamlit.py")
    print("\nTo generate a report manually, you can use src/report.py")

if __name__ == "__main__":
    main()
