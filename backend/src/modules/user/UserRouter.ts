import express, { Request, Response, Router } from 'express';
import passport from 'passport';

import { User, UserInterface } from '@modules/user/UserModel';
import { WorkspaceUsers } from '@modules/workspace_users/WorkspaceUsersModel';

export const UserRouter: Router = (() => {
  const router = express.Router();

  router.get(
    '/workspaces',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const user = await User.findById((request.user as UserInterface).id);
      if (!user) {
        return response.api.error(request.user, 404, 'invalid user');
      }
      const workspaces = await WorkspaceUsers.find({ user: user.id }).populate('user').populate('workspace');

      if (user) {
        return response.api.success(workspaces);
      }
    }
  );

  return router;
})();
