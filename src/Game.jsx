import { useState } from "react";

function Square({ value, onSquareClick, isWinningSquare }) {
    return (
        <button className={`square ${isWinningSquare ? "winning-square" : ""}`} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }

        const nextSquares = squares.slice();

        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }

        const location = { row: Math.floor(i / 3) + 1, col: (i % 3) + 1 };

        onPlay(nextSquares, location);
    }

    let status;

    const winnerInfo = calculateWinner(squares);
    const winner = winnerInfo.winner;
    const winningSquares = winnerInfo.winningSquares || [];

    const isDraw = winnerInfo.draw;

    if (winner) {
        status = "Winner: " + winner;
    } else if (isDraw) {
        status = "The game is a draw.";
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    function renderSquare(i) {
        return (
            <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                isWinningSquare={winningSquares.includes(i)}
            />
        );
    }

    const boardRows = [];

    for (let row = 0; row < 3; row++) {
        const boardSquares = [];

        for (let col = 0; col < 3; col++) {
            boardSquares.push(renderSquare(row * 3 + col));
        }

        boardRows.push(
            <div key={row} className="board-row">
                {boardSquares}
            </div>
        );
    }

    return (
        <>
            <div className="status">{status}</div>
            {boardRows}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([{ squares: Array(9).fill(null), location: null }]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isAscending, setIsAscending] = useState(true);

    const xIsNext = currentMove % 2 === 0;

    const currentSquares = history[currentMove].squares;

    function handlePlay(nextSquares, location) {
        const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, location }];

        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const toggleSortOrder = () => {
        setIsAscending(!isAscending);
    };

    const moves = history.map((step, move) => {
        const desc = move ? `Go to move #${move} (${step.location.row}, ${step.location.col})` : "Go to game start";

        return (
            <li key={move}>
                {move === currentMove ? (
                    <span>
                        You are at move #{move} {step.location ? `(${step.location.row}, ${step.location.col})` : ""}
                    </span>
                ) : (
                    <button onClick={() => jumpTo(move)}>{desc}</button>
                )}
            </li>
        );
    });

    if (!isAscending) {
        moves.reverse();
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>

            <div className="game-info">
                <button onClick={toggleSortOrder}>{isAscending ? "Sort Descending ↓" : "Sort Ascending ↑"}</button>

                <ul>{moves}</ul>
            </div>

            <footer>
                <p>
                    <strong>HCMUS Advanced Web App Development</strong>
                </p>

                <p>
                    <a href="https://github.com/pdqdat/awad-ia01" target="_blank">
                        <strong>IA01 Assessment &#8599;</strong>
                    </a>
                </p>

                <p>
                    By{" "}
                    <a href="https://github.com/pdqdat" target="_blank">
                        Dat Phan
                    </a>
                </p>
            </footer>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], winningSquares: [a, b, c] };
        }
    }

    if (squares.every((square) => square !== null)) {
        return { winner: null, draw: true, winningSquares: [] };
    }

    return { winner: null, winningSquares: [] };
}
