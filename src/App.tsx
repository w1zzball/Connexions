import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./App.css";
import Tile from "./components/Tile.tsx";
import Row from "./components/Row.tsx";
import Setup from "./components/Setup.tsx";
import initQuestionSets from "./static/initQuestions.tsx";
import Modal from "./components/Modal.tsx";
import { GameConfigContext } from "./context/GameConfigContext.tsx";
import type { Tile as TileType, QuestionSet } from "./types/types.tsx";
import GuessSummary from "./components/GuessSummary.tsx";
import Toast from "./components/Toast.tsx";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { toWords } from "number-to-words"

//TODO further reduce share URL length- remove excess object structure
//TODO improve favicon
//TODO make row answers elipsis out or make it scrollable
//TODO improve accessibility (ARIA labels, keyboard navigation, focus management)
//TODO add animations for solved rows or transitions
//TODO improve color picker UI and validate color contrast
//TODO add instructions/help modal
//TODO add toast to alert to improper link import
//TODO add light dark mode toggle button

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

let tileIdCounter = 0;
function questionSetsToTile(qSets: QuestionSet[]): TileType[] {
  const tileSet: TileType[] = [];
  qSets.forEach((qSet) => {
    qSet.answers.forEach((ans) => {
      tileSet.push({
        question: qSet.question,
        text: ans,
        color: qSet.color,
        id: tileIdCounter++,
      });
    });
  });
  // shuffle the tileSet before returning
  return shuffleArray(tileSet);
}

const initTileSet: TileType[] = questionSetsToTile(initQuestionSets);

function App() {
  //attempt to get state from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const compressedState = urlParams.get("ID");
  let urlState: { [key: string]: any } | null = null;
  if (compressedState) {
    //clear site url to remove params
    window.history.replaceState({}, document.title, window.location.pathname);
    try {
      const decompressedState =
        decompressFromEncodedURIComponent(compressedState);
      const truncatedState = JSON.parse(decompressedState);
      // Create a new state object with necessary properties
      urlState = {
        ...truncatedState,
        lives: truncatedState.numLives,
        tileSet: shuffleArray(questionSetsToTile(truncatedState.questionSets)),
        solvedTiles: [],
        guessHistory: [],
      };
    } catch (error) {
      console.error("Failed to restore game state from URL:", error);
    }
  }

  //attempt to get state from localStorage
  const stateString = localStorage.getItem("gameState");
  const localState = stateString ? JSON.parse(stateString) : null;
  //choose which state to use (prefer URL state if available)
  const gameState = urlState || localState || null;

  //
  const [numQuestions, setNumQuestions] = useState(() =>
    gameState ? gameState.numQuestions : initQuestionSets.length,
  );
  const [numAnswers, setNumAnswers] = useState(() =>
    gameState ? gameState.numAnswers : initQuestionSets[0].answers.length,
  );
  const [numLives, setNumLives] = useState(() =>
    gameState ? gameState.numLives : 4,
  );
  const [lives, setLives] = useState(() => (gameState ? gameState.lives : 4));

  const [tileSet, setTileSet] = useState<TileType[]>(() =>
    gameState ? gameState.tileSet : shuffleArray(initTileSet),
  );
  const [selected, setSelected] = useState<TileType[]>([]);
  const [solvedTiles, setSolvedTiles] = useState<TileType[][]>(() =>
    gameState ? gameState.solvedTiles : [],
  );
  const [guessHistory, setGuessHistory] = useState<TileType[][]>(() =>
    gameState ? gameState.guessHistory : [],
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [questionSets, setQuestionSets] = useState(() =>
    gameState ? gameState.questionSets : initQuestionSets,
  );
  const [isShaking, setIsShaking] = useState(false);
  const shuffleTiles = (): void => {
    setTileSet(shuffleArray(tileSet));
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [toastState, setToastState] = useState({
    isVisible: false,
    message: "",
  });
  function generateGameID(): string {
    // Create a new game state (fresh game, not current progress)
    const gameState = {
      numQuestions,
      numAnswers,
      numLives,
      //omitted to shorten URL
      // lives: numLives,
      // tileSet: shuffleArray(questionSetsToTile(questionSets)),
      // solvedTiles: [],
      // guessHistory: [],
      questionSets,
    };
    const stateString = JSON.stringify(gameState);
    const compressedState = compressToEncodedURIComponent(stateString);
    const IDUrl = `${window.location.origin}${window.location.pathname}?ID=${compressedState}`;
    return IDUrl;
  }

  // save to local storage on change
  useEffect(() => {
    const gameState = {
      numQuestions,
      numAnswers,
      numLives,
      lives,
      tileSet,
      solvedTiles,
      guessHistory,
      questionSets,
    };

    const stateString = JSON.stringify(gameState);
    localStorage.setItem("gameState", stateString);
  }, [
    //state data to track
    numQuestions,
    numAnswers,
    numLives,
    lives,
    tileSet,
    solvedTiles,
    guessHistory,
    questionSets,
  ]);

  const toggleModal = (): void => {
    setModalVisible(!modalVisible);
  };

  // Show modal on win or lose
  useEffect(() => {
    if (lives === 0 || tileSet.length === 0) {
      setModalVisible(true);
    }
  }, [lives, tileSet.length]);

  function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  const submit = (): void => {
    const answerTally: { [key: string]: number } = selected.reduce(
      (acc: { [key: string]: number }, curr) => {
        acc[curr.question] = (acc[curr.question] || 0) + 1;
        return acc;
      },
      {},
    );
    const isOneOff = Object.values(answerTally).some(
      (count) => count === numAnswers - 1,
    );

    // Helper to compare two arrays of tile ids regardless of order
    const idsSorted = (arr: TileType[]): number[] =>
      arr.map((t) => t.id).sort((a, b) => a - b);
    const isSameSet = (a: TileType[], b: TileType[]): boolean => {
      const aIds = idsSorted(a);
      const bIds = idsSorted(b);
      return (
        aIds.length === bIds.length && aIds.every((id, i) => id === bIds[i])
      );
    };
    if (guessHistory.some((g) => isSameSet(g, selected))) {
      setToastState({ isVisible: true, message: "already guessed!" });
      setTimeout(() => setToastState({ isVisible: false, message: "" }), 1200);
      return;
    }
    if (selected.length !== numAnswers) return;
    const question = selected[0]?.question;
    const isCorrect: boolean = selected.reduce(
      (acc, tile) => acc && tile.question === question,
      true,
    );
    if (isCorrect) {
      setSolvedTiles((old) => [...old, selected]);
      setTileSet((prevTileSet) =>
        prevTileSet.filter(
          (tile) => !selected.some((sel) => sel.id === tile.id),
        ),
      );
      setSelected([]);
      setGuessHistory((old) => [...old, selected]);
    } else {
      if (isOneOff) {
        setToastState({ isVisible: true, message: "one off!" });
        setTimeout(
          () => setToastState({ isVisible: false, message: "" }),
          1200,
        );
      }
      setGuessHistory((old) => [...old, selected]);
      setLives(lives - 1);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  };

  const handleSelect = (tile: TileType): void => {
    if (selected.some((t) => t.id === tile.id)) {
      setSelected(selected.filter((t) => t.id !== tile.id));
    } else {
      if (selected.length < numAnswers) {
        setSelected([...selected, tile]);
      }
    }
  };
  // reset game state when the number of questions changes or when the game is toggled
  const handleBack = () => {
    setIsPlaying((old) => !old);
    setGuessHistory([]);
    setTileSet(shuffleArray(questionSetsToTile(questionSets)));
    setSolvedTiles([]);
    setSelected([]);
    setLives(numLives);
  };

  // Handler to fully reset the game (for Play Again)
  const resetGame = () => {
    tileIdCounter = 0;
    setGuessHistory([]);
    setTileSet(shuffleArray(questionSetsToTile(questionSets)));
    setSolvedTiles([]);
    setSelected([]);
    setLives(numLives);
    setModalVisible(false);
  };

  return (
    <GameConfigContext.Provider
      value={{
        numQuestions,
        setNumQuestions,
        numAnswers,
        setNumAnswers,
        numLives,
        setNumLives,
        questionSets,
        setQuestionSets,
      }}
    >
      <>
        <Toast isVisible={toastState.isVisible} message={toastState.message} />
        {isPlaying ? (
          <div id="game">
            <p id="game-dimension-text">
              Make {toWords(numQuestions)} group{numQuestions !== 1 ? "s" : ""} of {toWords(numAnswers)}!
            </p>
            <div id="play-area">
              {/* solved rows*/}
              <div style={{ marginBottom: "16px" }}>
                {solvedTiles.map((tiles, index) => (
                  <Row
                    key={index}
                    color={tiles[0]?.color}
                    question={tiles[0]?.question}
                    tileString={tiles.map((tile) => tile.text).join(", ")}
                  />
                ))}
              </div>
              <div
                id="board"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${numAnswers}, 1fr)`,
                  gap: "12px",
                  justifyItems: "stretch",
                  alignItems: "center",
                  width: "100%",
                  margin: "0 auto",
                }}
              >
                {tileSet.map((tile) => (
                  <motion.div
                    key={tile.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Tile
                      text={tile.text}
                      selected={selected.some((t) => t.id === tile.id)}
                      shake={
                        isShaking && selected.some((t) => t.id === tile.id)
                      }
                      handleSelect={() => handleSelect(tile)}
                      numAnswers={numAnswers} // pass grid size
                    />
                  </motion.div>
                ))}
              </div>
              <div id="mistakes-counter">
                <p>Mistakes Remaining: {"● ".repeat(lives)}</p>
              </div>
              <div id="button-container">
                <button onClick={shuffleTiles}>Shuffle</button>
                <button
                  className={selected.length < 1 ? "disabled" : undefined}
                  onClick={
                    selected.length < 1 ? undefined : () => setSelected([])
                  }
                >
                  Deselect All
                </button>
                <button
                  className={
                    selected.length !== numAnswers || lives === 0
                      ? "disabled"
                      : undefined
                  }
                  onClick={
                    selected.length !== numAnswers || lives === 0
                      ? undefined
                      : submit
                  }
                >
                  Submit
                </button>
              </div>
              <div id="button-container-secondary">
                <button
                  className="settings-button "
                  onClick={() => setIsPlaying((old) => !old)}
                >
                  Customise Game <i className="fa-solid fa-gear"></i>
                </button>
                <button
                  className="share-button"
                  onClick={() => {
                    const gameID = generateGameID();
                    navigator.clipboard.writeText(gameID);
                    setToastState({
                      isVisible: true,
                      message: "Game link copied to clipboard!",
                    });
                    setTimeout(
                      () => setToastState({ isVisible: false, message: "" }),
                      1200,
                    );
                  }}
                >
                  <i className="fa-solid fa-copy"></i> Copy Game Link
                </button>
              </div>
            </div>
            {/* Overlay modal if game is over */}
            {modalVisible && (lives === 0 || tileSet.length === 0) && (
              <Modal isVisible={modalVisible} onClose={toggleModal}>
                {lives === 0 ? (
                  <>
                    <h2>Game Over</h2>
                    <GuessSummary guessHistory={guessHistory} />
                    <button
                      style={{ marginTop: "30px" }}
                      className="back-button"
                      onClick={resetGame}
                    >
                      <i className="fa-solid fa-arrow-rotate-left"></i> Play
                      Again
                    </button>
                  </>
                ) : (
                  <>
                    <h2>You Win</h2>
                    <GuessSummary guessHistory={guessHistory} />
                    <button
                      style={{ marginTop: "30px" }}
                      className="back-button"
                      onClick={resetGame}
                    >
                      <i className="fa-solid fa-arrow-rotate-left"></i> Play
                      Again
                    </button>
                  </>
                )}
              </Modal>
            )}
          </div>
        ) : (
          <div>
            <button className="back-button" onClick={handleBack}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <Setup />
            <button className="back-button" onClick={handleBack}>
              <i className="fa-solid fa-arrow-left"></i>
            </button>
          </div>
        )}
      </>
    </GameConfigContext.Provider>
  );
}

export default App;
