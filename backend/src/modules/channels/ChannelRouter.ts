import express, { Request, Response, Router } from 'express';

import { Channel } from './ChannelModel';
import { Workspace, WorkspaceSchema } from '@modules/workspaces/WorkspaceModel';
import passport from 'passport';
import { model } from 'mongoose';

export const ChannelRouter: Router = (() => {
  const router = express.Router();

  router.post('/', passport.authenticate('jwt', { session: false }), async (request: Request, response: Response) => {
    const workspace = request.body.workspace_id ? await Workspace.findById(request.body.workspace_id).exec() : false;

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

  router.get('/', passport.authenticate('jwt', { session: false }), async (request: Request, response: Response) => {
    const channels = await Channel.find().populate('workspace');

    if (channels) {
      return response.api.success(channels);
    } else {
      response.api.error({}, 500, 'Something went wrong');
    }
  });

  router.get(
    '/:channelId',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const channel = await Channel.findById(request.params.channelId).populate('workspace');

      if (channel) {
        return response.api.success({ ...channel.toJSON(), id: channel.id });
      } else {
        response.api.error({}, 500, 'Something went wrong');
      }
    }
  );

  return router;
})();
