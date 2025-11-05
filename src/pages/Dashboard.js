// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  Timestamp,
} from "firebase/firestore";
import AddTransaction from "../components/AddTransaction";
import ExpenseList from "../components/ExpenseList";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#4caf50", "#f44336", "#007bff", "#ff9800"];

function Dashboard({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    loanGiven: 0,
    debtTaken: 0,
    balance: 0,
  });

  useEffect(() => {
    const q = query(
      collection(db, "transactions"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = allData.filter((t) => {
        const d = t.date?.toDate?.() || t.createdAt?.toDate?.();
        return (
          d &&
          d.getMonth() + 1 === Number(monthFilter) &&
          d.getFullYear() === Number(yearFilter)
        );
      });

      setTransactions(filtered);

      // 💰 Calculate totals
      const income = filtered
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expense = filtered
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const loanGiven = filtered
        .filter((t) => t.type === "loan" && t.loanType === "given")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const debtTaken = filtered
        .filter((t) => t.type === "loan" && t.loanType === "taken")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      setSummary({
        income,
        expense,
        loanGiven,
        debtTaken,
        balance: income - expense - debtTaken + loanGiven,
      });
    });

    return unsubscribe;
  }, [user.uid, monthFilter, yearFilter]);

  const handleAddTransaction = async (transaction) => {
    try {
      await addDoc(collection(db, "transactions"), {
        ...transaction,
        uid: user.uid,
        createdAt: Timestamp.now(),
      });
      alert("✅ Transaction added successfully!");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("❌ Failed to add transaction. Try again.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const pieData = [
    { name: "Income", value: summary.income },
    { name: "Expense", value: summary.expense },
    { name: "Loan Given", value: summary.loanGiven },
    { name: "Debt Taken", value: summary.debtTaken },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa, #f1f8e9)",
        padding: "30px 10%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ color: "#333" }}>
          Welcome,{" "}
          <span style={{ color: "#007bff" }}>
            {user.displayName || user.email}
          </span>
        </h2>
        <button
          onClick={handleLogout}
          style={{
            background: "linear-gradient(45deg, #ff4e50, #f9d423)",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          Logout
        </button>
      </div>

      {/* Add Transaction */}
      <AddTransaction user={user} onAdd={handleAddTransaction} />

      {/* Month + Year Filter */}
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          background: "#fff",
          padding: "12px 16px",
          borderRadius: 10,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: 20,
        }}
      >
        <label style={{ fontWeight: 600 }}>Filter:</label>
        <select
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          style={filterStyle}
        >
          {[...Array(12).keys()].map((m) => (
            <option key={m + 1} value={m + 1}>
              {new Date(0, m).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          style={filterStyle}
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div style={summaryContainer}>
        <div style={{ ...summaryCard, borderTop: "4px solid #4caf50" }}>
          <h4>Income</h4>
          <p style={{ color: "#4caf50", fontSize: 22, fontWeight: 700 }}>
            ₹{summary.income}
          </p>
        </div>
        <div style={{ ...summaryCard, borderTop: "4px solid #f44336" }}>
          <h4>Expense</h4>
          <p style={{ color: "#f44336", fontSize: 22, fontWeight: 700 }}>
            ₹{summary.expense}
          </p>
        </div>
        <div style={{ ...summaryCard, borderTop: "4px solid #007bff" }}>
          <h4>Loan Given</h4>
          <p style={{ color: "#007bff", fontSize: 22, fontWeight: 700 }}>
            ₹{summary.loanGiven}
          </p>
        </div>
        <div style={{ ...summaryCard, borderTop: "4px solid #ff9800" }}>
          <h4>Debt Taken</h4>
          <p style={{ color: "#ff9800", fontSize: 22, fontWeight: 700 }}>
            ₹{summary.debtTaken}
          </p>
        </div>
        <div style={{ ...summaryCard, borderTop: "4px solid #2196f3" }}>
          <h4>Balance</h4>
          <p
            style={{
              color: summary.balance >= 0 ? "#4caf50" : "#f44336",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            ₹{summary.balance}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          borderRadius: 12,
          padding: 20,
          marginTop: 30,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          height: 320,
        }}
      >
        <h3>Income vs Expense vs Loan/Debt</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction List */}
      <div style={{ marginTop: 30 }}>
        <ExpenseList transactions={transactions} />
      </div>
    </div>
  );
}

const filterStyle = {
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ccc",
  background: "#f8f9fa",
  fontWeight: 500,
};

const summaryContainer = {
  display: "flex",
  gap: 20,
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: 10,
};

const summaryCard = {
  flex: "1 1 220px",
  textAlign: "center",
  background: "rgba(255,255,255,0.95)",
  padding: "18px 0",
  borderRadius: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

export default Dashboard;
