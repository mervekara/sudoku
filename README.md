# 🤹 Sudoku Game - Vue 3 + TypeScript + Node.js + MongoDB

> A fully functional Sudoku game built with Vue 3, TypeScript, and Node.js, featuring real-time scoring, hints, leaderboard, and persistent storage via MongoDB.

---

## 🚀 Project Overview

This Sudoku game was developed according to the following key requirements:

- ✅ Fully compliant with classical Sudoku rules
- ✅ 4 Difficulty Levels:

  - Beginner (36–40 visible cells)
  - Intermediate (32–36 visible cells)
  - Hard (28–32 visible cells)
  - Expert (24–28 visible cells)

- ✅ Randomly generated puzzle on every new game
- ✅ Score system based on correctness, time, hints, and errors
- ✅ Leaderboard (Top 3 scores for each difficulty) stored in MongoDB
- ✅ Real-time validation: incorrect input highlighted instantly
- ✅ Hint system with max 10 hints per game, with increasing penalty
- ✅ Draft notes (italic), undo/redo, pause on tab change
- ✅ Internationalization (i18n) support
- ✅ Fully strict TypeScript with clean project structure
- ✅ Unit tested with Vitest (especially generator logic)
- ✅ Dockerized environment for full stack deployment

---

## 👜 Project Structure

```
sudoku/
├── fe/              # Vue 3 + TypeScript
│   ├── components/
│   ├── layouts/
│   ├── stores/
│   └── ...
├── be/               # Node.js + Express + MongoDB
│   ├── routes/
│   ├── models/
│   └── ...
├── docker-compose.yml     # Multi-service environment
└── README.md
```

---

## 🔧 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [Docker](https://www.docker.com/) & Docker Compose

### Docker Setup

```bash
git clone https://github.com/mervekara/sudoku.git
cd sudoku
docker-compose up --build
```

- 🎮 Frontend: [http://localhost:3000](http://localhost:3000)
- 📢 Backend API: [http://localhost:5000](http://localhost:5000)
- 🗃️ MongoDB: [mongodb://localhost:27017](mongodb://localhost:27017)

### Manual Setup (Optional)

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Backend

```bash
cd backend
npm install
npm run dev
```

> You must have a local MongoDB instance running if not using Docker.

---

## ✅ Features

| Feature              | Description                                    |
| -------------------- | ---------------------------------------------- |
| Difficulty Selector  | 4 levels: beginner to expert                   |
| Real-Time Validation | Incorrect input shown immediately              |
| Hint System          | Max 10 hints, increasing penalty               |
| Draft Mode           | Add/remove temporary notes                     |
| Undo/Redo            | Restore previous actions                       |
| Timer-based Scoring  | Total Score = Score - Time                     |
| Leaderboard          | Top 3 records per difficulty stored in MongoDB |
| Pause on Blur        | Game auto-pauses on tab change                 |
| i18n Support         | Multi-language ready                           |
| Animations           | Highlight complete rows/boxes                  |
| TypeScript Support   | Fully typed across frontend & backend          |
| Unit Tests           | Sudoku generator & logic tested via Vitest     |
| Dockerized           | All services run with one command              |

---

## 🌐 Environment Variables

### Backend `.env`

```env
PORT=3000
MONGO_URI=mongodb://mongo:27017/sudoku
```

---

## 🧠 Technologies Used

- **Frontend**: Vue 3, TypeScript, Pinia, Vue Query, TailwindCSS, i18n
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Testing**: Vitest, @vue/test-utils
- **Tooling**: Docker, Docker Compose, ESLint, Prettier

---

## 💡 Developer Notes

- Sudoku board generation is tested and guarantees unique solvable puzzles.
- Grid state management is separated via composables & stores.
- Data fetching is handled via Vue Query.
- MongoDB is used for storing leaderboard records persistently.
- Modular architecture enables scalable development and testability.

---
