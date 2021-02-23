import React from 'react';
import { Modal } from 'react-bootstrap';
function CentredModal(props) {
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
                {/* <Image
                    src={imageSrc}
                    fluid
                    style={{ width: '100%' }}
                /> */}
                <ModalChildComponent {...modalChildProps} />
            </Modal.Body>
        </Modal>
    );
}

export default CentredModal;