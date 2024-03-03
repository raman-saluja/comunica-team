import express, { Request, Response, Router } from 'express';
import passport from 'passport';

import { UserInterface } from '@modules/user/UserModel';
import { WorkspaceUsers } from '@modules/workspace_users/WorkspaceUsersModel';

import { Workspace, WorkspaceInterface } from './WorkspaceModel';

export const WorkspaceRouter: Router = (() => {
  const router = express.Router();

  router.post('/', async (request: Request, response: Response) => {
    const workspace = new Workspace({
      name: request.body.name,
    });

    workspace
      .save()
      .then(() => {
        // generate jwt token using passport authenticate
        response.api.success({ ...workspace.toJSON(), id: workspace.id });
      })
      .catch((e) => {
        response.api.error(e.errors, 400, e.message);
      });
  });

  router.get('/', async (_request: Request, response: Response) => {
    const workspaces = await Workspace.find();

    if (workspaces) {
      return response.api.success(workspaces);
    } else {
      response.api.error({}, 500, 'Something went wrong');
    }
  });

  router.get('/:workspaceId', async (request: Request, response: Response) => {
    const workspace = await Workspace.findById(request.params.workspaceId);

    if (workspace) {
      return response.api.success({ ...workspace.toJSON(), id: workspace.id });
    } else {
      response.api.error({}, 500, 'Something went wrong');
    }
  });

  router.get(
    '/:workspaceId/join',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const workspace = await Workspace.findById(request.params.workspaceId);
      if (!workspace) {
        return response.api.error({}, 500, 'Something went wrong');
      }

      const exists = await WorkspaceUsers.findOne({ user: request.user, workspace: workspace });

      if (!exists) {
        const create = await new WorkspaceUsers();
        create.user = request.user as UserInterface;
        create.workspace = workspace as WorkspaceInterface;
        create.save();
      }

      const workspaceUser = await WorkspaceUsers.findOne({ user: request.user, workspace: workspace })
        .populate('user')
        .populate('workspace');

      return response.api.success(workspaceUser?.toJSON());
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
