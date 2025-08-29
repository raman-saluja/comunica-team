import { Socket, Server } from 'socket.io'; // Add Server import

import { User } from '@modules/user/UserModel';
// Remove this line: import { socketIO } from '@src/index';
import { logger } from '@src/server';

import { Chat } from './ChatModel';

export const registerChatEvents = (socket: Socket, socketIO: Server) => {
  // Add socketIO parameter
  socket.on('join-channel', async (payload: string) => {
    socket.join(`channel-${payload}`);
    socketIO.to(`channel-${payload}`).emit('joined-channel', payload);
  });

  socket.on('leave-channel', async (payload: string) => {
    socket.leave(`channel-${payload}`);
    socketIO.to(`channel-${payload}`).emit('left-channel', 'user left');
  });

  socket.on('sendMessage', async (payload) => {
    const user = await User.findById(payload.token!);

    const rooms = socketIO.of('/').adapter.rooms;
    console.log(rooms);

    if (!user) return;

    const chat = new Chat();
    chat.sender = user;
    chat.channel = payload.channel;
    chat.message = payload.message;
    chat.save().then(async () => {
      const message = await Chat.findById(chat.id).populate('sender').populate('channel').exec();
      socketIO.to(`channel-${payload.channel}`).emit('message-received', message?.toJSON());
    });

    logger.info('received a message');
    logger.info(payload.channel);
  });
};
