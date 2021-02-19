import React from 'react';
import logo from './logo.svg';
import './App.scss';
import axios from 'axios';
import GifGridFunc from './GifTable/GifGridFunc'

function App() {
  function testApiConnection() {
    const url = `${process.env.REACT_APP_API_ROOT}/api/get/`;
    axios.get(url)
      .then(response => {
        alert(response.data['detail'][0]['title']);
      });
  }

  return (
    <div className="pcoded-wrapper">
      <div className="pcoded-content">
        <div className="pcoded-inner-content">
          <div className="App">
            <GifGridFunc/>
            <button onClick={testApiConnection}>Click to test API integration.</button>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;