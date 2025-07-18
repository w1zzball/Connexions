import QuestionArea from './QuestionArea.tsx'
import { useGameConfig } from '../context/GameConfigContext.tsx'
import type { QuestionSet } from '../types/types.tsx'
import './Setup.css'

export default function Setup() {
    const { numQuestions, setNumQuestions, numAnswers, setNumAnswers, numLives, setNumLives, questionSets, setQuestionSets } = useGameConfig();

    // Add a new question
    const addQuestion = (): void => {
        setNumQuestions(numQuestions + 1);
        setQuestionSets([
            ...questionSets,
            { question: '', answers: Array(numAnswers).fill(''), color: '#bb2b2b' }
        ]);
    };

    // Remove the last question
    const removeQuestion = (): void => {
        if (numQuestions > 1) {
            setNumQuestions(numQuestions - 1);
            setQuestionSets(questionSets.slice(0, -1));
        }
    };

    // Add a new answer to all questions
    const addAnswer = (): void => {
        setNumAnswers(numAnswers + 1);
        setQuestionSets(questionSets.map((q: QuestionSet) => ({
            ...q,
            answers: [...q.answers, '']
        })));
    };

    // Remove the last answer from all questions
    const removeAnswer = (): void => {
        if (numAnswers > 1) {
            setNumAnswers(numAnswers - 1);
            setQuestionSets(questionSets.map((q: QuestionSet) => ({
                ...q,
                answers: q.answers.slice(0, -1)
            })));
        }
    };

    return (
        <div id="setup">
            <div id="setup-controls-grid">
                <span className="setup-label">Questions</span>
                <span className="setup-label">Answers</span>
                <span className="setup-label">Lives</span>

                <button className="setup-plus" onClick={addQuestion}>+</button>
                <button className="setup-plus" onClick={addAnswer}>+</button>
                <button className="setup-plus" onClick={() => setNumLives(numLives + 1)}>+</button>

                <span className="setup-value">{numQuestions}</span>
                <span className="setup-value">{numAnswers}</span>
                <span className="setup-value">{numLives}</span>

                <button className="setup-minus" onClick={removeQuestion} disabled={numQuestions <= 1}>-</button>
                <button className="setup-minus" onClick={removeAnswer} disabled={numAnswers <= 1}>-</button>
                <button className="setup-minus" onClick={() => setNumLives(numLives > 1 ? numLives - 1 : 1)} disabled={numLives <= 1}>-</button>
            </div>
            <div id="question-container">
                {Array(numQuestions).fill(0).map((_, index) => (
                    <QuestionArea key={index} questionIndex={index} />
                ))}
            </div>
        </div>
    )
}