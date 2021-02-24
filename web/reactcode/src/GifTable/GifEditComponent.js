import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

{/* 
            Reusable input form component that is used to add a gif and
            also to edit the gif.

            It takes the correspoding input box's value and it's setter function from parent component
*/}

function EditComp(props) {
    const { setGifType, setGifUrl, setGifTitle, gifUrl, gifType, gifTitle, actionClickFunc, buttonActionName } = props;
    return (
        <Form>
            <Row>
                <Col md={4}>
                    <Form.Group controlId="formBasicInput">
                        <Form.Label>Gif URL</Form.Label>
                        <Form.Control type="gifUrl" placeholder="Enter Gif URL" value={gifUrl} onChange={e => setGifUrl(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group controlId="formBasicInput">
                        <Form.Label>Type</Form.Label>
                        <Form.Control type="gifType" placeholder="Enter type name" value={gifType} onChange={e => setGifType(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group controlId="formBasicInput">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="gifTitle" placeholder="Enter title" value={gifTitle} onChange={e => setGifTitle(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>
            <Button variant="primary" onClick={() => actionClickFunc()}>
                {buttonActionName}
            </Button>
        </Form>
    )
}

EditComp.propTypes = {
    setGifType: PropTypes.func,
    setGifUrl: PropTypes.func,
    setGifTitle: PropTypes.func,
    gifUrl: PropTypes.string,
    gifType: PropTypes.string,
    gifTitle: PropTypes.string,
    actionClickFunc: PropTypes.func,
    buttonActionName: PropTypes.string
}

export default EditComp;