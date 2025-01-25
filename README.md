# Connect 4 Game

Connect 4 is a classic two-player strategy game where players take turns dropping their pieces into a 7x6 grid. The objective is to connect four of your pieces vertically, horizontally, or diagonally before your opponent does.

This project implements Connect 4 with a **Django backend** and a **React frontend**, providing a seamless and interactive gaming experience.

---

## Features

- **AI Opponent**: Challenge a computer opponent with different difficulty levels.
- **Responsive Design**: Optimized for desktop and mobile devices.

---

## Tech Stack

### Backend

- **Django**: Handles the server-side logic, APIs, and database management.
- **Django REST Framework (DRF)**: Provides RESTful APIs for communication with the frontend.

### Frontend

- **React**: Builds the interactive and dynamic user interface.

---

## Installation

### Prerequisites

- Python (3.8 or higher)
- Node.js (16 or higher)
- npm or yarn

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/dzemilmanic/Connect4.git
   cd connect4/backend
   ```

2. Apply migrations:

   ```bash
   python manage.py migrate
   ```

3. Run the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The React app will be available at `http://localhost:5173`, and the Django backend will run at `http://localhost:8000`.

---

## API Endpoints

### Game

- **POST /api/algorithms/start/**: Start a new game.
- **POST /api/algorithms/move/**: Make a move.
- **GET /api/algorithms/state/**: Retrieve the current game state.

## Future Improvements

- Add spectating mode for live games.
- Implement advanced AI strategies.
- Introduce game themes and customizations.
- Add social login options (e.g., Google, Facebook).

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Acknowledgments

- Thanks to the open-source community for tools and libraries.
- Inspired by the classic Connect 4 game.

---

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the project.
