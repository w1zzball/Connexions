import { useState } from "react";
import './Tile.css'
export default function Tile({ text, selected = false,handleSelect }) {
  const [isSolved, setIsSolved] = useState(false)

  return (
    <div className="tile" style={{
      backgroundColor: selected ? 'lightblue' : 'white',
    }}

      onClick={handleSelect}>
      <span>{text}</span>
    </div>)
}
