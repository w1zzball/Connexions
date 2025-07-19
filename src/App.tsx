import { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import './App.css'
import Tile from './components/Tile.tsx'
import Row from './components/Row.tsx'
import Setup from './components/Setup.tsx'
import { GameConfigContext } from './context/GameConfigContext.tsx';
import type { Tile as TileType, QuestionSet } from './types/types.tsx';
import GuessSummary from './components/GuessSummary.tsx';

let initQuestionSets: QuestionSet[] = [
  {
    question: "types of fruit",
    answers: ["Apple", "Banana", "Orange", "Grape"],
    color: '#F9DF6D'
  },
  {
    question: "COLOuRs",
    answers: ["Red", "Blue", "Green", "Yellow"],
    color: '#A0C35A'
  },
  {
    question: "ANIMALs",
    answers: ["Dog", "Cat", "Horse", "Cow"],
    color: '#B0C4EF'
  },
  {
    question: "COUNTRies",
    answers: ["France", "Japan", "Brazil", "Canada"],
    color: '#BA81C5'
  },
]

let tileIdCounter = 0;
function questionSetsToTile(qSets: QuestionSet[]): TileType[] {
  let tileSet: TileType[] = [];
  qSets.forEach(qSet => {
    qSet.answers.forEach(ans => {
      tileSet.push({ question: qSet.question, text: ans, color: qSet.color, id: tileIdCounter++ });
    });
  });
  return tileSet;
}

const initTileSet: TileType[] = questionSetsToTile(initQuestionSets);

function App() {
  const [numQuestions, setNumQuestions] = useState(initQuestionSets.length);
  const [numAnswers, setNumAnswers] = useState(initQuestionSets[0]?.answers.length || 4);
  const [numLives, setNumLives] = useState(4);
  const [lives, setLives] = useState(4);
  const [tileSet, setTileSet] = useState<TileType[]>(() => shuffleArray(initTileSet));
  const [selected, setSelected] = useState<TileType[]>([]);
  const [solvedTiles, setSolvedTiles] = useState<TileType[][]>([]);
  const [guessHistory, setGuessHistory] = useState<TileType[][]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [questionSets, setQuestionSets] = useState(initQuestionSets);
  const [isShaking, setIsShaking] = useState(false);
  const shuffleTiles = (): void => {
    setTileSet(shuffleArray(tileSet));
  }

  function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  const submit = (): void => {
    // Helper to compare two arrays of tile ids regardless of order
    const idsSorted = (arr: TileType[]): number[] => arr.map(t => t.id).sort((a, b) => a - b);
    const isSameSet = (a: TileType[], b: TileType[]): boolean => {
      const aIds = idsSorted(a);
      const bIds = idsSorted(b);
      return aIds.length === bIds.length && aIds.every((id, i) => id === bIds[i]);
    };
    if (guessHistory.some(g => isSameSet(g, selected))) {
      alert("You have already guessed this combination.");
      return;
    }
    if (selected.length !== numAnswers) return;
    let question = selected[0]?.question;
    let isCorrect: boolean = selected.reduce((acc, tile) =>
      acc && tile.question === question
      , true)
    if (isCorrect) {
      setSolvedTiles(old => [...old, selected]);
      setTileSet(prevTileSet => prevTileSet.filter(tile => !selected.some(sel => sel.id === tile.id)));
      setSelected([]);
      setGuessHistory(old => [...old, selected]);
    } else {
      setGuessHistory(old => [...old, selected]);
      setLives(lives - 1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  }

  const handleSelect = (tile: TileType): void => {
    if (selected.some(t => t.id === tile.id)) {
      setSelected(selected.filter(t => t.id !== tile.id));
    } else {
      if (selected.length < numAnswers) {
        setSelected([...selected, tile]);
      }
    }
  };
  // reset game state when the number of questions changes or when the game is toggled
  useEffect(() => {
    if (isPlaying) {
      setGuessHistory([]);
      setTileSet(shuffleArray(questionSetsToTile(questionSets)));
      setSolvedTiles([]);
      setSelected([]);
      setLives(numLives);
    }
  }, [questionSets, isPlaying, numLives]);

  return (
    <GameConfigContext.Provider
      value={{ numQuestions, setNumQuestions, numAnswers, setNumAnswers, numLives, setNumLives, questionSets, setQuestionSets }}>
      <>

        {isPlaying ?
          <div id="game">
            {lives == 0 ? <div>
              Game Over
              <GuessSummary guessHistory={guessHistory} />
            </div> :
              tileSet.length === 0 ?
                <div>
                  You Win
                  <GuessSummary guessHistory={guessHistory} />
                </div> :
                //todo -- add a summary of guesses here
                //todo -- improve game over / win screen
                <div id="play-area">
                  {/* solved rows*/}
                  <div style={{ marginBottom: '16px' }}>
                    {solvedTiles.map((tiles, index) => (
                      <Row
                        key={index}
                        color={tiles[0]?.color}
                        question={tiles[0]?.question}
                        tileString={tiles.map(tile => tile.text).join(', ')}
                      />
                    ))}
                  </div>
                  <div
                    id="board"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${numAnswers}, 1fr)`,
                      gap: '12px',
                      justifyItems: 'stretch',
                      alignItems: 'center',
                      width: '100%',
                      margin: '0 auto',
                    }}
                  >
                    {tileSet.map(tile => (
                      <motion.div
                        key={tile.id}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Tile
                          text={tile.text}
                          selected={selected.some(t => t.id === tile.id)}
                          shake={isShaking && selected.some(t => t.id === tile.id)}
                          handleSelect={() => handleSelect(tile)}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div id="mistakes-counter">
                    <p>Mistakes Remaining:  {"● ".repeat(lives)}</p>
                  </div>
                  <div id="button-container">
                    <button onClick={shuffleTiles}>Shuffle</button>
                    <button
                      className={selected.length < 1 ? 'disabled' : undefined}
                      onClick={selected.length < 1 ? undefined : () => setSelected([])}
                    >Deselect All</button>
                    <button
                      className={selected.length !== numAnswers ? 'disabled' : undefined}
                      onClick={selected.length !== numAnswers ? undefined : submit}
                    >Submit</button>
                    <button className="settings-button " onClick={() => setIsPlaying(old => !old)}>
                      <i className="fa-solid fa-gear"></i>
                    </button>
                  </div>
                </div>
            }
          </div>
          :
          <div>
            <button className="back-button" onClick={() => setIsPlaying(old => !old)}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <Setup />
            <button className="back-button" onClick={() => setIsPlaying(old => !old)}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>

          </div>

        }

      </>
    </GameConfigContext.Provider>
  )
}

export default App
