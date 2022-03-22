import { GamePane } from './components/gamepane/GamePane';
import { Navbar } from './components/navbar/Navbar';
import './App.css';

import React, { useState } from "react";
import {version} from "./config.json";

export default function App() {
    const width = window.innerWidth < 500 ? window.innerWidth - (window.innerWidth * 0.1) : 500;
    const height = 500;

    const { version } = require('./config.json');

    const [ guessHistory, setGuessHistory ] = useState([]);
    const [ gameNumber, setGameNumber ] = useState(0);

    return (
        <div className="vertle-all">
            <div className="vertle-game">
                <Navbar guessHistory={guessHistory} gameNumber={gameNumber}/>
                <hr size={5} className="vertle-divider"/>
                <GamePane width={width} height={height} outputGuessHistory={setGuessHistory} setGameNumber={setGameNumber}/>
            </div>
            <p className="vertle-footer">Create by Ethan Johnson v{version}</p>
        </div>
    );
}