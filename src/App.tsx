import { useEffect, useState } from 'react'
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
  const [numQuestions, setNumQuestions] = useState(4);
  const [numAnswers, setNumAnswers] = useState(4);
  const [tileSet, setTileSet] = useState<Tile[]>(initTileSet);
  const [selected, setSelected] = useState<Tile[]>([]);
  const [solved, setSolved] = useState(0);
  const [solvedTiles, setSolvedTiles] = useState<Tile[][]>([]);
  const [shakingTiles, setShakingTiles] = useState<Set<string>>(new Set());

  const shuffleTiles = () => {
    const ShuffledTiles = [...tileSet].sort(() => Math.random() - 0.5);
    setTileSet(ShuffledTiles);
  };
  useEffect(() => {
    shuffleTiles();
  }, []);

  const deselectAll = () => {
    setSelected([]);
  };

  const submit = () => {
    let question = selected[0]?.question;
    let isCorrect: boolean = selected.reduce((acc, tile) =>
      acc && tile.question === question
      , true)
    if (isCorrect) {
      setSolvedTiles(old => (
        [...old, selected]
      ))
      setTileSet(tileSet.filter(tile => !selected.includes(tile)));
      setSolved(solved + 1);
      deselectAll();
    } else {
      const shakeSet = new Set(selected.map(tile => tile.text));
      setShakingTiles(shakeSet);
      setTimeout(() => setShakingTiles(new Set()), 400);
    }
  }
  // log the solvedTiles whenever it changes
  useEffect(() => {
    console.log(solvedTiles);
  }, [solvedTiles]);

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
      <div id="solved-container">

      </div>
      <div id="board">
        {solvedTiles.map((tiles, index) => (
          <Row
            key={index}
            question={tiles[0].question}
            tileString={tiles.map(tile => tile.text).join(', ')}
          />
        ))}
        {tileSet.map(tile => (
          <Tile
            key={tile.text}
            text={tile.text}
            selected={selected.includes(tile)}
            shake={shakingTiles.has(tile.text)}
            handleSelect={() => handleSelect(tile)}
          />
        ))}
      </div>
      <div id="mistakes-counter">
        <p>Mistakes Remaining</p>
      </div>
      <div id="button-container">
        <button onClick={shuffleTiles}>Shuffle</button>
        <button className={selected.length < 1 ? 'disabled' : undefined} onClick={deselectAll}>Deselect All</button>
        <button className={selected.length != 4 ? 'disabled' : undefined} onClick={submit}>submit</button>
      </div>
    </>
  )
}

export default App
