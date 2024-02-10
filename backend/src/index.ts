import { Server } from 'socket.io';

import { getPort } from '@common/utils/envConfig';
import { app, logger } from '@src/server';

const port = getPort();

const server = app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
// const io = socket(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST'],
//   },
// });

const io = new Server({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

export const socketIO = io;

io.on('connection', () => {
  // socket.emit('noArg');
  // console.log('a user connected');
});

const onCloseSignal = () => {
  logger.info('sigint received, shutting down');
  server.close(() => {
    logger.info('server closed');
    process.exit();
  });

  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
