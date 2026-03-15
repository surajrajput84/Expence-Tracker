💰 TrackMyExpense – Personal Expense Tracker

TrackMyExpense is a simple and efficient personal finance management web application that helps users track their daily expenses, categorize spending, and visualize financial habits through an interactive dashboard.

The application allows users to add, edit, delete, and categorize expenses while providing visual analytics to better understand spending patterns.

🚀 Live Demo

🔗 https://trackmyexpense5700.netlify.app/dashboard

📌 Features
🔐 User Authentication

Secure login and signup using Firebase Authentication

Each user can access only their own financial data

Persistent login session

💵 Expense Management

Users can easily manage their expenses with full CRUD functionality.

Capabilities

Add new expenses

Edit existing expenses

Delete unwanted expenses

Add details like:

Description

Amount

Category

Date

📂 Category-Based Expense Tracking

Expenses are grouped into categories such as:

Food

Transport

Bills

Shopping

Other

This helps users understand where their money is being spent.

📊 Dashboard Analytics

The dashboard provides a visual summary of user spending.

Dashboard includes

Monthly spending overview

Expense category distribution

Pie charts for category analysis

Quick financial summary

These analytics help users analyze financial habits and make better budgeting decisions.

🛠 Tech Stack
Frontend

React.js

HTML5

CSS3

JavaScript

Backend Services

Firebase Authentication

Firebase Firestore (Cloud Database)

Deployment

Netlify

🏗 Architecture

The application follows a client-cloud architecture using Firebase services.

User
  │
  ▼
React Frontend (UI)
  │
  ├── Firebase Authentication (Login / Signup)
  │
  ▼
Firebase Firestore (Expense Database)
  │
  ▼
Dashboard Analytics & Charts
🔄 User Flow

1️⃣ User opens the application
2️⃣ User signs up or logs in using Firebase Authentication
3️⃣ User is redirected to the dashboard
4️⃣ User can add a new expense
5️⃣ Expense data is stored in Firebase Firestore
6️⃣ Dashboard updates charts and summary automatically

📚 Learning & Experience

This project helped in learning:

React component-based architecture

Firebase Authentication integration

Cloud database management with Firestore

CRUD operations in a real-world application

Building interactive dashboards

Deploying web applications using Netlify

📂 Project Structure
TrackMyExpense
│
├── src
│   ├── components
│   ├── pages
│   ├── firebase
│   ├── dashboard
│   └── App.js
│
├── public
│
├── package.json
│
└── README.md

<img width="959" height="500" alt="image" src="https://github.com/user-attachments/assets/9933b141-5b20-4b0b-8503-dd614d6d8134" />
<img width="959" height="500" alt="image" src="https://github.com/user-attachments/assets/ec223240-9aa1-4e8e-b6fc-173fa290af68" />

<img width="949" height="502" alt="image" src="https://github.com/user-attachments/assets/1124abf0-4907-4d81-a463-5adfe02bc6b5" />



