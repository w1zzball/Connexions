import { createContext, useContext } from "react";

export const GameConfigContext = createContext<{
    numQuestions: number;
    setNumQuestions: (n: number) => void;
    numAnswers: number;
    setNumAnswers: (n: number) => void;
} | undefined>(undefined);

export function useGameConfig() {
    const ctx = useContext(GameConfigContext);
    if (!ctx) throw new Error("useGameConfig must be used within GameConfigProvider");
    return ctx;
}