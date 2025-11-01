// src/components/Totals.js
import React, { useMemo } from "react";

function Totals({ transactions = [] }) {
  const { income, expense, balance } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if (t.type === "income") inc += Number(t.amount || 0);
      else exp += Number(t.amount || 0);
    });
    return { income: inc, expense: exp, balance: inc - exp };
  }, [transactions]);

  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      <Card title="Income" value={`₹${income.toLocaleString()}`} />
      <Card title="Expenses" value={`₹${expense.toLocaleString()}`} />
      <Card title="Balance" value={`₹${balance.toLocaleString()}`} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ flex: 1, background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: 12, color: "#666" }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{value}</div>
    </div>
  );
}

export default Totals;
