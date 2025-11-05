// src/components/AddTransaction.js
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function AddTransaction({ user }) {
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [person, setPerson] = useState(""); // Person name (for loan/debt)
  const [loanType, setLoanType] = useState(""); // 👈 “Given” or “Taken” subtype

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!category || !amount || !date || (type === "loan" && (!person || !loanType))) {
      alert("Please fill all fields!");
      return;
    }

    if (!user || !user.uid) {
      alert("User not found! Please log in again.");
      return;
    }

    try {
      await addDoc(collection(db, "transactions"), {
        uid: user.uid,
        type,
        category,
        person: type === "loan" ? person : null,
        loanType: type === "loan" ? loanType : null, // 👈 Save subtype
        amount: Number(amount),
        date: Timestamp.fromDate(new Date(date)),
        createdAt: Timestamp.now(),
      });

      alert("✅ Transaction added successfully!");
      // reset
      setCategory("");
      setAmount("");
      setDate("");
      setPerson("");
      setLoanType("");
      setType("expense");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("❌ Failed to add transaction. Please try again.");
    }
  };

  return (
    <div style={cardContainer}>
      <h3 style={{ marginBottom: 10, color: "#333" }}>💸 Add Transaction</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Main Type */}
        <select value={type} onChange={(e) => setType(e.target.value)} style={inputStyle}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="loan">Loan/Debt</option>
        </select>

        {/* Subtype dropdown (only visible when loan/debt selected) */}
        {type === "loan" && (
          <select
            value={loanType}
            onChange={(e) => setLoanType(e.target.value)}
            style={inputStyle}
          >
            <option value="">-- Select Loan/Debt Type --</option>
            <option value="given">Loan Given</option>
            <option value="taken">Debt Taken</option>
          </select>
        )}

        {/* Category */}
        <input
          type="text"
          placeholder={
            type === "loan"
              ? "Purpose (e.g., Borrowed for Rent)"
              : "Category (e.g., Food, Salary)"
          }
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        />

        {/* Person */}
        {type === "loan" && (
          <input
            type="text"
            placeholder="Person/Lender/Borrower Name"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            style={inputStyle}
          />
        )}

        {/* Amount */}
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />

        {/* Date */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={addButton}>
          ➕ Add
        </button>
      </form>
    </div>
  );
}

// ✨ Styles
const cardContainer = {
  background: "rgba(255,255,255,0.95)",
  borderRadius: 12,
  padding: "20px",
  marginBottom: "25px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  transition: "0.3s",
};

const formStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  alignItems: "center",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  flex: "1 1 160px",
  fontSize: "14px",
  background: "#f9f9f9",
  transition: "border 0.3s",
};

const addButton = {
  background: "linear-gradient(45deg, #42a5f5, #4caf50)",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
};

export default AddTransaction;
