import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import './App.css'
import Tile from './components/Tile.tsx'
import Row from './components/Row.tsx'

interface Tile {
  question: string;
  text: string;
}

const initColors = [
  { straightforward: "#F9DF6D" },
  { moderate: "#A0C35A" },
  { challenging: "#B0C4EF" },
  { tricky: "#BA81C5" },
]

const initTileSet: Tile[] = [

  { question: "FRUIT", text: "Apple" },
  { question: "FRUIT", text: "Banana" },
  { question: "FRUIT", text: "Orange" },
  { question: "FRUIT", text: "Grape" },
  { question: "COLOR", text: "Red" },
  { question: "COLOR", text: "Blue" },
  { question: "COLOR", text: "Green" },
  { question: "COLOR", text: "Yellow" },
  { question: "ANIMAL", text: "Dog" },
  { question: "ANIMAL", text: "Cat" },
  { question: "ANIMAL", text: "Horse" },
  { question: "ANIMAL", text: "Cow" },
  { question: "COUNTRY", text: "France" },
  { question: "COUNTRY", text: "Japan" },
  { question: "COUNTRY", text: "Brazil" },
  { question: "COUNTRY", text: "Canada" },
];

function App() {
  const [lives, setLives] = useState(3);
  const [numQuestions, setNumQuestions] = useState(4);
  const [numAnswers, setNumAnswers] = useState(4);
  const [tileSet, setTileSet] = useState<Tile[]>(() => shuffleArray(initTileSet));
  const [selected, setSelected] = useState<Tile[]>([]);
  const [solved, setSolved] = useState(0);
  const [solvedTiles, setSolvedTiles] = useState<Tile[][]>([]);
  const [shakingTiles, setShakingTiles] = useState<Set<string>>(new Set());
  const [incorrectGuesses, setIncorrectGuesses] = useState<Tile[][]>([]);

  const shuffleTiles = () => {
    setTileSet(shuffleArray(tileSet));
  };

  function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  const deselectAll = () => {
    setSelected([]);
  };

  const submit = () => {
    if (incorrectGuesses.includes(selected)) {
      alert("You have already guessed this combination.");
      //TODO -- this should be a toast, not an alert, implement with timeout
      return;
    }
    let question = selected[0]?.question;
    let isCorrect: boolean = selected.reduce((acc, tile) =>
      acc && tile.question === question
      , true)
    if (isCorrect) {
      setSolvedTiles(old => [...old, selected])
      setTileSet(tileSet.filter(tile => !selected.includes(tile)));
      setSolved(solved + 1);
      deselectAll();
    } else {
      setIncorrectGuesses(old => [...old, selected]);
      setLives(lives - 1);
      const shakeSet = new Set(selected.map(tile => tile.text));
      setShakingTiles(shakeSet);
      setTimeout(() => setShakingTiles(new Set()), 400);
    }
  }

  const handleSelect = (tile: Tile) => {
    if (selected.includes(tile)) {
      setSelected(selected.filter(t => t !== tile));
    } else {
      if (selected.length < numAnswers) {
        setSelected([...selected, tile]);
      }
    }
  };
  return (
    <>
      {lives == 0 ? <div> Game Over </div> :
        solved === numAnswers ? <div>You Win</div> :
          <div id="game">
            <div id="board">
              {solvedTiles.map((tiles, index) => (
                <Row
                  key={index}
                  question={tiles[0].question}
                  tileString={tiles.map(tile => tile.text).join(', ')}
                />
              ))}
              <AnimatePresence>
                {tileSet.map(tile => (
                  <motion.div
                    key={tile.text}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Tile
                      text={tile.text}
                      selected={selected.includes(tile)}
                      shake={shakingTiles.has(tile.text)}
                      handleSelect={() => handleSelect(tile)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div id="mistakes-counter">
              <p>Mistakes Remaining:  {"● ".repeat(lives)}</p>
            </div>
            <div id="button-container">
              <button onClick={shuffleTiles}>Shuffle</button>
              <button
                className={selected.length < 1 ? 'disabled' : undefined}
                onClick={selected.length < 1 ? undefined : deselectAll}
              >Deselect All</button>
              <button
                className={selected.length != 4 ? 'disabled' : undefined}
                onClick={selected.length != 4 ? undefined : submit}
              >submit</button>
            </div>
          </div>
      }

    </>
  )
}

export default App
