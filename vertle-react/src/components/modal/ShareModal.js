import React, { useEffect, useState } from "react";

import { Modal, Button, Toast, ToastContainer } from 'react-bootstrap';
import { BsFillShareFill } from "react-icons/bs";
import 'bootstrap/dist/css/bootstrap.min.css';

import { createShareable} from "../../util/ShareBuilder";
import './Modals.css';

export function ShareModal(props) {
    const { setClosed, isOpen, guessHistory, gameNumber } = props;
    const [ text, setText ] = useState("");
    const [ isToastVisible, setIsToastVisible ] = useState(false);

    useEffect(() => {
        setText(createShareable(gameNumber, guessHistory));
    }, [guessHistory, gameNumber]);

    const onShare = () => {
        if (navigator.share) {
            navigator.share({ text }).then(() => {
                setIsToastVisible(true);
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text).then(() => {
                setIsToastVisible(true);
            }).catch(console.error);
        }
    }

    return <Modal show={isOpen} onHide={setClosed}>
            <Modal.Body>
                <ToastContainer position='middle-center'>
                    <Toast className="m-toast" autohide delay={2000} show={isToastVisible} onClose={() => setIsToastVisible(false)}>
                        <Toast.Body>
                            <p>Copied!</p>
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
                <div className="m-all">
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
                                    <Button variant="outline-dark" onClick={onShare}>
                                        {"Copy to Clipboard "}
                                        <BsFillShareFill/>
                                    </Button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>;
}