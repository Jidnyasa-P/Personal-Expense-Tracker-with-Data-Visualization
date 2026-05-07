# Interview Preparation Guide 🎤
**Project: Personal Expense Tracker with Data Visualization**

### 1. Explain your project.
"I developed a Personal Expense Tracker that automates the boring parts of finance management. It takes raw bank CSV exports, cleans the data, and uses a rule-based categorization engine to tag expenses. The data is stored in a structured SQLite database, which allows for complex queries. I also built a Streamlit dashboard that visualizes spending patterns and generates monthly performance reports in Excel format."

### 2. What problem does this project solve?
"Most people struggle to track where their money goes. Manual logging is tedious, and banking apps are often hard to export from. This tool bridges the gap by allowing users to import their own data, customize categorization rules, and get a unified view across multiple accounts."

### 3. Why did you choose SQLite over CSV for storage?
"While CSVs are great for ingestion, they aren't ideal for long-term storage or complex analysis. SQLite allows for **Data Integrity** (using primary keys to prevent duplicate transactions) and **Relational Mapping** (linking transactions to a categories table). It’s also much faster as the dataset grows."

### 4. How does the categorization rule engine work?
"Currently, it uses a regex-based keyword matching system. It scans transaction descriptions for common merchants (like 'Amazon', 'Uber', 'Swiggy') and assigns them to categories like 'Shopping' or 'Transport'. I designed it to be modular so that a Machine Learning classifier (like Naive Bayes) could be integrated later."

### 5. What was the biggest technical challenge?
"Handling inconsistent date formats and special characters in bank CSVs. I used Pandas' `to_datetime` with `errors='coerce'` and customized cleaning strings to ensure the pipeline doesn't break when a bank changes its export format."

### 6. Technical Stack Used:
- **Language**: Python 3.x
- **Data Handling**: Pandas, NumPy
- **Storage**: SQLite3
- **Visualization**: Streamlit, Matplotlib
- **Reporting**: XlsxWriter

---

### Tips for HR Round:
- **Highlight the Value**: "I built this to improve my own financial literacy while mastering Python data tools."
- **Focus on Impact**: "The automated reporting saves roughly 30 minutes of manual work every month."
- **Future Roadmap**: Mention that you plan to add OCR for receipt scanning or an API integration with Open Banking.
