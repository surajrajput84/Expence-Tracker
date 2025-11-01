// src/components/AddTransaction.js
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

function AddTransaction({ user }) {
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !amount || !date) {
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
        amount: Number(amount),
        date: Timestamp.fromDate(new Date(date)),
        createdAt: Timestamp.now(),
      });

      alert("Transaction added successfully!");

      // Reset form
      setCategory("");
      setAmount("");
      setDate("");
      setType("expense");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction. Please try again.");
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: 8,
        marginBottom: 30,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Add Transaction</h3>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={inputStyle}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="text"
          placeholder="Category (e.g., Food, Salary)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #ccc",
  flex: "1 1 150px",
};

export default AddTransaction;
