# 🎮 Connect 4 Game

**Connect 4** is a classic two-player strategy game where players take turns dropping their pieces into a 7x6 grid. The goal is to be the first to connect four pieces vertically, horizontally, or diagonally.

This project delivers a modern version of the game using a **Django backend** and a **React frontend**, offering a smooth and interactive gaming experience.

🔗 **Live Demo**: [connect4.app](https://connect4-game.up.railway.app)

---

## 🚀 Features

- 🧠 **AI Opponent** – Play against a computer with adjustable difficulty levels.
- 📱 **Responsive Design** – Fully optimized for desktop and mobile devices.
- 🎮 **Real-Time Gameplay** – Seamless interaction through REST APIs.

---

## 🛠 Tech Stack

### 🧩 Backend

- **Django** – Web framework for server-side logic and game engine.
- **Django REST Framework (DRF)** – API layer for communication with frontend.

### 🎨 Frontend

- **React** – Builds the dynamic and interactive user interface.

---

## 🧪 Installation

### 🔧 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

---

### ⚙️ Backend Setup

```bash
git clone https://github.com/dzemilmanic/Connect4.git
cd connect4/backend
```

1. Install dependencies (optional):
   ```bash
   pip install -r requirements.txt
   ```

2. Apply migrations:
   ```bash
   python manage.py migrate
   ```

3. Run the development server:
   ```bash
   python manage.py runserver
   ```

---

### 💻 Frontend Setup

```bash
cd ../frontend
```

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

- React app runs at: `http://localhost:5173`  
- Django API runs at: `http://localhost:8000`

---

## 🔌 API Endpoints

### 🎯 Game Logic

- `POST /api/algorithms/start/` – Start a new game.
- `POST /api/algorithms/move/` – Submit a player or AI move.
- `GET  /api/algorithms/state/` – Get the current game state.

---

## 🌟 Future Improvements

- 👁️ Spectator mode for live games
- 🤖 Smarter AI with advanced algorithms
- 🎨 Themes and board customization
- 🔐 Social login (Google, Facebook, etc.)

---

## 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for more information.

---
