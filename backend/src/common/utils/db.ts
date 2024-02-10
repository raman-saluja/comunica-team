import mongoose from 'mongoose';

import { getMongoDBConfig } from './envConfig';

export const db = () => {
  mongoose
    .connect(getMongoDBConfig())
    .then(() => {
      // console.log('Connected to MongoDB');
    })
    .catch(() => {
      // console.log("Couldn't connect to MongoDB");
    });
  return mongoose;
};
