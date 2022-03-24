import { GamePane } from './components/gamepane/GamePane';
import { Navbar } from './components/navbar/Navbar';
import './App.css';

import React, { useState } from "react";
import { useCookies} from 'react-cookie';
import {version} from "./config.json";

export default function App() {
    const heightOffest = window.innerHeight - 300;
    const height = heightOffest < 500 ? heightOffest - (heightOffest * 0.1) : 500;
    const width = window.innerWidth < 500 ? window.innerWidth - (window.innerWidth * 0.1) : 500;

    const { version } = require('./config.json');

    const [ guessHistory, setGuessHistory ] = useState([]);
    const [ gameNumber, setGameNumber ] = useState(0);

    const [ cookie, setCookie, removeCookie] = useCookies(['gameState']);

    return (
        <div className="vertle-all">
            <div className="vertle-game">
                <Navbar guessHistory={guessHistory} gameNumber={gameNumber}/>
                <hr size={5} className="vertle-divider"/>
                <GamePane width={width} height={height} outputGuessHistory={setGuessHistory} setGameNumber={setGameNumber} cookie={cookie} setCookie={setCookie} removeCookie={removeCookie}/>
            </div>
            <div className="vertle-footer">
                <p>{`v${version}`}</p>
            </div>
        </div>
    );
}