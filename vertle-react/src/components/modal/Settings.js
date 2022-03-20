import './Modals.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

export function Settings(props) {
    const { setClosed, isOpen } = props;

    return (
        <Modal show={isOpen} onHide={setClosed}>
            <Modal.Body>
                <div className="m-all">
                    <header className="m-head">Settings</header>
                    <div className="m-body">
                        <p>Nothin'</p>
                    </div>
                    {/*<div className="m-footer">*/}
                    {/*    <Button variant="secondary" onClick={setClosed}>Close</Button>*/}
                    {/*</div>*/}
                </div>
            </Modal.Body>
        </Modal>
    )
}