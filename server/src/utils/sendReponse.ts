import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

type ResponseBody = {
  success: boolean;
  data?: unknown;
  message?: string;
};

const sendResponse = <T = null>(
  res: Response,
  statusCode: number = StatusCodes.OK,
  message?: string,
  data: T | null = null,
) => {
  const responseBody: ResponseBody = {
    success: true,
  };

  if (message) responseBody.message = message;
  if (data !== null && data !== undefined) {
    responseBody.data = data;
  }

  return res.status(statusCode).json(responseBody);
};

export default sendResponse;
