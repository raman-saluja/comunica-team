import express, { Request, Response, Router } from 'express';
import passport from 'passport';

import { User, UserInterface } from '@modules/user/UserModel';
import { Roles, WorkspaceUsers } from '@modules/workspace_users/WorkspaceUsersModel';

import { authUser } from '@common/utils/auth';
import mongoose from 'mongoose';
import { Workspace, WorkspaceInterface } from './WorkspaceModel';
import { Channel } from '@modules/channels/ChannelModel';
import { Chat } from '@modules/chats/ChatModel';

export const WorkspaceRouter: Router = (() => {
  const router = express.Router();

  router.put(
    '/:workspaceId',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const workspace = await Workspace.findOne({
        _id: request.params.workspaceId,
        created_by: authUser(request.user).id,
      });

      if (!workspace) {
        return response.api.error({}, 404, 'Workspace Not Found');
      }

      if (request.body.name) workspace.name = request.body.name;

      workspace
        .save()
        .then(async () => {
          const data = await workspace.populate('created_by');
          response.api.success({ ...data.toJSON(), id: workspace.id });
        })
        .catch((e) => {
          response.api.error(e.errors, 400, e.message);
        });
    }
  );

  router.delete(
    '/:workspaceId',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const workspace = await Workspace.findOne({
        _id: request.params.workspaceId,
        created_by: authUser(request.user).id,
      });

      if (!workspace) {
        return response.api.error({}, 404, 'Workspace Not Found');
      }

      // deleting channels, chats, workspace_users before deleting workspace
      const channels = await Channel.find({ workspace: workspace.id });
      await channels.map(async (channel) => {
        await Chat.deleteMany({ channel: channel.id });
        await channel.deleteOne();
      });

      await WorkspaceUsers.deleteMany({ workspace: workspace.id });

      workspace
        .deleteOne()
        .then(async () => {
          response.api.success({}, 200, 'deleted');
        })
        .catch((e) => {
          response.api.error(e.errors, 400, e.message);
        });
    }
  );

  router.post('/', passport.authenticate('jwt', { session: false }), async (request: Request, response: Response) => {
    const workspace = new Workspace({
      name: request.body.name,
      created_by: (request.user as UserInterface).id,
    });

    const user = await User.findById(authUser(request.user).id);

    workspace
      .save()
      .then(async () => {
        const workspace_user = new WorkspaceUsers({
          user,
          workspace: workspace.id,
        });
        await workspace_user.save();
        const data = await workspace.populate('created_by');
        response.api.success({ ...data.toJSON(), id: workspace.id });
      })
      .catch((e) => {
        response.api.error(e.errors, 400, e.message);
      });
  });

  router.get('/', passport.authenticate('jwt', { session: false }), async (_request: Request, response: Response) => {
    const workspaces = await Workspace.find().populate('created_by');

    if (workspaces) {
      return response.api.success(workspaces);
    } else {
      response.api.error({}, 500, 'Something went wrong');
    }
  });

  router.get(
    '/:workspaceId',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const workspace = await Workspace.findOne({
        _id: request.params.workspaceId,
        created_by: authUser(request.user).id,
      }).populate('created_by');

      if (workspace) {
        return response.api.success({ ...workspace.toJSON(), id: workspace.id });
      } else {
        return response.api.error({}, 404, 'Not found');
      }
    }
  );

  router.get(
    '/:workspaceId/join',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      try {
        if (!request.params.workspaceId || !mongoose.Types.ObjectId.isValid(request.params.workspaceId)) {
          return response.api.error({}, 404, 'Invalid workspace');
        }

        const workspace = await Workspace.findById(request.params.workspaceId);
        if (!workspace) {
          return response.api.error({}, 404, 'Invalid workspace');
        }

        const user_id = (request.user as UserInterface).id;
        const user = await User.findById(user_id);
        if (!user) {
          return response.api.error({}, 400, 'unauthorised');
        }

        const exists = await WorkspaceUsers.findOne({ user: user_id, workspace: workspace });

        if (!exists) {
          const create = new WorkspaceUsers();
          create.role = Roles.Member;
          create.user = user;
          create.workspace = workspace as WorkspaceInterface;
          create.save();
        }

        const workspaceUser = await WorkspaceUsers.findOne({ user: user_id, workspace: workspace })
          .populate('user')
          .populate('workspace');

        return response.api.success(workspaceUser?.toJSON());
      } catch (error) {
        return response.api.error(error as object, 500, 'Something went wrong');
      }
    }
  );

  router.get(
    '/:workspaceId/users',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const workspace = await Workspace.findById(request.params.workspaceId);
      if (!workspace) {
        return response.api.error({}, 500, 'Something went wrong');
      }

      const workspaceUser = await WorkspaceUsers.find({ workspace: workspace }).populate('user').populate('workspace');

      return response.api.success(workspaceUser);
    }
  );

  return router;
})();
