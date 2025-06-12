


# 📈 IPO Web Application

Welcome to the **IPO Web Application** — a modern full-stack platform to **track**, **manage**, and **register** IPOs in real-time.  
Built using **React.js**, **Flask**, and **MongoDB**, this platform empowers **investors** and **admins** with clean UI/UX, powerful data tools, and secure authentication.

---

## 🚀 Why This Project?

Managing IPOs should be simple and powerful. This app enables:
✅ Easy viewing of upcoming IPOs  
✅ Secure admin portal for IPO registration  
✅ Detailed investor & broker information  
✅ Responsive, dark/light mode design for an exceptional user experience

---

## 🔧 Tech Stack

### 🖼 Frontend
- ⚛️ **React.js**
- 🎨 **Tailwind CSS**
- 🔁 **React Router**
- 📡 **Axios** for API communication
- 🌗 **Theme toggle** (Dark/Light)

### 🧠 Backend

- 🍃 **MongoDB** with Replica Set support
- 🔐 **JWT Auth** (Login/Register)
- 🌍 **CORS** & Environment Config

### ☁ Deployment
- 🐳 **Docker-ready**
- 🚀 Compatible with **Render**, **Vercel**, **Heroku**

---

## 📸 Features Overview

### 🔐 Authentication
- Secure **login/register** flow
- JWT-based session management
- Basic route protection

### 🏦 IPO Management
- Live list of **upcoming IPOs**
- **Admin** panel to register new IPOs
- Company name, pricing, open/close dates

### 🧑‍💼 Brokers & Investors
- View registered brokers
- Investor information panel

### 📊 Admin Dashboard
- CRUD operations for IPO data
- Track users and registrations
- Ready for analytics integration

### 🎨 UI/UX Goodness
- Fully **responsive**
- **Dark/Light** theme toggle
- Clean Tailwind-based component system

---

## ⚙️ Getting Started

### 🧾 Prerequisites
- Node.js v18+

- MongoDB installed locally or cloud URI

---

### 📦 Clone the Repo

```bash
git clone https://github.com/Anugrahbhuinya/IPO-Webapp.git
cd IPO-Webapp
```

---


```bash
cd backend
python -m venv venv
# For Windows:
venv\Scripts\activate
# For Mac/Linux:
source venv/bin/activate


```

✅ Ensure MongoDB is running locally, or set up `.env` with cloud Mongo URI.

---

### 🔜 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will launch at 👉 [http://localhost:5173](http://localhost:5173)

---

## 🗂 Project Structure

```bash
IPO-Webapp/
│
├── frontend/             # React frontend
│   ├── src/
│   ├── public/
│   └── ...
│
├── backend/              # Flask backend
│   ├── app.py
│   ├── models/
│   └── routes/
│
├── mongo/                # MongoDB replica set config
│
└── README.md
```

---

## 🔐 Environment Variables

In `/backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/ipo_db
SECRET_KEY=your_jwt_secret
```

---

## 📌 Future Improvements

- [ ] 💼 User portfolio management
- [ ] 📧 Email notifications for IPO updates
- [ ] 📊 Analytics dashboard for admins
- [ ] 🛠 CI/CD deployment pipeline

---

## 🤝 Contributing

Contributions are welcome!  
Fork the repo, make improvements, and open a pull request 💡

---

## 📃 License

This project is licensed under the **MIT License**.

---

## 🔗 Connect

Made with 💡 by [Anugrah Bhuinya](https://github.com/Anugrahbhuinya)  
Let’s build something amazing together!
```

---
