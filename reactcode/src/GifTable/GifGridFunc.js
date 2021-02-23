import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Form, Button, Badge, Container, Image, Modal, Spinner, Overlay } from 'react-bootstrap';
import { ReactSortable } from "react-sortablejs";

import Aux from "../hoc/_Aux";
import axios from 'axios'
import { map, size, isEqual, isEmpty, findIndex, forEach, filter, cloneDeep, pick } from '../common-libraries'
import EditComp from './GifEditComponent';
import CentredModal from './CentreModal';

function GifGridFunc() {
    const [imageModalShow, setImageModalShow] = useState({});
    const [editModalShow, setEditModalShow] = useState({});
    const [gifList, setGifList] = useState([]);
    const [gifUrl, setGifUrl] = useState('');
    const [gifType, setGifType] = useState('');
    const [gifTitle, setGifTitle] = useState('');
    const [errorFree, setErrorFree] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [minutes, setMinutes] = useState(0);
    const [hour, setHour] = useState(0);

    const [editTitle, setEditTitle] = useState('');
    const [editType, setEditType] = useState('');
    const [editUrl, setEditUrl] = useState('');
    const [editId, setEditId] = useState(0);


    const generateModalValueId = (gifList) => {
        var modalShowColl = {}
        map(gifList, (gif) => {
            modalShowColl = { ...modalShowColl, [gif['id']]: false }
        });
        setImageModalShow(modalShowColl)
        setEditModalShow(modalShowColl);

    }

    const getGifData = () => {
        const localStorageGifList = JSON.parse(localStorage.getItem("gifList") || "[]");

        if (isEmpty(localStorageGifList)) {
            const curTime = new Date()
            localStorage.setItem('lastSavedTime', curTime.toString());
            console.log("empty local storage... or dirty")
            const url = `${process.env.REACT_APP_API_ROOT}/api/giflist`;
            axios.get(url)
                .then(response => {
                    const { data } = response.data;
                    localStorage.setItem('gifList', JSON.stringify(data));
                    setGifList(data);
                    generateModalValueId(data);
                });
        } else {
            console.log('Not an empty local storage...')
            setGifList(localStorageGifList);
            generateModalValueId(localStorageGifList);
        }
    }

    const checkChanges = () => {
        console.log("Running check every 5 sec")
        const localStorageGifList = JSON.parse(localStorage.getItem("gifList") || "[]");
        const stateGif = gifList;
        console.log("Checking isEqual", isEqual(stateGif, localStorageGifList))
        if (isEqual(stateGif, localStorageGifList)) {
            console.log("Same!");
        } else {
            var toUpdateGifPosition = [];

            forEach(gifList, (stateGif) => {
                toUpdateGifPosition.push({ id: stateGif['id'], position: findIndex(gifList, stateGif) })
            });
            //update backend
            const url = `${process.env.REACT_APP_API_ROOT}/api/update-positions`;
            const headers = {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
            console.log("to update", toUpdateGifPosition)

            axios.post(url, { updateList: toUpdateGifPosition },
                {
                    headers: headers
                }
            )
                .then(response => {
                    const { success } = response.data;
                    if (isEqual(success, "true")) {
                        console.log("setting localstorage empty!")
                        localStorage.setItem('gifList', []);
                        localStorage.setItem('lastSavedTime', JSON.stringify(new Date()));
                        getGifData();
                    }
                });
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

    useInterval(() => {
        const lastSavedTime = Date.parse(localStorage.getItem("lastSavedTime") || "new Date()");
        const currentTime = new Date();
        var timeDiff = currentTime - lastSavedTime;
        timeDiff /= 1000;
        timeDiff = Math.round(timeDiff);
        const min = Math.round(timeDiff / 60) % 60
        const hr = Math.round(timeDiff / 3600) % 24
        setMinutes(min);
        setHour(hr)

    }, 1000)

    useEffect(() => {
        getGifData();
    }, []);

    useEffect(() => {
        checkError();
    }, [gifType, gifUrl, gifTitle]);

    const handleModalShow = (boolVal, itemId) => {
        var newModalShow = { ...imageModalShow };
        newModalShow[itemId] = boolVal
        setImageModalShow(newModalShow);
    }

    const handleEditModalShow = (boolVal, itemId) => {

        var newEditModalShow = { ...editModalShow };
        newEditModalShow[itemId] = boolVal
        setEditModalShow(newEditModalShow);
    }

    const checkError = () => {
        if (gifUrl && gifType && gifTitle) {
            setErrorFree(true);
        }
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
            .then(() => {
                localStorage.setItem('gifList', []);
                getGifData();
            });
    }

    const updateGif = () => {

        console.log('Edit update')
        console.log(editTitle, editType, editUrl);
        handleEditModalShow(false, editId);
    }

    const addProps = {
        setGifTitle: setGifTitle,
        setGifUrl: setGifUrl,
        setGifType: setGifType,
        actionClickFunc: addGif,
        gifTitle: gifTitle,
        gifType: gifType,
        gifUrl: gifUrl,
        buttonActionName: 'Add'

    }


    return (
        <Aux>
            <Container>
                <Row>
                    <Col >
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Gif card</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <EditComp {...addProps} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title >Gif List</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Last saved {hour} Hr {minutes} min(s) ago!</Card.Subtitle>

                            </Card.Header>
                            <Card.Body>

                                <ReactSortable
                                    list={gifList}
                                    setList={(newState) => {
                                        const filteredGif = [];
                                        forEach(newState, (newGif) => {
                                            const newObj = pick(newGif, ['id', 'title', 'type_name', 'gif_url'])
                                            filteredGif.push(newObj);
                                        })
                                        setGifList(filteredGif);
                                    }}
                                    className="row"
                                >
                                    {gifList.map((item) => {
                                        const imgVisibility = isLoadingData ? {} : { visibility: 'hidden' }
                                        const modalChildProps = {
                                            src: item.gif_url,
                                            fluid: true,
                                            style: { width: '100%' }
                                        }
                                        const modalProps = {
                                            modalTitle: item.title
                                        }

                                        const modalChildEditProps = {
                                            setGifTitle: setEditTitle,
                                            setGifUrl: setEditUrl,
                                            setGifType: setEditType,
                                            actionClickFunc: updateGif,
                                            gifTitle: editTitle,
                                            gifType: editType,
                                            gifUrl: editUrl,
                                            buttonActionName: 'Update',
                                            gifId: item.id

                                        }
                                        return (
                                            <Col md={4}>
                                                <Card key={item.id} >
                                                    <Card.Header>
                                                        <Card.Title as="h5">{item.title}</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        {!isLoadingData && <Spinner animation="border" variant="primary" />}
                                                        <Image
                                                            src={item.gif_url}
                                                            fluid
                                                            style={{ height: '400px', width: '100%', ...imgVisibility }}
                                                            onClick={() => handleModalShow(true, item.id)}
                                                            onLoad={() => setIsLoadingData(true)}
                                                        />
                                                        <CentredModal
                                                            show={imageModalShow[item.id]}
                                                            onHide={() => handleModalShow(false, item.id)}
                                                            ModalChildComponent={Image}
                                                            modalChildProps={modalChildProps}
                                                            modalProps={modalProps}
                                                        />
                                                        <CentredModal
                                                            show={editModalShow[item.id]}
                                                            onHide={() => handleEditModalShow(false, item.id)}
                                                            ModalChildComponent={EditComp}
                                                            modalChildProps={modalChildEditProps}
                                                            modalProps={modalProps}
                                                        />
                                                    </Card.Body>
                                                    <Card.Footer >
                                                        <Button variant="primary" size="sm" onClick={() => {
                                                            setEditType(item.type_name)
                                                            setEditUrl(item.gif_url)
                                                            setEditTitle(item.title)
                                                            setEditId(item.id)
                                                            handleEditModalShow(true, item.id)
                                                        }}>Edit</Button>
                                                        <Button variant="outline-danger" size="sm" onClick={() => deleteGif(item.id)}>Delete</Button>
                                                    </Card.Footer>
                                                </Card>
                                            </Col>
                                        )
                                    }
                                    )}
                                </ReactSortable>
                            </Card.Body>
                        </Card>

                    </Col>

                </Row>
            </Container>
        </Aux >
    )

}

export default GifGridFunc;