import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import './GamePane.css';

export function GamePane(props) {
    const { width, height, answer, totalVertices } = props;
    const [ state, setState ] = useState(0b0);

    const [ vertices, setVertices ] = useState([]);
    const [ linesToDraw, setLinesToDraw ] = useState([]);
    const [ currentVertex, setCurrentVertex ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    const [ isMouseDown, setIsMouseDown ] = useState(false);
    const [ mouseX, setMouseX ] = useState(0);
    const [ mouseY, setMouseY ] = useState(0);

    const [ guessHistory, setGuessHistory ] = useState([]);
    const [ currentGuess, setCurrentGuess ] = useState(null);

    const canvas = useRef(null);
    const vertexRadius = 15;

    useEffect(() => render());

    useEffect(() => {
        document.body.style.overflow = "hidden";
        canvas.current.getContext("2d").imageSmoothingEnabled = false;

        const calcGameRadius = () => {
            return width * 0.45;
        }

        const calcVertexPosition = (n) => {
            let radius = calcGameRadius();

            return [
                radius * Math.sin((2 * Math.PI * n) / totalVertices),
                -1.0 * radius * Math.cos((2 * Math.PI * n) / totalVertices)
            ];
        }

        let v = [];

        Array(totalVertices).fill(null).map((_, i) => i).map(i => {
            let pos = calcVertexPosition(i);
            let x = pos[0] + (width * 0.5);
            let y = pos[1] + (height * 0.5);

            let map = new Map();
            map.set('x', x);
            map.set('y', y);
            map.set('i', i);

            v.push(map);
        });

        setVertices(v);
    }, [answer]);

    /**
     * @param n the index of the vertex
     */
    const getLinesForVertex = (n) => {
        let N = 6;
        let c = N * 0.5 - 1;
        let out = [];

        for (let i = 0; i < N - 1; i++) {
            if (i < c) {
                out.push(n + i * N);
            } else if (i > c) {
                out.push((n + i + 1) % N + (N - i - 2) * N);
            } else {
                let halfN = N * 0.5;
                out.push(n % halfN + (halfN - 1) * N);
            }
        }

        return out;
    };

    const getLineForVertices = (v1, v2) => {
        let lines1 = getLinesForVertex(v1.get('i'));
        let lines2 = getLinesForVertex(v2.get('i'));
        let lineNumber = lines1.filter(l => lines2.indexOf(l) !== -1)[0];

        let map = new Map();
        map.set('lineNumber', lineNumber);
        map.set('x1', v1.get('x'));
        map.set('y1', v1.get('y'));
        map.set('x2', v2.get('x'));
        map.set('y2', v2.get('y'));
        map.set('color', '#222222');

        return map;
    }

    const render = () => {
        let ctx = canvas.current.getContext("2d");

        const drawVertices = (ctx) => {
            ctx.moveTo(0, 0);
            ctx.lineWidth = 0;

            vertices.map(v => {
                if (currentGuess) {
                    ctx.fillStyle = currentGuess.get('color');
                } else {
                    ctx.fillStyle = v.get('color');
                }

                ctx.beginPath();
                ctx.arc(v.get('x'), v.get('y'), vertexRadius, 0, 2 * Math.PI);
                ctx.fill();
            });
        };

        const drawLines = (ctx) => {
            ctx.strokeStyle = "#222222";
            ctx.lineWidth = 2;

            const drawLine = (l) => {
                ctx.moveTo(l.get('x1'), l.get('y1'));
                ctx.lineTo(l.get('x2'), l.get('y2'));
                ctx.stroke();
            }

            if (currentGuess) {
                currentGuess.get('lines').map(drawLine);
            } else {
                linesToDraw.map(drawLine);
            }
        }

        const drawMouseDownLine = (ctx) => {
            ctx.strokeStyle = '#222222';
            ctx.lineWidth = 2;

            let offsetX = canvas.current.offsetLeft;
            let offsetY = canvas.current.offsetTop;

            let x = currentVertex.get('x');
            let y = currentVertex.get('y');

            ctx.moveTo(x, y);
            ctx.lineTo(mouseX - offsetX, mouseY - offsetY);
            ctx.stroke();
        }

        ctx.clearRect(0, 0, width, height);
        drawLines(ctx);
        drawVertices(ctx);

        if (isMouseDown && currentVertex && !currentGuess) {
            drawMouseDownLine(ctx);
        }
    }

    const onGuessNavigation = (direction) => {
        if (direction === -1) {
            if (!currentGuess) {
                setCurrentGuess(guessHistory.length - 1);
            } else {
                setCurrentGuess(guessHistory.indexOf(currentGuess) - 1);
            }
        }

        if (direction === 1) {
            if (!currentGuess) {
                return;
            } else if (guessHistory.indexOf(currentGuess) !== guessHistory.length - 1){
                setCurrentGuess(guessHistory.indexOf(currentGuess) + 1);
            } else {
                setCurrentGuess(null);
            }
        }
    }

    const onCheckAnswerClick = () => {
        setIsLoading(true);

        let correctLines = [];

        for (let i = 0; i < answer.toString(2).length; i++) {
            let digit = answer.toString(2)[i];

            if (digit === '1') {
                correctLines.push(answer.toString(2).length - 1 - i);
            }
        }

        let guess = new Map();
        let guessVertices = [];

        vertices.map(v => {
            let lines = getLinesForVertex(v.get('i'));

            let correctLinesForVertex = [];
            let drawnLinesForVertex = [];

            for (let i = 0; i < lines.length; i++) {
                for (let j = 0; j < correctLines.length; j++) {
                    if (lines[i] === correctLines[j]) {
                        correctLinesForVertex.push(lines[i]);
                    }
                }

                for (let j = 0; j < linesToDraw.length; j++) {
                    if (lines[i] === linesToDraw[j].get('lineNumber')) {
                        drawnLinesForVertex.push(lines[i])
                    }
                }
            }

            if (correctLinesForVertex.length === drawnLinesForVertex.length) {
                let areEqual = true;

                for (let i = 0; i < correctLinesForVertex.length; i++) {
                    for (let j = 0; j < drawnLinesForVertex.length; j++) {
                        if (correctLinesForVertex[i] !== drawnLinesForVertex[j]) {
                            areEqual = false;
                        }
                    }
                }

                if (areEqual) {
                    v.set('color', '#00FF00');
                } else {
                    v.set('color', '#FFFF00');
                }
            } else if (correctLinesForVertex.length !== 0) {
                v.set('color', '#222222');
            }

            let map = new Map();
            map.set('guessedLines', drawnLinesForVertex.length);
            map.set('color', v.get('color'));
            map.set('lines', Array.from(linesToDraw));
            guessVertices.push(map);
        });

        guess.set('vertices', guessVertices);
        guessHistory.push(guess);
        setIsLoading(false);
    };

    const lineAlreadyExists = (v1, v2) => {
        let out = false;
        let newLine = getLineForVertices(v1, v2);

        linesToDraw.map(line => {
            if (line.get('lineNumber') === newLine.get('lineNumber')) {
                out = true;
            }
        });

        return out;
    }

    const onVertexSelected = (v) => {
        if (currentVertex === null) {
            setCurrentVertex(v);
        } else if (currentVertex.get('i') !== v.get('i') && !lineAlreadyExists(currentVertex, v)) {
            let line = getLineForVertices(currentVertex, v);
            linesToDraw.push(line);
            setCurrentVertex(null);
            setState(state + Math.pow(2, line.get('lineNumber')));
        } else if (currentVertex.get('i') !== v.get('i') && lineAlreadyExists(currentVertex, v)) {
            let line = getLineForVertices(currentVertex, v);

            for (let i = 0; i < linesToDraw.length; i++){
                if (linesToDraw[i].get('lineNumber') === line.get('lineNumber')) {
                    linesToDraw.splice(i, 1);
                }
            }

            setCurrentVertex(null);
            setState(state - Math.pow(2, line.get('lineNumber')));
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

        vertices.map(v => {
            let x = v.get('x');
            let y = v.get('y');

            if (Math.pow(ex - x, 2) + Math.pow(ey - y, 2) < Math.pow(vertexRadius * 2, 2)) {
                onVertexSelected(v);
            }
        });

        if (currentVertex) {
            setCurrentVertex(null);
        }
    };

    const isTouchDevice = () => {
        return ( 'ontouchstart' in window ) ||
            ( navigator.maxTouchPoints > 0 ) ||
            ( navigator.msMaxTouchPoints > 0 );
    }

    const clear = () => {
        setLinesToDraw([]);
        vertices.map(v => v.set('color', '#222222'));
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
                    disabled={isLoading || linesToDraw.length === 0}
                    onClick={onCheckAnswerClick}
                >{isLoading ? "Loading..." : "Submit"}</Button>
                <Button
                    style={{ width: 100, borderWidth: 2 }}
                    variant="outline-dark"
                    disabled={linesToDraw.length === 0}
                    onClick={() => clear()}
                    >Clear</Button>
                <Button
                    style={{ borderWidth: 2 }}
                    onClick={() => onGuessNavigation(1)}
                    disabled={guessHistory.length === 0 || guessHistory.indexOf(currentGuess) === guessHistory.length - 1 || !currentGuess}
                    variant="outline-dark">{">"}</Button>
            </div>
            <hr size={5} className="gamePane-divider"/>
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
                        onCanvasClick(e);
                    }
                }}
                onTouchStart={(e) => {
                    if (isTouchDevice()) {
                        setIsMouseDown(true);
                        onCanvasClick(e);
                    }
                }}
                onTouchMove={(e) => {
                    if (isTouchDevice()) {
                        setMouseX(e.changedTouches.item(0).clientX);
                        setMouseY(e.changedTouches.item(0).clientY);
                    }
                }}>
                Your browser does not support HTML canvas.
            </canvas>
        </div>
    );
}