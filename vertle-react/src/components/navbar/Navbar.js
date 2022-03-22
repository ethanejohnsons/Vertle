import './Navbar.css';
import {Share} from '../modal/Share.js';
import {Help} from '../modal/Help.js';

import React, { useState } from "react";
import { BsShare, BsQuestionCircle } from "react-icons/bs";

export function Navbar(props) {
    const { guessHistory, gameNumber     } = props;

    const [ isShareModalOpen, setIsShareModalOpen ] = useState(false);
    const [ isHelpModalOpen, setIsHelpModalOpen ] = useState(false);

    return (
        <div className="navbar-all">
            <div>
                <BsShare className="navbar-icon" onClick={() => setIsShareModalOpen(true)} />
                <BsQuestionCircle className="navbar-icon" onClick={() => setIsHelpModalOpen(true)} />
            </div>
            <div className="navbar-title">
                <header>Vertle</header>
            </div>
            <Share setClosed={() => setIsShareModalOpen(false)} isOpen={isShareModalOpen} guessHistory={guessHistory} gameNumber={gameNumber}/>
            <Help setClosed={() => setIsHelpModalOpen(false)} isOpen={isHelpModalOpen} />
        </div>
    );
}