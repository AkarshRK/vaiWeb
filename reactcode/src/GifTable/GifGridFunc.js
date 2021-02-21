import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Form, Button, CardColumns, CardDeck, Image, Modal, Spinner } from 'react-bootstrap';
import { ReactSortable } from "react-sortablejs";

import Aux from "../hoc/_Aux";
import axios from 'axios'
import { map, size, isEqual, isEmpty } from '../common-libraries'
function CentredModal(props) {


    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.cardName}
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
    const [modalShow, setModalShow] = useState({});
    const [gifList, setGifList] = useState([]);
    const [gifUrl, setGifUrl] = useState('');
    const [gifType, setGifType] = useState('');
    const [gifTitle, setGifTitle] = useState('');
    const [errorFree, setErrorFree] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const generateModalValueId = (gifList) => {
        var modalShowColl = {}
        map(gifList, (gif) => {
            modalShowColl = { ...modalShowColl, [gif['id']]: false }
        });
        setModalShow(modalShowColl)

    }

    const getGifData = () => {
        const localStorageGifList = JSON.parse(localStorage.getItem("gifList") || "[]");

        if (isEmpty(localStorageGifList)) {
            setIsLoadingData(true);
            console.log("empty local storage...")
            const url = `${process.env.REACT_APP_API_ROOT}/api/giflist`;
            axios.get(url)
                .then(response => {
                    const { data } = response.data;
                    localStorage.setItem('gifList', JSON.stringify(data));
                    setGifList(data);
                    generateModalValueId(data);
                })
                .then(() => {
                    setIsLoadingData(false);
                });
        } else {
            console.log('Not an empty local storage...')
            setGifList(localStorageGifList);
            generateModalValueId(localStorageGifList);
        }
    }

    const checkChanges = () => {
        console.log("every 5 sec", gifList)
        const localStorageGifList = JSON.parse(localStorage.getItem("gifList") || "[]");
        console.log("Gif list", gifList);
        console.log("Local storage Gif list", localStorageGifList);
        if (isEqual(gifList, localStorageGifList)) {
            console.log("same");
        } else {
            //update backend
            console.log("update backend")
        }

    }

    const useInterval = (callback, delay) => {
        const savedCallback = useRef();

        // Remember the latest callback.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }

    useInterval(() => {
        checkChanges();
    }, 5000)

    useEffect(() => {
        getGifData();
    }, []);

    useEffect(() => {
        checkError();
    }, [gifType, gifUrl, gifTitle]);

    const handleModalShow = (boolVal, itemId) => {
        var newModalShow = { ...modalShow };
        newModalShow[itemId] = boolVal
        setModalShow(newModalShow);
    }

    const checkError = () => {
        if (gifUrl && gifType && gifTitle) {
            setErrorFree(true);
        }
        console.log(errorFree)
    }

    const addGif = () => {
        const url = `${process.env.REACT_APP_API_ROOT}/api/add`;

        console.log(errorFree)
        if (errorFree) {
            const gifData = {
                'position': size(gifList),
                'title': gifTitle,
                'type_name': gifType,
                'gif_url': gifUrl
            }
            const headers = {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
            axios.post(url, gifData,
                {
                    headers: headers
                }
            )
                .then(response => {
                    getGifData();
                });
        }
    }

    const deleteGif = (gifId) => {
        const url = `${process.env.REACT_APP_API_ROOT}/api/delete/${gifId}`;
        const body = { id: gifId }
        axios.post(url, {})
            .then(response => {
                getGifData();
            });
    }

    const updateGif = (gifId) => {
        console.log(localStorage)
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
                                <Button variant="primary" onClick={() => addGif()}>
                                    Add Gif
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ReactSortable
                        list={gifList}
                        setList={(newState) => { setGifList(newState) }}
                        className="row"
                    >
                        {gifList.map((item) => {
                            const imgVisibility = isLoadingData ? {} : { visibility: 'hidden' }
                            return (
                                <Col md={4}>
                                    <Card key={item.id} >
                                        <Card.Header>
                                            <Card.Title as="h5">{item.title}</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            {!isLoadingData && <Spinner animation="border" variant="primary" />}
                                            <Image src={item.gif_url}
                                                fluid
                                                style={{ height: '400px', width: '100%', ...imgVisibility }}
                                                onClick={() => handleModalShow(true, item.id)}
                                                onLoad={() => setIsLoadingData(true)}
                                            />
                                            <CentredModal
                                                show={modalShow[item.id]}
                                                onHide={() => handleModalShow(false, item.id)}
                                                imageSrc={item.gif_url}
                                                cardName={item.title}
                                            />
                                        </Card.Body>
                                        <Card.Footer >
                                            <Button variant="primary" size="sm" onClick={() => updateGif(item.id)}>Update</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => deleteGif(item.id)}>Delete</Button>
                                        </Card.Footer>
                                    </Card>
                                </Col>
                            )
                        }
                        )}

                    </ReactSortable>

                </Col>
            </Row>
        </Aux >
    )

}

export default GifGridFunc;