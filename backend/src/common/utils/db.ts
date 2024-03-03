import mongoose, { Document } from 'mongoose';

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

export const defaultToJSONMethod = () => {
  return {
    transform: (_document: Document, returnedObject: any) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  };
};
