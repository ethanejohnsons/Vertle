import './Modals.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';

export function Help(props) {
    const { setClosed, isOpen } = props;

    return (
        <Modal show={isOpen} onHide={setClosed}>
            <Modal.Body>
                <div className="m-all">
                    <header className="m-head">How to play</header>
                    <div className="m-body">
                        <p>Connect the dots in the correct configuration in 6 guesses or less!</p>
                        <hr/>
                        <p>
                            Each time you submit a guess, the vertices will change color based on how close you were to the right number of connections.
                            <br/>
                            <br/>
                            🟢 means that all of the lines connected are correct.
                            <br/>
                            <br/>
                            🟡 means that the <i>number</i> is correct, but not the specific lines chosen.
                        </p>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}