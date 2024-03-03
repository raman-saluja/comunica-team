import bcrypt from 'bcryptjs';
import express, { Request, Response, Router } from 'express';
import passport from 'passport';

import { authJWT, genPassword } from '@common/utils/auth';
import { env } from '@common/utils/envConfig';
import { User, UserInterface, UserStatus, UserVerifyStatus } from '@modules/user/UserModel';

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
          verify_url: `${env('CORS_ORIGIN')}/email/verify?token=${encodeURIComponent(token)}`,
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
        response.api.success({ ...user.toJSON(), token: authJWT(user) });
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
        response.api.success({ ...user.toJSON(), token: authJWT(user) });
      } else response.api.error({}, 404, 'invalid user');
    }
  );

  router.get(
    '/user',
    passport.authenticate('jwt', { session: false }),
    async (request: Request, response: Response) => {
      const user = await User.findById((request.user as UserInterface).id);
      if (user) {
        const res = { ...user.toJSON() };
        response.api.success(res);
      } else response.api.error({}, 404, 'invalid user');
    }
  );

  router.post('/login', async (request: Request, response: Response) => {
    const data = request.body;
    const user = await User.findOne(
      { email: data.email },
      {
        id: 1,
        name: 1,
        email: 1,
        password: 1,
        status: 1,
        verify: 1,
      }
    );

    if (!user || !data.password || !user.password) {
      return response.api.error({}, 404, 'invalid email');
    }

    if (user.status == UserStatus.INACTIVE) {
      return response.api.error({}, 401, 'account suspended');
    }

    return await bcrypt.compare(data.password, user.password, (_err: any, result: any) => {
      if (!result) {
        return response.api.error({}, 401, 'invalid password');
      } else {
        const res = { ...user.toJSON() };
        delete res.password;
        const token = authJWT(user!);
        response.cookie('user', token, { maxAge: 900000, httpOnly: true });
        return response.api.success({ ...res, token }, 200, 'Logged in successfully');
      }
    });
  });

  return router;
})();
