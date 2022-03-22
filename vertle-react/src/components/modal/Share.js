import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { BsFillShareFill } from "react-icons/bs";

import { createShareable} from "../../util/ShareBuilder";
import './Modals.css';

export function Share(props) {
    const { setClosed, isOpen, guessHistory, gameNumber } = props;

    const onCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copying to clipboard was successful!');
        }, err => {
            console.error('Could not copy text: ', err);
        });
    };

    const getMessage = () => {
        let text = createShareable(gameNumber, guessHistory);

        return (
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
                            <Button variant="outline-dark" onClick={() => onCopy(text)}>
                                {"Copy to Clipboard "}
                                <BsFillShareFill/>
                            </Button>
                        </div>
                    }
                </div>
            </div>
        );
    }

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