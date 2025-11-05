import React from "react";
import { db } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";

function ExpenseList({ transactions = [] }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await deleteDoc(doc(db, "transactions", id));
      alert("✅ Transaction deleted successfully!");
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("Failed to delete transaction. Please try again.");
    }
  };

  return (
    <div style={listCard}>
      <h3 style={{ color: "#222", marginBottom: "10px" }}>📜 Your Transactions</h3>
      {transactions.length === 0 ? (
        <p style={{ color: "#777" }}>No transactions found for this month.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Category</th>
                <th>Person</th>
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

                // 🎨 Dynamic color + label
                let color = "#333";
                let label = "";
                let icon = "";

                if (t.type === "income") {
                  color = "#4caf50";
                  label = "Income";
                  icon = "💰";
                } else if (t.type === "expense") {
                  color = "#e53935";
                  label = "Expense";
                  icon = "💸";
                } else if (t.type === "loan") {
                  if (t.loanType === "given") {
                    color = "#007bff"; // blue
                    label = "Loan Given";
                    icon = "📤";
                  } else if (t.loanType === "taken") {
                    color = "#ff9800"; // orange
                    label = "Debt Taken";
                    icon = "📥";
                  } else {
                    color = "#6c757d";
                    label = "Loan/Debt";
                    icon = "💱";
                  }
                }

                return (
                  <tr key={t.id}>
                    <td style={{ color, fontWeight: 600 }}>{icon} {label}</td>
                    <td>{t.category || "—"}</td>
                    <td>{t.person || "—"}</td>
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
        </div>
      )}
    </div>
  );
}

// 🎨 Clean, aligned styles
const listCard = {
  background: "#ffffff",
  borderRadius: 12,
  padding: "20px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  width: "100%",
  marginTop: "20px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "15px",
  textAlign: "center",
};

const deleteBtn = {
  background: "#f44336",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "600",
  transition: "0.3s",
  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
};

export default ExpenseList;
