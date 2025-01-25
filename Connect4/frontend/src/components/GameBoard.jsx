import React from 'react';

function GameBoard({ board, onMove, currentPlayer, isFinished, winningCells = [] }) {
  const handleColumnClick = (column) => {
    if (!isFinished && board[0][column] === 0) {
      onMove(column);
    }
  };


  const isWinningCell = (row, col) => {
    if (!winningCells) return false;
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="game-board">
      <div className="board-grid">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const winning = isWinningCell(rowIndex, colIndex);
            //console.log(`Cell ${rowIndex},${colIndex} winning:`, winning); // Debug log

            const cellClasses = [
              'cell',
              cell === 0
                ? !isFinished
                  ? 'cell-empty'
                  : 'cell-disabled'
                : cell === 1
                ? 'cell-player1'
                : 'cell-player2',
              winning ? 'cell-winning' : '',
              cell !== 0 ? 'animate-drop' : ''
            ].filter(Boolean).join(' ');

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={cellClasses}
                onClick={() => handleColumnClick(colIndex)}
                disabled={cell !== 0 || isFinished}
                style={winning ? {
                  boxShadow: '0 0 0 4px white, 0 0 15px rgba(255, 255, 255, 0.8)',
                  zIndex: 1
                } : {}}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default GameBoard;