import { GamePane } from './components/gamepane/GamePane';
import { Navbar } from './components/navbar/Navbar';
import './App.css';

import React, { useState } from "react";

export default function App() {
    const width = window.innerWidth < 500 ? window.innerWidth - (window.innerWidth * 0.1) : 500;
    const height = 500;

    const baseColor = '#222222';
    const correctColor = '#8DBA69';
    const closeColor = '#DCC55B';
    const lastColor = '#AAAAAA';

    const [ guessHistory, setGuessHistory ] = useState([]);
    const [ gameNumber, setGameNumber ] = useState(0);

    return (
        <div className="vertle-all">
            <div className="vertle-game">
                <Navbar guessHistory={guessHistory} gameNumber={gameNumber}/>
                <hr size={5} className="vertle-divider"/>
                <GamePane
                    width={width}
                    height={height}
                    outputGuessHistory={setGuessHistory}
                    setGameNumber={setGameNumber}
                    baseColor={baseColor}
                    correctColor={correctColor}
                    closeColor={closeColor}
                    lastColor={lastColor}/>
            </div>
        </div>
    );
}