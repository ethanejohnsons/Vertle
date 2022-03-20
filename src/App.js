import React, { useEffect, useState } from 'react';

import { GamePane } from './components/gamepane/GamePane';
import { Navbar } from './components/navbar/Navbar';
import './App.css';

export default function App() {
    const [ refresh, setRefresh ] = useState(false);
    const [ answer, setAnswer ] = useState(0b0);
    const [ width, setWidth ] = useState(window.innerWidth < 500 ? window.innerWidth - (window.innerWidth * 0.1) : 500);
    const [ height, setHeight ] = useState(500);
    const [ totalVertices, setTotalVertices ] = useState(0);

    useEffect(() => {
        // TODO GET vertices from backend (i.e. retrieve answer of the day)
        let answer = 0b111000000000000;

        setAnswer(answer);
        setTotalVertices(Math.floor((1 + Math.sqrt(1 + 8 * (answer.toString(2).length + 1))) / 2));
    }, [refresh]);

    return (
        <div className="vertle-all">
            <div className="vertle-game">
                <Navbar/>
                <hr size={5} className="vertle-divider"/>
                <GamePane width={width} height={height} answer={answer} totalVertices={totalVertices} />
            </div>
        </div>
    );
}