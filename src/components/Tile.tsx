import { useState } from "react";
import './Tile.css'
export default function Tile({ text, selected = false,handleSelect }) {
  const [isSolved, setIsSolved] = useState(false)

  return (
    <div className="tile" style={{
      backgroundColor: selected ? '#5A594E' : '#EFEFE6',
      color: selected ? 'white' : '#121212',
    }}

      onClick={handleSelect}>
      <span>{text}</span>
    </div>)
}
