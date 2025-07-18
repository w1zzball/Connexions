import './Tile.css'

type TileProps = {
  text: string;
  selected?: boolean;
  shake?: boolean;
  handleSelect: () => void;
};

export default function Tile({ text, selected = false, shake = false, handleSelect }: TileProps) {
  return (
    <div
      className={`tile${shake ? ' shake' : ''}`}
      style={{
        backgroundColor: selected ? '#5A594E' : '#EFEFE6',
        color: selected ? 'white' : '#121212',
      }}
      onClick={handleSelect}
    >
      <span>{text}</span>
    </div>
  )
}
