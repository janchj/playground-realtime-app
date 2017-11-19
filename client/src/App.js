/* eslint-disable no-undef */
import React, { Component } from 'react';
import './App.css';

import DrawingForm from './DrawingForm';
import DrawingList from './DrawingList';
import Drawing from './Drawing';
import Connection from './Connection';

class App extends Component {

  state = {
    selectedDrawing: ''
  }

  selectDrawing = (drawing) => {
    this.setState({
      selectedDrawing: drawing
    });
  };

  render() {
    let drawingCtrl = (
      <div>
        <DrawingForm/>
        <DrawingList
          selectDrawing = {this.selectDrawing}
        />
      </div>
    )
    // if a drawing is selected
    if(this.state.selectedDrawing){
      drawingCtrl = (
        <Drawing 
        drawing = { this.state.selectedDrawing }
        key = { this.state.selectedDrawing.id } />
      )
    }
    return (
      <div className="App">
        <div className="App-header">
          <h2>Drawing app</h2>
        </div>
        <Connection />
        { drawingCtrl }
      </div>
    );
  }
}

export default App;