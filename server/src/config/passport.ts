import passport from 'passport';
import passportLocal from 'passport-local';

import { find, isBuffer } from 'lodash';

import IUser from '../interfaces/user';
import UserModel from '../models/user.model';

import { Request, Response, NextFunction } from 'express';
import { NativeError } from 'mongoose';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((req, user, done) => {
    done(undefined, user);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: NativeError, user: IUser) => done(err, user));
});

//Email and Password
passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        UserModel.findOne({ email: email.toLowerCase() }, (err: NativeError, user: IUser) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(undefined, false, { message: `Email ${email} not found.` });
            }
            user.comparePassword(password, (err: Error, isMatch: boolean) => {
                if (err) {
                    return done(err);
                }
                if (isMatch) {
                    return done(undefined, user);
                }
                return done(undefined, false, { message: 'Invalid email or password.' });
            });
        });
    })
);

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.path.split('/').slice(-1)[0];
    const user = req.user as IUser;
    if (find(user.tokens, { kind: provider })) {
        next();
    } else {
        res.redirect(`/auth/${provider}`);
    }
};
