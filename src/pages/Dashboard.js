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
} from "recharts";

const COLORS = ["#0088FE", "#FF4444", "#00C49F", "#FFBB28", "#FF8042"];

function Dashboard({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  // 🔥 Real-time fetch of transactions for logged-in user
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

      // ✅ Filter by selected month
      const filtered = allData.filter((t) => {
        const d = t.date?.toDate?.() || t.createdAt?.toDate?.();
        return d && d.getMonth() + 1 === Number(monthFilter);
      });

      setTransactions(filtered);

      // ✅ Calculate totals
      const income = filtered
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expense = filtered
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      setSummary({
        income,
        expense,
        balance: income - expense,
      });
    });

    return unsubscribe;
  }, [user.uid, monthFilter]);

  // ➕ Add transaction (called inside AddTransaction)
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

  // 🚪 Logout function
  const handleLogout = () => {
    signOut(auth);
  };

  const pieData = [
    { name: "Income", value: summary.income },
    { name: "Expense", value: summary.expense },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.displayName || user.email}</h2>
      <button
        onClick={handleLogout}
        style={{
          background: "#dc3545",
          color: "#fff",
          border: "none",
          padding: "8px 14px",
          borderRadius: 6,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        Logout
      </button>

      {/* ➕ Add Transaction Form (now passes user) */}
      <AddTransaction user={user} onAdd={handleAddTransaction} />

      {/* 🔎 Month Filter */}
      <div style={{ marginTop: 20 }}>
        <label>
          Filter by Month:
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            style={{
              marginLeft: 10,
              padding: 5,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          >
            {[...Array(12).keys()].map((m) => (
              <option key={m + 1} value={m + 1}>
                {new Date(0, m).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 💰 Monthly Summary */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 20,
          background: "#f8f9fa",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          flexWrap: "wrap",
        }}
      >
        <div style={summaryCard}>
          <h4>Total Income</h4>
          <p style={{ color: "green", fontSize: 20 }}>₹{summary.income}</p>
        </div>
        <div style={summaryCard}>
          <h4>Total Expense</h4>
          <p style={{ color: "red", fontSize: 20 }}>₹{summary.expense}</p>
        </div>
        <div style={summaryCard}>
          <h4>Balance</h4>
          <p
            style={{
              color: summary.balance >= 0 ? "green" : "red",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            ₹{summary.balance}
          </p>
        </div>
      </div>

      {/* 📊 Income vs Expense Chart */}
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 20,
          marginTop: 20,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          height: 300,
        }}
      >
        <h3>Income vs Expense</h3>
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
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 📋 Transaction List */}
      <ExpenseList transactions={transactions} />
    </div>
  );
}

const summaryCard = {
  flex: 1,
  textAlign: "center",
  background: "#fff",
  padding: "10px 0",
  borderRadius: 8,
  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
};

export default Dashboard;
