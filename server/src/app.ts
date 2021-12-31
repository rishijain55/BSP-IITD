import express, { Express } from 'express';
import session from 'express-session';
import { flash } from 'express-flash-message';
import MongoStore from 'connect-mongo';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';

import * as userController from './controllers/user.controller';

import * as passportConfig from './config/passport';
import config from './config/config';

const app: Express = express();

const mongoUrl = config.mongo.url;
const mongoOptions = config.mongo.options;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        resave: true,
        secret: config.sessionkey,
        saveUninitialized: true,
        store: new MongoStore({ mongoUrl, mongoOptions })
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user && req.path !== '/login' && req.path !== '/signup' && !req.path.match(/^\/auth/) && !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user && req.path == '/account') {
        req.session.returnTo = req.path;
    }
    next();
});

export default app;
