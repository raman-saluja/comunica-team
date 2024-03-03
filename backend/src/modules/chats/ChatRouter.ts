import express, { Request, Response, Router } from 'express';
import passport from 'passport';

import { Chat } from './ChatModel';

export const ChatRouter: Router = (() => {
  const router = express.Router();

  router.get(
    '/:channelId',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const chats = await Chat.find({ channel: request.params.channelId }).populate('sender').populate('channel');

      if (chats) {
        return response.api.success(chats);
      } else {
        response.api.error({}, 500, 'Something went wrong');
      }
    }
  );

  return router;
})();
