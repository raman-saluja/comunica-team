import bcrypt from 'bcryptjs';
import express, { Request, Response, Router } from 'express';
import passport from 'passport';

import { authJWT, genPassword } from '@common/utils/auth';
import { User, UserInterface, UserStatus, UserVerifyStatus } from '@modules/user/UserModel';
import { env } from '@common/utils/envConfig';
import { Workspace } from './WorkspaceModel';

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

  router.get('/', async (request: Request, response: Response) => {
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

  return router;
})();
