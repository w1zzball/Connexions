export interface Tile {
    question: string;
    text: string;
    color: string;
}

export interface QuestionSet {
    question: string;
    answers: string[];
    color: string;
}

export interface GuessSummaryProps {
    guessHistory: Tile[][];
}