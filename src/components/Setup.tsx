import QuestionArea from './QuestionArea.tsx'
import { useGameConfig } from '../context/GameConfigContext.tsx'
import './Setup.css'

export default function Setup() {

    const { numQuestions, setNumQuestions } = useGameConfig();
    return (
        <div id="setup">
            <button onClick={() => {
                setNumQuestions(num => Math.max(num - 1, 1));
            }}>-</button>
            <button onClick={() => {
                setNumQuestions(num => Math.min(num + 1, 7));
            }}>+</button>

            <div id="question-container">
                {Array(numQuestions).fill(0).map((_, index) => (
                    <QuestionArea key={index} questionIndex={index} />
                ))}
            </div>
        </div>
    )


}