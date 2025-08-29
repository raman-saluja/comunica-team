import { Socket } from 'socket.io';
import { Server } from 'socket.io';

import { env, getPort } from '@common/utils/envConfig';
import { registerChatEvents } from '@modules/chats/ChatEvents';
import { app, logger } from '@src/server';

const port = getPort();

const httpServer = app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});

const socketIO = new Server(httpServer, {
  cors: {
    origin: env('CORS_ORIGIN'),
    methods: ['GET', 'POST'],
  },
});

socketIO.on('connection', (socket: Socket) => {
  registerChatEvents(socket, socketIO); // Pass socketIO as parameter
});

const onCloseSignal = () => {
  logger.info('sigint received, shutting down');
  httpServer.close(() => {
    logger.info('server closed');
    socketIO.disconnectSockets();
    process.exit();
  });

  setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);

export { socketIO };
