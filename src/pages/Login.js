import React from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function Login() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>💰 Expense Tracker</h1>
        <p style={styles.subtitle}>Track your income and expenses easily</p>

        <button onClick={handleLogin} style={styles.googleBtn}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            style={{ width: 22, marginRight: 10 }}
          />
          Sign in with Google
        </button>

        <p style={styles.footer}>Securely powered by Firebase 🔒</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    background: "#fff",
    padding: "40px 60px",
    borderRadius: 16,
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "transform 0.3s ease",
  },
  title: {
    marginBottom: 10,
    fontSize: "28px",
    color: "#2e7d32",
  },
  subtitle: {
    color: "#555",
    fontSize: "15px",
    marginBottom: 30,
  },
  googleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#4285F4",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    width: "100%",
    transition: "background 0.3s ease, transform 0.2s ease",
  },
  footer: {
    marginTop: 30,
    fontSize: "13px",
    color: "#777",
  },
};

export default Login;
