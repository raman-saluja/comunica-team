import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import helmet from 'helmet';
import passport from 'passport';
import path from 'path';
import { pino } from 'pino';

import apiResponseMiddleware from '@common/middleware/apiResponseHandler';
import errorHandler from '@common/middleware/errorHandler';
// import rateLimiter from '@common/middleware/rateLimiter';
import requestLogger from '@common/middleware/requestLogger';
import { passportAuth } from '@common/utils/auth';
import { db } from '@common/utils/db';
import { getCorsOrigin } from '@common/utils/envConfig';
import { AuthRouter } from '@modules/auth/AuthRouter';
import { ChannelRouter } from '@modules/channels/ChannelRouter';
import { ChatRouter } from '@modules/chats/ChatRouter';
import { healthCheckRouter } from '@modules/healthCheck/healthCheckRouter';
import { UserRouter } from '@modules/user/UserRouter';
import { WorkspaceRouter } from '@modules/workspaces/WorkspaceRouter';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const logger = pino({ name: 'server start' });
const app: Express = express();
const corsOrigin = getCorsOrigin();

// serve "uploads" folder statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

db();

// Middlewares
app.use(cors({ origin: [corsOrigin], credentials: true }));
app.use(helmet());
// app.use(rateLimiter);
app.use(apiResponseMiddleware);
app.use(express.json());

// passport
passportAuth(passport);
app.use(passport.initialize());

// Request logging
app.use(requestLogger());

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/auth', AuthRouter);
app.use('/workspaces', WorkspaceRouter);
app.use('/channels', ChannelRouter);
app.use('/chats', ChatRouter);
app.use('/users', UserRouter);

// Swagger UI
// app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
