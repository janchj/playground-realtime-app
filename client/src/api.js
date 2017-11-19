import openSocket from 'socket.io-client';
import Rx from 'rxjs/Rx';

// set default URL
const port = parseInt(window.location.search.replace('?',''),10) || 3001;
const url = `localhost:${port}`;

// open socket
const socket = openSocket(url);

const subscribeToDrawings = (next) => {
  // subscribe to event
  socket.on('drawing', drawing => next(drawing));
  // call event
  socket.emit('subscribeToDrawings');
};

const subscribeToDrawingLine = (drawingId, next) => {
  // create stream of lines
  const lineStream = Rx.Observable.fromEventPattern(
    handler => socket.on(`drawingLine:${drawingId}`, handler),
    handler => socket.off(`drawingLine:${drawingId}`, handler)
  );
  // batch lines
  const bufferedStream = lineStream.bufferTime(100)
    .map((lines) => ({ lines }));

  
  bufferedStream.subscribe(linesEvent => next(linesEvent));
  
  // call event
  socket.emit('subscribeToDrawingLines', drawingId);
};

const createDrawing = (name) => {
  // call event
  socket.emit('createDrawing', { name });
}

const addLineToDrawing = (drawingId, line) => {
  // call event
  socket.emit('addLineToDrawing', { drawingId, ...line });
}

const subscribeToConnectionEvent = (cb) => {
  socket.on('connect', () => cb({
    state: 'connected',
    port
  }));
  socket.on('disconnect', () => cb({
    state: 'disconnected',
    port
  }));
  socket.on('connect_error', () => cb({
    state: 'disconnected',
    port
  }));
}

export {
  subscribeToDrawings,
  subscribeToDrawingLine,
  createDrawing,
  addLineToDrawing,
  subscribeToConnectionEvent
};
