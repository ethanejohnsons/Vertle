import React, { useState, useEffect, useRef } from 'react';
import LZString from 'lz-string';
import { Button } from 'react-bootstrap';

import { Line } from '../../model/Line';
import { Vertex } from '../../model/Vertex';
import { GameState } from '../../model/GameState';
import './GamePane.css';

export function GamePane(props) {
    const { width, height, outputGuessHistory, setGameNumber, cookie, setCookie, removeCookie } = props;
    const moment = require('moment');

    const baseColor = '#222222';
    const correctColor = '#8DBA69';
    const closeColor = '#DCC55B';
    const lastColor = '#AAAAAA';

    const { server, devServer, isDev } = require('../../config.json');

    // Game States
    const [ gameState, setGameState ] = useState(new GameState([], [], baseColor, closeColor, correctColor, lastColor, width, height, false));
    const [ guessHistory, setGuessHistory ] = useState([]);
    const [ currentGuess, setCurrentGuess ] = useState(null);
    const [ currentVertex, setCurrentVertex ] = useState(null);
    const [ gameHasEnded, setGameHasEnded ] = useState(false);
    const [ hasWon, setHasWon ] = useState(false);

    // Daily Answer Info
    const [ answer, setAnswer] = useState("");
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

        let api = isDev ? devServer : server;
        let date = moment().format('YYYY-MM-DD');

        fetch(`${api}/daily?date=${date}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        }).then(response => response.json()).then(data => {
            setAnswer(data.answer);
            setVertexCount(data.vertices);
            setGameNumber(data.gameNumber);
            setupGameState(data.vertices);
        }).catch(err => console.log(err));

        if (guessHistory.length === 0 && cookie['history']) {
            let history = JSON.parse(LZString.decompressFromBase64(cookie['history']));
            history = history.map(state => new GameState(state.vertices, state.lines, baseColor, closeColor, correctColor, lastColor, state.verified));
            history.forEach(state => state.cleanFromJSON());

            setGuessHistory(history);
            setGameHasEnded(cookie['gameHasEnded'] === 'true');
            setHasWon(cookie['hasWon'] === 'true');
            setCurrentGuess(gameState);

            if (cookie['gameHasEnded'] === 'true') {
                outputGuessHistory(history);
            }
        }
    }, []);

    useEffect(() => {
        setCurrentGuess(gameState);
    }, [gameState])

    // Write to cookie so that state persists for the rest of the day.
    useEffect(() => {
        removeCookie('history');
        removeCookie('gameHasEnded');
        removeCookie('hasWon');

        let date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0, 0);
        setCookie("history", LZString.compressToBase64(JSON.stringify(guessHistory)), { expires: date });
        setCookie("gameHasEnded", gameHasEnded.toString(), {  expires: date });
        setCookie("hasWon", hasWon, { expires: date });
    }, [currentGuess, guessHistory, hasWon, gameHasEnded]);

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

        if (currentGuess === gameState) {
            drawDraggable();
        }

        if (currentGuess) {
            if (currentGuess === gameState && guessHistory[guessHistory.length - 1]) {
                currentGuess.lines.forEach(line => line.draw(ctx));
                guessHistory[guessHistory.length - 1].vertices.forEach(vertex => {
                    let possibleLines = Line.fromVertex(vertex);
                    let connectedLines = 0;

                    for (let i = 0; i < possibleLines.length; i++) {
                        for (let j = 0; j < guessHistory[guessHistory.length - 1].lines.length; j++) {
                            if (possibleLines[i] === guessHistory[guessHistory.length - 1].lines[j].index) {
                                connectedLines++;
                            }
                        }
                    }

                    vertex.draw(ctx, connectedLines);
                });

            } else {
                currentGuess.draw(ctx);
            }
        }
    }

    const onGuessNavigation = (direction) => {
        let index = guessHistory.indexOf(currentGuess);

        if (direction === -1){
            if (currentGuess === gameState) {
                setCurrentGuess(guessHistory[guessHistory.length - 1]);
            } else {
                setCurrentGuess(guessHistory[index - 1]);
            }
        }

        if (direction === 1) {
            if (index === guessHistory.length - 1) {
                setCurrentGuess(gameState);
            } else {
                setCurrentGuess(guessHistory[index + 1]);
            }
        }
    }

    const onCheckAnswerClick = () => {
        let history = guessHistory;
        let guess = gameState.verifyAndReturn(answer);
        let gameHasEnded = false;

        if (guess.hasWon || history.length >= 5) {
            outputGuessHistory(history);
            gameHasEnded = true;
        }

        setupGameState(vertexCount);
        history.push(guess);
        setGameHasEnded(gameHasEnded);
        setHasWon(guess.hasWon);
        setGuessHistory(history);
    };

    // On mouse click or move
    useEffect(() => {
        if (!gameHasEnded && isMouseDown) {
            let offsetX = canvas.current.offsetLeft;
            let offsetY = canvas.current.offsetTop;
            let ex = mouseX - offsetX;
            let ey = mouseY - offsetY;

            gameState.vertices.forEach(vertex => {
                if (vertex.isCursorOver(ex, ey)) {
                    vertex.onClick(gameState, currentVertex, setCurrentVertex)
                }
            });

            if (isMouseDown && currentGuess !== gameState) {
                setCurrentGuess(gameState);
            }
        } else {
            setCurrentVertex(null);
        }
    }, [mouseX, mouseY, isMouseDown]);

    const setupGameState = (vertexCount) => {
        let gameState = new GameState([], [], baseColor, closeColor, correctColor, lastColor, false);

        Array(vertexCount).fill(null).map((_, i) => i).map(i => {
            let pos = Vertex.getPosition(i, vertexCount, Math.min(width * 0.45, height * 0.45));
            let x = pos[0] + (width * 0.5);
            let y = pos[1] + (height * 0.5);
            gameState.vertices.push(new Vertex(i, x, y, gameState.baseColor));
        });

        setGameState(gameState);
        setCurrentVertex(null);
        setCurrentGuess(gameState);
        return gameState;
    }

    const endMessage = (guessesLeft) => {
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
                return 'Not terrible.';
            case 0:
                if (hasWon) {
                    return 'You can do better next time.'
                }

                return '😔 Better luck tomorrow.'
        }
    }

    return (
        <div>
            <div className="gamePane-button">
                <Button
                    style={{ borderWidth: 2 }}
                    onClick={() => onGuessNavigation(-1)}
                    disabled={guessHistory.length === 0 || guessHistory[0] === currentGuess}
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
                    disabled={currentGuess === gameState}
                    variant="outline-dark">{">"}</Button>
            </div>
            <hr size={5} className="gamePane-divider"/>
            <p style={{ textAlign: "center" }}>{
                gameHasEnded ? endMessage(6 - guessHistory.length) : `${6 - guessHistory.length} guess${6 - guessHistory.length === 1 ? `` : `es`} left.`}
            </p>
            <canvas
                ref={canvas}
                width={width}
                height={height}
                onMouseUp={(e) => {
                    setMouseX(e.clientX);
                    setMouseX(e.clientY);
                    setIsMouseDown(false);
                }}
                onMouseDown={(e) => {
                    setMouseX(e.clientX);
                    setMouseX(e.clientY);
                    setIsMouseDown(true);
                }}
                onMouseMove={(e) => {
                    setMouseX(e.clientX);
                    setMouseY(e.clientY);
                }}

                onTouchEnd={(e) => {
                    setIsMouseDown(false);
                    setMouseX(e.changedTouches.item(0).pageX);
                    setMouseY(e.changedTouches.item(0).pageY);
                }}
                onTouchStart={(e) => {
                    setIsMouseDown(true);
                    setMouseX(e.changedTouches.item(0).pageX);
                    setMouseY(e.changedTouches.item(0).pageY);
                }}
                onTouchMove={(e) => {
                    setMouseX(e.changedTouches.item(0).pageX);
                    setMouseY(e.changedTouches.item(0).pageY);
                }}>
                Your browser does not support HTML canvas.
            </canvas>
        </div>
    );
}