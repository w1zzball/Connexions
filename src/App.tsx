import { useState } from 'react'
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
    { answer: "COLOR", text: "sadsadasdadsassasdss" },
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

  const randomizeTiles = () => {
    const shuffledTiles = [...tileSet].sort(() => Math.random() - 0.5);
    setTileSet(shuffledTiles);
  };

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
      <div id="board">
        {tileSet.map(tile => (
          <Tile key={tile.text} text={tile.text} />
        ))}
      </div>
      <div id="button-container">
        <button onClick={randomizeTiles}>Randomize Tiles</button>
      </div>
    </>
  )
}

export default App
