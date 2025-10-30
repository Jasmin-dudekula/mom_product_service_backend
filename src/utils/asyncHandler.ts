import {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";

// return type of the parent function is a RequestHandler because the
// function that it is returning is an express middleware function
// all express middleware functions are of the type RequestHandler
const asyncHandler = (asyncHandler: RequestHandler): RequestHandler => {
  // returning a function inside a function
  // this is an express middleware function
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(asyncHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
