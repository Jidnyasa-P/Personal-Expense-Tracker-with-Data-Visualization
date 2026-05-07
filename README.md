# Personal Expense Tracker with Data Visualization 💸

An industry-oriented Python project for personal finance management. This system imports transactions from bank CSVs, automatically categorizes them using rule-based logic, stores them in a normalized SQLite database, and provides insightful visualizations via a Streamlit dashboard.

## 🚀 Features
- **Data Ingestion**: Multi-format CSV parser with column mapping.
- **Auto-Categorization**: Regex-based classification for groceries, dining, shopping, bills, etc.
- **SQL Storage**: Clean, normalized SQLite schema for transactions and budgets.
- **KPI Analytics**: Instant calculation of Savings Rate, Burn Rate, and Top Spending Categories.
- **Interactive Dashboard**: Built with Streamlit for real-time filtering and visualization.
- **Automated Reporting**: Export monthly summaries to formatted Excel files (XLSX).

## 📁 Project Structure
```text
Personal-Expense-Tracker-Visualization/
│
├── data/               # SQLite DB and CSV datasets
├── docs/               # Documentation and Interview prep
├── src/                # Core Logic
│   ├── models.py       # DB Schema
│   ├── ingest.py       # CSV Loading
│   ├── categorize.py   # Classification Rules
│   ├── analyze.py      # KPI Logic
│   ├── report.py       # Excel Export
│   └── app_streamlit.py# Dashboard
├── reports/            # Generated Excel reports
├── main.py             # CLI Entry Point
├── requirements.txt    # Dependencies
└── README.md           # This file
```

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/Personal-Expense-Tracker.git
   cd Personal-Expense-Tracker
   ```

2. **Setup Virtual Environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Project**:
   ```bash
   # Initialize DB and generate sample data
   python main.py
   
   # Launch the Dashboard
   streamlit run src/app_streamlit.py
   ```

## 📈 Dashboard Preview
The dashboard provides:
- **Metrics**: Total Spend, Income, and Savings.
- **Visuals**: Monthly spending trends (Line Chart) and Category Split (Bar/Pie Chart).
- **Reports**: Downloadable monthly Excel exports.

## 🎓 Industry Relevance
This project demonstrates proficiency in:
- **Data Engineering**: Building ETL pipelines (Extract, Transform, Load).
- **Database Design**: Handling relational data with SQLite.
- **Analytics**: Calculating financial KPIs.
- **UX/UI**: Creating data-driven dashboards for end-users.

---
*Created for Student Portfolio & Industry Proof of Work.*
