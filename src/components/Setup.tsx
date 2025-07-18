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
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', justifyContent: 'center' }}>
                <div>
                    <span style={{ fontWeight: 'bold' }}>Questions: </span>
                    <button onClick={removeQuestion} disabled={numQuestions <= 1}>-</button>
                    <span style={{ margin: '0 8px' }}>{numQuestions}</span>
                    <button onClick={addQuestion}>+</button>
                </div>
                <div>
                    <span style={{ fontWeight: 'bold' }}>Answers: </span>
                    <button onClick={removeAnswer} disabled={numAnswers <= 1}>-</button>
                    <span style={{ margin: '0 8px' }}>{numAnswers}</span>
                    <button onClick={addAnswer}>+</button>
                </div>
                <div>
                    <span style={{ fontWeight: 'bold' }}>Lives: </span>
                    <button onClick={() => setNumLives(numLives > 1 ? numLives - 1 : 1)} disabled={numLives <= 1}>-</button>
                    <span style={{ margin: '0 8px' }}>{numLives}</span>
                    <button onClick={() => setNumLives(numLives + 1)}>+</button>
                </div>
            </div>
            <div id="question-container">
                {Array(numQuestions).fill(0).map((_, index) => (
                    <QuestionArea key={index} questionIndex={index} />
                ))}
            </div>
        </div>
    )
}