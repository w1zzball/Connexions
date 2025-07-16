import QuestionArea from './QuestionArea.tsx'
import { useGameConfig } from '../context/GameConfigContext.tsx'
import './Setup.css'

export default function Setup() {

    const { numQuestions, setNumQuestions, questionSets, setQuestionSets } = useGameConfig();
    return (
        <div id="setup">
            {/* <button onClick={() => {
                setNumQuestions(num => Math.max(num - 1, 1));
                // setQuestionSets(sets => sets.slice(0, -1));
            }}>-</button>
            <button onClick={() => {
                setNumQuestions(num => Math.min(num + 1, 7));
                // setQuestionSets(sets => [...sets, { question: '', answers: Array(4).fill(''), color: '#bb2b2bff' }]);
            }}>+</button> */}

            <div id="question-container">
                {Array(numQuestions).fill(0).map((_, index) => (
                    <QuestionArea key={index} questionIndex={index} />
                ))}
            </div>
        </div>
    )


}