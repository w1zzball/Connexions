import './Tile.css'

type TileProps = {
  text: string;
  selected?: boolean;
  shake?: boolean;
  handleSelect: () => void;
  numAnswers: number; // new prop
};

export default function Tile({ text, selected = false, shake = false, handleSelect, numAnswers }: TileProps) {
  // Calculate font size based on grid size and viewport width
  // The more answers per row, the smaller the font
  // Clamp between 0.7em and 1.2em
  const base = 1.1;
  const min = 0.7;
  const max = 1.2;
  // Use viewport width to further scale for mobile
  const vw = Math.max(window.innerWidth, 320);
  let scale = 1;
  if (numAnswers >= 6) scale = 0.7;
  else if (numAnswers === 5) scale = 0.8;
  else if (numAnswers === 4) scale = 1;
  else if (numAnswers === 3) scale = 1.1;
  else scale = 1.2;
  // Further reduce for small screens
  if (vw < 600) scale *= 0.9;
  const fontSize = `${Math.max(min, Math.min(max, base * scale))}em`;

  return (
    <div
      className={`tile${shake ? ' shake' : ''}`}
      style={{
        backgroundColor: selected ? '#5A594E' : '#EFEFE6',
        color: selected ? 'white' : '#121212',
      }}
      onClick={handleSelect}
    >
      <span style={{ fontSize }}>{text}</span>
    </div>
  )
}
