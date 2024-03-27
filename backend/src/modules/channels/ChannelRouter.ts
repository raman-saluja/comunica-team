import express, { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';

import { Workspace } from '@modules/workspaces/WorkspaceModel';

import { Channel } from './ChannelModel';
import { WorkspaceUsers } from '@modules/workspace_users/WorkspaceUsersModel';
import { authUser } from '@common/utils/auth';
import mongoose from 'mongoose';
import { Chat } from '@modules/chats/ChatModel';

export const ChannelRouter: Router = (() => {
  const router = express.Router();

  router.use(passport.authenticate('jwt', { session: false }));

  router.use(async (request: Request, response: Response, next: NextFunction) => {
    if (!request.query.workspace && !mongoose.isValidObjectId(request.query.workspace)) {
      return response.api.error({ ...request.query }, 400, 'workspace required');
    }

    const workspace_user = await WorkspaceUsers.findOne({
      workspace: request.query.workspace,
      user: authUser(request.user).id,
    });

    if (!workspace_user) {
      return response.api.error({}, 400, 'not allowed');
    }

    next();
  });

  router.post('/', passport.authenticate('jwt', { session: false }), async (request: Request, response: Response) => {
    const workspace = await Workspace.findById(request.query.workspace);

    if (!workspace) {
      return response.api.error({}, 400, 'workspace is invalid.');
    }

    const channel = new Channel({
      name: request.body.name,
      workspace: workspace._id,
    });

    channel
      .save()
      .then(() => {
        // generate jwt token using passport authenticate
        response.api.success({ ...channel.toJSON(), id: channel.id });
      })
      .catch((e) => {
        response.api.error(e.errors, 400, e.message);
      });
  });

  router.put(
    '/:channelId',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const workspace = await Workspace.findById(request.query.workspace);

      if (!workspace) {
        return response.api.error({}, 400, 'workspace is invalid.');
      }

      const channel = await Channel.findById(request.params.channelId);

      if (!channel) {
        return response.api.error({}, 404, 'not found');
      }
      channel.name = request.body.name;

      channel
        .save()
        .then(() => {
          // generate jwt token using passport authenticate
          response.api.success({ ...channel.toJSON(), id: channel.id });
        })
        .catch((e) => {
          response.api.error(e.errors, 400, e.message);
        });
    }
  );

  router.delete(
    '/:channelId',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const workspace = await Workspace.findById(request.query.workspace);

      if (!workspace) {
        return response.api.error({}, 400, 'workspace is invalid.');
      }

      const channel = await Channel.findById(request.params.channelId);

      if (!channel) {
        return response.api.error({}, 404, 'not found');
      }

      await Chat.deleteMany({ channel: channel.id });

      channel
        .deleteOne()
        .then(() => {
          // generate jwt token using passport authenticate
          response.api.success({});
        })
        .catch((e) => {
          response.api.error(e.errors, 400, e.message);
        });
    }
  );

  router.get('/', passport.authenticate('jwt', { session: false }), async (request: Request, response: Response) => {
    const channels = await Channel.find({ workspace: request.query.workspace });

    return response.api.success(channels);
  });

  router.get(
    '/:channelId',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const channel = await Channel.findById(request.params.channelId).populate('workspace');

      if (channel) {
        return response.api.success({ ...channel.toJSON() });
      } else {
        response.api.error({}, 500, 'Something went wrong');
      }
    }
  );

  return router;
})();
