// src/components/ExpenseList.js
import React from "react";
import { db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";

function ExpenseList({ transactions = [] }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await deleteDoc(doc(db, "transactions", id));
      alert("Transaction deleted successfully!");
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Failed to delete transaction. Please try again.");
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Your Transactions</h3>
      {transactions.length === 0 ? (
        <p style={{ color: "#777" }}>No transactions found.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => {
              const date =
                t.date?.toDate?.()?.toLocaleDateString?.() ||
                t.createdAt?.toDate?.()?.toLocaleDateString?.() ||
                "N/A";

              return (
                <tr key={t.id}>
                  <td style={{ color: t.type === "income" ? "green" : "red" }}>{t.type}</td>
                  <td>{t.category}</td>
                  <td>₹{t.amount}</td>
                  <td>{date}</td>
                  <td>
                    <button onClick={() => handleDelete(t.id)} style={deleteBtn}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const deleteBtn = {
  background: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
};

export default ExpenseList;
