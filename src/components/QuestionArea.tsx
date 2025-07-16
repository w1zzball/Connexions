import './QuestionArea.css'
import { useGameConfig } from '../context/GameConfigContext.tsx'
import { useState } from 'react'

export default function QuestionArea() {
    const { numQuestions } = useGameConfig();
    return (
        <div className="question-area">
            <p>Question:</p>
            <input type="color"></input>
            <input></input>
            <p>Answer:</p>
            {Array(numQuestions).fill(0).map((_, index) => (
                <input key={index} type="text" placeholder={`Answer ${index + 1}`} />
            ))}
        </div>

    )
}