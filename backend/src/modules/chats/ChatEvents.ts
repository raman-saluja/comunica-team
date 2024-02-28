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

const loadMessages = async ({ payload, socket }: loadMessagePayload) => {
  const chat = await Chat.find({
    channel: payload.channel,
  })
    .populate('channel')
    .populate('sender');
  socket.emit('load-messages-fulfilled', chat);
  return chat;
};

export const registerChatEvents = (socket: Socket) => {
  socket.on('join-channel', async (payload: string) => {
    socket.join(`channel-${payload}`);

    await loadMessages({
      payload: { channel: payload },
      socket,
    });
  });

  socket.on('load-messages', async (payload: { payload: loadMessagePayload['payload'] }) => {
    await loadMessages({
      payload: payload["payload"],
      socket,
    });
    // socket.broadcast.to(`channel-${payload}`).emit('joined-channel', "user left");
  });

  socket.on('leave-channel', async (payload: string) => {
    socket.leave(`channel-${payload}`);
    // socket.broadcast.to(`channel-${payload}`).emit('joined-channel', "user left");
  });

  socket.on('sendMessage', async (payload) => {
    let user = await User.findById(payload.token!);

    if (!user) return;

    let chat = new Chat();
    chat.sender = user;
    chat.channel = payload.channel;
    chat.message = payload.message;
    chat.save();
    socket.broadcast.to(`channel-${chat.channel._id}`).emit('message-received', chat.toJSON());
    logger.info('received a message', chat);
  });
};
