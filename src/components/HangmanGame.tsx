import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const WORDS = [
  { word: 'REACT', hint: 'JavaScript library for building UIs' },
  { word: 'JAVASCRIPT', hint: 'Programming language for web development' },
  { word: 'CODING', hint: 'General programming activity' },
  { word: 'HANGMAN', hint: 'The game itself (meta!)' },
  { word: 'COMPUTER', hint: 'The core machine running the code' }
];

const MAX_INCORRECT_GUESSES = 6;

const HANGMAN_DRAWINGS = [
  '',
  '  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  |   |\n      |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  |   |\n  O   |\n      |\n      |\n=========',
  '  +---+\n  |   |\n  |   |\n  O   |\n  |   |\n      |\n=========',
  '  +---+\n  |   |\n  |   |\n  O   |\n /|   |\n      |\n=========',
  '  +---+\n  |   |\n  |   |\n  O   |\n /|\\  |\n      |\n=========',
  '  +---+\n  |   |\n  |   |\n  O   |\n /|\\  |\n /    |\n=========',
  '  +---+\n  |   |\n  |   |\n  O   |\n /|\\  |\n / \\  |\n========='
];

interface WordEntry {
  word: string;
  hint: string;
}

interface GameState {
  currentWord: WordEntry;
  guessedLetters: Set<string>;
  incorrectGuesses: number;
  gameStatus: 'playing' | 'won' | 'lost';
}

const HangmanGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentWord: { word: '', hint: '' },
    guessedLetters: new Set(),
    incorrectGuesses: 0,
    gameStatus: 'playing',
  });
  const [currentGuess, setCurrentGuess] = useState('');

  const initializeGame = () => {
    const randomEntry = WORDS[Math.floor(Math.random() * WORDS.length)];
    setGameState({
      currentWord: randomEntry,
      guessedLetters: new Set(),
      incorrectGuesses: 0,
      gameStatus: 'playing',
    });
    setCurrentGuess('');
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const getDisplayWord = () => {
    return gameState.currentWord.word
      .split('')
      .map(letter => gameState.guessedLetters.has(letter) ? letter : '_')
      .join(' ');
  };

  const handleGuess = (letter: string) => {
    if (!letter || gameState.gameStatus !== 'playing' || gameState.guessedLetters.has(letter)) {
      return;
    }

    const upperLetter = letter.toUpperCase();
    const newGuessedLetters = new Set(gameState.guessedLetters).add(upperLetter);

    const isCorrectGuess = gameState.currentWord.word.includes(upperLetter);
    const newIncorrectGuesses = isCorrectGuess
      ? gameState.incorrectGuesses
      : gameState.incorrectGuesses + 1;

    const hasWon = gameState.currentWord.word.split('').every(letter => newGuessedLetters.has(letter));
    const hasLost = newIncorrectGuesses >= MAX_INCORRECT_GUESSES;

    setGameState({
      currentWord: gameState.currentWord,
      guessedLetters: newGuessedLetters,
      incorrectGuesses: newIncorrectGuesses,
      gameStatus: hasWon ? 'won' : hasLost ? 'lost' : 'playing',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentGuess.length === 1 && /[A-Za-z]/.test(currentGuess)) {
      handleGuess(currentGuess);
      setCurrentGuess('');
    }
  };

  const getIncorrectLetters = () => {
    return Array.from(gameState.guessedLetters).filter(letter => !gameState.currentWord.word.includes(letter));
  };

  const getCorrectLetters = () => {
    return Array.from(gameState.guessedLetters).filter(letter => gameState.currentWord.word.includes(letter));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-mono mb-2">HANGMAN</h1>
          <p className="text-green-300 font-mono">Guess the word one letter at a time!</p>
          <p className="text-green-500 font-mono text-sm mt-2">
            💡 Hint: {gameState.currentWord.hint}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-mono mb-4 text-green-300">Gallows</h2>
            <pre className="font-mono text-sm leading-tight text-green-400">
              {HANGMAN_DRAWINGS[Math.min(gameState.incorrectGuesses, HANGMAN_DRAWINGS.length - 1)]}
            </pre>
            <div className="mt-4 text-center">
              <p className="font-mono text-sm">
                Incorrect guesses: {gameState.incorrectGuesses}/{MAX_INCORRECT_GUESSES}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-mono mb-4 text-green-300">Word</h2>
            <div className="mb-6">
              <p className="text-3xl font-mono text-center tracking-wider text-white">
                {getDisplayWord()}
              </p>
            </div>

            {gameState.gameStatus === 'won' && (
              <div className="bg-green-800 border border-green-600 rounded p-4 mb-4">
                <p className="font-mono text-center text-green-200">
                  🎉 Congratulations! You won! 🎉
                </p>
              </div>
            )}

            {gameState.gameStatus === 'lost' && (
              <div className="bg-red-800 border border-red-600 rounded p-4 mb-4">
                <p className="font-mono text-center text-red-200">
                  💀 Game Over! The word was: {gameState.currentWord.word} 💀
                </p>
              </div>
            )}

            {gameState.gameStatus === 'playing' && (
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentGuess}
                    onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
                    placeholder="Enter a letter"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 font-mono text-green-400 focus:outline-none focus:border-green-500"
                    maxLength={1}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-mono transition-colors"
                    disabled={!currentGuess || gameState.guessedLetters.has(currentGuess.toUpperCase())}
                  >
                    Guess
                  </button>
                </div>
                {currentGuess && gameState.guessedLetters.has(currentGuess.toUpperCase()) && (
                  <p className="text-yellow-400 font-mono text-sm mt-1">
                    You already guessed '{currentGuess.toUpperCase()}'
                  </p>
                )}
              </form>
            )}

            <div className="space-y-2">
              {getCorrectLetters().length > 0 && (
                <div>
                  <span className="font-mono text-green-300 text-sm">Correct: </span>
                  <span className="font-mono text-green-400">
                    {getCorrectLetters().join(', ')}
                  </span>
                </div>
              )}

              {getIncorrectLetters().length > 0 && (
                <div>
                  <span className="font-mono text-red-300 text-sm">Incorrect: </span>
                  <span className="font-mono text-red-400">
                    {getIncorrectLetters().join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={initializeGame}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-mono transition-colors"
          >
            <RotateCcw size={20} />
            New Game
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="font-mono text-green-300 text-sm">
            Max incorrect guesses: {MAX_INCORRECT_GUESSES}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HangmanGame;