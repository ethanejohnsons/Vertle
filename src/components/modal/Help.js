import './Modals.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

export function Help(props) {
    const { setClosed, isOpen } = props;

    return (
        <Modal show={isOpen} onHide={setClosed}>
            <Modal.Body>
                <div className="m-all">
                    <header className="m-head">How to play</header>
                    <div className="m-body">
                        <p>Connect the dots in the correct configuration in 6 guesses or less!</p>
                    </div>
                    {/*<div className="m-footer">*/}
                    {/*    <Button variant="secondary" onClick={setClosed}>Close</Button>*/}
                    {/*</div>*/}
                </div>
            </Modal.Body>
        </Modal>
    )
}