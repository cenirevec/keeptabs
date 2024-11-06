import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Example() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Launch demo modal
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export class ConfirmationModal extends React.Component {
    constructor(props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    setShow(boolean) {
        this.setState({
            show: boolean
        })
    }

    handleShow() {
        this.setShow(true);
        if(this.props.onShow) this.props.onShow();
    }

    handleClose() {
        this.setShow(false)
        if(this.props.onClose) this.props.onClose();
    }

    onAction(event, name) {
        this.handleClose(event)
        if (this.props.onAction) {
            this.props.onAction(name);
        }

    }


    render() {
        return <Modal show={this.props.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ask for confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>{this.props.children}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={(event) => { this.onAction(event, 'cancel') }}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={(event) => { this.onAction(event, 'confirm') }}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    }
}

export default ConfirmationModal;