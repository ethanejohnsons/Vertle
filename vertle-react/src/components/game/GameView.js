import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from "react-cookie";
import { Button } from 'react-bootstrap';
import moment from "moment";

import { Line } from './model/Line';
import { Vertex } from './model/Vertex';
import { GameState } from './model/GameState';
import { Convert } from './math/VertleMath';

import './GameView.css';

const { server, devServer, isDev } = require('../../config.json');

export function GameView(props) {
    const { width, height, guesses, setShareState } = props;

    // Cookies
    const [ cookie, setCookie, removeCookie] = useCookies(['gameState']);

    // Daily Answer Info
    const [ answer, setAnswer] = useState("");
    const [ vertexCount, setVertexCount ] = useState(0);
    const [ gameNumber, setGameNumber ] = useState(0);

    // Game State
    const [ mode, setMode ] = useState(0);
    const [ workingState, setWorkingState ] = useState("");
    const [ selectedState, setSelectedState ] = useState("");
    const [ stateHistory, setStateHistory ] = useState([]);
    const [ gameState, setGameState ] = useState(new GameState("", width, height));

    const hasGameEnded = () => hasWon || stateHistory.length > guesses - 1;
    const [ hasWon, setHasWon ] = useState(false);

    const [ currentVertex, setCurrentVertex ] = useState(null);

    // Canvas/Mouse
    const [ isMouseDown, setIsMouseDown ] = useState(false);
    const [ mouseX, setMouseX ] = useState(0);
    const [ mouseY, setMouseY ] = useState(0);
    const canvas = useRef(null);

    // Rebuild cached game state each time a new state is selected.
    useEffect(() => {
        let gameState = new GameState(selectedState, width, height, stateHistory[stateHistory.length - 1]);

        // If the state is a previous guess, show the hint via the answer.
        if (stateHistory.includes && stateHistory.includes(selectedState)) {
            gameState.buildVertices(width, height, answer);
            gameState.buildLines();
        }

        if (gameState.previous) {
            gameState.previous.buildVertices(width, height, answer);
        }

        setGameState(gameState);
    }, [stateHistory, selectedState, answer, width, height]);

    useEffect(() => {
        if (hasWon) {
            setShareState({
                history: stateHistory,
                gameNumber: gameNumber,
                answer: answer
            });
        }
    }, [hasWon]);

    // If the working state is ever modified, the selected state should be assigned.
    useEffect(() => {
        setSelectedState(workingState);
    }, [workingState]);

    /**
     * Called once on initial page render.
     */
    useEffect(() => {
        // Document Setup
        document.body.style.overflow = "hidden";
        canvas.current.getContext("2d").imageSmoothingEnabled = false;

        fetch(`${isDev ? devServer : server}/daily?date=${moment().format('YYYY-MM-DD')}`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        }).then(res => res.json()).then(data => {
            let answer = data.simpleAnswer;
            let gameNumber = data.gameNumber;
            let vertexCount = Convert.toVertexCountFromLength(answer.length);

            setAnswer(answer);
            setVertexCount(vertexCount);
            setGameNumber(gameNumber);

            // try {
                // setStateHistory(JSON.parse(cookie['stateHistory']));
                // setWorkingState(JSON.parse(cookie['workingState']));
            // } catch (err) {
                setWorkingState(getBaseState(answer.length));
                setStateHistory([]);
            // }
        }).catch(console.error);
    }, []);

    /**
     * Writes to cookies so that the state persists for the rest of the day.
     */
    useEffect(() => {
        removeCookie('stateHistory');
        removeCookie('workingState');

        let date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0, 0);
        setCookie('stateHistory', JSON.stringify(stateHistory), { expires: date });
        setCookie('workingState', JSON.stringify(workingState), { expires: date });
    }, [workingState, stateHistory]);

    /**
     * Called on each render of the page.
     */
    useEffect(() => {
        let ctx = canvas.current.getContext("2d");

        // Clear the screen
        ctx.clearRect(0, 0, width, height);

        // Click & Drag
        if (isMouseDown && currentVertex) {
            Line.drawDraggable(ctx, currentVertex.x, currentVertex.y, mouseX, mouseY, canvas.current.offsetLeft, canvas.current.offsetTop, GameState.baseColor);
        }

        if (!hasGameEnded() && selectedState === workingState && gameState.previous) {
            gameState.lines.forEach(line => line.draw(ctx));

            gameState.previous.vertices.forEach(vertex => {
                let connectedLines = Vertex.getConnectedLines(gameState.previous, vertex.index);
                vertex.draw(ctx, connectedLines.length);
            });
        } else {
            gameState.draw(ctx, selectedState !== workingState);
        }
    });

    /**
     * @returns {string} a string of zeroes of the same length as the {@link answer}
     */
    const getBaseState = (length) => {
        return "".padStart(length ? length : answer.length, "0");
    }

    /**
     * Handles left and right button clicks.
     * @param direction the direction to move through the {@link stateHistory}
     */
    const onGuessNavigation = (direction) => {
        let index = stateHistory.indexOf(selectedState);

        if (direction === -1) {
            if (!hasGameEnded() && selectedState === workingState) {
                setSelectedState(stateHistory[stateHistory.length - 1]);
            } else {
                setSelectedState(stateHistory[index - 1]);
            }
        }

        if (direction === 1) {
            if (index === stateHistory.length - 1) {
                setSelectedState(workingState);
            } else {
                setSelectedState(stateHistory[index + 1]);
            }
        }
    }

    /**
     * Handles the "Submit" button click. Checks whether the user's guess
     * is correct and if so, generate a new share state.
     */
    const onSubmit = () => {
        setStateHistory(prevStateHistory => [...prevStateHistory, workingState]);

        let hasWon = answer === workingState;
        setHasWon(hasWon);

        if (hasWon || stateHistory.length >= guesses - 1) {
            setWorkingState(answer);
        } else {
            setWorkingState(getBaseState(answer.length));
        }
    };

    /**
     * Handles all mouse movement/clicking. Includes touch screens.
     */
    useEffect(() => {
        if (workingState && !hasGameEnded() && isMouseDown) {
            let offsetX = canvas.current.offsetLeft;
            let offsetY = canvas.current.offsetTop;
            let ex = mouseX - offsetX;
            let ey = mouseY - offsetY;

            gameState.vertices.forEach(vertex => {
                if (vertex.isCursorOver(ex, ey)) {
                    if (currentVertex === null) {
                        setCurrentVertex(vertex);
                    } else if (currentVertex.index !== vertex.index) {
                        setWorkingState(vertex.onClick(workingState, currentVertex, vertexCount));
                        setCurrentVertex(null);
                    }
                }
            });

            if (isMouseDown && selectedState !== workingState) {
                setSelectedState(workingState);
            }
        } else {
            setCurrentVertex(null);
        }
    }, [mouseX, mouseY, isMouseDown]);

    /**
     * Gets a message to display based on the user's guess count at the end of the game.
     * @returns {string} the response string
     */
    const getEndMessage = () => {
        switch (guesses - stateHistory.length) {
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
                    disabled={stateHistory.length === 0 || stateHistory[0] === selectedState}
                    variant="outline-dark">{"<"}</Button>
                <Button
                    style={{ width: 100, borderWidth: 2 }}
                    variant="outline-dark"
                    disabled={gameState.lines.length === 0 || selectedState !== workingState || hasGameEnded()}
                    onClick={onSubmit}
                >Submit</Button>
                <Button
                    style={{ width: 100, borderWidth: 2 }}
                    variant="outline-dark"
                    disabled={gameState.lines.length === 0 || selectedState !== workingState || hasGameEnded()}
                    onClick={() => setWorkingState(getBaseState(answer.length))}
                    >Clear</Button>
                <Button
                    style={{ borderWidth: 2 }}
                    onClick={() => onGuessNavigation(1)}
                    disabled={selectedState === workingState}
                    variant="outline-dark">{">"}</Button>
            </div>
            <hr size={5} className="gamePane-divider"/>
            <p style={{ textAlign: "center" }}>{
                hasGameEnded() ? getEndMessage() : `${guesses - stateHistory.length} guess${guesses - stateHistory.length === 1 ? `` : `es`} left.`}
            </p>
            <canvas
                ref={canvas} width={width} height={height}
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