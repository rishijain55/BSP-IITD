import { Request, Response, NextFunction } from 'express';
import user from '../models/user.model';
import { IUser } from '../interfaces/user';
import mongoose from 'mongoose';

const validate = (req: Request, res: Response, next: NextFunction) => {};

const register = async (req: Request, res: Response, next: NextFunction) => {
    var id = new mongoose.Types.ObjectId;
    const newUser: <IUser> = new user(req.body);
};

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
