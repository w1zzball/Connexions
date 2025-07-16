import './QuestionArea.css'
import { useGameConfig } from '../context/GameConfigContext.tsx'
import { useState } from 'react'

export default function QuestionArea({ questionIndex }: { questionIndex: number }) {
    const { numQuestions, questionSets, setQuestionSets } = useGameConfig();
    return (
        <div className="question-area">
            <p>Question:</p>
            <input className='color-picker' type="color"></input>
            <input className='question-input' type="text" placeholder="Question"
                maxLength={50} autoComplete="off"
                value={questionSets[questionIndex]?.question}
                onChange={(e) => {
                    const newSets = [...questionSets];
                    newSets[questionIndex].question = e.target.value;
                    setQuestionSets(newSets);
                }}
            />
            <p>Answer:</p>
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