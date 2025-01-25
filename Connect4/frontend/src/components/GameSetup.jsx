import React, { useState } from 'react';
import { User, Cpu, Brain } from 'lucide-react';

function GameSetup({ onStart }) {
  const [gameType, setGameType] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [algorithm, setAlgorithm] = useState('minimax');

  const handleStart = () => {
    const settings = {
      game_type: gameType,
      ...(gameType !== 'human-human' && {
        difficulty,
        algorithm,
      }),
    };
    onStart(settings);
  };

  return (
    <div className="setup-container">
      <h2 className="setup-title">Game Setup</h2>
      
      <div className="setup-section">
        <h3 className="setup-title">Select Game Type</h3>
        <div className="setup-grid setup-grid-3">
          <button
            className={`setup-button ${gameType === 'human-human' ? 'active' : ''}`}
            onClick={() => setGameType('human-human')}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <User size={24} />
              <User size={24} />
            </div>
            <div style={{ fontWeight: 500 }}>Human vs Human</div>
          </button>
          
          <button
            className={`setup-button ${gameType === 'human-computer' ? 'active' : ''}`}
            onClick={() => setGameType('human-computer')}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <User size={24} />
              <Cpu size={24} />
            </div>
            <div style={{ fontWeight: 500 }}>Human vs Computer</div>
          </button>

          <button
            className={`setup-button ${gameType === 'computer-computer' ? 'active' : ''}`}
            onClick={() => setGameType('computer-computer')}
          >
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <Cpu size={24} />
              <Cpu size={24} />
            </div>
            <div style={{ fontWeight: 500 }}>Computer vs Computer</div>
          </button>
        </div>
      </div>

      {gameType !== 'human-human' && (
        <>
          <div className="setup-section">
            <h3 className="setup-title">Select Difficulty</h3>
            <div className="setup-grid setup-grid-3">
              {['easy', 'medium', 'expert'].map((level) => (
                <button
                  key={level}
                  className={`setup-button ${difficulty === level ? 'active-purple' : ''}`}
                  onClick={() => setDifficulty(level)}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="setup-section">
            <h3 className="setup-title">Select Algorithm</h3>
            <div className="setup-grid setup-grid-2">
              {['minimax', 'negascout'].map((algo) => (
                <button
                  key={algo}
                  className={`setup-button ${algorithm === algo ? 'active-green' : ''}`}
                  onClick={() => setAlgorithm(algo)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Brain size={20} />
                    {algo}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        className={`button ${gameType ? 'button-blue' : ''}`}
        style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}
        onClick={handleStart}
        disabled={!gameType}
      >
        Start Game
      </button>
    </div>
  );
}

export default GameSetup;