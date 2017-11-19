/* eslint-disable no-undef */
/* eslint-disable no-labels */
/* eslint-disable no-unused-labels */
import React, { Component } from 'react';

import { subscribeToDrawings } from './api';

class DrawingList extends Component {
  constructor(props){
    super(props);
    // get list of drawings
    subscribeToDrawings(drawing =>{
      this.setState(prevState => ({
        drawings: prevState.drawings.concat([drawing])
      }));
    });
  }

  state = {
    drawings: []
  };

  render() {
    console.log(this.state.drawings);
    const drawings = this.state.drawings.map(drawing =>
        <li 
        className = "DrawingList-item"
        key = {drawing.id}
        onClick = {event => {this.props.selectDrawing(drawing)}}
        > {drawing.name} </li>
    )
    return (
      <ul className = "DrawingList">
        {drawings}
      </ul>
    );
  }
}

export default DrawingList