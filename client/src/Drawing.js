/* eslint-disable no-undef */
import React, {Component} from 'react';

import Canvas from 'simple-react-canvas';

import { addLineToDrawing, subscribeToDrawingLine } from './api';

class Drawing extends Component {

  state = {
    lines: []
  }

  componentDidMount(){
    subscribeToDrawingLine(this.props.drawing.id, (linesEvent) => {
      this.setState((prevState) => {
        return {
          lines: [...prevState.lines, ...linesEvent.lines]
        }
      })
    })
  }

  handleLine = (line) => {
    addLineToDrawing(this.props.drawing.id, line);
  }
  render() {
    return (
        this.props.drawing ?
        <div className="Drawing">
          <div className="Drawing-title">{this.props.drawing.name}</div>
          <Canvas 
          drawingEnabled={true}
          onDraw={this.handleLine}
          lines={this.state.lines}/>
        </div>
        : null
    )
  }
}

export default Drawing;
