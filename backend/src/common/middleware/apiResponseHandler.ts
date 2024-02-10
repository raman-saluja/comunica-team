import { NextFunction, Request, Response } from 'express';

import { ApiResponse, ResponseStatus } from '@common/models/ApiResponse';
import { handleApiResponse } from '@common/utils/httpHandlers';

const apiResponseMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.api = {
    error: (data?: object, status?: number, message?: string) => {
      handleApiResponse(new ApiResponse(ResponseStatus.Failed, message ?? '', data ?? {}, status ?? 404), res);
    },
    success: (data?: object, status?: number, message?: string) => {
      handleApiResponse(new ApiResponse(ResponseStatus.Success, message ?? '', data ?? {}, status ?? 200), res);
    },
  };
  next();
};

export default apiResponseMiddleware;
