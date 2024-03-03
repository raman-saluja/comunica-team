import { User } from '@modules/user/UserModel';
import { socketIO } from '@src/index';
import { logger } from '@src/server';
import { Socket } from 'socket.io';
import { Chat } from './ChatModel';

interface loadMessagePayload {
  payload: {
    channel: string;
  };
  socket: Socket;
}

export const registerChatEvents = (socket: Socket) => {
  socket.on('join-channel', async (payload: string) => {
    socket.join(`channel-${payload}`);
    socketIO.to(`channel-${payload}`).emit('joined-channel', 'user joined');
  });

  socket.on('leave-channel', async (payload: string) => {
    socket.leave(`channel-${payload}`);
    socketIO.to(`channel-${payload}`).emit('joined-channel', 'user left');
  });

  socket.on('sendMessage', async (payload) => {
    let user = await User.findById(payload.token!);

    if (!user) return;

    let chat = new Chat();
    chat.sender = user;
    chat.channel = payload.channel;
    chat.message = payload.message;
    chat.save().then(async () => {
      let message = await Chat.findById(chat.id).populate('sender').populate('channel').exec();
      socketIO.to(`channel-${payload.channel}`).emit('message-received', message?.toJSON());
    });

    logger.info('received a message');
    logger.info(payload.channel);
  });
};
