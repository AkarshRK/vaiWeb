import React from 'react';
import logo from './logo.svg';
import './App.scss';
import axios from 'axios';
import GifGridFunc from './GifTable/GifGridComponent'

function App() {

  return (
    <div className="pcoded-wrapper">
      <div className="pcoded-content">
        <div className="pcoded-inner-content">
          <div className="App">
            <GifGridFunc/>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;