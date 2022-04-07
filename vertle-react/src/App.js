import { GameView } from './components/game/GameView';
import { Navbar } from './components/navbar/Navbar';
import './App.css';

import React, { useState } from "react";
const { version } = require('./config.json');

export default function App() {
    const height = (window.innerHeight - 300) < 500 ? (window.innerHeight - 300) - ((window.innerHeight - 300) * 0.1) : 500;
    const width = window.innerWidth < 500 ? window.innerWidth - (window.innerWidth * 0.1) : 500;

    const [ shareState, setShareState ] = useState(null);

    return (
        <div className="vertle-all">
            <div className="vertle-game">
                <Navbar shareState={shareState}/>
                <hr size={5} className="vertle-divider"/>
                <GameView width={width} height={height} setShareState={setShareState} guesses={6}/>
            </div>
            <div className="vertle-footer">
                <p>{`v${version}`}</p>
            </div>
        </div>
    );
}