import './Vertle.css';
import React, { useState, useEffect } from 'react';

// Bootstrap thingz
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Spinner} from 'react-bootstrap';

export default function Vertle() {
    const [ refresh, setRefresh ] = useState(true);
    const [ lines, setLines ] = useState([]);
    const [ vertices, setVertices ] = useState([]);

    const [ currentVertex, setCurrentVertex ] = useState(null);

    useEffect(() => {
        // TODO GET vertices from backend (i.e. retrieve answer of the day)
    }, [refresh]);

    const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;
        return { width, height };
    };

    const drawLines = () => {
        return lines.map(line => {
            return <line x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]} stroke="red"/>
        });
    }

    const onVertexClick = (event) => {
        if (!currentVertex) {
            setCurrentVertex(event.target);
        } else if (currentVertex !== event.target) {
            let firstbound = currentVertex.getBoundingClientRect();
            let secondbound = event.target.getBoundingClientRect();

            lines.push([
                firstbound.x + firstbound.width * 0.5,
                firstbound.y + firstbound.height * 0.5,
                secondbound.x + secondbound.width * 0.5,
                secondbound.y + secondbound.height * 0.5
            ]);

            setCurrentVertex(null);
        }
    };

    return (
        <div>
            <header className="Vertle-header">Vertle</header>
            <div className="Vertle">
                <Button className="Vertle-vertex" variant="primary" onClick={onVertexClick}>Pretend I'm a Vertex</Button>
                {'                                           '}
                <Button className="Vertle-vertex" variant="secondary" onClick={onVertexClick}>Pretend I'm a Second Vertex</Button>
                <svg width={getWindowDimensions().width} height={getWindowDimensions().height}>
                    <line x1="100" y1="100" x2="200" y2="200" stroke="red"/>
                    {drawLines()}
                </svg>
            </div>
        </div>
    );
}