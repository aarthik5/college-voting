# 🗳️ College Voting System

A secure, role-based online voting platform built using **MERN Stack (MongoDB, Express.js, React, Node.js)** for college elections. Supports candidate management by admins and restricted voting by students.

## 🔧 Features

### 👩‍🎓 Student User
- Login using institutional email
- View candidates role-wise
- Vote once per role (enforced)
- Visual confirmation after vote
- Logout with confirmation

### 🧑‍💼 Admin Panel
- Secure login for admins
- Add candidates with role, name & image
- Delete any candidate
- View total votes per candidate
- Organized layout by roles

## 💻 Tech Stack

- **Frontend**: React.js, Axios, CSS (Neon/Dark theme)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Others**: bcryptjs, multer (for image upload)

## 📁 Project Structure

college-voting-system/
│
├── client/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│
├── server/               # Express backend
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── controllers/      # Logic for routes
│   └── server.js         # Entry point
│
├── uploads/              # Candidate images
└── .env

## 🚀 Installation Guide

### 🔹 Prerequisites

- Node.js & npm
- MongoDB installed and running locally

### 🔹 Backend Setup

```bash
cd server
npm install
node server.js

🔹 Frontend Setup

cd client
npm install
npm start

🔐 Make sure MongoDB is running on mongodb://localhost:27017/collegeVoting

Admin Panel:
🔐 Admin Credentials (for demo)
email: admin@college.com
password: admin123

📝 Author
Made with ❤️ by Aarthik 
