// src/components/SummaryChart.js
import React, { useMemo } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function SummaryChart({ transactions = [] }) {
  const expenseByCategory = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + Number(t.amount || 0);
      }
    });
    const labels = Object.keys(map);
    const data = Object.values(map);
    return { labels, data };
  }, [transactions]);

  const monthlyByType = useMemo(() => {
    // group by month label
    const map = {};
    transactions.forEach(t => {
      const d = t.createdAt?.toDate ? t.createdAt.toDate() : new Date(t.createdAt || t.date || Date.now());
      const label = d.toLocaleString(undefined, { month: "short", year: "numeric" });
      if (!map[label]) map[label] = { income: 0, expense: 0 };
      if (t.type === "income") map[label].income += Number(t.amount || 0);
      else map[label].expense += Number(t.amount || 0);
    });

    const labels = Object.keys(map).sort((a,b)=>{
      // rough sort by parsing month-year
      return new Date(a) - new Date(b);
    });
    const income = labels.map(l => map[l].income);
    const expense = labels.map(l => map[l].expense);
    return { labels, income, expense };
  }, [transactions]);

  return (
    <div style={{ marginTop: 12 }}>
      <h3>Category distribution (expenses)</h3>
      {expenseByCategory.labels.length === 0 ? <p>No expense categories yet.</p> :
        <div style={{ maxWidth: 480 }}>
          <Pie data={{ labels: expenseByCategory.labels, datasets: [{ data: expenseByCategory.data, backgroundColor: undefined }] }} />
        </div>
      }

      <h3 style={{ marginTop: 22 }}>Monthly Income vs Expense</h3>
      {monthlyByType.labels.length === 0 ? <p>No monthly data yet.</p> :
        <div style={{ maxWidth: 700 }}>
          <Bar
            data={{
              labels: monthlyByType.labels,
              datasets: [
                { label: "Income", data: monthlyByType.income },
                { label: "Expense", data: monthlyByType.expense }
              ]
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
              scales: { y: { beginAtZero: true, ticks: { callback: (v) => `₹${v}` } } }
            }}
          />
        </div>
      }
    </div>
  );
}

export default SummaryChart;
