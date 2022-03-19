import React, { useState, useEffect, useRef } from 'react';

export function GamePane(props) {
    const { width, height, answer, totalVertices } = props;
    const [ state, setState ] = useState(0b0);

    const [ vertices, setVertices ] = useState([]);
    const [ linesToDraw, setLinesToDraw ] = useState([]);
    const [ currentVertex, setCurrentVertex ] = useState(null);

    const canvas = useRef(null);

    useEffect(() => {
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
    });

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

    useEffect(() => {
    }, []);

    useEffect(() => {
        canvas.current.getContext("2d").imageSmoothingEnabled = false;
        const drawVertices = () => {
            let ctx = canvas.current.getContext("2d");
            ctx.moveTo(0, 0);
            ctx.fillStyle = '#222222';

            vertices.map(v => {
                ctx.beginPath();
                ctx.arc(v.get('x'), v.get('y'), 15, 0, 2 * Math.PI);
                ctx.fill();
            });
        };

        const drawLines = () => {
            let ctx = canvas.current.getContext("2d");
            ctx.strokeStyle = '#222222';
            ctx.lineWidth = 2;

            linesToDraw.map(l => {
                ctx.moveTo(l.get('x1'), l.get('y1'));
                ctx.lineTo(l.get('x2'), l.get('y2'));
                ctx.stroke();
            });
        }

        drawLines();
        drawVertices();
    });

    const onVertexSelected = (v) => {
        if (currentVertex === null) {
            setCurrentVertex(v);
        } else if (currentVertex.get('i') !== v.get('i')) {
            let v1 = currentVertex;
            let v2 = v;
            linesToDraw.push(getLineForVertices(v1, v2));
            setCurrentVertex(null);
        } else {
            setCurrentVertex(null);
        }
    };

    const onCanvasClick = (event) => {
        let ex = event.clientX - canvas.current.offsetLeft;
        let ey = event.clientY - canvas.current.offsetTop;

        vertices.map(v => {
            let x = v.get('x');
            let y = v.get('y');

            if (Math.pow(ex - x, 2) + Math.pow(ey - y, 2) < Math.pow(15, 2)) {
                onVertexSelected(v);
            }
        })
    };

    return (
        <div className="gamePane">
            <canvas ref={canvas} width={width} height={height} onClick={onCanvasClick}>
                Your browser does not support HTML canvas.
            </canvas>
        </div>
    );
}