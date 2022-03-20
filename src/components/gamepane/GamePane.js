import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';

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

        return map;
    }

    const render = () => {
        let ctx = canvas.current.getContext("2d");

        const drawVertices = (ctx) => {
            ctx.moveTo(0, 0);
            ctx.fillStyle = '#222222';

            vertices.map(v => {
                ctx.beginPath();
                ctx.arc(v.get('x'), v.get('y'), vertexRadius, 0, 2 * Math.PI);
                ctx.fill();
            });
        };

        const drawLines = (ctx) => {
            ctx.strokeStyle = '#222222';
            ctx.lineWidth = 2;

            linesToDraw.map(l => {
                ctx.moveTo(l.get('x1'), l.get('y1'));
                ctx.lineTo(l.get('x2'), l.get('y2'));
                ctx.stroke();
            });
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

        if (isMouseDown && currentVertex) {
            drawMouseDownLine(ctx);
        }
    }

    const onCheckAnswerClick = () => {
        setIsLoading(true);

        if (state === answer) {
            alert("YAS QUEEN");
        } else {
            alert("NOPE");
        }

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

    return (
        <div className="gamePane">
            <Button
                style={{ float: "right" }}
                variant="outline-dark"
                disabled={isLoading}
                onClick={onCheckAnswerClick}
            >{isLoading ? "Loading..." : "Submit"}
            </Button>
            <p>{state.toString(2)}</p>
            <p>{answer.toString(2)}</p>
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