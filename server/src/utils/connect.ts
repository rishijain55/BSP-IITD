import mongoose from 'mongoose';
import config from '../config/config';
import logging from './logging';

async function connect() {
    try {
        await mongoose.connect(config.mongo.url, config.mongo.options).then((result) => {
            logging.info('Mongo Connected');
        });
    } catch {
        (error: Error) => {
            logging.error(error);
        };
    }
}

export default connect;
