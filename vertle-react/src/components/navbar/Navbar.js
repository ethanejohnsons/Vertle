import './Navbar.css';
import {ShareModal} from '../modal/ShareModal.js';
import {HelpModal} from '../modal/HelpModal.js';
import {SupportModal} from '../modal/SupportModal.js';

import React, { useState } from "react";
import { BsShare, BsQuestionCircle, BsCup } from "react-icons/bs";

export function Navbar(props) {
    const { guessHistory, gameNumber } = props;

    const [ isShareModalOpen, setIsShareModalOpen ] = useState(false);
    const [ isHelpModalOpen, setIsHelpModalOpen ] = useState(false);
    const [ isSupportModalOpen, setIsSupportModalOpen ] = useState(false);

    return (
        <div className="navbar-all">
            <div>
                <BsShare className="navbar-icon" onClick={() => setIsShareModalOpen(true)} />
                <BsQuestionCircle className="navbar-icon" onClick={() => setIsHelpModalOpen(true)} />
                <BsCup className="navbar-icon" onClick={() => setIsSupportModalOpen(true)} />
            </div>
            <div className="navbar-title">
                <header>Vertle</header>
            </div>
            <ShareModal setClosed={() => setIsShareModalOpen(false)} isOpen={isShareModalOpen} guessHistory={guessHistory} gameNumber={gameNumber}/>
            <HelpModal setClosed={() => setIsHelpModalOpen(false)} isOpen={isHelpModalOpen} />
            <SupportModal setClosed={() => setIsSupportModalOpen(false)} isOpen={isSupportModalOpen} />
        </div>
    );
}