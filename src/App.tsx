import { useEffect, useState } from 'react'
import './App.css'
import Tile from './components/Tile.tsx'

interface Tile {
  answer: string;
  text: string;
}

const initTileSet: Tile[] = [

  { answer: "FRUIT", text: "Apple" },
  { answer: "FRUIT", text: "Banana" },
  { answer: "FRUIT", text: "Orange" },
  { answer: "FRUIT", text: "Grape" },
  { answer: "COLOR", text: "Red" },
  { answer: "COLOR", text: "Blue" },
  { answer: "COLOR", text: "Green" },
  { answer: "COLOR", text: "Yellow" },
  { answer: "ANIMAL", text: "Dog" },
  { answer: "ANIMAL", text: "Cat" },
  { answer: "ANIMAL", text: "Horse" },
  { answer: "ANIMAL", text: "Cow" },
  { answer: "COUNTRY", text: "France" },
  { answer: "COUNTRY", text: "Japan" },
  { answer: "COUNTRY", text: "Brazil" },
  { answer: "COUNTRY", text: "Canada" },
];

function App() {
  const [numQuestions, setNumQuestions] = useState(4);
  const [numAnswers, setNumAnswers] = useState(4);
  const [tileSet, setTileSet] = useState<Tile[]>(initTileSet);
  const [selected, setSelected] = useState<Tile[]>([]);
  const [solved, setSolved] = useState(0);
  const [solvedTiles, setSolvedTiles] = useState<Tile[][]>([]);

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
    let answer = selected[0].answer;
    let isCorrect: boolean = selected.reduce((acc, tile) =>
      acc && tile.answer === answer
      , true)
    if (isCorrect) {
      setSolvedTiles(old => (
        [...old, selected]
      ))
      setTileSet(tileSet.filter(tile => !selected.includes(tile)));
      setSolved(solved + 1);
      deselectAll();
    }
    else {
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
      <div id="solved-container">

      </div>
      <div id="board">
        {tileSet.map(tile => (
          <Tile key={tile.text}
            text={tile.text}
            selected={selected.includes(tile)}
            handleSelect={() => handleSelect(tile)}
          />
        ))}
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
