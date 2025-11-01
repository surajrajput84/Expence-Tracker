// src/components/AddExpense.js
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function AddExpense() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("Please login first.");
    if (!amount || !category || !date) return alert("Please fill all fields.");

    try {
      setLoading(true);

      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        amount: Number(amount),
        category,
        type,
        date: Timestamp.fromDate(new Date(date)),
        createdAt: Timestamp.now(),
      });

      setAmount("");
      setCategory("");
      setType("expense");
      setDate("");
      alert("Transaction added successfully!");
    } catch (err) {
      console.error("Add transaction error:", err);
      alert("Failed to add transaction. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <h3>Add Transaction</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          style={input}
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          style={input}
          type="text"
          placeholder="Category (e.g. Food, Rent)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <select
          style={input}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          style={input}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button style={button} type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  maxWidth: 360,
  margin: "0 auto",
};

const input = {
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
  fontSize: 14,
};

const button = {
  background: "#2b8cff",
  color: "#fff",
  border: "none",
  padding: "10px 14px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: "bold",
};

export default AddExpense;
