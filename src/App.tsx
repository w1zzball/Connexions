import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import './App.css'
import Tile from './components/Tile.tsx'
import Row from './components/Row.tsx'
import Setup from './components/Setup.tsx'
import { GameConfigContext } from './context/GameConfigContext.tsx';
import type { Tile as TileType, QuestionSet } from './types/types.tsx';

let initQuestionSets: QuestionSet[] = [
  {
    question: "types of fruit",
    answers: ["Apple", "Banana", "Orange", "Grape"],
    color: '#F9DF6D'
  },
  {
    question: "COLORs",
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

function questionSetsToTile(qSets: QuestionSet[]): TileType[] {
  let tileSet: TileType[] = []
  qSets.forEach(qSet => {
    qSet.answers.forEach(ans => {
      tileSet.push({ question: qSet.question, text: ans, color: qSet.color })
    })
  })
  return tileSet;
}

const initTileSet = questionSetsToTile(initQuestionSets);

function App() {
  const [lives, setLives] = useState(3);
  const [numQuestions, setNumQuestions] = useState(4);
  const [numAnswers, setNumAnswers] = useState(4);
  const [tileSet, setTileSet] = useState<TileType[]>(() => shuffleArray(initTileSet));
  const [selected, setSelected] = useState<TileType[]>([]);
  //TODO get rid of shakingTiles, derive it from selected
  const [solvedTiles, setSolvedTiles] = useState<TileType[][]>([]);
  const [shakingTiles, setShakingTiles] = useState<Set<string>>(new Set());
  const [guessHistory, setGuessHistory] = useState<TileType[][]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [questionSets, setQuestionSets] = useState(initQuestionSets);
  const shuffleTiles = () => {
    setTileSet(shuffleArray(tileSet));
  }


  function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  const deselectAll = () => {
    setSelected([]);
  }

  const submit = () => {
    if (guessHistory.includes(selected)) {
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
      setGuessHistory(old => [...old, selected]);
      deselectAll();
    } else {
      setGuessHistory(old => [...old, selected]);
      setLives(lives - 1);
      //

      const shakeSet = new Set(selected.map(tile => tile.text));
      setShakingTiles(shakeSet);
      setTimeout(() => setShakingTiles(new Set()), 400);
    }
  }

  const handleSelect = (tile: TileType) => {
    if (selected.includes(tile)) {
      setSelected(selected.filter(t => t !== tile));
    } else {
      if (selected.length < numAnswers) {
        setSelected([...selected, tile]);
      }
    }
  };
  // Reset game state when the number of questions changes or when the game is toggled
  useEffect(() => {
    if (isPlaying) {
      setTileSet(shuffleArray(questionSetsToTile(questionSets)));
      setSolvedTiles([]);
      setSelected([]);
      setLives(3);
    }
  }, [questionSets, isPlaying]);

  return (
    <GameConfigContext.Provider
      value={{ numQuestions, setNumQuestions, numAnswers, setNumAnswers, questionSets, setQuestionSets }}>
      <>
        <button onClick={() => setIsPlaying(old => !old)}>toggle setup</button>
        {isPlaying ?
          <div id="game">
            {lives == 0 ? <div> Game Over </div> :
              tileSet.length === 0 ? <div>You Win</div> :
                //todo -- add a summary of guesses here
                //todo -- improve game over / win screen
                <div id="play-area">
                  <div id="board">
                    {solvedTiles.map((tiles, index) => (
                      <Row
                        key={index}
                        color={tiles[0].color}
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
          </div>
          :
          <Setup />
        }

      </>
    </GameConfigContext.Provider>
  )
}

export default App
