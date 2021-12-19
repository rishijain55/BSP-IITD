import { Express, Request, Response } from 'express';

function routes(router: Express) {
    router.get('/', (req: Request, res: Response) => {
        res.sendStatus(200);
        console.log('Home Page visited');
    });

    router.get('/healthcheck', (req: Request, res: Response) => {
        res.sendStatus(200);
    });
}

export default routes;
