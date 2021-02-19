import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, CardColumns, Image, Modal } from 'react-bootstrap';
import { ReactSortable } from "react-sortablejs";

import Aux from "../hoc/_Aux";
import axios from 'axios'

function MyVerticallyCenteredModal(props) {

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Bank Draft
          </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Image src={props.imageSrc}
                    fluid
                    style={{ width: '100%' }}
                />
            </Modal.Body>
        </Modal>
    );
}

function GifGridFunc() {
    const [modalShow, setModalShow] = useState({
        "1": false,
        "2": false,
        "3": false
    });
    const [items, setItems] = useState([
        {
            id: "1",
            name: "https://media.giphy.com/media/MCfhrrNN1goH6/giphy-downsized.gif",
            type_name: "Cat 1"
        },
        {
            id: "2",
            name: "https://media.giphy.com/media/1iu8uG2cjYFZS6wTxv/giphy-downsized.gif",
            type_name: "Cat 2"
        },
        {
            id: "3",
            name: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy-downsized.gif",
            type_name: "Cat 3"
        },
        {
            id: "4",
            name: "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy-downsized.gif",
            type_name: "Cat 4"
        },
        {
            id: "5",
            name: "https://media.giphy.com/media/SVYrs1hU0SiAf1nw1n/giphy-downsized.gif",
            type_name: "Cat 5"
        }

    ]);
    const [gifUrl, setGifUrl] = useState('');

    const handleModalShow = (boolVal, itemId) => {
        var newModalShow = { ...modalShow };
        newModalShow[itemId] = boolVal
        setModalShow(newModalShow);
    }

    return (
        <Aux>
            <Row>
                <Col >
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Gif card</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group controlId="formBasicInput">
                                            <Form.Label>Gif URL</Form.Label>
                                            <Form.Control type="gifurl" placeholder="Enter Gif URL" value={gifUrl} onChange={e => setGifUrl(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formBasicInput">
                                            <Form.Label>Type</Form.Label>
                                            <Form.Control type="gifurl" placeholder="Enter type name" value={gifUrl} onChange={e => setGifUrl(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group controlId="formBasicInput">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control type="gifurl" placeholder="Enter title" value={gifUrl} onChange={e => setGifUrl(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button variant="primary">
                                    Add Gif
                                    </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <CardColumns>
                    <ReactSortable
                        list={items}
                        setList={(newState) => setItems(newState)}
                    >
                        {items.map((item) =>
                            (
                                <Card key={item.id} >
                                    <Card.Header>
                                        <Card.Title as="h5">{item.type_name}</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Image src={item.name}
                                            fluid
                                            style={{ height: '400px', width: '100%' }}
                                            onClick={() => handleModalShow(true, item.id)} />
                                        <MyVerticallyCenteredModal
                                            show={modalShow[item.id]}
                                            onHide={() => handleModalShow(false, item.id)}
                                            imageSrc={item.name}
                                        />
                                    </Card.Body>
                                </Card>
                            )
                        )}
                    </ReactSortable>
                </CardColumns>

            </Row>
        </Aux >
    )

}

export default GifGridFunc;