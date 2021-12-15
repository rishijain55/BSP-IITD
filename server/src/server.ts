import http from 'http';
import express, { Express, NextFunction, Request, Response } from 'express';
import logging from './config/logging';
import config from './config/config';
import mongoose from 'mongoose';
import firebaseAdmin from 'firebase-admin';

const router: Express = express();

const httpServer = http.createServer(router);

let serviceAccountKey = require('./config/serviceAccountKey.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccountKey)
});

mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info('Mongo Connected');
    })
    .catch((error) => {
        logging.error(error);
    });

/** Log the request */
router.use((req, res, next) => {
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** API Access Policies  */
router.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

/** Error handling */
router.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

/** Listen */
httpServer.listen(config.server.port, () => logging.info(`Server is running ${config.server.hostname}:${config.server.port}`));
