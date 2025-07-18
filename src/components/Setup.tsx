import QuestionArea from './QuestionArea.tsx'
import { useGameConfig } from '../context/GameConfigContext.tsx'
import './Setup.css'

export default function Setup() {
    const { numQuestions, setNumQuestions, numAnswers, setNumAnswers, questionSets, setQuestionSets } = useGameConfig();

    // Add a new question
    const addQuestion = () => {
        setNumQuestions(n => n + 1);
        setQuestionSets(sets => [
            ...sets,
            { question: '', answers: Array(numAnswers).fill(''), color: '#bb2b2b' }
        ]);
    };

    // Remove the last question
    const removeQuestion = () => {
        if (numQuestions > 1) {
            setNumQuestions(n => n - 1);
            setQuestionSets(sets => sets.slice(0, -1));
        }
    };

    // Add a new answer to all questions
    const addAnswer = () => {
        setNumAnswers(n => n + 1);
        setQuestionSets(sets => sets.map(q => ({
            ...q,
            answers: [...q.answers, '']
        })));
    };

    // Remove the last answer from all questions
    const removeAnswer = () => {
        if (numAnswers > 1) {
            setNumAnswers(n => n - 1);
            setQuestionSets(sets => sets.map(q => ({
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
            </div>
            <div id="question-container">
                {Array(numQuestions).fill(0).map((_, index) => (
                    <QuestionArea key={index} questionIndex={index} />
                ))}
            </div>
        </div>
    )
}