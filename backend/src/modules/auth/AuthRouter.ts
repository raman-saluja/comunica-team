import bcrypt from 'bcryptjs';
import express, { Request, Response, Router } from 'express';
import passport from 'passport';

import { authJWT, genPassword } from '@common/utils/auth';
import { User, UserInterface, UserVerifyStatus } from '@modules/user/UserModel';

export const AuthRouter: Router = (() => {
  const router = express.Router();

  router.post('/register', async (request: Request, response: Response) => {
    const user = new User({
      email: request.body.email,
    });

    user
      .save()
      .then(() => {
        // generate jwt token using passport authenticate
        const token = authJWT(user);
        response.api.success({
          user,
          token,
        });
      })
      .catch((e) => {
        response.api.error(e.errors, 400, e.message);
      });
  });

  router.get(
    '/verify',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const user = await User.findById((request.user as UserInterface)._id);

      if (user) {
        user.verify = UserVerifyStatus.YES;
        user.save();
        response.api.success({ ...user.toObject(), token: authJWT(user) });
      } else response.api.error({}, 404, 'invalid user');
    }
  );

  router.put(
    '/update',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const user = await User.findById((request.user as UserInterface)._id);
      const data = request.body;
      if (user) {
        if (data.password) {
          user.password = await genPassword(data.password);
          await user.save();
        }
        response.api.success({ ...user.toObject(), token: authJWT(user) });
      } else response.api.error({}, 404, 'invalid user');
    }
  );

  router.put(
    '/update',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const user = await User.findById((request.user as UserInterface)._id);
      const data = request.body;

      if (user) {
        if (data.password) {
          user.password = await genPassword(data.password);
          await user.save();
        }
        response.api.success({ ...user.toObject(), token: authJWT(user) });
      } else response.api.error({}, 404, 'invalid user');
    }
  );

  router.post('/login', async (request: Request, response: Response) => {
    const data = request.body;
    const user = await User.findOne({ email: data.email });

    if (!user || !data.password) {
      return response.api.error({}, 404, 'invalid email');
    }

    return await bcrypt.compare(data.password, user.password, (err: any, result: any) => {
      if (!result) {
        return response.api.error({}, 401, 'invalid password');
      } else {
        return response.api.success({ ...user!.toObject(), token: authJWT(user!) }, 200, 'Logged in successfully');
      }
    });
  });

  return router;
})();
