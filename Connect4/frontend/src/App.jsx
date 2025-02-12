import React, { useState, useEffect } from "react";
import { Settings, RefreshCw, User, Cpu } from "lucide-react";
import GameSetup from "./components/GameSetup";
import GameBoard from "./components/GameBoard";

const INITIAL_GAME_STATE = {
  id: null,
  board_state: Array(6).fill(Array(7).fill(0)),
  current_player: 1,
  is_finished: false,
  winner: null,
  game_type: null,
  difficulty: null,
  algorithm: null,
  winning_cells: [],
  lastMoveTime: null,
  moveCalculationTime: 0,
  from_file: false,
};

function App() {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [isSetupOpen, setIsSetupOpen] = useState(true);

  useEffect(() => {
    if (gameState.game_type === "computer-computer" && !gameState.is_finished && !gameState.from_file) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const startNewGame = async (settings) => {
    try {
      const response = await fetch(
        "https://desirable-nourishment-production.up.railway.app/api/algorithms/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...settings,
            initial_moves: settings.initial_moves || [],
            from_file: Boolean(settings.initial_moves),
          }),
        }
      );
      const data = await response.json();
      
      // If there are initial moves, apply them sequentially
      if (settings.initial_moves && settings.initial_moves.length > 0) {
        let currentState = data;
        for (let i = 0; i < settings.initial_moves.length; i++) {
          const column = settings.initial_moves[i];
          const moveResponse = await fetch(
            `https://desirable-nourishment-production.up.railway.app/api/algorithms/${currentState.id}/make_move/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                column,
                algorithm: settings.algorithm,
                difficulty: settings.difficulty,
                is_from_file: true,
                skip_computer_move: true, // Add this flag to prevent computer moves
              }),
            }
          );
          currentState = await moveResponse.json();
          if (currentState.is_finished) break;
        }
        setGameState({
          ...currentState,
          ...settings,
          lastMoveTime: Date.now(),
          from_file: true,
        });
      } else {
        setGameState({
          ...INITIAL_GAME_STATE,
          ...data,
          ...settings,
          lastMoveTime: Date.now(),
          from_file: false,
        });
      }
      setIsSetupOpen(false);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  const makeComputerMove = async () => {
    if (!gameState.id || gameState.is_finished || gameState.from_file) return;

    const startTime = Date.now();
    try {
      const response = await fetch(
        `https://desirable-nourishment-production.up.railway.app/api/algorithms/${gameState.id}/make_move/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            column: null,
            algorithm: gameState.algorithm,
            difficulty: gameState.difficulty,
            skip_computer_move: gameState.from_file,
          }),
        }
      );
      const data = await response.json();
      const endTime = Date.now();

      setGameState((prev) => ({
        ...prev,
        ...data,
        lastMoveTime: endTime,
        moveCalculationTime: endTime - startTime,
      }));
    } catch (error) {
      console.error("Error making move:", error);
    }
  };

  const makeMove = async (column) => {
    if (!gameState.id || gameState.is_finished) return;

    const startTime = Date.now();
    try {
      const response = await fetch(
        `https://desirable-nourishment-production.up.railway.app/api/algorithms/${gameState.id}/make_move/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            column,
            algorithm: gameState.algorithm,
            difficulty: gameState.difficulty,
            skip_computer_move: gameState.from_file,
          }),
        }
      );
      const data = await response.json();
      const endTime = Date.now();

      setGameState((prev) => ({
        ...prev,
        ...data,
        lastMoveTime: endTime,
        moveCalculationTime: endTime - startTime,
      }));

      // Only make computer move if not from file and game isn't finished
      if (gameState.game_type === 'human-computer' && !gameState.from_file && !data.is_finished) {
        await makeComputerMove();
      }
    } catch (error) {
      console.error("Error making move:", error);
    }
  };

  const resetGame = () => {
    setGameState(INITIAL_GAME_STATE);
    setIsSetupOpen(true);
  };

  return (
    <div className="app-container">
      <div className="container">
        <header className="header">
          <h1 className="game-title">Connect Four</h1>
          <div className="header-buttons">
            <button onClick={resetGame} className="button button-purple">
              <RefreshCw size={20} />
              New Game
            </button>
          </div>
        </header>

        {isSetupOpen ? (
          <GameSetup onStart={startNewGame} />
        ) : (
          <div>
            <div className="game-status">
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    className={`player-indicator ${
                      gameState.current_player === 1
                        ? "player1-color"
                        : "player2-color"
                    }`}
                  />
                  <span style={{ fontWeight: 600 }}>
                    Player {gameState.current_player}'s Turn
                  </span>
                </div>
                {gameState.game_type !== "human-human" && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "0.875rem" }}>
                      Player 1:{" "}
                      {gameState.game_type === "human-computer" ? (
                        <User size={16} style={{ display: "inline" }} />
                      ) : (
                        <Cpu size={16} style={{ display: "inline" }} />
                      )}
                    </span>
                    <span style={{ fontSize: "0.875rem" }}>
                      Player 2: <Cpu size={16} style={{ display: "inline" }} />
                    </span>
                  </div>
                )}
              </div>
              {gameState.moveCalculationTime > 0 && !gameState.from_file && (
                <div style={{ fontSize: "0.875rem" }}>
                  Move calculation time:{" "}
                  {(gameState.moveCalculationTime / 1000).toFixed(2)}s
                </div>
              )}
            </div>

            <GameBoard
              board={gameState.board_state}
              onMove={makeMove}
              currentPlayer={gameState.current_player}
              isFinished={gameState.is_finished}
              winningCells={gameState.winning_cells || []}
            />

            {gameState.is_finished && (
              <div className="game-result">
                {gameState.winner
                  ? `Player ${gameState.winner} Wins!`
                  : "It's a Draw!"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;