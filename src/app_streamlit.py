import streamlit as st
import pandas as pd
import os
import sys

# Add src to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.analyze import fetch_frame, calculate_kpis, monthly_trends
from src.ingest import read_bank_csv, upsert_transactions
from src.categorize import run_categorization
from src.report import export_month

st.set_page_config(page_title="Personal Expense Tracker", page_icon="💸", layout="wide")

# Sidebar - Settings & Upload
st.sidebar.title("Configuration")
db_path = "data/expenses.db"

# Check if data exists
if not os.path.exists(db_path):
    st.warning("Database not found. Please run the sample data generator or upload a CSV.")
    if st.button("Generate Sample Data"):
        import subprocess
        subprocess.run(["python3", "data/generate_mock_data.py"])
        st.rerun()

st.sidebar.header("Upload Data")
uploaded_file = st.sidebar.file_uploader("Upload Bank CSV", type=["csv"])

if uploaded_file:
    # Basic mapping for our mock CSV or custom
    df_new = read_bank_csv(uploaded_file, "Manual_Upload", "Date", "Narration", "Amount")
    if not df_new.empty:
        upsert_transactions(df_new)
        run_categorization()
        st.sidebar.success(f"Successfully ingested {len(df_new)} rows!")

# Main Dashboard
st.title("💸 Personal Expense Tracker & Insights")
st.markdown("---")

df = fetch_frame(db_path)

if not df.empty:
    kpis = calculate_kpis(df)
    
    # KPI Row
    col1, col2, col3 = st.columns(3)
    col1.metric("Total Spending", f"₹{kpis['total_spend']:,.2f}", delta_color="inverse")
    col2.metric("Total Income", f"₹{kpis['total_income']:,.2f}")
    col3.metric("Net Savings", f"₹{kpis['savings']:,.2f}", delta=f"{kpis['savings']:.1f}")

    st.markdown("### Spending Trends")
    t1, t2 = st.tabs(["Monthly Trend", "Category Split"])

    with t1:
        trend_df = monthly_trends(df)
        st.line_chart(trend_df.set_index("month"))

    with t2:
        st.bar_chart(kpis["top_categories"])

    # Detailed View
    st.markdown("### Transaction Analysis")
    selected_month = st.selectbox("Select Month for Report", sorted(df["month"].unique(), reverse=True))
    
    filtered_df = df[df["month"] == selected_month]
    st.dataframe(filtered_df, use_container_width=True)

    if st.button(f"Generate Excel Report for {selected_month}"):
        report_path = export_month(selected_month)
        if report_path:
            with open(report_path, "rb") as f:
                st.download_button(
                    label="Download Excel Report",
                    data=f,
                    file_name=os.path.basename(report_path),
                    mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )

else:
    st.info("No data available. Please upload a CSV or generate sample data in the sidebar.")
