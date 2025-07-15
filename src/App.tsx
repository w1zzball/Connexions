import { useState } from 'react'
import './App.css'
import Tile from './components/Tile.tsx'

interface Tile {
  row: number;
  text: string;
}

interface Row {
  tiles : Array<Tile>;
  question : string;
}


let row1 : Row = {tiles : [{row:1,text:"a"}], question : "test"}

function App() {


  const [solved, setSolved]=useState(0);
  return(
    <Tile/>
  ) 
}

export default App
