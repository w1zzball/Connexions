export interface Tile {
    question: string;
    text: string;
    color: string;
    id: number;
}

export interface QuestionSet {
    question: string;
    answers: string[];
    color: string;
}

export interface GuessSummaryProps {
    guessHistory: Tile[][];
}

export interface ToastProps {
    isVisible: boolean;
    message: string;
}

export interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
    isVisible: boolean;
}

export type SetQuestionSets = React.Dispatch<React.SetStateAction<QuestionSet[]>>;