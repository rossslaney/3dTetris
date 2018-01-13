import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import VizViewer from './components/VizViewer'
class App extends Component {
  render() {
    return (
      <div className="App">
        <ul>
          <li className="fa-home"></li>
          <li className="fa-suitcase"></li>
          <li className="fa-flask"></li>
          <li className="fa-user"></li>
        </ul>
        <header className="App-header">
          <h1 className="App-title">Welcome to Pitch3D</h1>
        </header>
        <div className ="viewMain" id="viewMain">
          <VizViewer />
        </div>
      </div>
    );
  }
}

export default App;
