import './Navbar.css';
import {Share} from '../modal/Share.js';
import {Help} from '../modal/Help.js';
import {Settings} from '../modal/Settings.js';

import React, { useState } from "react";
import { BsGear, BsShare, BsQuestionCircle } from "react-icons/bs";

export function Navbar(props) {
    const { isGameSolved } = props;

    const [ isSettingsModalOpen, setIsSettingsModalOpen ] = useState(false);
    const [ isShareModalOpen, setIsShareModalOpen ] = useState(false);
    const [ isHelpModalOpen, setIsHelpModalOpen ] = useState(false);

    return (
        <div className="navbar-all">
            <div>
                <BsGear className="navbar-icon" onClick={() => setIsSettingsModalOpen(true)} />
                <BsShare className="navbar-icon" onClick={() => setIsShareModalOpen(true)} />
                <BsQuestionCircle className="navbar-icon" onClick={() => setIsHelpModalOpen(true)} />
            </div>
            <div className="navbar-title">
                <header>Vertle</header>
            </div>
            <Share setClosed={() => setIsShareModalOpen(false)} isOpen={isShareModalOpen} isGameSolved={isGameSolved} />
            <Help setClosed={() => setIsHelpModalOpen(false)} isOpen={isHelpModalOpen} />
            <Settings setClosed={() => setIsSettingsModalOpen(false)} isOpen={isSettingsModalOpen} />
        </div>
    );
}