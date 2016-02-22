import config from 'config';
import app from 'app';
import http from 'http';
import socketio from 'socket.io';
import _debug from 'debug';
const debug = _debug('svc:bin:app');

const httpServer = http.Server(app);

const io = socketio(httpServer);
io.on('connection', socket => {
  debug('a user connected');

  app.set('socket', socket);

  socket.on('disconnect', () => {
    debug('a user disconnected');
  });

  socket.on('il-ping', msg => {
    debug('>>> message: ', msg);
    if (msg === 'socket') {
      socket.emit('il-pong', { status: 'complete' });
    } else {
      socket.emit('il-pong', { status: 'submitted' });
      setTimeout(() => {
        socket.emit('il-pong', { status: 'complete' });
      }, 3000);
    }
  });
});

const host = config.server_host;
const port = config.server_port;

httpServer.listen(port, host, () => {
  debug(`Server is now running at ${host}:${port}.`);
});
