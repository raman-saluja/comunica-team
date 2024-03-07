import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PassportStatic } from 'passport';
import { ExtractJwt, Strategy, StrategyOptionsWithSecret } from 'passport-jwt';

import { env, getAppSecret } from '@common/utils/envConfig';
import { UserInterface } from '@modules/user/UserModel';

export interface AuthJWTPayload extends JwtPayload {
  user: UserInterface;
}

export const passportAuth = (passport: PassportStatic) => {
  const opts: StrategyOptionsWithSecret = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: getAppSecret(),
  };
  return passport.use(
    new Strategy(opts, function (jwt_payload: AuthJWTPayload, done) {
      return done(null, jwt_payload.user);
    })
  );
};

export const passportSocketAuth = (passport: PassportStatic) => {
  const opts: StrategyOptionsWithSecret = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: getAppSecret(),
  };
  return passport.use(
    new Strategy(opts, function (jwt_payload: AuthJWTPayload, done) {
      return done(null, jwt_payload.user);
    })
  );
};

export function authJWT(user: UserInterface): string {
  return jwt.sign(
    {
      user,
    },
    env('APP_SECRET')
  );
}

export async function genPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export const wrapMiddlewareForSocketIo = (middleware: any) => (socket: any, next: any) =>
  middleware(socket.request, {}, next);

export const authUser = (user: any): UserInterface => {
  return user as UserInterface;
};
