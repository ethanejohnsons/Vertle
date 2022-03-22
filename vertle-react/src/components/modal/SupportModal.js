import './Modals.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Image } from 'react-bootstrap';
import {BsGithub, BsTwitter, BsEnvelope} from "react-icons/bs";
import React from "react";
import {social} from "../../config.json";

export function SupportModal(props) {
    const { setClosed, isOpen } = props;
    const { social } = require("../../config.json");

    return (
        <Modal show={isOpen} onHide={setClosed}>
            <Modal.Body>
                <div className="m-all">
                    <header className="m-head">Buy Me a Coffee</header>
                    <hr/>
                    <Image
                        className="m-profile"
                        src="https://cdn.buymeacoffee.com/uploads/profile_pictures/2022/03/AmjkV0abFNqzoiro.jpg@300w_0e.webp"
                        roundedCircle thumbnail/>
                    <div className="m-body">
                        <p>Help support me and my projects.</p>
                        <Button variant="outline-dark" onClick={() => window.open(social.buymeacoffee)}>
                            Buy me a Coffee
                        </Button>
                        <div>
                            <BsGithub className="m-icon" onClick={() => window.open(social.github)} />
                            <BsTwitter className="m-icon" onClick={() => window.open(social.twitter)} />
                            <BsEnvelope className="m-icon" onClick={() => window.open(`mailto:${social.email}`)} />
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}