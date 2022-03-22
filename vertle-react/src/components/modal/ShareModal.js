import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { BsFillShareFill } from "react-icons/bs";
import React, { useEffect, useState } from "react";

import { createShareable} from "../../util/ShareBuilder";
import './Modals.css';

export function ShareModal(props) {
    const { setClosed, isOpen, guessHistory, gameNumber } = props;
    const [ text, setText ] = useState("");

    useEffect(() => {
        setText(createShareable(gameNumber, guessHistory));
    }, [guessHistory, gameNumber]);

    const getMessage = () =>
            <div>
                <header className="m-head">Share this game with your friends!</header>
                <div className="m-body">
                    <p>https://vertle-game.com/</p>
                    { guessHistory.length === 0 &&
                        <p>After you complete today's puzzle, you'll be able to share your score with your friends.</p>
                    }
                    { guessHistory.length > 0 &&
                        <div className="m-shareable">
                            <p>{ text }</p>
                            <Button variant="outline-dark">
                                {"Copy to Clipboard "}
                                <BsFillShareFill/>
                            </Button>
                        </div>
                    }
                </div>
            </div>;

    return (
        <Modal show={isOpen} onHide={setClosed}>
            <Modal.Body>
                <div className="m-all">
                    { getMessage() }
                </div>
            </Modal.Body>
        </Modal>
    )
}