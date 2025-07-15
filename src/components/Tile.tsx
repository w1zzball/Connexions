import {useState} from "react";
import './Tile.css'
export default function Tile({text}) {
  const [isSolved, setIsSolved] = useState(false) 

return(
  <div className="tile">
   <span>{text}</span> 
  </div>)
}
