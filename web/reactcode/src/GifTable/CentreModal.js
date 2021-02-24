import React from 'react';
import { Modal } from 'react-bootstrap';

function CentredModal(props) {
    {/* 
            Reusable overlay modal component that takes another component
            as props and displays it as overlay in the middle of the webpage
    */}
    const { modalProps, ModalChildComponent, modalChildProps } = props;
    const { modalTitle } = modalProps;

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {modalTitle}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ModalChildComponent {...modalChildProps} />
            </Modal.Body>
        </Modal>
    );
}

export default CentredModal;