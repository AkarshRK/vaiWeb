import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Button, Container, Image, Spinner } from 'react-bootstrap';
import { ReactSortable } from "react-sortablejs";

import Aux from "../hoc/_Aux";
import axios from 'axios'
import { map, size, isEqual, isEmpty, findIndex, forEach, pick } from '../common-libraries'
import EditComp from './GifEditComponent';
import CentredModal from './CentreModal';


function GifGridFunc() {

    {/* 
            The main webpage which holds all the logic to 
            - add
            - edit
            - sort
            - delete
            - view
            a gif(s)
    */}

    //******************state values************************

    //modal state values which holds data in the form of {id: <gif_id>, boolValue:<to_show>} 
    const [imageModalShow, setImageModalShow] = useState({});
    const [editModalShow, setEditModalShow] = useState({});

    // values to hold add inputs
    const [gifList, setGifList] = useState([]);
    const [gifUrl, setGifUrl] = useState('');
    const [gifType, setGifType] = useState('');
    const [gifTitle, setGifTitle] = useState('');
    const [errorAddFree, setErrorAddFree] = useState(false);

    // spinner value and last updated state values
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [minutes, setMinutes] = useState(0);
    const [hour, setHour] = useState(0);

    //state values to hold edit input values
    const [editTitle, setEditTitle] = useState('');
    const [editType, setEditType] = useState('');
    const [editUrl, setEditUrl] = useState('');
    const [editId, setEditId] = useState(0);
    const [errorEditFree, setErrorEditFree] = useState(false);

    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    }

    // function used to generate modal control values
    const generateModalValueId = (gifList) => {
        var modalShowColl = {}
        map(gifList, (gif) => {
            modalShowColl = { ...modalShowColl, [gif['id']]: false }
        });
        setImageModalShow(modalShowColl)
        setEditModalShow(modalShowColl);

    }

    {/*  
        1.Calls the GET api only if either the browser storage is empty or a change action has
        taken (add, edit, update) 
        2. It is called if the card order is changed every 5 seconds
        
    */}
    const getGifData = () => {
        const localStorageGifList = JSON.parse(localStorage.getItem("gifList") || "[]");

        if (isEmpty(localStorageGifList)) {
            const curTime = new Date()
            localStorage.setItem('lastSavedTime', curTime.toString());
            const url = `${process.env.REACT_APP_API_ROOT}/api/giflist`;
            axios.get(url)
                .then(response => {
                    const { data } = response.data;
                    localStorage.setItem('gifList', JSON.stringify(data));
                    setGifList(data);
                    generateModalValueId(data);
                });
        } else {
            setGifList(localStorageGifList);
            generateModalValueId(localStorageGifList);
        }
    }


    // func to reset local storage values
    const setLocalStorageUpdateTime = () => {
        localStorage.setItem('gifList', []);
        localStorage.setItem('lastSavedTime', JSON.stringify(new Date()));
    }

    // func which is run every 5 sec to check if the order is same or changed
    const checkChanges = () => {
        const localStorageGifList = JSON.parse(localStorage.getItem("gifList") || "[]");
        const stateGif = gifList;
        if (!isEqual(stateGif, localStorageGifList)) {
            var toUpdateGifPosition = [];

            forEach(gifList, (stateGif) => {
                toUpdateGifPosition.push({ id: stateGif['id'], position: findIndex(gifList, stateGif) })
            });
            //update backend
            const url = `${process.env.REACT_APP_API_ROOT}/api/update-positions`;

            axios.post(url, { updateList: toUpdateGifPosition },
                {
                    headers: headers
                }
            )
                .then(response => {
                    const { success } = response.data;
                    if (isEqual(success, "true")) {
                        setLocalStorageUpdateTime();
                        getGifData();
                    }
                });
        }

    }


    // custom hook to use it with setInterval
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


    // to calculate the last saved time
    useInterval(() => {
        const lastSavedTime = Date.parse(localStorage.getItem("lastSavedTime") || "new Date()");
        const currentTime = new Date();
        var timeDiff = currentTime - lastSavedTime;
        timeDiff /= 1000;
        timeDiff = Math.floor(timeDiff);
        const min = Math.floor(timeDiff / 60) % 60
        const hr = Math.floor(timeDiff / 3600) % 24
        setMinutes(min);
        setHour(hr)

    }, 1000)


    // equivalent of componentDidMount
    useEffect(() => {
        getGifData();
    }, []);

    useEffect(() => {
        checkAddError();
    }, [gifType, gifUrl, gifTitle]);

    useEffect(() => {
        checkEditError();
    }, [editType, editUrl, editTitle]);

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

    // to check if on click add the values musn't be empty
    const checkAddError = () => {
        if (gifUrl && gifType && gifTitle) {
            setErrorAddFree(true);
        }
    }
    const checkEditError = () => {
        if (editUrl && editType && editTitle) {
            setErrorEditFree(true);
        }
    }



    const addGif = () => {
        const url = `${process.env.REACT_APP_API_ROOT}/api/add`;

        if (errorAddFree) {
            const gifData = {
                'position': size(gifList),
                'title': gifTitle,
                'type_name': gifType,
                'gif_url': gifUrl
            }

            axios.post(url, gifData,
                {
                    headers: headers
                }
            )
                .then(response => {
                    setLocalStorageUpdateTime();
                    getGifData();
                });
        }
    }

    const deleteGif = (gifId) => {
        const url = `${process.env.REACT_APP_API_ROOT}/api/delete/${gifId}`;
        const body = { id: gifId }
        axios.post(url, {})
            .then(() => {
                setLocalStorageUpdateTime();
                getGifData();
            });
    }

    const updateGif = () => {

        const url = `${process.env.REACT_APP_API_ROOT}/api/update`;

        if (errorEditFree) {
            const gifData = {
                'id': editId,
                'title': editTitle,
                'type_name': editType,
                'gif_url': editUrl
            }

            axios.post(url, gifData,
                {
                    headers: headers
                }
            )
                .then(() => {
                    setLocalStorageUpdateTime();
                    getGifData();
                    handleEditModalShow(false, editId);
                });
        }

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