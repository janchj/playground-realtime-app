/* eslint-disable no-undef */
import React, { Component } from 'react';

import { subscribeToConnectionEvent } from './api';

class Connection extends Component {
  // default state
  state = {
      connectionState: 'connecting'
  }

  constructor(props){
    console.log('loaded');
    super(props);
    subscribeToConnectionEvent(({
      state: connectionState,
      port
    }) => {
      console.log(connectionState);
      this.setState({
        connectionState,
        port
      })
    })
  }

  render() {
    let content = this.state.connectionState;

    if(this.state.connectionState === "connecting"){
      content = (
        <div>
          Trying to connect
        </div>
        );
    }

    if(this.state.connectionState === "connected") {
        content = (
          <div>
            Connected
          </div>
          );
      }

      if(this.state.connectionState === "disconnected") {
        content = (
          <div className="Connection-error">
            Unable to connect
          </div>
          );
      }

      return (
        <div className="Connection">
          <div className="Connection-port">
            port: {this.state.port}
          </div>
          { content }
        </div>
      );
  }
}

export default Connection;