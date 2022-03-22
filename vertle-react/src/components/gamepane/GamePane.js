import React, { useState, useEffect, useRef } from 'react';
import { useCookies} from 'react-cookie';

import { Button } from 'react-bootstrap';

import { Line } from '../../model/Line';
import { Vertex } from '../../model/Vertex';
import { GameState } from '../../model/GameState';
import './GamePane.css';

export function GamePane(props) {
    const { width, height, outputGuessHistory, setGameNumber, baseColor, closeColor, correctColor, lastColor } = props;

    // Game States
    const [ gameState, setGameState ] = useState(new GameState([], [], baseColor, closeColor, correctColor, lastColor));
    const [ guessHistory, setGuessHistory ] = useState([]);
    const [ currentGuess, setCurrentGuess ] = useState(null);
    const [ currentVertex, setCurrentVertex ] = useState(null);
    const [ gameHasEnded, setGameHasEnded ] = useState(false);

    // Game State - Cookie
    const [ gameStateCookie, setGameStateCookie ] = useCookies(['game-state']);

    // Daily Answer Info
    const [ answer, setAnswer] = useState(0b0);
    const [ vertexCount, setVertexCount ] = useState(0);

    // Canvas/Mouse States
    const [ isMouseDown, setIsMouseDown ] = useState(false);
    const [ mouseX, setMouseX ] = useState(0);
    const [ mouseY, setMouseY ] = useState(0);
    const canvas = useRef(null);

    useEffect(() => render());

    useEffect(() => {
        document.body.style.overflow = "hidden";
        canvas.current.getContext("2d").imageSmoothingEnabled = false;

        fetch('http://192.168.86.22:4000/daily', {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        }).then(response => response.json()).then(data => {
            setAnswer(parseInt(data.answer, 2));
            setVertexCount(data.vertices);
            setGameNumber(data.gameNumber);
            setupGameState(data.vertices);
        }).catch(err => console.log(err));

        if (gameStateCookie['history'] !== undefined) {
            // setGuessHistory(gameStateCookie['history']);
            // setGameHasEnded(gameStateCookie['gameHasEnded']);

            // if (guessHistory.length > 0) {
            //     setCurrentGuess(guessHistory[guessHistory.length - 1]);
            // }
        }
    }, []);

    useEffect(() => {
        let date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(0,0,0,0);
        setGameStateCookie("history", guessHistory, { expires: date });
        setGameStateCookie("gameHasEnded", gameHasEnded, { expires: date });
    }, [gameState, gameHasEnded]);

    const render = () => {
        let ctx = canvas.current.getContext("2d");

        // Clear the screen
        ctx.clearRect(0, 0, width, height);

        const drawDraggable = () => {
            // Click & Drag
            if (isMouseDown && currentVertex) {
                Line.drawDraggable(ctx,
                    currentVertex.x,
                    currentVertex.y,
                    mouseX,
                    mouseY,
                    canvas.current.offsetLeft,
                    canvas.current.offsetTop,
                    gameState.baseColor
                );
            }
        }


        if (currentGuess) {
            currentGuess.lines.forEach(line => line.draw(ctx));
            gameState.lines.forEach(line => line.draw(ctx));
            drawDraggable();
            currentGuess.vertices.forEach(vertex => vertex.draw(ctx));
        } else {
            drawDraggable();
            gameState.draw(ctx);
        }
    }

    const onGuessNavigation = (direction) => {
        let index = guessHistory.indexOf(currentGuess);

        if (direction === -1 && index > 0) {
            setCurrentGuess(guessHistory[index - 1]);
        }

        if (direction === 1 && index < guessHistory.length - 1) {
            setCurrentGuess(guessHistory[index + 1]);
        }
    }

    const onCheckAnswerClick = () => {
        let guess = gameState.verifyAndReturn(answer);
        guessHistory.push(guess);
        setCurrentGuess(guess);

        if (guess.hasWon || guessHistory.length === 6) {
            outputGuessHistory(guessHistory);
            setGameHasEnded(true);
        } else {
            setupGameState(vertexCount);
        }
    };

    const onCanvasClick = (event) => {
        let ex;
        let ey;
        let offsetX = canvas.current.offsetLeft;
        let offsetY = canvas.current.offsetTop;

        if (isTouchDevice()) {
            ex = event.changedTouches.item(0).clientX - offsetX;
            ey = event.changedTouches.item(0).clientY - offsetY;
        } else {
            ex = event.clientX - offsetX;
            ey = event.clientY - offsetY;
        }

        if (!gameHasEnded && !gameState.onClick(ex, ey, currentVertex, setCurrentVertex)) {
            setCurrentVertex(null);
        }
    };

    const isTouchDevice = () => {
        return ( 'ontouchstart' in window ) ||
            ( navigator.maxTouchPoints > 0 ) ||
            ( navigator.msMaxTouchPoints > 0 );
    }

    const setupGameState = (vertexCount) => {
        let gameState = new GameState([], [], baseColor, closeColor, correctColor, lastColor);

        Array(vertexCount).fill(null).map((_, i) => i).map(i => {
            let pos = Vertex.getPosition(i, vertexCount, width * 0.45);
            let x = pos[0] + (width * 0.5);
            let y = pos[1] + (height * 0.5);
            gameState.vertices.push(new Vertex(i, x, y, gameState.baseColor));
        });

        setGameState(gameState);
        setCurrentVertex(null);
    }

    const winMessage = (guessesLeft) => {
        switch (guessesLeft) {
            case 5:
                return 'Sus. 🤨'
            case 4:
                return 'Epic! 😎';
            case 3:
                return 'Nice!';
            case 2:
                return 'Good!';
            case 1:
                return 'Not bad!';
            case 0:
                return 'You can do better!';
        }
    }

    return (
        <div>
            <div className="gamePane-button">
                <Button
                    style={{ borderWidth: 2 }}
                    onClick={() => onGuessNavigation(-1)}
                    disabled={guessHistory.length === 0 || guessHistory.indexOf(currentGuess) === 0}
                    variant="outline-dark">{"<"}</Button>
                <Button
                    style={{ width: 100, borderWidth: 2 }}
                    variant="outline-dark"
                    disabled={gameState.lines.length === 0 || gameHasEnded}
                    onClick={onCheckAnswerClick}
                >Submit</Button>
                <Button
                    style={{ width: 100, borderWidth: 2 }}
                    variant="outline-dark"
                    disabled={gameState.lines.length === 0 || gameHasEnded}
                    onClick={() => setupGameState(vertexCount)}
                    >Clear</Button>
                <Button
                    style={{ borderWidth: 2 }}
                    onClick={() => onGuessNavigation(1)}
                    disabled={guessHistory.length === 0 || guessHistory.indexOf(currentGuess) === guessHistory.length - 1 || !currentGuess}
                    variant="outline-dark">{">"}</Button>
            </div>
            <hr size={5} className="gamePane-divider"/>
            <p style={{ textAlign: "center" }}>{
                gameHasEnded ? winMessage(6 - guessHistory.length) : `${6 - guessHistory.length} guesses left.`}
            </p>
            <canvas
                ref={canvas}
                width={width}
                height={height}
                onMouseUp={(e) => {
                    if (!isTouchDevice()) {
                        onCanvasClick(e);
                        setIsMouseDown(false);
                    }
                }}
                onMouseDown={(e) => {
                    if (!isTouchDevice()) {
                        onCanvasClick(e);
                        setIsMouseDown(true);
                    }
                }}
                onMouseMove={(e) => {
                    if (!isTouchDevice()) {
                        setMouseX(e.clientX);
                        setMouseY(e.clientY);
                    }
                }}

                onTouchEnd={(e) => {
                    if (isTouchDevice()) {
                        setIsMouseDown(false);
                        setMouseX(e.changedTouches.item(0).pageX);
                        setMouseY(e.changedTouches.item(0).pageY);
                        onCanvasClick(e);
                    }
                }}
                onTouchStart={(e) => {
                    if (isTouchDevice()) {
                        setIsMouseDown(true);
                        setMouseX(e.changedTouches.item(0).pageX);
                        setMouseY(e.changedTouches.item(0).pageY);
                        onCanvasClick(e);
                    }
                }}
                onTouchMove={(e) => {
                    if (isTouchDevice()) {
                        setMouseX(e.changedTouches.item(0).pageX);
                        setMouseY(e.changedTouches.item(0).pageY);
                    }
                }}>
                Your browser does not support HTML canvas.
            </canvas>
        </div>
    );
}