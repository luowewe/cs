/*
 * Trivial web server that serves the contents of the public/ directory.
 */

import express from 'express';

import { WebSocket, WebSocketServer } from 'ws';

const port = 3000;

const app = express();

app.use(express.static('public'));

const server = app.listen(port, function () {
  console.log(`Listening on port ${this.address().port}`);
});

const itemData = {
  "Write an essay": {
    self: { x: 0.0, y: 0.1 }
  },
  "Summarize text to help understand it": {
    self: { x: 0, y: 0 }
  },
  "Lookup the name of something from a description.": {
    self: { x: 0, y: 0 }
  },
  "Find grammatical errors in writing": {
    self: { x: 0, y: 0 }
  },
  "Get style suggestions on code": {
    self: { x: 0, y: 0 }
  },
  "Get style suggestions on writing": {
    self: { x: 0, y: 0 }
  },
  "Get quotations from a book": {
    self: { x: 0, y: 0 }
  },
};

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', (data, isBinary) => {
    if (data.toString() === 'hello') {
      ws.send(JSON.stringify({items: itemData}));
    } else {
      console.log(`Got message ${data}`);
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data, { binary: isBinary });
        }
      });
    }
  });
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});
