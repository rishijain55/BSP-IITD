import crypto from 'crypto';
import async from 'async';
import nodemailer from 'nodemailer';
import passport from 'passport';
import IUser, { AuthToken } from '../interfaces/user';
import UserModel from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import { IVerifyOptions } from 'passport-local';
import { body, check, validationResult } from 'express-validator';
import '../config/passport';
import config from '../config/config';
import { CallbackError, NativeError } from 'mongoose';

export const getLogin = (req: Request, res: Response): void => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/login', {
        title: 'Login'
    });
};

export const postLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check('email', 'Email is not valid').isEmail().run(req);
    await check('password', 'Password cannot be blank').isLength({ min: 1 }).run(req);
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/login');
    }

    passport.authenticate('local', (err: Error, user: IUser, info: IVerifyOptions) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('errors', { msg: info.message });
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', { msg: 'Success! You are logged in.' });
            res.redirect(req.session.returnTo || '/');
        });
    })(req, res, next);
};

export const logout = (req: Request, res: Response): void => {
    req.logout();
    res.redirect('/');
};

export const getSignup = (req: Request, res: Response): void => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('account/signup', { title: 'Create Account' });
};

export const postSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check('email', 'Email is not valid').isEmail().run(req);
    await check('password', 'Password must be atleast 6 characters long').isLength({ min: 6 }).run(req);
    await check('confirmPassword', 'Passwords do not match').equals(req.body.password).run(req);
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        res.redirect('/login');
    }

    const user = new UserModel({
        email: req.body.email,
        password: req.body.password
    });

    UserModel.findOne({ email: req.body.email }, (err: NativeError, existingUser: IUser) => {
        if (err) {
            return next(err);
        }
        if (existingUser) {
            req.flash('errors', { msg: 'Account with that email already exists.' });
            return res.redirect('/signup');
        }
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
};

export const getAccount = (req: Request, res: Response): void => {
    res.render('account/profile', { title: 'Profile' });
};

export const postUpdateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check('email', 'Please enter a valid email address.').isEmail().run(req);
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/account');
    }
    const user = req.user as IUser;
    UserModel.findById(user.id, (err: NativeError, user: IUser) => {
        if (err) {
            return next(err);
        }
        user.email = req.body.email || '';
        user.username = req.body.username || '';
        user.department = req.body.department || '';
        user.year = req.body.year || 1;

        user.save((err: CallbackError) => {
            if (err) {
                return next(err);
            }
            req.flash('success', { msg: 'Profile information has been updated.' });
            res.redirect('/account');
        });
    });
};

export const postUpdatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check('password', 'Password must be atleast 6 characters long').isLength({ min: 6 }).run(req);
    await check('confirmPassword', 'Passwords do not match').equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/account');
    }

    const user = req.user as IUser;

    UserModel.findById(user.id, (err: NativeError, user: IUser) => {
        if (err) {
            return next(err);
        }
        user.password = req.body.password;
        user.save((err: CallbackError) => {
            if (err) {
                return next(err);
            }
            req.flash('success', { msg: 'Password has been changed.' });
            res.redirect('/account');
        });
    });
};

export const postDeleteAccount = (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as IUser;
    UserModel.remove({ _id: user.id }, (err) => {
        if (err) {
            return next(err);
        }
        req.logout();
        req.flash('info', { msg: 'Your account has been deleted' });
        res.redirect('/');
    });
};

export const getReset = (req: Request, res: Response, next: NextFunction): void => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    UserModel.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires')
        .gt(Date.now())
        .exec((err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
                res.redirect('/forgot');
            }

            res.render('account/reset', { title: 'Password Reset' });
        });
};

export const postReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check('password', 'Password must be atleast 6 characters long').isLength({ min: 6 }).run(req);
    await check('confirmPassword', 'Passwords do not match').equals(req.body.password).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('back');
    }

    async.waterfall(
        [
            function resetPassword(done: (err: any, user: IUser) => void) {
                UserModel.findOne({ passwordResetToken: req.params.token })
                    .where('passwordResetExpires')
                    .gt(Date.now())
                    .exec((err, user: any) => {
                        if (err) {
                            return next(err);
                        }
                        if (!user) {
                            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
                            return res.redirect('back');
                        }
                        user.password = req.body.password;
                        user.passwordResetToken = undefined;
                        user.passwordResetExpires = undefined;

                        user.save((err: Error) => {
                            if (err) {
                                return next(err);
                            }
                            req.logIn(user, (err) => {
                                done(err, user);
                            });
                        });
                    });
            },
            function sendResetPasswordEmail(user: IUser, done: (err: Error) => void) {
                const transporter = nodemailer.createTransport({
                    service: 'SendGrid',
                    auth: {
                        user: config.sendgrid.user,
                        pass: config.sendgrid.password
                    }
                });
                const mailOptions = {
                    to: user.email,
                    from: '',
                    subject: 'Your password has been changed',
                    text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
                };
                transporter.sendMail(mailOptions, (err) => {
                    req.flash('success', { msg: 'Success! Your password has been changed.' });
                });
            }
        ],
        (err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        }
    );
};

export const getForgot = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await check('email', 'Please enter a valid email address.').isEmail().run(req);
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/forgot');
    }

    async.waterfall(
        [
            function createRandomToken(done: (err: Error | null, token: string) => void) {
                crypto.randomBytes(16, (err, buf) => {
                    const token = buf.toString('hex');
                    done(err, token);
                });
            },
            function setRandomToken(token: AuthToken, done: (err: NativeError | Error, token?: AuthToken, user?: IUser) => void) {
                UserModel.findOne({ email: req.body.email }, (err: NativeError, user: any) => {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        req.flash('errors', { msg: 'Account with that email address does not exist.' });
                        return res.redirect('/forgot');
                    }
                    user.passwordResetToken = token;
                    user.passwordResetExpires = Date.now() + 3600000; // 1hour
                    user.save((err: Error) => {
                        done(err, token, user);
                    });
                });
            },
            function sendForgotPasswordEmail(token: AuthToken, user: IUser, done: (err: Error | null) => void) {
                const transporter = nodemailer.createTransport({
                    service: 'SendGrid',
                    auth: {
                        user: config.sendgrid.user,
                        pass: config.sendgrid.password
                    }
                });
                const mailOptions = {
                    to: user.email,
                    from: '',
                    subject: 'Reset your password',
                    text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n http://${req.headers.host}/reset/${token}\n\n If you did not request this, please ignore this email and your password will remain unchanged.\n`
                };
                transporter.sendMail(mailOptions, (err) => {
                    req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
                    done(err);
                });
            }
        ],
        (err) => {
            if (err) {
                return next(err);
            }
            res.redirect('/forgot');
        }
    );
};
