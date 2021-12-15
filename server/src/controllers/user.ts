import { Request, Response, NextFunction } from 'express';

const validate = (req: Request, res: Response, next: NextFunction) => {};

const register = (req: Request, res: Response, next: NextFunction) => {};

const login = (req: Request, res: Response, next: NextFunction) => {};

const read = (req: Request, res: Response, next: NextFunction) => {};

const readAll = (req: Request, res: Response, next: NextFunction) => {};

export default {
    validate,
    register,
    login,
    read,
    readAll
};
