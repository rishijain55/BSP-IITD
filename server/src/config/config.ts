import dotenv from 'dotenv';

dotenv.config();

const MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    autoIndex: false,
    retryWrites: false
};

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'abc';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'abc';
const MONGO_HOST = process.env.MONGO_URL || 'abc';

const MONGO = {
    host: MONGO_HOST,
    password: MONGO_PASSWORD,
    username: MONGO_USERNAME,
    options: MONGO_OPTIONS,
    url: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}?retryWrites=true&w=majority`
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

const SENDGRID = {
    user: process.env.SENDGRID_USERNAME,
    password: process.env.SENDGRID_PASSWORD
};

const config = {
    sessionkey: process.env.SESSION_SECRET || 'secretkey',
    mongo: MONGO,
    sendgrid: SENDGRID,
    server: SERVER,
    saltWorkFactor: 10,
    accessTokenTtl: '15m',
    refreshTokenTtl: '1y'
};

export default config;
