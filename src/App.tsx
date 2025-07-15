import { useState } from 'react'
import './App.css'
import Tile from './components/Tile.tsx'
import Row from './components/Row.tsx'

interface Tile {
  row: number;
  text: string;
}

interface Row {
  tiles: Array<Tile>;
  answer: string;
}

let exampleTile = { row: 1, text: "a" }
let exampleTiles = [exampleTile, exampleTile, exampleTile, exampleTile]
let exampleRow: Row = { tiles: exampleTiles, answer: "test" }
let row1: Row = exampleRow

function App() {

  const [solved, setSolved] = useState(0);
  return (
    <>
      <Row>
        {row1.tiles.map(tile=>(
          <Tile text={tile.text}/>
        ))}
      </Row>
    </>
  )
}

export default App
