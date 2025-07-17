import './QuestionArea.css'
import { useGameConfig } from '../context/GameConfigContext.tsx'
import { useState } from 'react'

export default function QuestionArea({ questionIndex }: { questionIndex: number }) {
    const { numQuestions, questionSets, setQuestionSets } = useGameConfig();
    return (
        <div className="question-area" style={{ backgroundColor: questionSets[questionIndex]?.color }}>
            {/* <p>Question:</p> */}

            <input className='question-input' type="text" placeholder="Question"
                maxLength={50} autoComplete="off"
                value={questionSets[questionIndex]?.question}
                onChange={(e) => {
                    const newSets = [...questionSets];
                    newSets[questionIndex].question = e.target.value;
                    setQuestionSets(newSets);
                }}
            />
            <div className="color-row">
                <i className="fa-solid fa-eye-dropper" style={{ fontSize: '1.2em', color: '#1e1e1e' }}></i>
                <input className='color-picker' type="color" value={questionSets[questionIndex]?.color}
                    onChange={(e) => {
                        const newSets = [...questionSets];
                        newSets[questionIndex].color = e.target.value;
                        setQuestionSets(newSets);
                    }} />

            </div>
            {/* <p>Answer:</p> */}
            {Array(numQuestions).fill(0).map((_, index) => (
                <input key={index} className='answer-input' type="text" placeholder={`Answer ${index + 1}`}
                    value={questionSets[questionIndex]?.answers[index]}
                    onChange={(e) => {
                        const newSets = [...questionSets];
                        newSets[questionIndex].answers[index] = e.target.value;
                        setQuestionSets(newSets);
                    }}
                />
            ))}
        </div>

    )
}