import { GamePane } from './components/game/GameView';
import { Navbar } from './components/navbar/Navbar';
import './App.css';

import React, { useState } from "react";
const { version } = require('./config.json');

export default function App() {
    const height = (window.innerHeight - 300) < 500 ? (window.innerHeight - 300) - ((window.innerHeight - 300) * 0.1) : 500;
    const width = window.innerWidth < 500 ? window.innerWidth - (window.innerWidth * 0.1) : 500;

    const [ guessHistory, setGuessHistory ] = useState([]);
    const [ gameNumber, setGameNumber ] = useState(0);

    return (
        <div className="vertle-all">
            <div className="vertle-game">
                <Navbar guessHistory={guessHistory} gameNumber={gameNumber}/>
                <hr size={5} className="vertle-divider"/>
                <GamePane width={width} height={height} guessHistory={guessHistory} setGuessHistory={setGuessHistory} setGameNumber={setGameNumber}/>
            </div>
            <div className="vertle-footer">
                <p>{`v${version}`}</p>
            </div>
        </div>
    );
}