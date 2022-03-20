import './Modals.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

export function Share(props) {
    const { setClosed, isOpen, isGameSolved } = props;

    const getMessage = () => {
        if (isGameSolved) {
            return "uhhhh";
        }

        return (
            <div>
                <header className="m-head">Share this game with your friends!</header>
                <div className="m-body">
                    <p>https://vertle-game.com/</p>
                    <p>After you complete today's puzzle, you'll be able to share your score with your friends.</p>
                </div>
            </div>
        );
    }

    return (
        <Modal show={isOpen} onHide={setClosed}>
            <Modal.Body>
                <div className="m-all">
                    { getMessage() }
                    {/*<div className="m-footer">*/}
                    {/*    <Button variant="secondary" onClick={setClosed}>Close</Button>*/}
                    {/*</div>*/}
                </div>
            </Modal.Body>
        </Modal>
    )
}