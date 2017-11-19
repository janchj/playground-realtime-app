const io = require('socket.io')();

const db = require('rethinkdb');

// default port for app
const port = 3001;

// add line to drawing
const addLineToDrawing = ({ connection, line }) => {
  db.table('lines')
    .insert(Object.assign(line, { timestamp: new Date() }))
    .run(connection)
    .then(() => console.log('lined added', line))
};

// create drawing
const createDrawing = ({ connection, name }) => {
  db.table('drawings')
    .insert({ name, timestamp: new Date() })
    .run(connection)
    .then(() => console.log('drawing added with name', name))
};

// subscribe client to drawing changes
const subscribeToDrawings = ({ connection, client }) => {
  db.table('drawings')
    .changes({ includeInitial: true })
    .run(connection)
    .then(drawings => {
      drawings.each((err, drawing) => {
        console.log(err);
        console.log(drawing);
        client.emit('drawing', drawing.new_val);
      });
    });
};

// subscribe client to drawing line changes
const subscribeToDrawingLines = ({ connection, client, drawingId }) => {
  db.table('lines')
  .filter(db.row('drawingId').eq(drawingId))
  .changes({ includeInitial: true })
  .run(connection).then(cursor => {
    cursor.each((err, lineRow) => {
      client.emit(`drawingLine:${drawingId}`, lineRow.new_val);
    })
  })
};

// open default connection
db.connect({
  host: 'localhost',
  port: 28015,
  db: 'whiteboards'
  }).then(connection => {

  // respond to event
  io.on('connection', (client) => {
      // create a new drawing
      client.on('createDrawing', ({ name }) => {
        console.log('createDrawing called');
        createDrawing({ connection, name });
      });

      // drawing changes
      client.on('subscribeToDrawings', () => {
        subscribeToDrawings({ connection, client });
      });

      // line changes
      client.on('addLineToDrawing', (line) => {
        addLineToDrawing({ connection, line });
      });

      // line changes
      client.on('subscribeToDrawingLines', (drawingId) => {
        subscribeToDrawingLines({ connection, client, drawingId });
      });
  });
});

// start socket io on port
io.listen(port);
console.log('listening on PORT:', port);
