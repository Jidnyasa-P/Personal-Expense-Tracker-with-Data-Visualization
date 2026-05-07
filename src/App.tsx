import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  History,
  Settings,
  Download,
  AlertCircle,
  Database,
  Terminal,
  Github,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Cell 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for tailwind classes
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types for our simulation
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

const INITIAL_DATA: Transaction[] = [
  { id: '1', date: '2024-05-01', description: 'Amazon - Electronics', amount: -2500, category: 'Shopping' },
  { id: '2', date: '2024-05-02', description: 'Salary Credit', amount: 65000, category: 'Income' },
  { id: '3', date: '2024-05-04', description: 'Uber Trip', amount: -450, category: 'Transport' },
  { id: '4', date: '2024-05-05', description: 'Swiggy - Lunch', amount: -680, category: 'Food & Dining' },
  { id: '5', date: '2024-05-07', description: 'Netflix Subscription', amount: -499, category: 'Entertainment' },
  { id: '6', date: '2024-05-08', description: 'Big Bazaar - Groceries', amount: -3200, category: 'Groceries' },
  { id: '7', date: '2024-04-28', description: 'Electricity Bill', amount: -1200, category: 'Bills & Utilities' },
  { id: '8', date: '2024-04-25', description: 'Zomato - Pizza', amount: -850, category: 'Food & Dining' },
];

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_DATA);
  const [showAddForm, setShowAddForm] = useState(false);

  // Derived KPIs
  const kpis = useMemo(() => {
    const expenses = transactions.filter(t => t.amount < 0);
    const income = transactions.filter(t => t.amount > 0);
    
    const totalSpend = Math.abs(expenses.reduce((sum, t) => sum + t.amount, 0));
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const savings = totalIncome - totalSpend;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    return { totalSpend, totalIncome, savings, savingsRate };
  }, [transactions]);

  // Chart Data: Category Breakdown
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter(t => t.amount < 0).forEach(t => {
      map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Chart Data: Trend
  const trendData = useMemo(() => {
    // Simplified: group by day for top 10 recent
    return transactions
      .slice(0, 10)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(t => ({
        date: t.date.split('-').slice(1).join('/'),
        amount: Math.abs(t.amount)
      }));
  }, [transactions]);

  const addTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get('amount'));
    const isIncome = formData.get('type') === 'income';

    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      description: formData.get('desc') as string,
      amount: isIncome ? amount : -amount,
      category: formData.get('category') as string,
    };

    setTransactions([newTx, ...transactions]);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] text-slate-950">
              <Wallet size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white leading-none">PyFinance Engine</h1>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em] font-bold">Live Simulation • industry proof</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAddForm(true)}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
            >
              <Plus size={18} /> New Entry
            </button>
            <div className="hidden md:flex px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
              v1.2.0-stable
            </div>
          </div>
        </header>

        {/* Bento Grid */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-min">
          
          {/* Main KPI Cards Section */}
          <section className="md:col-span-8 md:row-span-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <KPICard 
              label="Total Spend" 
              value={`₹${kpis.totalSpend.toLocaleString()}`} 
              icon={<TrendingDown className="text-rose-400" />} 
              color="rose"
            />
            <KPICard 
              label="Total Income" 
              value={`₹${kpis.totalIncome.toLocaleString()}`} 
              icon={<TrendingUp className="text-emerald-400" />} 
              color="emerald"
            />
            <KPICard 
              label="Net Savings" 
              value={`₹${kpis.savings.toLocaleString()}`} 
              icon={<ArrowUpRight className="text-sky-400" />} 
              color="sky"
              sub={`${kpis.savingsRate.toFixed(1)}% Rate`}
            />
          </section>

          {/* Quick Status / Hardware Simulation feel */}
          <section className="md:col-span-4 md:row-span-1 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex items-center justify-between group overflow-hidden relative">
            <div className="z-10">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Database Layer</h3>
              <p className="text-white font-semibold">SQLite Storage Active</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono">Real-time Persistence</span>
              </div>
            </div>
            <Database className="text-slate-800 group-hover:text-emerald-500 transition-colors duration-500" size={50} />
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </section>

          {/* Visualization: Category Breakdown */}
          <section className="md:col-span-5 md:row-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-mono uppercase tracking-[0.2em]">
                <PieChartIcon size={14} />
                Expense categorization
              </div>
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest">Rule-Based</span>
            </div>
            
            <div className="flex-1 w-full translate-x-[-12px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#64748b" 
                    fontSize={10} 
                    width={80}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Simulation Feed: Transactions */}
          <section className="md:col-span-7 md:row-span-3 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-mono uppercase tracking-[0.2em]">
                <History size={14} />
                ETL Pipeline Stream
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.3)]" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
              </div>
            </div>
            
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {transactions.map((tx) => (
                  <motion.div 
                    layout
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:bg-slate-800/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm",
                        tx.amount > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      )}>
                        {tx.amount > 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white tracking-tight">{tx.description}</h4>
                        <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase mt-0.5">
                          {tx.category} / {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "text-sm font-bold font-mono tracking-tighter",
                      tx.amount > 0 ? "text-emerald-400" : "text-slate-100"
                    )}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Mini-Log: Python Source Info */}
          <section className="md:col-span-5 md:row-span-1 bg-black/40 border border-slate-800 rounded-3xl p-6 font-mono text-[11px] flex flex-col justify-center gap-2 group relative overflow-hidden">
            <div className="flex items-center justify-between mb-1 opacity-50 uppercase tracking-widest text-[9px]">
               <div className="flex items-center gap-2">
                <Terminal size={12} className="text-emerald-500" />
                Script Output
               </div>
               <span>Terminal v2</span>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400"><span className="text-emerald-500">$</span> python <span className="text-sky-400 underline decoration-sky-500/30 underline-offset-4">main.py</span></p>
              <p className="text-slate-500 opacity-60">Initializing SQLite Backend...</p>
              <p className="text-slate-500 opacity-60">Seeding <span className="text-emerald-500/80">150</span> mock transactions...</p>
              <p className="text-slate-300 animate-pulse font-bold mt-1">Starting Streamlit Server [Port 3000]</p>
            </div>
          </section>

          {/* Quick Nav / Hub */}
          <section className="md:col-span-12 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex flex-wrap justify-center gap-4">
              <HubLink icon={<BookOpen size={16} />} label="README.md" color="emerald" />
              <HubLink icon={<Github size={16} />} label="GitHub Steps" color="sky" />
              <HubLink icon={<CheckCircle2 size={16} />} label="Interview kit" color="amber" />
            </div>
            <div className="flex items-center gap-6">
               <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Repository Root</span>
                <span className="text-[10px] text-slate-300 font-mono">/Personal-Expense-Tracker/</span>
               </div>
               <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                  <Settings size={20} />
               </div>
            </div>
          </section>

        </main>
      </div>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500 rounded-xl text-slate-950 shadow-lg shadow-emerald-500/20">
                    <Plus size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Add Simulation Entry</h2>
                </div>
                <button onClick={() => setShowAddForm(false)} className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">✕</button>
              </div>

              <form onSubmit={addTransaction} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-3">Narration</label>
                  <input required name="desc" type="text" placeholder="e.g., Starbucks Coffee" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm text-slate-100" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-3">Amount (₹)</label>
                    <input required name="amount" type="number" placeholder="0" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none focus:border-emerald-500 text-sm text-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-3">Type</label>
                    <select name="type" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none text-sm appearance-none cursor-pointer text-slate-200">
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 pb-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-3">Category Tag</label>
                  <select name="category" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 outline-none text-sm appearance-none cursor-pointer text-slate-200">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/10 uppercase tracking-[0.2em] text-xs mt-4">
                  Push to Data Stream
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; border: 2px solid #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
}

function KPICard({ label, value, icon, color, sub }: { label: string, value: string, icon: React.ReactNode, color: string, sub?: string }) {
  const colors = {
    rose: "border-rose-500/20 bg-rose-500/[0.02]",
    emerald: "border-emerald-500/20 bg-emerald-500/[0.02]",
    sky: "border-sky-500/20 bg-sky-500/[0.02]",
  };

  return (
    <div className={cn("p-6 rounded-3xl border flex flex-col justify-between h-36 relative group overflow-hidden transition-all duration-500 hover:border-white/10", colors[color as keyof typeof colors])}>
      <div className="flex justify-between items-start">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 font-mono mt-1">{label}</h3>
        <div className="p-2 bg-slate-900 rounded-xl group-hover:scale-110 transition-transform shadow-inner">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight text-white mb-0.5">{value}</div>
        {sub && <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-600 font-mono italic">{sub}</div>}
      </div>
    </div>
  );
}

function HubLink({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  };
  return (
    <div className={cn("px-5 py-3 rounded-2xl border flex items-center gap-3 text-xs font-bold transition-all cursor-pointer", colors[color as keyof typeof colors])}>
      <span className="opacity-80">{icon}</span>
      <span className="tracking-tight uppercase">{label}</span>
    </div>
  );
}

const CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Income",
  "Uncategorized"
];

const COLORS = ['#10b981', '#0ea5e9', '#f43f5e', '#f59e0b', '#8b5cf6', '#6366f1'];
