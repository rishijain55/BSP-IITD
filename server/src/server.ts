// import express from 'express';

// const app = express();
// app.listen(3000, () => {
//     console.log('App is running');
// });
import http from 'http';
import express, { Express, NextFunction, Request, Response } from 'express';
import logging from './utils/logging';
import config from './config/config';
import connect from './utils/connect';
import routes from './routes';

const router: Express = express();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// const httpServer = http.createServer(router);

/**API Access Policies*/
router.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Listen */
router.listen(config.server.port, async () => {
    logging.info(`Server is running ${config.server.hostname}:${config.server.port}`);
    await connect();
    routes(router);
});

/** Log the request */
router.use((req, res, next) => {
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});
