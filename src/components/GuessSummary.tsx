import type { GuessSummaryProps } from "../types/types"
import './GuessSummary.css'
export default function GuessSummary({ guessHistory }: GuessSummaryProps) {

    return (
        <div className="guess-history">
            {guessHistory.map(guess =>
                <p className="guess-history-row">
                    {guess.map(tile => (
                        <span
                            style={{
                                display: "inline-block",
                                width: "1em",
                                height: "1em",
                                backgroundColor: tile.color,
                                margin: "0 2px",
                                borderRadius: "0.2em",
                            }}
                        ></span>
                    ))}
                </p>
            )}
        </div >
    )
}