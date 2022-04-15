import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import './Modals.css';

export function SettingsModal(props) {
    const { setClosed, isOpen, difficulty, setDifficulty } = props;

    const handleClick = (value) => {
        setDifficulty(value);
        setClosed(true);
    }

    return (
        <Modal show={isOpen} onHide={setClosed}>
            <Modal.Body>
                <div className="m-all">
                    <header className="m-head">Difficulty</header>
                    <div className="m-body" style={{ padding: 5, justifyContent: "center" }}>
                        <p style={{color: "#aaaaaa"}}>Choose from 5, 6, or 7 vertex shapes.</p>
                        <hr/>
                        <ToggleButtonGroup
                            type="radio"
                            value={difficulty}
                            name="difficulty"
                            onChange={value => setDifficulty(value)}
                            vertical
                            style={{ width: "90%" }}
                        >
                            <ToggleButton onClick={() => handleClick(0)} variant="outline-dark" value={0}>Simple</ToggleButton>
                            <ToggleButton onClick={() => handleClick(1)} variant="outline-dark" value={1}>Moderate</ToggleButton>
                            <ToggleButton onClick={() => handleClick(2)} variant="outline-dark" value={2}>Complex</ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}