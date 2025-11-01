// src/pages/Login.js
import React from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function Login() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8f9fa",
      }}
    >
      <h2>Expense Tracker</h2>
      <button
        onClick={handleLogin}
        style={{
          background: "#4285F4",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          marginTop: 20,
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
