import { Server } from 'http';
import { createServer } from '@meteo-france-api/utils/server';
import config from '@meteo-france-api/config';
import logger from '@meteo-france-api/utils/logger';
import db from '@meteo-france-api/utils/db';

const main = async () => {

    db.open()
        .then(() => createServer())
        .then(servers => {
            /** Server */
            const httpServer: Server = servers.httpServer;
            httpServer.listen(config.port, () => logger.http(`The server is running on port ${config.port}`));
        })
        .catch(err => {
            logger.error(`Error: ${err}`)
        });
        
};

main();





